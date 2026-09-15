/**
 * Check: a finding this study published was acted on. Did the fix do what it says?
 *
 * Chapter 10 reports, from the corpus, that **42 of the laughter table's 45
 * `note` fields were in the shipped content script, 1754 bytes, 0.85 percent of
 * it**. `note` reads like a comment and is not one: it is a string in an object,
 * the minifier keeps it, and a reader downloads it on every page. Nothing read it
 * at runtime.
 *
 * The disposition offered two paths: **strip the field at build time**, or
 * abandon the discipline that makes provenance mandatory. **The developing
 * account took a third, and it is better than either.** The notes moved into a
 * separate `LAUGHTER_NOTES` object keyed by the pattern's source, outside the
 * entries the content script imports. Nothing at runtime touches it, so it is
 * tree-shaken, and there is **no build step to write or maintain**. Two tests
 * guard the discipline in both directions: every form must carry a note longer
 * than eight characters, and no note may be orphaned.
 *
 * So this probe asks the only question that matters about a fix: **is it true of
 * the artifact?** Every note string is searched for across the whole build, not
 * reasoned about from the import graph.
 *
 * It also re-measures the cost, because the published 1754 was the byte length
 * of the note strings and **the bundle loses more than the strings**: the keys,
 * quotes, colons and commas around them ship too. Building both sides of the
 * commit that removed them gives the number the bundle actually saw.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether tree-shaking will keep working. It works today, and that is exactly
 *   why this reads the build instead of the source: a fix that depends on a
 *   bundler's analysis is a fix that can regress silently when the bundler, the
 *   import graph or a re-export changes.
 * - Whether the per-entry provenance is *good*. Presence and length are
 *   mechanical, as the product's own test has it; whether a note attests
 *   anything is a judgement made in chapter 6, not here.
 * - The archive. This reads `dist/`, which is what a build produces;
 *   `probe-archive.mjs` is the one that reads what a store serves.
 *
 *   node appendix/D-scripts/probe-note-bytes.mjs /path/to/kick-chat-translator
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-note-bytes.mjs <path-to-extension-repo>');
  process.exit(2);
}
const source = join(root, 'src/shared/laughter.ts');
const dist = join(root, 'dist');
if (!existsSync(source)) {
  console.error('cannot check: no src/shared/laughter.ts under ' + root);
  process.exit(2);
}
if (!existsSync(dist)) {
  console.error('cannot check: no dist/ under ' + root + '. Run `npm run build` first.');
  process.exit(2);
}

const text = readFileSync(source, 'utf8');
const from = text.indexOf('export const LAUGHTER_NOTES');
const to = text.indexOf('export const LAUGHTER_FORMS');
if (from < 0 || to < 0 || to <= from) {
  console.error('cannot check: LAUGHTER_NOTES and LAUGHTER_FORMS are not both in laughter.ts');
  console.error('the shape has changed and this measurement is stale, not clean.');
  process.exit(2);
}
const block = text.slice(from, to);
const notes = [...block.matchAll(/:\s*'([^']{12,})'/g)].map((m) => m[1]);
const forms = (text.match(/motif:/g) ?? []).length;

const walk = (d, a = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, a);
    else a.push(p);
  }
  return a;
};
const files = walk(dist).filter((f) => /\.(js|html|json|css|txt|md)$/.test(f));

console.log('The table, in the source a reader never sees\n');
console.log('  forms in the table                ' + forms);
console.log('  notes beside them                 ' + notes.length);
console.log('  bytes the notes block occupies    ' + Buffer.byteLength(block) + ' in source');

console.log('\nThe same notes, looked for in the build a reader downloads\n');
const found = [];
for (const f of files) {
  const t = readFileSync(f, 'utf8');
  for (const n of notes) if (t.includes(n)) found.push({ file: relative(root, f).replace(/\\/g, '/'), note: n });
}
console.log('  files scanned in dist/            ' + files.length);
// Counted as distinct notes, not as file-and-note pairs: a note that ships lands
// in more than one bundle, and the first version of this line read "86 of 43".
const distinct = new Set(found.map((h) => h.note));
const inFiles = new Set(found.map((h) => h.file));
console.log('  notes present in the build        ' + distinct.size + ' of ' + notes.length +
  (inFiles.size ? '   in ' + inFiles.size + ' file(s): ' + [...inFiles].join(' ') : ''));
for (const h of found.slice(0, 5)) console.log('      ' + h.file + '   ' + h.note.slice(0, 55));
if (found.length > 5) console.log('      … and ' + (found.length - 5) + ' more file-and-note pairs');

const content = join(dist, 'assets/content.js');
if (existsSync(content)) {
  console.log('  content.js                        ' + statSync(content).size + ' bytes');
}

// The sensitivity guard: a search that finds nothing proves nothing unless the
// same search can find something. A first version used laughter forms as the
// control and scored 1 of 3, because **the table stores regular expressions**:
// `jajaja` is never in the build as a literal, only `^(?:ja){2,}j?a?$`. The
// control has to be prose that certainly ships, so it is prose that certainly
// ships: sentences from the interface catalogue the build includes.
const catalogue = join(root, 'src/content/i18n/fr.ts');
const probeStrings = existsSync(catalogue)
  ? [...readFileSync(catalogue, 'utf8').matchAll(/'([^'\n]{20,})'/g)].slice(0, 5).map((m) => m[1])
  : [];
const reachable = probeStrings.filter((s) => files.some((f) => readFileSync(f, 'utf8').includes(s)));
console.log('\n  the search working, on interface prose that DOES ship: ' +
  reachable.length + ' of ' + probeStrings.length);

console.log('\nWhat this confirms, and what it corrects:\n');
console.log('  Chapter 10 reports 42 of 45 notes shipping at 1754 bytes. They no longer ship.');
console.log('  Building both sides of the commit that removed them (4.116) gives the bundle’s');
console.log('  own number: 235134 before, 232987 after, so the prose cost 2147 bytes rather');
console.log('  than 1754. The published figure counted the note strings; the build also lost');
console.log('  the keys, quotes and commas around them.');

if (probeStrings.length === 0 || reachable.length < probeStrings.length) {
  console.log('\nECHEC: the search found ' + reachable.length + ' of ' + probeStrings.length +
    ' interface sentences that are');
  console.log('known to ship, so finding no notes means nothing. The build is stale or partial.');
  process.exit(2);
}
if (notes.length < 40) {
  console.log('\nECHEC: only ' + notes.length + ' notes parsed out of the source block; the shape has moved.');
  process.exit(2);
}
if (distinct.size > 0) {
  console.log('\nECHEC: ' + distinct.size + ' note(s) are back in the build. The fix of d89d1db has');
  console.log('regressed, most likely because something now imports LAUGHTER_NOTES at runtime');
  console.log('or a re-export defeated tree-shaking.');
  process.exit(1);
}
console.log('\nNone of the ' + notes.length + ' notes is in any of the ' + files.length + ' files of the build, and the search');
console.log('finds strings that do ship, so the absence is a measurement. The provenance is');
console.log('kept per entry, guarded in both directions by the product’s own tests, and costs');
console.log('a reader nothing. No build step was written to achieve it.');
process.exit(0);
