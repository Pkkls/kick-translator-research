/**
 * Attack: the corpus's *zero false positives* for the shlyokavitsa markers.
 *
 * The corpus reports the two-marker conjunction rule at **3 of 4 held-out and 0
 * false positives on 187 lines in 19 languages**. That is the most carefully
 * built rule in the detector: the marker list was assembled **by paradigm rather
 * than from the misses**, nine entries were demoted by a five-letter floor, and
 * the held-out recall was checked before and after. The zero is true of those
 * 187 lines.
 *
 * **Nineteen languages is a lot and still a choice.** The rule asks for two
 * *distinct* weak markers from one language and no other language reaching two,
 * and the Bulgarian weak list is largely pan-Slavic function words: `sme`,
 * `dobre`, `az`, `mnogo`, `tova`, `taka`, `stava`, `tuk`. Those are not
 * Bulgarian-only words, they are Slavic words, and Bulgarian's neighbours write
 * them in Latin letters for the same reason Bulgarians do.
 *
 * Two of them are not even Slavic-only. **`sega` is a games company** and `sam`
 * is an English given name, on a platform for watching games.
 *
 * The control comes first, as always: real shlyokavitsa, which this rule exists
 * to catch and which was a genuine gap before it. A rule that stopped finding
 * Bulgarian would make its false positives irrelevant, and the run fails rather
 * than reporting them clean.
 *
 * Also checked, because the source claims it in a comment: **a strong marker
 * always wins**, which is what keeps `ochen mnogo ludey` Russian rather than
 * letting `mnogo` drag it to Bulgarian. That is a replication, and it holds.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - How much Slovak, Polish or Serbian traffic a Kick channel carries. This
 *   study has no chat capture. What is measured is that the sentences are
 *   ordinary, not how many arrive.
 * - Whether the corpus's 19 languages included these. They are not listed
 *   anywhere this study can read, so the claim here is only that **these
 *   sentences collide**, not that the corpus missed a language it had.
 * - Bulgarian written in Cyrillic, which is a different path entirely.
 *
 *   node appendix/D-scripts/probe-shlyokavitsa-traps.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-shlyokavitsa-traps.mjs <path-to-extension-repo>');
  process.exit(2);
}
if (!existsSync(join(root, 'node_modules/esbuild/lib/main.js'))) {
  console.error('cannot measure: no esbuild under ' + root + '/node_modules');
  process.exit(2);
}
const esbuild = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-shlyok-'));
const bundle = async (n, c) => {
  const o = join(tmp, n + '.mjs');
  await esbuild.build({
    stdin: { contents: c, resolveDir: root, sourcefile: n + '.ts', loader: 'ts' },
    bundle: true, format: 'esm', platform: 'neutral', outfile: o, logLevel: 'silent',
  });
  return import(pathToFileURL(o).href);
};
const { romanisedLanguage, ROMANISED_WEAK_MARKERS } =
  await bundle('r', "export { romanisedLanguage, ROMANISED_WEAK_MARKERS } from './src/shared/romanised';\n");
const { detectLanguage, confidentLanguage } =
  await bundle('d', "export { detectLanguage, confidentLanguage } from './src/content/langDetect';\n");
const { isSameLanguageAsTarget, shouldDropBySourceLang } =
  await bundle('f', "export { isSameLanguageAsTarget, shouldDropBySourceLang } from './src/content/filters';\n");

// The control: real shlyokavitsa, Bulgarian written with a Latin keyboard.
const BULGARIAN = [
  'az sam tuk', 'mnogo mi haresva tova', 'kade si sega', 'shte doida po kasno',
  'tova e mnogo dobre', 'nyama nishto stava', 'taka mislya i az', 'koga zapochva tozi',
  'stiga be tuka', 'tezi sa mnogo smeshno',
];
// Neighbours of Bulgarian, writing their own languages in Latin letters.
const NEIGHBOURS = {
  Slovak: ['sme dobre', 'az sme dobre', 'to je dobre sme radi', 'sme tu a dobre nam je',
    'dobre sme to spravili'],
  Polish: ['dobre az za dobre', 'az tak dobre'],
  'Serbian or Croatian': ['mnogo dobre igre', 'tova mnogo dobre'],
  Czech: ['mnogo dobre no'],
};
// English on a gaming platform. `sega` is a games company, `sam` a given name.
const ENGLISH = ['sam and sega', 'sam said sega was better', 'sega or sam which', 'tuk tuk sam'];
// The comment's own claim: a strong marker always wins over the weak stage.
const STRONG_WINS = ['ochen mnogo ludey'];

console.log('The control: real shlyokavitsa, which this rule exists to catch\n');
const found = BULGARIAN.filter((l) => romanisedLanguage(l) === 'bg');
for (const l of BULGARIAN) console.log('  ' + (romanisedLanguage(l) === 'bg' ? 'bg    ' : 'MISSED') + '  ' + l);
console.log('  ' + found.length + ' of ' + BULGARIAN.length + ' found');

console.log('\nThe source’s own claim, that a strong marker always wins:\n');
for (const l of STRONG_WINS) console.log('  ' + String(romanisedLanguage(l) ?? '—').padEnd(4) + '  ' + l);

console.log('\nNeighbouring languages, writing themselves in Latin letters\n');
const fp = [];
for (const [lang, lines] of Object.entries(NEIGHBOURS)) {
  const hit = lines.filter((l) => detectLanguage(l) === 'bg');
  fp.push(...hit);
  console.log('  ' + lang.padEnd(22) + hit.length + ' of ' + lines.length + ' declared Bulgarian');
  for (const l of lines) console.log('      ' + String(detectLanguage(l) ?? '—').padEnd(4) + '  ' + l);
}
console.log('\nEnglish, on a platform for watching games\n');
const engHit = ENGLISH.filter((l) => detectLanguage(l) === 'bg');
fp.push(...engHit);
for (const l of ENGLISH) console.log('  ' + String(detectLanguage(l) ?? '—').padEnd(4) + '  ' + l);
console.log('  ' + engHit.length + ' of ' + ENGLISH.length + ' declared Bulgarian');

const totalLines = Object.values(NEIGHBOURS).flat().length + ENGLISH.length;
console.log('\n  ' + fp.length + ' of ' + totalLines + ' lines that are not Bulgarian are declared Bulgarian');

// ── which markers do the damage ────────────────────────────────────────────
const weak = ROMANISED_WEAK_MARKERS.bg ?? [];
const blame = new Map();
for (const l of fp) {
  for (const t of l.toLowerCase().split(/[^\p{L}]+/u)) if (weak.includes(t)) blame.set(t, (blame.get(t) ?? 0) + 1);
}
console.log('\n  the weak list holds ' + weak.length + ' markers; these are the ones doing it:');
for (const [m, n] of [...blame].sort((a, b) => b[1] - a[1])) console.log('      ' + m.padEnd(8) + n + ' line(s)');

// ── the consequence, driven ────────────────────────────────────────────────
console.log('\nWhat the product then does, its own filters driven directly:\n');
const droppedAtBg = fp.filter((l) => isSameLanguageAsTarget(detectLanguage(l), 'bg')).length;
const admitted = fp.filter((l) => shouldDropBySourceLang(detectLanguage(l), { sourceLangAllowlist: ['bg'] }) === undefined).length;
const sl = fp.filter((l) => confidentLanguage(l) !== undefined).length;
console.log('  reader whose target is Bulgarian, the line dropped as "already in your language": ' +
  droppedAtBg + ' of ' + fp.length);
console.log('  reader whose source allowlist is [bg], the line admitted as Bulgarian:            ' +
  admitted + ' of ' + fp.length);
console.log('  lines where the engine is told `bg` as the source language:                       ' +
  sl + ' of ' + fp.length + '   (confidentLanguage withholds it, as the source intends)');

console.log('\nThe benches, so the populations can be disagreed with:');
for (const [k, v] of Object.entries({ 'real shlyokavitsa': BULGARIAN, ...NEIGHBOURS, English: ENGLISH })) {
  console.log('  ' + k);
  for (const l of v) console.log('      ' + l);
}
rmSync(tmp, { recursive: true, force: true });

if (found.length < 8) {
  console.log('\nECHEC: only ' + found.length + ' of ' + BULGARIAN.length + ' real shlyokavitsa lines were found.');
  console.log('The rule is not doing its job, so its false positives are not the story.');
  process.exit(2);
}
if (romanisedLanguage('ochen mnogo ludey') !== 'ru') {
  console.log('\nECHEC: a strong marker no longer beats the weak stage, which the source claims');
  console.log('in a comment and which held when 4.114 measured it.');
  process.exit(2);
}
// The exit code asserts the set, not the count (4.112).
const RECORDED = [
  'az sme dobre', 'az tak dobre', 'dobre az za dobre', 'dobre sme to spravili',
  'mnogo dobre igre', 'mnogo dobre no', 'sam and sega', 'sam said sega was better',
  'sega or sam which', 'sme dobre', 'sme tu a dobre nam je', 'to je dobre sme radi',
  'tova mnogo dobre', 'tuk tuk sam',
];
if (JSON.stringify([...fp].sort()) !== JSON.stringify(RECORDED)) {
  const fixed = RECORDED.filter((l) => !fp.includes(l));
  const fresh = fp.filter((l) => !RECORDED.includes(l));
  console.log('\nECHEC: the set of non-Bulgarian lines declared Bulgarian has changed since 4.114.');
  if (fixed.length) console.log('  no longer Bulgarian: ' + fixed.join(' | '));
  if (fresh.length) console.log('  newly Bulgarian:     ' + fresh.join(' | '));
  process.exit(1);
}
console.log('\nThe rule finds ' + found.length + ' of ' + BULGARIAN.length + ' real shlyokavitsa lines, keeps a strong marker');
console.log('winning as its comment claims, and declares ' + fp.length + ' of ' + totalLines + ' lines Bulgarian that are');
console.log('Slovak, Polish, Serbian, Czech or English. The weak list is pan-Slavic function');
console.log('words plus a games company, and two of them are enough.');
process.exit(0);
