/**
 * Attack: the corpus's *zero false positives* claim for the arabizi detector.
 *
 * The corpus publishes two figures a pass apart. With a wide digit set the
 * detector produced **3 false positives**; restricted to `[3579]` it reports
 * **12 of 12 detected and 0 false positives on 29 traps**. That restriction is
 * good work and the zero is real on those traps. A zero is a statement about the
 * traps, though, and this study's own repeated lesson is that the population
 * decides.
 *
 * **The population here is a gaming chat**, because that is what Kick is. So the
 * bench is ordinary English gaming chat, nothing exotic, written for this pass
 * and printed in full below.
 *
 * The rule under test, from `arabizi.ts`: a word is arabizi when it survives
 * stripping to `[a-z0-9]`, is at least three characters, contains one of
 * `3 5 7 9`, and holds at least two letters. One such word makes the whole
 * message arabizi.
 *
 * **The positive control comes first and is not optional.** This feature
 * repaired a measured harm: an arabizi message used to come out `lang_unknown`,
 * so an Arabic reader who restricted their sources to `ar` lost exactly the
 * messages they wanted. If the detector stopped finding real arabizi this probe
 * would be reporting a fix that breaks a reader, and the run fails rather than
 * reporting the false positives clean.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - How often these words occur in real traffic. This study has no multilingual
 *   chat capture, which chapter 14 lists as a standing limit. What is measured
 *   is that the words are ordinary, not how many messages carry them.
 * - Whether a wider digit set would be worse. It would: the corpus measured that
 *   and this probe does not re-open it. The finding is about `[3579]`, the
 *   shipped rule.
 * - Arabizi that avoids `3 5 7 9` entirely. `shu ra2yak` carries only a `2` and
 *   is not detected; that is the restriction's stated cost and is shown in the
 *   control rather than hidden.
 *
 *   node appendix/D-scripts/probe-arabizi-traps.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-arabizi-traps.mjs <path-to-extension-repo>');
  process.exit(2);
}
if (!existsSync(join(root, 'node_modules/esbuild/lib/main.js'))) {
  console.error('cannot measure: no esbuild under ' + root + '/node_modules');
  process.exit(2);
}
const esbuild = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-arabizi-'));
const bundle = async (n, c) => {
  const o = join(tmp, n + '.mjs');
  await esbuild.build({
    stdin: { contents: c, resolveDir: root, sourcefile: n + '.ts', loader: 'ts' },
    bundle: true, format: 'esm', platform: 'neutral', outfile: o, logLevel: 'silent',
  });
  return import(pathToFileURL(o).href);
};
const { detectLanguage, confidentLanguage } =
  await bundle('d', "export { detectLanguage, confidentLanguage } from './src/content/langDetect';\n");
const { isArabizi } = await bundle('a', "export { isArabizi } from './src/shared/arabizi';\n");
const { isNoise, isSameLanguageAsTarget, shouldDropBySourceLang } =
  await bundle('f', "export { isNoise, isSameLanguageAsTarget, shouldDropBySourceLang } from './src/content/filters';\n");
const { isSlangOnly } = await bundle('g', "export { isSlangOnly } from './src/shared/glossary';\n");

// Real arabizi, the control. If these stop being found, the feature is broken
// and nothing else on this page matters.
const ARABIZI = [
  'salam 3alaykom', 'kifak 7abibi', 'ana 3ayez a3raf', 'sho 3am ta3mel',
  'yalla n5arej', 'el 7amdulilah', 'keef 7alak ya 3ammi', 'ma3lish habibi',
  '3andi mushkila', 'wallah 7elo ktir',
];
// The restriction's stated cost, shown rather than hidden: arabizi whose only
// digit is a 2 is outside `[3579]` and is not meant to be found.
const OUTSIDE = ['shu ra2yak', 'ma2fool hada'];
// Ordinary English gaming chat. Weapons, consoles, hardware, an esports org.
const GAMING = [
  'nice ak47 shot', 'cloud9 winning again', 'just got the ps5', 'gta5 still the best',
  'mp5 is broken lol', 'that was so l33t', 'ak74 or ak47 which one', 'top5 plays of the week',
  'bf3 was better than bf4', 'my rx7 build finally done', 'he hit 97 headshots',
  'stream at 1080p 60fps', 'gg wp', 'lets go boys', 'that aim is insane',
  'new patch dropped today',
];

const verdict = (l) => ({
  noise: isNoise(l), slang: isSlangOnly(l), arabizi: isArabizi(l),
  full: detectLanguage(l), lookup: confidentLanguage(l),
});

console.log('The positive control: real arabizi, which this feature exists to find\n');
const found = ARABIZI.filter((l) => verdict(l).full === 'ar');
for (const l of ARABIZI) {
  const v = verdict(l);
  console.log('  ' + (v.full === 'ar' ? 'found  ' : 'MISSED ') + l);
}
console.log('  ' + found.length + ' of ' + ARABIZI.length + ' found');
console.log('\n  outside the restricted digit set, not meant to be found:');
for (const l of OUTSIDE) console.log('      ' + (verdict(l).full === 'ar' ? 'found ' : 'missed') + '  ' + l);

console.log('\nOrdinary English gaming chat, run through the pipeline’s own order\n');
console.log('  verdict  reaches detect  isArabizi  detectLanguage');
const fp = [];
for (const l of GAMING) {
  const v = verdict(l);
  const reaches = !v.noise && !v.slang;
  const bad = reaches && v.full === 'ar';
  if (bad) fp.push(l);
  console.log('  ' + (bad ? 'ARABIC ' : '       ').padEnd(9) + (reaches ? 'yes' : 'no ').padEnd(16) +
    (v.arabizi ? 'yes' : 'no ').padEnd(11) + String(v.full ?? '—').padEnd(6) + l);
}
console.log('\n  ' + fp.length + ' of ' + GAMING.length + ' English gaming lines are declared Arabic');

// ── the consequence, driven rather than argued ─────────────────────────────
console.log('\nWhat the product then does with those, its own filters driven directly:\n');
const allowAr = { sourceLangAllowlist: ['ar'] };
const allowEs = { sourceLangAllowlist: ['es'] };
const droppedAtAr = fp.filter((l) => isSameLanguageAsTarget(detectLanguage(l), 'ar')).length;
const admitted = fp.filter((l) => shouldDropBySourceLang(detectLanguage(l), allowAr) === undefined).length;
const wrongReason = fp.filter((l) => shouldDropBySourceLang(detectLanguage(l), allowEs) === 'lang_not_allowed').length;
const notSkippedAsEnglish = fp.filter((l) => detectLanguage(l) !== 'en').length;
console.log('  reader whose target is Arabic, English line dropped as "already in your language": ' +
  droppedAtAr + ' of ' + fp.length);
console.log('  reader whose source allowlist is [ar], English admitted as Arabic:                 ' +
  admitted + ' of ' + fp.length);
console.log('  reader whose allowlist is [es], shown lang_not_allowed for an English line:        ' +
  wrongReason + ' of ' + fp.length);
console.log('  English reader with "skip English" on, line NOT skipped and sent to translate:     ' +
  notSkippedAsEnglish + ' of ' + fp.length);
console.log('\n  The engine is not told `ar`: confidentLanguage withholds it, so the text that');
console.log('  comes back is translated from what it is. The cost is the filter decisions, the');
console.log('  flag, and a provider call for a line the reader already reads.');

console.log('\nThe benches, so the populations can be disagreed with:');
for (const [k, v] of Object.entries({ 'real arabizi': ARABIZI, 'outside [3579]': OUTSIDE, 'gaming chat': GAMING })) {
  console.log('  ' + k);
  for (const l of v) console.log('      ' + l);
}
rmSync(tmp, { recursive: true, force: true });

// The control decides whether anything here can be read at all.
if (found.length < 8) {
  console.log('\nECHEC: only ' + found.length + ' of ' + ARABIZI.length + ' real arabizi lines were found.');
  console.log('The detector is not doing its job, so its false positives are not the story.');
  process.exit(2);
}
// The exit code asserts the set rather than its size, so a partial fix says which
// lines it fixed instead of passing quietly. `fp.length > 0` would have let the
// word-final rule through at 1 of 16 and reported nothing.
const RECORDED = [
  'ak74 or ak47 which one', 'bf3 was better than bf4', 'cloud9 winning again',
  'gta5 still the best', 'just got the ps5', 'mp5 is broken lol', 'my rx7 build finally done',
  'nice ak47 shot', 'that was so l33t', 'top5 plays of the week',
];
if (JSON.stringify([...fp].sort()) !== JSON.stringify(RECORDED)) {
  const fixed = RECORDED.filter((l) => !fp.includes(l));
  const fresh = fp.filter((l) => !RECORDED.includes(l));
  console.log('\nECHEC: the set of gaming lines declared Arabic has changed since 4.112.');
  if (fixed.length) console.log('  no longer Arabic: ' + fixed.join(' | '));
  if (fresh.length) console.log('  newly Arabic:     ' + fresh.join(' | '));
  process.exit(1);
}
console.log('\nThe detector finds ' + found.length + ' of ' + ARABIZI.length + ' real arabizi lines and also declares ' +
  fp.length + ' of ' + GAMING.length);
console.log('ordinary English gaming lines Arabic. `ak47`, `cloud9`, `ps5`, `gta5` and `mp5`');
console.log('each satisfy the rule exactly: three characters, a digit from 3 5 7 9, two');
console.log('letters. The zero the corpus reports is true of its 29 traps, and its 29 traps');
console.log('carry no gaming vocabulary, on a platform that is for watching games.');
process.exit(0);
