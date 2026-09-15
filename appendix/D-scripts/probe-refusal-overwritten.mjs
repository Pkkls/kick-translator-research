/**
 * Replicate: does the product's own Cyrillic separation survive its own caller?
 *
 * Thirty of this study's 45 `[reported]` figures come from the corpus's language
 * work, taken from the developing account's records and never re-measured here.
 * The headline is that **a writing system is not a language**, diagnosed three
 * times in the same day on three scripts, and it is the product's central
 * detection claim. This re-takes it on a bench written here, in this file, so a
 * reader can disagree with the population rather than only with the number.
 *
 * **The separations replicate.** What does not survive is the refusal.
 *
 * `cyrilliqueQuelleLangue` answers `undefined` for Mongolian on purpose, and the
 * source says why at length: *franc-min ne porte pas le mongol du tout*, and
 * Mongolian is not among the 42 languages offered, so naming it would ask the
 * engine to translate from a language it does not have. That `undefined` is a
 * **refusal**: the product knows what the text is not, and says do not guess.
 *
 * `confidentLanguage` respects it. `detectLanguage` calls the same lookup, sees
 * `undefined`, reads it as *no information rather than a decision*, and falls
 * through to franc, which is the one mechanism the comment above the guard says
 * cannot do this job. When franc happens to answer, the refusal is gone.
 *
 * **`undefined` is carrying two meanings**, *I do not know* and *I know, and the
 * answer is do not guess*, and only one caller can tell them apart.
 *
 * The consequence is measured here rather than argued, by driving the product's
 * own `isSameLanguageAsTarget` and `shouldDropBySourceLang` with the values
 * `detectLanguage` actually returns. It is bounded: the engine's source language
 * comes from `confidentLanguage` and is not affected, so translations are not
 * wrong. The filter decisions are.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether this bench is representative. It is thirty Mongolian lines and ten
 *   each of five other languages, written for this pass, chat register, 15 to 33
 *   characters. They are printed in full below. A different thirty would give a
 *   different rate, and the rate is reported as this bench's rather than as the
 *   product's.
 * - Which of franc's answers are stable across versions. The overwrite depends
 *   on franc guessing at all, so the rate is a property of two libraries at two
 *   versions, while **the mechanism does not depend on the rate**.
 * - Whether the reader is ever shown the wrong flag. The flag path is not driven
 *   here; the two filter calls are.
 *
 *   node appendix/D-scripts/probe-refusal-overwritten.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-refusal-overwritten.mjs <path-to-extension-repo>');
  process.exit(2);
}
const esbuildEntry = join(root, 'node_modules/esbuild/lib/main.js');
if (!existsSync(esbuildEntry)) {
  console.error('cannot measure: no esbuild under ' + root + '/node_modules');
  process.exit(2);
}

// The bench. Written for this pass, chat register, and printed in full at the
// end of the run so the population is auditable rather than described.
const BENCH = {
  ru: ['привет всем как дела', 'это было очень смешно', 'я думаю что он прав',
    'сегодня играем в новую игру', 'не могу поверить что так вышло',
    'спасибо за стрим было круто', 'кто нибудь знает когда начало',
    'мне кажется это баг', 'давайте ещё раз попробуем', 'он всегда так делает'],
  uk: ['привіт усім як справи', 'це було дуже смішно', 'я думаю що він має рацію',
    'сьогодні граємо у нову гру', 'не можу повірити що так вийшло',
    'дякую за стрім було круто', 'хтось знає коли початок',
    'мені здається це баг', 'давайте ще раз спробуємо', 'він завжди так робить'],
  bg: ['здравейте на всички как сте', 'това беше много смешно', 'мисля че той е прав',
    'днес играем нова игра', 'не мога да повярвам че стана така',
    'благодаря за стрийма беше страхотно', 'някой знае ли кога започва',
    'струва ми се че е бъг', 'хайде да опитаме пак', 'той винаги прави така'],
  fa: ['سلام به همه چطورید', 'این خیلی خنده دار بود', 'فکر می کنم او درست می گوید',
    'امروز بازی جدید انجام می دهیم', 'باورم نمی شود که این طور شد',
    'ممنون بابت استریم عالی بود', 'کسی می داند کی شروع می شود',
    'به نظرم این یک اشکال است', 'بیایید دوباره امتحان کنیم', 'او همیشه همین کار را می کند'],
  ar: ['مرحبا بالجميع كيف حالكم', 'هذا كان مضحكا جدا', 'أعتقد أنه على حق',
    'اليوم نلعب لعبة جديدة', 'لا أصدق أن هذا حدث', 'شكرا على البث كان رائعا',
    'هل يعرف أحد متى يبدأ', 'يبدو لي أن هذا خطأ', 'هيا نحاول مرة أخرى', 'هو دائما يفعل هكذا'],
};
// Mongolian is the population the refusal is about, so it is larger and separate:
// the expected answer is **no code at all**, not `mn`, because Mongolian is not
// among the 42 languages the product offers.
const MONGOLIAN = [
  'сайн байна уу бүгдээрээ', 'энэ маш инээдтэй байсан', 'би түүнийг зөв гэж бодож байна',
  'өнөөдөр шинэ тоглоом тоглоно', 'ийм болсонд итгэхгүй байна',
  'стримд баярлалаа гайхалтай байлаа', 'хэзээ эхлэхийг хэн нэгэн мэдэх үү',
  'надад алдаа юм шиг санагдаж байна', 'дахин оролдоод үзье', 'тэр үргэлж ингэдэг',
  'чи хаанаас ирсэн бэ', 'маргааш уулзана уу', 'би энэ тоглоомыг үзэж байна',
  'юу болоод байгаа юм бэ', 'сайхан амарсан уу', 'өнөө орой чөлөөтэй юу',
  'би ойлгохгүй байна', 'энэ хэцүү байна шүү', 'та нар юу хийж байна',
  'бүгд сайхан байна уу', 'надад туслаач гуйя', 'би түүнд хэлсэн юм',
  'одоо эхэлье гэж бодож байна', 'манай баг ялсан', 'чамайг хүлээж байна',
  'өчигдөр орой унтсангүй', 'энэ ямар хэл вэ', 'тэд маргааш ирнэ',
  'би мэдэхгүй байна шүү', 'сонсож байна уу',
];

// The clone's modules reach each other through the ~/ alias, so bundle rather
// than import, the way the clone's own harnesses do.
const esbuild = await import(pathToFileURL(esbuildEntry).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-refusal-'));
const bundle = async (name, exports) => {
  const out = join(tmp, name + '.mjs');
  await esbuild.build({
    stdin: { contents: exports, resolveDir: root, sourcefile: name + '-entry.ts', loader: 'ts' },
    bundle: true, format: 'esm', platform: 'neutral', outfile: out, logLevel: 'silent',
  });
  return import(pathToFileURL(out).href);
};
const detect = await bundle('detect',
  "export { detectLanguage, confidentLanguage } from './src/content/langDetect';\n");
const filters = await bundle('filters',
  "export { isSameLanguageAsTarget, shouldDropBySourceLang } from './src/content/filters';\n");
const francMod = await bundle('franc', "export { franc } from 'franc-min';\n");
const { detectLanguage, confidentLanguage } = detect;
const { isSameLanguageAsTarget, shouldDropBySourceLang } = filters;
const { franc } = francMod;

// ── the separations, re-taken ───────────────────────────────────────────────
console.log('The five separations, on a bench written for this pass\n');
console.log('  language   confidentLanguage right   detectLanguage right');
const scores = {};
for (const [want, lines] of Object.entries(BENCH)) {
  const c = lines.filter((l) => confidentLanguage(l) === want).length;
  const d = lines.filter((l) => detectLanguage(l) === want).length;
  scores[want] = c;
  console.log('  ' + want.padEnd(11) + (c + ' of ' + lines.length).padEnd(24) + d + ' of ' + lines.length);
}

// ── the refusal ────────────────────────────────────────────────────────────
const rows = MONGOLIAN.map((l) => ({
  line: l,
  lookup: confidentLanguage(l),
  full: detectLanguage(l),
  franc: franc(l, { minLength: 3 }),
}));
const refused = rows.filter((r) => r.lookup === undefined);
const overwritten = refused.filter((r) => r.full !== undefined);
const missed = rows.filter((r) => r.lookup !== undefined);

console.log('\nMongolian, where the right answer is no code at all\n');
console.log('  lines on the bench                              ' + rows.length);
console.log('  the guard fires, the lookup refuses             ' + refused.length +
  '   (the corpus reports 17 of 20 for the same rule)');
console.log('  the guard does not fire, a code is looked up    ' + missed.length +
  (missed.length ? '   ' + missed.map((r) => r.lookup).join(' ') : ''));
console.log('  refusals that detectLanguage overwrites         ' + overwritten.length +
  ' of ' + refused.length);
for (const r of overwritten) {
  console.log('      detectLanguage=' + r.full + '  franc=' + r.franc + '   ' + r.line);
}

// ── the consequence, driven rather than argued ─────────────────────────────
// The product's own two filter calls, given exactly what detectLanguage returns.
console.log('\nWhat the product then does with those values, its own filters driven directly:\n');
const settingsAllowRu = { sourceLangAllowlist: ['ru'] };
const settingsAllowEsFr = { sourceLangAllowlist: ['es', 'fr'] };
let droppedAsYourLanguage = 0, admittedAsRussian = 0, wrongReason = 0;
for (const r of overwritten) {
  if (isSameLanguageAsTarget(r.full, 'ru')) droppedAsYourLanguage++;
  if (shouldDropBySourceLang(r.full, settingsAllowRu) === undefined) admittedAsRussian++;
  if (shouldDropBySourceLang(r.full, settingsAllowEsFr) === 'lang_not_allowed') wrongReason++;
}
console.log('  reader whose target is Russian, line dropped as "already in your language": ' +
  droppedAsYourLanguage + ' of ' + overwritten.length);
console.log('  reader whose source allowlist is [ru], Mongolian admitted as Russian:       ' +
  admittedAsRussian + ' of ' + overwritten.length);
console.log('  reader whose allowlist excludes it, shown lang_not_allowed not lang_unknown: ' +
  wrongReason + ' of ' + overwritten.length);
const respected = refused.filter((r) => r.full === undefined);
let honestUnknown = 0;
for (const r of respected) if (shouldDropBySourceLang(r.full, settingsAllowEsFr) === 'lang_unknown') honestUnknown++;
console.log('  the same call on the refusals that survive, for contrast: lang_unknown ' +
  honestUnknown + ' of ' + respected.length);

console.log('\nThe bench, so the population can be disagreed with:');
for (const [k, lines] of Object.entries({ ...BENCH, mn: MONGOLIAN })) {
  console.log('  ' + k + ' (' + lines.length + ')');
  for (const l of lines) console.log('      ' + l);
}

rmSync(tmp, { recursive: true, force: true });

// A probe that measured nothing must fail. If the separations collapse, the
// bundle is wrong or the bench is nonsense, and the refusal figure means nothing.
const separated = Object.values(scores).reduce((a, b) => a + b, 0);
if (separated < 35) {
  console.log('\nECHEC: only ' + separated + ' of 50 control lines were separated at all.');
  console.log('Either the bundle is not the product or this bench is not what it claims.');
  process.exit(2);
}

// The exit code asserts the finding, so a later session learns when it is stale.
if (overwritten.length === 0) {
  console.log('\nECHEC: no refusal was overwritten, so 4.109 is fixed or franc has changed');
  console.log('its answers, and this study is stale either way.');
  process.exit(1);
}
console.log('\nThe separations replicate. The refusal does not survive its own caller:');
console.log(overwritten.length + ' of ' + refused.length + ' lines the guard deliberately declined to name are named');
console.log('anyway by detectLanguage, through the one mechanism the guard exists to overrule.');
process.exit(0);
