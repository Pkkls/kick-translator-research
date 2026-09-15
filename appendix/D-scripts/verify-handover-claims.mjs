#!/usr/bin/env node
/**
 * Re-derive every measurable claim in HANDOVER.md against the system it
 * describes, and print expected against actual.
 *
 * A handover is worth what its numbers are worth. This exists so that nobody
 * has to trust a transcription, including the account that wrote it: the
 * claims most likely to be wrong in a secondary reading are the ones copied
 * from someone else's notebook, and the ones measured once and then edited.
 *
 * Usage:
 *   node verify-handover-claims.mjs <path-to-extension-repo>
 *
 * Exit code 0 if every checkable claim holds, 1 otherwise.
 * Claims that need a browser, real traffic, or the ignored harness directory
 * are reported as UNCHECKABLE rather than silently skipped: a verifier that
 * quietly drops what it cannot test reports a clean run over a subset.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const root = process.argv[2];
if (!root) {
  console.error('usage: node verify-handover-claims.mjs <path-to-extension-repo>');
  process.exit(2);
}

const results = [];
const claim = (id, expected, actual, note) =>
  results.push({ id, expected: String(expected), actual: String(actual), ok: String(expected) === String(actual), note });
const uncheckable = (id, why) => results.push({ id, uncheckable: why });

const read = (p) => readFileSync(join(root, p), 'utf8');
const git = (cmd) => execSync('git ' + cmd, { cwd: root, encoding: 'utf8' }).trim();

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(name) && !/\.test\./.test(name)) acc.push(p);
  }
  return acc;
}
const contentFiles = walk(join(root, 'src', 'content'));

// 3.1 Direction handling -----------------------------------------------------

const dirSites = [];
for (const f of contentFiles) {
  read(f.slice(root.length + 1)).split('\n').forEach((line, i) => {
    if (/\.dir\s*=|setAttribute\(\s*['"]dir['"]/.test(line)) dirSites.push({ file: f, line: i + 1 });
  });
}
claim('3.1 direction attribute assignments', 2, dirSites.length);

// The distance between the construction that sets dir and the write it guards
// is quoted in the text. It is the kind of number that rots on any edit.
const compose = read('src/content/composeUi.ts').split('\n');
const dirLine = compose.findIndex((l) => /\.dir\s*=/.test(l)) + 1;
const writeLine = compose.findIndex((l) => /textEl\.textContent\s*=\s*state\.text/.test(l)) + 1;
claim('3.1 dir set before the write it guards', true, dirLine > 0 && writeLine > dirLine, dirLine + ' then ' + writeLine + ', ' + (writeLine - dirLine) + ' lines apart');

const errorCallers = [];
for (const f of walk(join(root, 'src'))) {
  read(f.slice(root.length + 1)).split('\n').forEach((line) => {
    if (/showError\(/.test(line) && !/export function/.test(line)) errorCallers.push(line.trim());
  });
}
const externalText = errorCallers.filter((l) => !/localised\(|,\s*code\s*,|'[a-z_]+'/.test(l));
claim('3.1 showError callers passing external text', 0, externalText.length, errorCallers.length + ' callers total');

const BIDI = /\\u202[A-E]|\\u206[6-9]|\\u200[B-F]|\\uFEFF/;
claim('3.1 sources handling direction-control characters', 0, contentFiles.filter((f) => BIDI.test(read(f.slice(root.length + 1)))).length);

// 3.1 markup -----------------------------------------------------------------

let markup = 0;
for (const f of contentFiles) {
  if (/\binnerHTML\s*=|insertAdjacentHTML|createContextualFragment|document\.write\s*\(/.test(read(f.slice(root.length + 1)))) markup++;
}
claim('3.1 files with a markup sink', 1, markup, 'the one is an internal icon table into SVG');

// 3.2 Detectability ----------------------------------------------------------

const css = read('src/content/inject.css');
const classNames = new Set([...css.matchAll(/\.(kt-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]));
claim('3.2 prefixed class names', 99, classNames.size);

const injector = read('src/content/injector.ts');
claim('3.2 fixed id on an injected element', true, /\.id\s*=\s*STYLE_ID|\.id\s*=\s*['"][\w-]+['"]/.test(injector));
claim('3.2 attribute set on the document element', true, /documentElement\.setAttribute\(/.test(injector));
claim('3.2 marker written onto host rows', true, /row\.setAttribute\(PROCESSED_MARK/.test(read('src/content/observer.ts')));

// 3.3 Localisation -----------------------------------------------------------

const keys = JSON.parse(read('src/shared/i18n/keys.json'));
const declared = Array.isArray(keys) ? keys.length : Object.keys(keys).length;
claim('3.3 declared interface keys', 155, declared);

const langFiles = readdirSync(join(root, 'src/shared/i18n')).filter((f) => /\.ts$/.test(f) && f !== 'index.ts');
const perFile = new Set(langFiles.map((f) => (read('src/shared/i18n/' + f).match(/^\s{2}[a-zA-Z][a-zA-Z0-9_]*\s*:/gm) || []).length));
claim('3.3 entries per language file', '34', [...perFile].join(','), langFiles.length + ' files');
claim('3.3 an Arabic interface locale ships', true, existsSync(join(root, 'src/shared/i18n/ar.ts')));

// 3.3 Branches and release ---------------------------------------------------

const remotes = git('branch -r').split('\n').map((l) => l.trim()).filter((l) => l && !l.includes('->'));
const nonMain = remotes.filter((b) => !/\/(master|main)$/.test(b));
claim('3.3 remote branches besides the main one', 9, nonMain.length);

const merged = git('branch -r --merged master').split('\n').map((l) => l.trim()).filter((l) => l && !l.includes('->') && !/\/(master|main)$/.test(l));
claim('3.3 of those, already merged', 7, merged.length);

const pkgVersion = JSON.parse(read('package.json')).version;
const lastTag = git('tag --sort=-v:refname').split('\n')[0].replace(/^v/, '');
claim('3.3 package version agrees with the latest tag', pkgVersion, lastTag);

// 3.3 Harness ----------------------------------------------------------------

const harness = join(root, 'scratchpad', 'harness');
if (!existsSync(harness)) {
  uncheckable('3.3 harness counts', 'the harness directory is ignored by version control and absent from this clone');
} else {
  const files = readdirSync(harness).filter((f) => f.endsWith('.mjs'));
  claim('3.3 harness files', 56, files.length);
  const runner = readFileSync(join(harness, 'run-gates.mjs'), 'utf8');
  claim('3.3 runner entries', 40, (runner.match(/^ {2}\['/gm) || []).length);
}

// Claims that need what this account did not have ---------------------------

uncheckable('3.1 what a reader sees on an override', 'needs a browser and a built artefact');
uncheckable('5 frequency of any phenomenon in real chat', 'needs a live capture');
uncheckable('5 on-device engine availability', 'needs multiple real browser profiles');
uncheckable('every [yours] number', 'taken on another machine at commits that have moved');

// Report ---------------------------------------------------------------------

const checked = results.filter((r) => !r.uncheckable);
const failed = checked.filter((r) => !r.ok);

for (const r of checked) {
  console.log(
    (r.ok ? 'ok   ' : 'WRONG') + '  ' + r.id.padEnd(48) + ' expected ' + r.expected + ', actual ' + r.actual + (r.note ? '  (' + r.note + ')' : ''),
  );
}
for (const r of results.filter((x) => x.uncheckable)) {
  console.log('----   ' + r.id.padEnd(48) + ' UNCHECKABLE: ' + r.uncheckable);
}

console.log('\n' + (checked.length - failed.length) + '/' + checked.length + ' checkable claims hold');
console.log(results.filter((x) => x.uncheckable).length + ' claims are not checkable from a clone, listed above rather than skipped');

if (checked.length === 0) {
  console.error('\nFAIL: nothing was checked. The probe measured nothing.');
  process.exit(2);
}
process.exit(failed.length === 0 ? 0 : 1);
