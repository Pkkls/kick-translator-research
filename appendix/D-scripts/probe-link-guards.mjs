/**
 * Measure: which URL shapes the product's two link guards actually recognise.
 *
 * `PRIVACY.md` says a chat message's text content is sent to the provider
 * *after we strip emotes, URLs, and `@mentions`*. All eleven localised store
 * listings say *Emotes, mentions, links and emoji spam are stripped before
 * anything is sent*. A10's whole axis is that the privacy claims and the
 * traffic must not disagree, and its own words for that disagreement are *a
 * store removal, not a bug report*.
 *
 * There are two guards, one per direction, written separately:
 *
 * - outgoing, `composeLogic.ts`: `PROTECT_RE`, used by `maskProtected` to
 *   replace a URL with an inert placeholder before the request and restore it
 *   after.
 * - incoming, `emoteParser.ts`: `URL_RE`, used to hold URLs out of the text
 *   that goes to the engine.
 *
 * **Both are anchored on `https?://`.** So the question this probe answers is
 * not whether the guards work, which they do, but what a URL has to look like
 * before either guard considers it one.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - It reads the incoming pattern out of the source rather than importing it,
 *   because `URL_RE` is not exported. That is the technique
 *   `probe-emote-stripper.mjs` uses on the same file and it fails loudly if the
 *   constant is renamed, rather than quietly reporting zero.
 * - It says nothing about whether a scheme-less URL *should* be masked. That is
 *   a product decision. It measures the gap between two sentences the product
 *   publishes and what the code does.
 * - A shape reported as sent raw is sent to whichever provider the reader has
 *   configured. Which providers, and which of them the policy names, is 4.77.
 *
 *   node appendix/D-scripts/probe-link-guards.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-link-guards.mjs <path-to-extension-repo>');
  process.exit(2);
}
const esbuildEntry = join(root, 'node_modules/esbuild/lib/main.js');
if (!existsSync(esbuildEntry)) {
  console.error('cannot measure: no esbuild under ' + root + '/node_modules');
  process.exit(2);
}

const esbuild = await import(pathToFileURL(esbuildEntry).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-links-'));
const out = join(tmp, 'composeLogic.mjs');
await esbuild.build({
  stdin: {
    contents: "export { maskProtected, isLinkOrMentionOnly } from './src/content/composeLogic';\n",
    resolveDir: root,
    sourcefile: 'link-guards-entry.ts',
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  outfile: out,
  logLevel: 'silent',
});
const { maskProtected, isLinkOrMentionOnly } = await import(pathToFileURL(out).href);

// The incoming pattern, out of its own module's source. Not exported, so this
// is the technique probe-emote-stripper.mjs uses on the same file.
const parserSrc = readFileSync(join(root, 'src/content/emoteParser.ts'), 'utf8');
const m = parserSrc.match(/const URL_RE = \/(.+?)\/([a-z]*);/);
if (!m) {
  console.error('cannot measure: no URL_RE in src/content/emoteParser.ts');
  rmSync(tmp, { recursive: true, force: true });
  process.exit(2);
}
const incoming = new RegExp(m[1], m[2].replace('g', ''));

// Constructed from how links are actually written in a chat, not collected.
// Every row past the first two omits the scheme, which is the variable under
// test; the first two are the control and must be masked.
const CASES = [
  ['https://example.com/secret', 'control, scheme present'],
  ['http://example.com/secret', 'control, the other scheme'],
  ['www.example.com/secret', 'the www form'],
  ['example.com/secret', 'bare host and path'],
  ['kick.com/somechannel', "the host this product runs on"],
  ['twitch.tv/somebody', 'the other platform'],
  ['bit.ly/aBcDeF', 'a shortener, where the path is the whole payload'],
  ['regarde example.com/mon-truc', 'inside a sentence, so no skip can apply'],
];

console.log('outgoing guard: PROTECT_RE via maskProtected');
console.log('incoming guard: URL_RE ' + incoming + ', read from emoteParser.ts\n');

const width = Math.max(...CASES.map((c) => c[0].length));
let raw = 0;
for (const [text, why] of CASES) {
  const masked = maskProtected(text).masked !== text;
  const seen = incoming.test(text);
  const skipped = isLinkOrMentionOnly(text);
  const protectedAtAll = masked || seen || skipped;
  if (!protectedAtAll) raw++;
  console.log(
    (protectedAtAll ? 'held back ' : 'SENT RAW  ') + text.padEnd(width) +
    '  outgoing ' + (masked ? 'masked' : 'no    ') +
    '  incoming ' + (seen ? 'seen ' : 'no   ') +
    '  link-only skip ' + (skipped ? 'yes' : 'no ') +
    '   ' + why,
  );
}

console.log('\n' + raw + ' of ' + CASES.length + ' shapes reach a translation provider verbatim.');
console.log('Both guards require a scheme, so they agree, and they agree about the same blind spot.');

rmSync(tmp, { recursive: true, force: true });

// A probe that measured nothing must fail. The two controls carry a scheme and
// must be held back by the outgoing guard; if they are not, the import or the
// pattern extraction is broken and every "SENT RAW" above is meaningless.
const controlsHeld = CASES.slice(0, 2).every(([t]) => maskProtected(t).masked !== t);
if (!controlsHeld) {
  console.log('\nECHEC: a scheme-bearing URL was not masked, so this run measured nothing');
  process.exit(2);
}
// The finding is the defect, so the exit code asserts the defect. The day a
// scheme-less URL is held back, this goes red and the study is out of date.
if (raw === 0) {
  console.log('\nECHEC: every shape is held back now, so the finding in 4.91 is fixed and this study is stale');
  process.exit(1);
}
process.exit(0);
