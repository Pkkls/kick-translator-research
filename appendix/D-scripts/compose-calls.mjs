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

// The limiter and its cap come from the same module and are bundled separately
// so that --rate can drive the product's own class rather than a model of it.
const out2 = join(tmp, 'limiter.mjs');
await esbuild.build({
  stdin: {
    contents: "export { RateLimiter, COMPOSE_MAX_PER_MIN } from './src/content/composeLogic';\n",
    resolveDir: root,
    sourcefile: 'compose-limiter-entry.ts',
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  outfile: out2,
  logLevel: 'silent',
});

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

// ── The composition, which is the only thing a reader actually meets ────────
//
// The count above is the gate chain's answer for one message. It is not the
// number of requests a reader causes, because two more things sit in the path:
// the debounce, which decides whether a prefix is ever evaluated, and a sliding
// rate limiter consulted at compose.ts:320, immediately before the request.
//
// A claim about a pipeline is a claim about a composition and must be measured
// at the composition, which is this study's own rule from chapter 3. So this
// mode drives all three together over a simulated minute of typing.
if (process.argv.includes('--rate')) {
  const { RateLimiter, COMPOSE_MAX_PER_MIN } = await import(pathToFileURL(out2).href);
  console.log('\nCOMPOSE_MAX_PER_MIN ' + COMPOSE_MAX_PER_MIN +
    ', sliding window 60000 ms, consulted at compose.ts:320 before the request.\n');
  const MSG = 'the stream looks great today';
  // A reader types a message, stops to read the preview, then sends and starts
  // the next one. Without that pause a fast typist never settles a single
  // prefix and the model reports zero calls at every fast rate, which is a
  // property of the model and not of the product. The pause is what makes the
  // last prefix of each message settle, and that one always does.
  const PAUSE_MS = 2000;
  console.log('one minute of typing ' + JSON.stringify(MSG) +
    ', with a ' + PAUSE_MS + ' ms pause at the end of each message:\n');
  console.log('  chars/s   wpm   settled   decided   SENT   refused   what binds');
  for (const rate of [0.5, 1, 2, 3, 3.5, 5, 8]) {
    const gap = 1000 / rate;
    const limiter = new RateLimiter(COMPOSE_MAX_PER_MIN, 60_000);
    let t = 0, settled = 0, decided = 0, sent = 0, refused = 0;
    while (t < 60_000) {
      let lastTranslated;
      for (let pos = 1; pos <= MSG.length && t < 60_000; pos++) {
        t += gap;
        // A keystroke settles only when the next event is further off than the
        // debounce. Mid-message that is the next keystroke; at the end of a
        // message it is the pause, so the final prefix always settles.
        const nextGap = pos === MSG.length ? PAUSE_MS : gap;
        if (nextGap <= COMPOSE_DEBOUNCE_MS) continue;
        settled++;
        const prefix = MSG.slice(0, pos);
        if (decideComposeAction(prefix, lastTranslated, undefined, 'fr') !== 'translate') continue;
        decided++;
        if (limiter.tryAcquire(t + COMPOSE_DEBOUNCE_MS)) { sent++; lastTranslated = prefix; }
        else refused++;
      }
      t += PAUSE_MS;
    }
    const binds = refused > 0 ? 'THE LIMITER'
      : gap <= COMPOSE_DEBOUNCE_MS ? 'the debounce, only the last prefix settles'
      : 'the gate chain';
    console.log('  ' + String(rate).padStart(7) + '   ' + String(Math.round(rate * 60 / 5)).padStart(3) +
      '   ' + String(settled).padStart(7) + '   ' + String(decided).padStart(7) +
      '   ' + String(sent).padStart(4) + '   ' + String(refused).padStart(7) + '   ' + binds);
  }
  console.log('\nwpm is characters per minute over five, the usual convention.');
  console.log('The model types without hesitating inside a message, so the settled');
  console.log('column is a floor at fast rates: a real pause mid-word settles a prefix.');
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
