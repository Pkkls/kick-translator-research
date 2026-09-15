/**
 * Check: does every reason the reader is shown go through the catalogue?
 *
 * A18's bar asks that *every empty and failure state shows a sentence a
 * non-technical reader can act on*. The product does this well and guards it
 * well: `src/content/msg.coverage.test.ts` holds 43 assertions matching every
 * `msg()` and `localised()` call site against the chat catalogue **in both
 * directions**, refuses to pass on an empty scan, and even fails on an
 * exemption it no longer needs. It is the most disciplined test in the corpus.
 *
 * It cannot see the defect this probe is for. A string that never calls
 * `msg()` or `localised()` never enters the system the test scans, so the
 * report comes back complete and is correct about everything it can reach.
 * **An empty report is a statement about the instrument's reach**, and the reach
 * of a call-site scanner is call sites.
 *
 * So this scans the other way round: every `return` in the reason-producing path
 * whose value is a **literal string or template**, rather than a catalogue
 * lookup. Those are the sentences that will be English for every reader whatever
 * their interface language.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Strings built elsewhere and returned through a variable. This finds the
 *   literal shape, which is how the one known instance is written, and a
 *   determined indirection would pass.
 * - Whether a catalogued sentence is any good. Presence is mechanical; whether
 *   a reader can act on it is a judgement and is made in 4.105, not here.
 * - Files outside the reason path. The list of files is the population and is
 *   printed, so the scope of a clean run is visible rather than implied.
 *
 *   node appendix/D-scripts/probe-untranslated.mjs /path/to/kick-chat-translator
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-untranslated.mjs <path-to-extension-repo>');
  process.exit(2);
}

// The files that produce a sentence the reader sees on or beside a chat line.
// Named rather than globbed: this is a claim about which files carry reasons,
// and a reader can disagree with it by looking at the list.
const FILES = [
  'src/content/pipeline.ts',
  'src/content/injector.ts',
  'src/content/langChip.ts',
  'src/content/composeUi.ts',
];
for (const f of FILES) {
  if (!existsSync(join(root, f))) {
    console.error('cannot check: missing ' + f);
    process.exit(2);
  }
}

// A returned literal: `return 'text'` or `return `text``, with something in it.
// An empty string is the product's way of saying "no reason", and is fine.
const RETURN_LITERAL = /^\s*(?:return|=>)\s*(`[^`]*\$\{[^`]*`|`[^`]+`|'[^']+'|"[^"]+")\s*;?\s*$/;
const LOOKUP = /\b(?:localised|msg)\s*\(/;

const raw = [];
let scanned = 0;
for (const f of FILES) {
  const lines = readFileSync(join(root, f), 'utf8').split('\n');
  lines.forEach((line, i) => {
    scanned++;
    if (LOOKUP.test(line)) return;
    const m = line.match(RETURN_LITERAL);
    if (!m) return;
    const text = m[1].slice(1, -1);
    // Sentences, not tokens: a returned identifier, class name or code is not a
    // reason. A space and a lower-case word is the cheapest test that separates
    // 'kt-float-label' from 'it is only chat slang'.
    if (!/\s/.test(text) || !/[a-z]{3}/.test(text)) return;
    raw.push({ where: f + ':' + (i + 1), text });
  });
}

console.log('files scanned, as the population this claim is about:');
for (const f of FILES) console.log('  ' + f);
console.log('\n' + scanned + ' lines read, ' + raw.length + ' returned sentence(s) that never reach the catalogue:\n');
for (const r of raw) console.log('  ' + r.where + '   ' + JSON.stringify(r.text));

// A probe that measured nothing must fail. If the scan finds no catalogue
// lookups at all, the shape has moved and a clean result means nothing.
const lookups = FILES.reduce((n, f) => n + (readFileSync(join(root, f), 'utf8').match(/\b(?:localised|msg)\s*\(/g) ?? []).length, 0);
console.log('\ncatalogue lookups seen in the same files: ' + lookups);
if (lookups < 10) {
  console.log('ECHEC: too few lookups found, so the scan is not reading what it thinks.');
  process.exit(2);
}

// The exit code asserts the finding, as probe-link-guards.mjs does: red when the
// population moves in either direction, so a later session learns this is stale.
const KNOWN = ['src/content/pipeline.ts:169'];
const unexpected = raw.filter((r) => !KNOWN.includes(r.where));
const fixed = KNOWN.filter((k) => !raw.some((r) => r.where === k));
if (unexpected.length) {
  console.log('\nECHEC: a raw sentence this study has not recorded: ' + unexpected.map((r) => r.where).join(', '));
  process.exit(1);
}
if (fixed.length) {
  console.log('\nECHEC: ' + fixed.join(', ') + ' goes through the catalogue now, so 4.105 is fixed and this study is stale.');
  process.exit(1);
}
console.log('\nThe one raw sentence is the known one (4.105): the minimum-length reason,');
console.log('the only skip reason in the file that does not call localised().');
process.exit(0);
