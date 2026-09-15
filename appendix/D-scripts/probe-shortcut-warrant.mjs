/**
 * Check: is each detection shortcut *required and written down*, or gone?
 *
 * That is the third clause of A11's bar, and the only one nobody had taken a
 * number for. [4.103](../E-method-log.md) measured the surface from the page's
 * own world: **6 fixed element ids and 2 `data-kt` attributes** a script can
 * query by name. [4.54](../E-method-log.md) answered the documentation half as a
 * blanket *no document in either repository counts them*. Neither asked the
 * question the clause poses, which is per shortcut and has two terms.
 *
 * **"Required" has two readings and they give different numbers**, so both are
 * reported rather than one being chosen quietly:
 *
 * - *Required at all*: the product reads the name back somewhere. A name
 *   nothing reads is decoration and could be deleted today.
 * - *Required as a fixed, guessable literal*: code outside the file that
 *   declares the constant has to spell the same string. A stylesheet always
 *   does, because it ships as a static file and cannot import anything.
 *
 * **The second reading is the bar's own**, because the bar is about the cost of
 * detection: *finding the extension costs a page script a read of rendered
 * content and never a query by name*. An id read back only through the constant
 * that declares it, in one file, would work identically with a per-install
 * random suffix, and then there is nothing to query by name.
 *
 * A literal search alone gets this wrong, which is why the constant is resolved
 * first. Five of the six ids appear exactly once as a string, in their own
 * `const X_ID = 'kt-…'` line, and every later use is of `X_ID`. Counting
 * strings would call them write-only decoration; they are read back three and
 * four times each.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether a name is *worth* keeping. This reports what forces the literal,
 *   not whether the feature behind it should exist.
 * - Indirection past one hop. It resolves `const X = 'literal'` and then uses
 *   of `X` in the same file. A name assembled at runtime, or passed through two
 *   modules, is not followed, and there is one such case: the float menu's id
 *   reaches `makeLangMenu()` as an argument, reported as the argument it is
 *   rather than resolved into the callee.
 * - Whether a mention in a document *explains* the name. Presence is mechanical.
 *   The two mentions that exist were read by hand in 4.108 and are debugging
 *   notes, which is a judgement this script does not make.
 *
 *   node appendix/D-scripts/probe-shortcut-warrant.mjs . /path/to/kick-chat-translator
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const study = process.argv[2];
const root = process.argv[3];
if (!study || !root) {
  console.error('usage: probe-shortcut-warrant.mjs <this repository> <path-to-extension-repo>');
  process.exit(2);
}
if (!existsSync(join(root, 'src/content'))) {
  console.error('cannot check: no src/content under ' + root);
  process.exit(2);
}

// The population is what probe-detection.mjs saw from the page's own world, not
// what source reading suggests. Those are different numbers and 4.103's is the
// one a hostile page actually has.
const NAMES = [
  'kt-lang-chip', 'kt-floating-bar', 'kt-float-lang-menu',
  'kt-compose-bar', 'kt-lang-menu', 'kt-inject-style',
  'data-kt-scheme', 'data-kt-id',
];

const walk = (d, acc = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx|css)$/.test(p) && !/\.test\.tsx?$/.test(p)) acc.push(p);
  }
  return acc;
};
const files = walk(join(root, 'src'));
const rel = (p) => relative(root, p).replace(/\\/g, '/');
const text = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));

// ── what forces a literal ───────────────────────────────────────────────────
// The rule is one line and does not depend on classifying call shapes: **a
// literal is forced when code outside the file that declares its constant
// spells the same string.** A comment does not count, because nothing breaks
// when a comment goes stale.
//
// This replaced a first version that decided the finding from a regex over call
// shapes. That version put 59 sites in an `other` bucket, 48 of them one obvious
// CSS selector shape, and got `kt-floating-bar` wrong on the way. The naming
// below is now output a reader can scan; the finding rests on the file boundary.
const isComment = (line) => {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
};
const CALL = '(?:getElementById|querySelectorAll|querySelector|closest|matches|getAttribute)\\s*(?:<[^>]*>)?\\s*\\(';
const describe = (line, token, file) => {
  if (isComment(line)) return 'comment';
  if (file.endsWith('.css')) return 'css selector';
  if (new RegExp(CALL + '[^)]*' + token).test(line)) return 'query';
  if (new RegExp('\\.id\\s*===?\\s*' + token + '\\b').test(line)) return 'query';
  if (new RegExp('(?:setAttribute|removeAttribute)\\s*\\(\\s*[\'"`]?' + token).test(line)) return 'attribute write';
  if (new RegExp('\\.id\\s*=\\s*' + token + '\\b').test(line)) return 'write';
  if (new RegExp('aria-[a-z]+[\'"`]\\s*,\\s*' + token + '\\b').test(line)) return 'aria target';
  if (new RegExp('const\\s+\\w+\\s*=\\s*[\'"`]' + token).test(line)) return 'declaration';
  return 'other';
};

const report = [];
for (const name of NAMES) {
  // Step one: find the constant, if the literal is declared as one.
  let constName = null, declaredIn = null;
  for (const [f, s] of text) {
    const m = s.match(new RegExp('const\\s+(\\w+)\\s*=\\s*[\'"`]' + name + '[\'"`]'));
    if (m) { constName = m[1]; declaredIn = f; break; }
  }
  // Step two: every occurrence of the literal, and of the constant in the file
  // that declares it.
  const sites = [];
  for (const [f, s] of text) {
    s.split('\n').forEach((line, i) => {
      const hitsLiteral = line.includes(name);
      const hitsConst = constName && f === declaredIn && new RegExp('\\b' + constName + '\\b').test(line);
      if (!hitsLiteral && !hitsConst) return;
      const token = hitsLiteral ? name : constName;
      sites.push({ file: rel(f), line: i + 1, how: describe(line, token, f), literal: hitsLiteral, src: line.trim() });
    });
  }
  const home = declaredIn && rel(declaredIn);
  const forcing = sites.filter((s) => s.literal && s.how !== 'comment' && (s.file.endsWith('.css') || s.file !== home));
  report.push({ name, constName, declaredIn: home, sites, forcing, readBack: sites.some((s) => s.how === 'query') });
}

// ── the documentation half ──────────────────────────────────────────────────
const mdFiles = (dir) => {
  const out = [];
  const go = (d) => {
    for (const n of readdirSync(d)) {
      if (n === 'node_modules' || n === '.git' || n === 'dist') continue;
      const p = join(d, n);
      if (statSync(p).isDirectory()) go(p);
      else if (p.endsWith('.md')) out.push(p);
    }
  };
  go(dir);
  return out;
};
const extDocs = mdFiles(root);
const studyDocs = mdFiles(study);
const named = (docs, name) => docs.filter((f) => readFileSync(f, 'utf8').includes(name));

// ── output ─────────────────────────────────────────────────────────────────
console.log(files.length + ' source files read, ' + extDocs.length + ' documents in the extension, ' +
  studyDocs.length + ' in this study\n');
console.log('name                 const              read back   forced by a fixed literal     ext docs');
for (const r of report) {
  const where = r.forcing.length
    ? r.forcing.length + ' site(s) outside ' + (r.declaredIn ? r.declaredIn.split('/').pop() : 'any constant')
    : 'no';
  console.log('  ' + r.name.padEnd(19) + (r.constName ?? '\u2014').padEnd(19) +
    (r.readBack ? 'yes' : 'no').padEnd(12) + where.padEnd(32) + named(extDocs, r.name).length);
}

const readBack = report.filter((r) => r.readBack).length;
const forcedNames = report.filter((r) => r.forcing.length).map((r) => r.name).sort();
const documented = report.filter((r) => named(extDocs, r.name).length > 0);

console.log('\nrequired, read-back reading:                  ' + readBack + ' of ' + NAMES.length);
console.log('required, fixed-literal reading (the bar\u2019s):  ' + forcedNames.length + ' of ' + NAMES.length +
  '  (' + forcedNames.join(', ') + ')');
console.log('named in any document the extension ships:    ' + documented.length + ' of ' + NAMES.length);
for (const d of documented) {
  console.log('    ' + d.name + ': ' + named(extDocs, d.name).map((f) => relative(root, f).replace(/\\/g, '/')).join(', '));
}

console.log('\nevery site that forces a literal, so the rule can be disagreed with:');
for (const r of report.filter((x) => x.forcing.length)) {
  const byFile = {};
  for (const s of r.forcing) (byFile[s.file] ??= []).push(s.line);
  console.log('  ' + r.name + '  (declared in ' + (r.declaredIn ?? 'no constant') + ')');
  for (const [f, ls] of Object.entries(byFile)) console.log('      ' + f + '  ' + ls.length + ' line(s), first ' + ls[0]);
}
const unclassified = report.flatMap((r) => r.sites.filter((s) => s.how === 'other'));
console.log('\nsites this script will not name, reported rather than guessed at: ' + unclassified.length);
for (const s of unclassified) console.log('    ' + s.file + ':' + s.line + '   ' + s.src.slice(0, 88));

// A probe that measured nothing must fail: if the names have moved, every one
// comes back with no sites and the run would report a clean surface.
const empty = report.filter((r) => r.sites.length === 0);
if (empty.length) {
  console.log('\nECHEC: ' + empty.map((r) => r.name).join(', ') + ' appears nowhere in the source.');
  console.log('The population has moved and this measurement is stale, not clean.');
  process.exit(2);
}

// The exit code asserts the finding, so a later session learns when it is stale.
const EXPECTED_FORCED = ['data-kt-id', 'data-kt-scheme', 'kt-floating-bar'];
if (JSON.stringify(forcedNames) !== JSON.stringify(EXPECTED_FORCED)) {
  console.log('\nECHEC: the set of names forced to a fixed literal has changed: ' + forcedNames.join(', '));
  process.exit(1);
}
if (documented.length !== 2) {
  console.log('\nECHEC: ' + documented.length + ' names are in the extension\u2019s documents, 4.108 recorded 2.');
  process.exit(1);
}
console.log('\nFive of the eight are spelled only in the file that declares them and selected');
console.log('by no stylesheet, so a per-install random suffix would satisfy every read-back');
console.log('they have. A sixth, kt-floating-bar, is forced only because index.ts repeats the');
console.log('string injector.ts already holds in FLOAT_ID; importing it moves that one across.');
console.log('Two are structurally forced: a stylesheet cannot import a constant.');
process.exit(0);
