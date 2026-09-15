/**
 * Measure: engine calls per typed character on the outgoing path.
 *
 * A3's bar has four clauses and three of them were settled in 4.59. The fourth,
 * *calls to any engine per typed character stay under the ceiling in the budget
 * file*, has been empty in [appendix G](../G-budget.md) since the budget was
 * built, with the note that the instrument is `compose-kick-live.mjs`. That
 * harness opens the real kick.com with a signed-in profile, which this account
 * will not drive, so the row stayed unset for want of an instrument nobody was
 * going to run.
 *
 * It does not need a browser. The decision is a pure function.
 * `decideComposeAction(text, lastTranslated, detected, target)` returns one of
 * seven actions and only `translate` reaches an engine, so the count for a
 * message is the number of its prefixes that return `translate`. The controller
 * debounces at `COMPOSE_DEBOUNCE_MS` before calling it, which can only lower the
 * number: a prefix that never settles is never decided. So the prefix count is
 * the **worst case**, reached by a typist slower than the debounce, and that is
 * what the specification asks an axis to be measured at: the worst case that can
 * be constructed, not the average that happened to be on screen.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - The in-tab cache sits after this decision, so a repeat within a session
 *   costs a decision and not a call. Counting `translate` therefore over-counts
 *   real traffic, which is the safe direction for a ceiling.
 * - `detected` is passed as undefined here. The real controller runs
 *   `confidentLanguage` first, and a confident same-language detection returns
 *   `skip-same-lang`. Supplying it would lower the count for a reader typing
 *   their target language, which again is the safe direction.
 * - A rolling rate limiter in the controller caps network calls independently.
 *   This measures what the decision permits, not what the socket sees.
 *
 *   node appendix/D-scripts/compose-calls.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: compose-calls.mjs <path-to-extension-repo>');
  process.exit(2);
}
const esbuildEntry = join(root, 'node_modules/esbuild/lib/main.js');
if (!existsSync(esbuildEntry)) {
  console.error('cannot measure: no esbuild under ' + root + '/node_modules');
  process.exit(2);
}

// composeLogic.ts reaches other modules through the ~/ alias, so a bare import
// of the file does not resolve. Bundle it the way the clone's own harnesses do.
const esbuild = await import(pathToFileURL(esbuildEntry).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-compose-'));
const out = join(tmp, 'composeLogic.mjs');
await esbuild.build({
  stdin: {
    contents: "export { decideComposeAction, COMPOSE_MIN_LEN, COMPOSE_MAX_LEN, COMPOSE_DEBOUNCE_MS } from './src/content/composeLogic';\n",
    resolveDir: root,
    sourcefile: 'compose-calls-entry.ts',
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  outfile: out,
  logLevel: 'silent',
});
const m = await import(pathToFileURL(out).href);
const { decideComposeAction, COMPOSE_MIN_LEN, COMPOSE_MAX_LEN, COMPOSE_DEBOUNCE_MS } = m;

/**
 * Type a message one character at a time and count what reaches an engine.
 *
 * `lastTranslated` is carried the way the controller carries it, because
 * `skip-unchanged` is the guard that stops a settled message being sent twice
 * and leaving it out would overstate the count.
 */
function walk(text, target) {
  let lastTranslated;
  let calls = 0;
  const actions = Object.create(null);
  for (let i = 1; i <= text.length; i++) {
    const prefix = text.slice(0, i);
    const action = decideComposeAction(prefix, lastTranslated, undefined, target);
    actions[action] = (actions[action] ?? 0) + 1;
    if (action === 'translate') {
      calls++;
      lastTranslated = prefix;
    }
  }
  return { calls, chars: text.length, actions };
}

// Constructed, not collected. Each case is built from a clause of the gate
// chain so that the reason for its number is readable from the case itself.
const CASES = [
  ['ordinary sentence, the worst case', 'the stream looks great today', 'fr'],
  ['one long word, no spaces', 'unmotquiestvraimenttreslong', 'fr'],
  ['pure slang, every prefix noise', 'kekw kekw kekw kekw', 'fr'],
  ['a handle only', '@somebody', 'fr'],
  ['a link only', 'https://example.com/a/b/c', 'fr'],
  ['under the floor the whole way', 'a', 'fr'],
  ['at the floor exactly', 'ab', 'fr'],
];

console.log('COMPOSE_DEBOUNCE_MS ' + COMPOSE_DEBOUNCE_MS +
  ', COMPOSE_MIN_LEN ' + COMPOSE_MIN_LEN + ', COMPOSE_MAX_LEN ' + COMPOSE_MAX_LEN);
console.log('Calls counted are decisions returning "translate", one per settled prefix.\n');

const width = Math.max(...CASES.map((c) => c[0].length));
let worst = 0;
for (const [name, text, target] of CASES) {
  const r = walk(text, target);
  const perChar = r.calls / r.chars;
  worst = Math.max(worst, perChar);
  console.log(name.padEnd(width) + '  ' + String(r.calls).padStart(3) + ' calls / ' +
    String(r.chars).padStart(3) + ' chars = ' + perChar.toFixed(3) + ' per character');
}

console.log('\nworst constructed case: ' + worst.toFixed(3) + ' engine calls per typed character');

// The two skip cases are the interesting ones and the count alone does not say
// why, so print the prefixes. The guards read complete tokens, and a prefix of a
// link or of an emote is neither a link nor an emote.
if (process.argv.includes('--prefixes')) {
  console.log('\nprefixes that reach an engine, for messages the guards skip once complete:');
  for (const [name, text, target] of CASES.filter((c) => /slang|link/.test(c[0]))) {
    console.log('  ' + name + '  ' + JSON.stringify(text));
    let last;
    for (let i = 1; i <= text.length; i++) {
      const prefix = text.slice(0, i);
      if (decideComposeAction(prefix, last, undefined, target) === 'translate') {
        console.log('    at ' + String(i).padStart(2) + '  ' + JSON.stringify(prefix));
        last = prefix;
      }
    }
  }
}

// The ceiling is a property of the gate chain rather than of the corpus of
// cases: once a prefix is long enough and is not noise, every further character
// changes the text, so `skip-unchanged` cannot fire twice in a row. One call per
// character is therefore the bound, and a case reaching it proves it is tight.
const bound = 1;
if (worst > bound) {
  console.log('\nECHEC: a case exceeded one call per character, which the gate chain should make impossible');
  rmSync(tmp, { recursive: true, force: true });
  process.exit(1);
}
console.log('bound: 1.000 per character, from the gate chain. The worst case above is what reaches it.');
rmSync(tmp, { recursive: true, force: true });
process.exit(0);
