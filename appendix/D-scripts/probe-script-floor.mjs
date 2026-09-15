/**
 * Replicate the emoji fix, then ask what the floor it left behind is worth.
 *
 * The corpus reports a real defect and a real fix. The script pre-check's
 * denominator used to count **every** non-ASCII character, emoji included, so
 * emoji inflated it without ever being able to win a majority: *"да" plus two
 * emoji* fell to 2 of 4, no strict majority, `undefined`; *"رائع" plus four
 * emoji* did the same and franc took over and answered Persian on Arabic. The
 * fix counts only characters carrying one of eight known scripts. The published
 * figure is that it **holds to 6 emoji**.
 *
 * **It holds further than that, and the corpus under-states its own fix.** Emoji
 * are not in the denominator at all now, so there is no limit to find: `да`
 * followed by fifty emoji is still Russian. The published 6 was the end of what
 * was tried, not the end of what works.
 *
 * **What the fix left is a floor of two**, and the source is explicit about why:
 * a single Cyrillic homoglyph in an English word counts 1, and at a floor of 1
 * the whole line becomes Russian. Two is the mitigation, and it works for one
 * character. This asks what two characters are worth.
 *
 * They are worth the whole message, because **ASCII is skipped before the
 * counting starts**. A thousand characters of English contribute nothing to the
 * denominator, so two Cyrillic letters are 100 percent of it. Seven of the eight
 * counted scripts decide a message this way; Han is the exception and defers to
 * franc on purpose ([4.110](../E-method-log.md)).
 *
 * **The realistic vector is not a homoglyph, it is a kaomoji.** `(・∀・)` carries
 * two U+30FB katakana middle dots. That is two kana, the floor is met, and the
 * kana rule wins outright without needing a majority. An English sentence
 * carrying that face is Japanese.
 *
 * This one reaches further than 4.112 and 4.114 did. Those moved
 * `detectLanguage` only, so the filters and the flag were wrong and the
 * translation was not. Here **`confidentLanguage` returns the wrong answer**, so
 * the source language sent to the provider is wrong.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - How often a kaomoji or a stray homoglyph arrives. No chat capture exists
 *   here. What is measured is that two characters suffice at any length.
 * - What a provider does when told the wrong source language. That needs a live
 *   engine; the corpus's own note on `sl=fr` says the message can come back
 *   unchanged and then be dropped without a word.
 * - Scripts the pre-check does not count. Greek is one: two Greek letters change
 *   nothing, which is shown rather than assumed.
 *
 *   node appendix/D-scripts/probe-script-floor.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-script-floor.mjs <path-to-extension-repo>');
  process.exit(2);
}
if (!existsSync(join(root, 'node_modules/esbuild/lib/main.js'))) {
  console.error('cannot measure: no esbuild under ' + root + '/node_modules');
  process.exit(2);
}
const esbuild = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-floor-'));
const o = join(tmp, 'd.mjs');
await esbuild.build({
  stdin: {
    contents: "export { detectLanguage, confidentLanguage } from './src/content/langDetect';\n",
    resolveDir: root, sourcefile: 'd.ts', loader: 'ts',
  },
  bundle: true, format: 'esm', platform: 'neutral', outfile: o, logLevel: 'silent',
});
const { detectLanguage, confidentLanguage } = await import(pathToFileURL(o).href);

const EN = 'this is a perfectly ordinary english sentence about the stream and nothing else';

// ── the replication ────────────────────────────────────────────────────────
console.log('The corpus’s own two examples, and how far the fix actually holds\n');
const emojiRun = [0, 2, 6, 10, 50].map((n) => ({ n, got: confidentLanguage('да' + '\u{1F600}'.repeat(n)) }));
console.log('  "да" plus emoji:   ' + emojiRun.map((r) => r.n + ':' + (r.got ?? '-')).join('  '));
const arRun = [0, 4, 30].map((n) => ({ n, got: confidentLanguage('رائع' + '\u{1F525}'.repeat(n)) }));
console.log('  "رائع" plus emoji: ' + arRun.map((r) => r.n + ':' + (r.got ?? '-')).join('  '));
console.log('  the published figure is "holds to 6"; there is no limit to find.');

// ── the floor, which is what the fix left ──────────────────────────────────
console.log('\nThe floor of two. One character is refused, which is the documented mitigation:\n');
const one = confidentLanguage(EN + ' а');
const two = confidentLanguage(EN + ' ао');
console.log('  one Cyrillic character in ' + EN.length + ' of English:   ' + (one ?? 'undefined'));
console.log('  two Cyrillic characters in the same:        ' + (two ?? 'undefined'));

console.log('\nTwo characters, by script, in the same English sentence:\n');
const SCRIPTS = {
  Cyrillic: 'ао', Arabic: 'اب', Hebrew: 'אב', Thai: 'กข',
  Devanagari: 'अआ', Han: '一二', Kana: 'あい', Hangul: '가각',
  Greek: 'αο',
};
const decided = [];
for (const [name, pair] of Object.entries(SCRIPTS)) {
  const got = confidentLanguage(EN + ' ' + pair);
  if (got) decided.push(name);
  console.log('  ' + name.padEnd(12) + (got ?? 'undefined'));
}
console.log('\n  ' + decided.length + ' of ' + Object.keys(SCRIPTS).length + ' decide the message from two characters.');
console.log('  Han defers to franc on purpose (4.110); Greek is not one of the eight counted.');

console.log('\nLength changes nothing, because ASCII is skipped before counting starts:\n');
for (const n of [1, 20, 120, 200]) {
  const t = ('word '.repeat(n)).trim() + ' ао';
  console.log('  ' + String(t.length).padStart(5) + ' characters of English plus two Cyrillic:   ' +
    (confidentLanguage(t) ?? 'undefined'));
}

// ── the realistic vector ───────────────────────────────────────────────────
console.log('\nKaomoji, which stream chat is made of:\n');
const KAOMOJI = {
  'shrug': '¯\\_(ツ)_/¯',
  'happy arms': 'ヽ(・∀・)ノ',
  'dot face': '(・∀・)',
  'flip table': '(╯°□°)╯︵ ┻━┻',
  'lenny': '( ͡° ͜ʖ ͡°)',
};
const japanese = [];
for (const [name, k] of Object.entries(KAOMOJI)) {
  const inside = 'that play was insane ' + k + ' lets go';
  const got = confidentLanguage(inside);
  if (got) japanese.push(name);
  console.log('  ' + name.padEnd(12) + 'in an English sentence: ' + String(got ?? 'undefined').padEnd(10) + k);
}
console.log('\n  the characters of `' + KAOMOJI['dot face'] + '` the counter reads as kana:');
for (const ch of KAOMOJI['dot face']) {
  const c = ch.codePointAt(0);
  if (c >= 0x3040 && c <= 0x30ff) console.log('      U+' + c.toString(16).toUpperCase().padStart(4, '0') + '  ' + ch);
}
console.log('  two of them, so the floor is met, and one kana wins outright without a majority.');

// ── the control, and the reach ─────────────────────────────────────────────
console.log('\nThe control: real text in each script still reads correctly\n');
const REAL = {
  ru: 'привет всем как дела',
  ja: '今日はいい天気ですね',
  ar: 'مرحبا بالجميع',
  ko: '안녕하세요 여러분',
};
let realOk = 0;
for (const [want, t] of Object.entries(REAL)) {
  const got = confidentLanguage(t);
  if (got === want) realOk++;
  console.log('  ' + want + '  ' + (got === want ? 'correct  ' : 'WRONG (' + got + ')') + '  ' + t);
}

console.log('\nHow far this reaches, which is further than 4.112 and 4.114:\n');
console.log('  confidentLanguage is what the pipeline hands the provider as the source');
console.log('  language. It returns ' + (two ?? '-') + ' for an English sentence carrying two Cyrillic');
console.log('  letters, so this is not a filter being wrong about a line it keeps. It is the');
console.log('  wrong source language on the call itself.');
rmSync(tmp, { recursive: true, force: true });

if (realOk < 4) {
  console.log('\nECHEC: only ' + realOk + ' of 4 real lines read correctly; the pre-check is broken');
  console.log('and its floor is not the story.');
  process.exit(2);
}
if (emojiRun.some((r) => r.got !== 'ru')) {
  console.log('\nECHEC: the emoji fix no longer holds, so the replication above is stale.');
  process.exit(2);
}
if (one !== undefined) {
  console.log('\nECHEC: one foreign character now decides a message; the floor of two is gone.');
  process.exit(1);
}
const RECORDED = ['Cyrillic', 'Arabic', 'Hebrew', 'Thai', 'Devanagari', 'Kana', 'Hangul'];
if (JSON.stringify(decided) !== JSON.stringify(RECORDED)) {
  console.log('\nECHEC: the scripts that decide from two characters have changed since 4.115.');
  console.log('  recorded: ' + RECORDED.join(' '));
  console.log('  now:      ' + decided.join(' '));
  process.exit(1);
}
if (japanese.length === 0) {
  console.log('\nECHEC: no kaomoji makes an English sentence Japanese, so 4.115 is fixed.');
  process.exit(1);
}
console.log('\nThe emoji fix replicates and holds further than published. The floor it left');
console.log('refuses one character and accepts two, at any message length, on seven of the');
console.log('eight counted scripts, and ' + japanese.length + ' of ' + Object.keys(KAOMOJI).length + ' ordinary kaomoji reach it.');
process.exit(0);
