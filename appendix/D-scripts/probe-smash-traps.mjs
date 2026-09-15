/**
 * Attack: the corpus's *zero false positives* for the keyboard-smash filter.
 *
 * The corpus reports **15 of 15 smashes caught, 0 false positives**, and a
 * threshold chosen by measurement: 0.6 gave 2 false positives, 0.65 and 0.7 gave
 * none, and 0.7 shipped. That is careful work and the zero is true of the lines
 * it was measured on.
 *
 * **A false positive here is the most expensive kind in the product.** The
 * message is dropped by `isNoise` before any detection happens, and the reason
 * the reader is shown is *it is only emoji, symbols or laughter*. The message is
 * not mistranslated, it is gone, and the explanation is false.
 *
 * So this needs a population nobody chose, and there is one already in the
 * repository: **the product's own interface text, in every locale it ships**.
 * Those are real sentences in nine languages, written by the people who wrote
 * the filter, and indisputably not keyboard smash.
 *
 * Extracting them has one trap worth writing down, because this probe fell into
 * it. A first version took every quoted string and reported Korean and Japanese
 * flagging `chipError`, `flagFrom` and `retryTip` — **object keys, not
 * translations**. The rule that separates them needs no parser: **a translated
 * sentence contains a space and a key name does not.**
 *
 * The rule under test, from `filters.ts`: a single word, no whitespace, at least
 * six letters, nothing but `a-z`, at least six distinct letters or a repeated
 * group, and at least 70 percent of adjacent pairs on one QWERTY row.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - How often a bare one-word message is sent. Punctuation saves a word —
 *   `porque?` is not smash because the rule requires pure `a-z` — and so does a
 *   second word. What is measured is which words are lost when sent alone.
 * - Whether the shipped threshold is better than 0.65. The corpus measured that
 *   and this does not re-open it. Both give the same answer on this population.
 * - Any language the product does not ship an interface for.
 *
 *   node appendix/D-scripts/probe-smash-traps.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-smash-traps.mjs <path-to-extension-repo>');
  process.exit(2);
}
for (const p of ['node_modules/esbuild/lib/main.js', 'src/content/i18n', 'src/shared/i18n']) {
  if (!existsSync(join(root, p))) {
    console.error('cannot measure: no ' + p + ' under ' + root);
    process.exit(2);
  }
}
const esbuild = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-smash-'));
const out = join(tmp, 'f.mjs');
await esbuild.build({
  stdin: {
    contents: "export { isKeyboardSmash, isNoise } from './src/content/filters';\n",
    resolveDir: root, sourcefile: 'f.ts', loader: 'ts',
  },
  bundle: true, format: 'esm', platform: 'neutral', outfile: out, logLevel: 'silent',
});
const { isKeyboardSmash, isNoise } = await import(pathToFileURL(out).href);

// The control: real keyboard smash, in **two shapes**, and the second shape is
// there because of what happened when it was missing. A first version listed
// only walks along a row, a candidate fix passed it 10 of 10 while taking the
// false positives to zero, and it looked like the answer. Adding hands that mash
// a row out of order showed the same fix losing all ten of those. **A control
// the plant happens to pass is not a control.**
const WALKS = [
  'asdfghjkl', 'qwertyuiop', 'asdasdasd', 'sdfsdfsdf', 'lkjhgfdsa',
  'poiuytrewq', 'hjklhjklhjkl', 'werrtyuio', 'asdfasdfasdf', 'qwerqwerqwer',
];
const MASHES = [
  'asdkfjalsdkf', 'sdlkfjasdlk', 'jfkdlsajfd', 'hjdksalfgh', 'kdjshfaklsd',
  'lasdkfjhg', 'fjdksalgh', 'dkslafjgh', 'ghjdkslaf', 'sakdjfhgl',
];
const SMASH = [...WALKS, ...MASHES];

const STRING = /'([^'\n]{6,})'|"([^"\n]{6,})"|`([^`\n]{6,})`/g;
const perLocale = new Map();
for (const dir of [join(root, 'src/content/i18n'), join(root, 'src/shared/i18n')]) {
  for (const f of readdirSync(dir)) {
    if (!/\.tsx?$/.test(f) || /\.test\./.test(f)) continue;
    const loc = f.replace(/\.tsx?$/, '').split('.')[0];
    if (['index', 'types', 'coverage'].includes(loc)) continue;
    if (!perLocale.has(loc)) perLocale.set(loc, new Set());
    for (const m of readFileSync(join(dir, f), 'utf8').matchAll(STRING)) {
      const v = m[1] ?? m[2] ?? m[3] ?? '';
      if (!/\s/.test(v)) continue; // a key name has no space; a sentence does
      for (const w of v.split(/[^\p{L}]+/u)) if (w.length >= 6) perLocale.get(loc).add(w);
    }
  }
}

console.log('The control: real keyboard smash, which this filter exists to catch\n');
const caught = SMASH.filter((s) => isKeyboardSmash(s));
console.log('  walking a row, out of order:   ' + WALKS.filter(isKeyboardSmash).length + ' of ' + WALKS.length +
  '        mashing a row: ' + MASHES.filter(isKeyboardSmash).length + ' of ' + MASHES.length);
console.log('  ' + caught.length + ' of ' + SMASH.length + ' caught' +
  (caught.length < SMASH.length ? '   missed: ' + SMASH.filter((s) => !caught.includes(s)).join(' ') : ''));

console.log('\nThe product’s own interface text, by locale, words of six letters or more\n');
console.log('  locale  words  flagged    rate   every one of them');
const rows = [...perLocale].map(([loc, w]) => ({ loc, n: w.size, hits: [...w].filter(isKeyboardSmash) }))
  .filter((r) => r.n > 0).sort((a, b) => (b.hits.length / b.n) - (a.hits.length / a.n));
let total = 0, flagged = 0;
for (const r of rows) {
  total += r.n; flagged += r.hits.length;
  console.log('    ' + r.loc.padEnd(6) + String(r.n).padStart(5) + String(r.hits.length).padStart(8) +
    ('  ' + (100 * r.hits.length / r.n).toFixed(1) + '%').padStart(9) + '   ' + r.hits.join(' '));
}
console.log('\n  ' + flagged + ' of ' + total + ' = ' + (100 * flagged / total).toFixed(2) + '%');

// The floor and what sits above it. Words flagged in every locale are the
// untranslated English technical terms that appear in all of them; what is left
// is what each language loses on its own.
const everywhere = rows[0].hits.filter((w) => rows.every((r) => r.hits.includes(w)));
console.log('\n  flagged in every locale, so untranslated English in all of them: ' +
  everywhere.length + '   ' + everywhere.join(' '));
console.log('  above that floor, per language:');
for (const r of rows) {
  const own = r.hits.filter((w) => !everywhere.includes(w));
  if (own.length) console.log('      ' + r.loc + '  +' + own.length + '   ' + own.join(' '));
  else console.log('      ' + r.loc + '  +0');
}

// ── what saves a word, and what does not ───────────────────────────────────
console.log('\nWhat the filter does with one of them, and what rescues it:\n');
for (const t of ['porque', 'porque?', 'no porque', 'Traduire', 'Traduire!', 'Pourquoi']) {
  console.log('    isNoise(' + JSON.stringify(t).padEnd(13) + ') = ' + (isNoise(t) ? 'DROPPED' : 'kept'));
}
console.log('\n  A bare one-word message is lost; the same word with any punctuation or a');
console.log('  second word survives, because the rule requires the text to be nothing but');
console.log('  a-z. The reason the reader is shown is "it is only emoji, symbols or');
console.log('  laughter", which of `porque` is not true in any of its three parts.');

console.log('\nWhy the rate is not spread evenly:');
console.log('  the rule only ever fires on a word written entirely in a-z, so Arabic,');
console.log('  Russian, Japanese, Korean and Chinese text cannot reach it at all and their');
console.log('  counts are the English terms left untranslated. Among the Latin-script');
console.log('  locales the QWERTY top row carries e u i o r t p, which is most of what');
console.log('  French, Portuguese and Spanish are built from.');
rmSync(tmp, { recursive: true, force: true });

if (caught.length < SMASH.length) {
  console.log('\nECHEC: only ' + caught.length + ' of ' + SMASH.length + ' real smashes were caught.');
  console.log('The filter is not doing its job, so its false positives are not the story.');
  process.exit(2);
}
if (total < 2000) {
  console.log('\nECHEC: only ' + total + ' words extracted; the locale files have moved.');
  process.exit(2);
}
// The exit code asserts the set, not the count: a partial fix should say which
// words it fixed rather than pass quietly (4.112).
const RECORDED = ['European', 'Shorter', 'optional', 'repository', 'stripped', 'supported'];
if (JSON.stringify([...everywhere].sort()) !== JSON.stringify(RECORDED)) {
  console.log('\nECHEC: the words flagged in every locale have changed since 4.113.');
  console.log('  recorded: ' + RECORDED.join(' '));
  console.log('  now:      ' + [...everywhere].sort().join(' '));
  process.exit(1);
}
console.log('\nThe filter catches ' + caught.length + ' of ' + SMASH.length + ' real smashes and also flags ' + flagged +
  ' of ' + total + ' words');
console.log('of the product’s own shipped interface text. Among them are `Traduire`, which');
console.log('is this extension’s French label for Translate, `Pourquoi`, and `porque` in');
console.log('both Spanish and Portuguese.');
process.exit(0);
