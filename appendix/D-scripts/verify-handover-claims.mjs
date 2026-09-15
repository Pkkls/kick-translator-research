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
 * Claims that need a browser, real traffic, or a machine this account did not
 * have are reported as UNCHECKABLE rather than silently skipped: a verifier
 * that quietly drops what it cannot test reports a clean run over a subset.
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

// Counted over selectors with comments stripped. The first published figure
// was 99, taken by matching the whole file, and one of those was a placeholder
// inside a comment about CSS specificity. A22 exists because of this class of
// error and caught this instance on its first run.
const css = read('src/content/inject.css').replace(/\/\*[\s\S]*?\*\//g, '');
const selectors = css.split('}').map((block) => block.split('{')[0]).join(' ');
const classNames = new Set([...selectors.matchAll(/\.(kt-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]));
claim('3.2 prefixed class names', 98, classNames.size, 'selectors only, comments stripped');

const injector = read('src/content/injector.ts');
claim('3.2 fixed id on an injected element', true, /\.id\s*=\s*STYLE_ID|\.id\s*=\s*['"][\w-]+['"]/.test(injector));
claim('3.2 attribute set on the document element', true, /documentElement\.setAttribute\(/.test(injector));
claim('3.2 marker written onto host rows', true, /row\.setAttribute\(PROCESSED_MARK/.test(read('src/content/observer.ts')));

// 3.3 Localisation -----------------------------------------------------------

const keys = JSON.parse(read('src/shared/i18n/keys.json'));
const declared = Array.isArray(keys) ? keys.length : Object.keys(keys).length;
claim('3.3 declared interface keys', 155, declared);

// Counted by walking the object, not by matching lines. The published figure
// was 34, from a pattern that saw only unquoted keys at one indentation; 121
// of the 155 keys are quoted because they are English sentences. The coverage
// is complete. This is the error A22 exists for, and it reached publication.
function countObjectKeys(source) {
  const body = source.slice(source.indexOf('{') + 1, source.lastIndexOf('}'));
  let depth = 0;
  let inStr = null;
  let keys = 0;
  let atKey = true;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (inStr) { if (c === inStr && body[i - 1] !== '\\') inStr = null; continue; }
    if (c === "'" || c === '"') { if (depth === 0 && atKey) { keys++; atKey = false; } inStr = c; continue; }
    if (c === '{' || c === '[') { depth++; continue; }
    if (c === '}' || c === ']') { depth--; continue; }
    if (c === ',' && depth === 0) { atKey = true; continue; }
    if (depth === 0 && atKey && /[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < body.length && /[\w$]/.test(body[j])) j++;
      if (body[j] === ':') { keys++; atKey = false; i = j; }
    }
  }
  return keys;
}
const langFiles = readdirSync(join(root, 'src/shared/i18n')).filter((f) => /\.ts$/.test(f) && f !== 'index.ts');
const perFile = new Set(langFiles.map((f) => countObjectKeys(read('src/shared/i18n/' + f))));
claim('3.3 entries per language file', '155', [...perFile].join(','), langFiles.length + ' files, counted structurally');
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
  // Counted by bracket depth rather than by line shape. A line-anchored regex
  // gave two different answers on two attempts, because seven entries carry
  // their arguments across several lines. Repeating a measurement with the
  // same technique confirms only that the technique is stable.
  const runner = readFileSync(join(harness, 'run-gates.mjs'), 'utf8');
  const block = runner.slice(runner.indexOf('const GATES = ['), runner.indexOf('\n];', runner.indexOf('const GATES = [')));
  let depth = 0;
  let gateEntries = 0;
  for (let i = block.indexOf('[') + 1; i < block.length; i++) {
    if (block[i] === '[') { if (depth === 0) gateEntries++; depth++; }
    else if (block[i] === ']') depth--;
  }
  claim('3.3 runner entries', 40, gateEntries, 'counted structurally, not by line');

  // Orphans by the file each entry launches, not by its name. The first count
  // here compared gate names with file names and published 35: it missed a gate
  // whose name is not its file and counted imported modules as harnesses. The
  // project's own state.mjs makes the same comparison and reports 32. All three
  // reconcile to the same 29, item by item.
  const launched = new Set([...block.replace(/\/\/.*$/gm, '').matchAll(/scratchpad\/harness\/([\w.-]+\.mjs)/g)].map((m) => m[1]));
  const imported = new Set(files.flatMap((f) => [...readFileSync(join(harness, f), 'utf8').matchAll(/from\s+'\.\/([\w.-]+\.mjs)'/g)].map((m) => m[1])));
  const RUNNERS = ['run-gates.mjs', 'run-live.mjs']; // ponytail: by name; a third runner needs adding here
  const notLaunched = files.filter((f) => !launched.has(f));
  const orphans = notLaunched.filter((f) => !imported.has(f) && !RUNNERS.includes(f));
  claim('3.3 files no runner entry launches', 34, notLaunched.length, launched.size + ' launched');
  claim('3.3 of those, runners or modules a gate imports', 5, notLaunched.length - orphans.length);
  claim('3.3 orphans', 29, orphans.length);
  const etatPath = join(root, '.agent', 'ETAT.json');
  if (existsSync(etatPath)) {
    const etat = JSON.parse(readFileSync(etatPath, 'utf8')).portes?.orphelins ?? [];
    const wrong = etat.filter((n) => launched.has(n + '.mjs') || imported.has(n + '.mjs'));
    claim('3.3 state.mjs orphans that are launched or imported', 3, wrong.length, wrong.join(', ') + ' of ' + etat.length);
  } else uncheckable('3.3 state.mjs orphan list', '.agent/ETAT.json absent');
}

// 3.5b Manifest, counted structurally ---------------------------------------
// Prefer the built manifest, which is structured data. Fall back to slicing the
// source's host_permissions array rather than matching https across the whole
// file: that regex also caught the content script's matches block and reported
// ten where there are eight.

let hostCount;
let hostSource;
if (existsSync(join(root, 'dist', 'manifest.json'))) {
  hostCount = JSON.parse(read('dist/manifest.json')).host_permissions.length;
  hostSource = 'built manifest';
} else {
  const cfg = read('manifest.config.ts');
  const from = cfg.indexOf('host_permissions');
  const arr = cfg.slice(from, cfg.indexOf(']', from));
  hostCount = (arr.match(/'https:/g) || []).length;
  hostSource = 'source, host_permissions array only';
}
claim('3.5b host permissions', 8, hostCount, hostSource);
claim('3.5b no web-accessible resources', true, !/web_accessible_resources\s*:/.test(read('manifest.config.ts')));

// 3.5c and 3.5d Worker lifecycle -------------------------------------------

const bg = read('src/background/index.ts');
const bgLines = bg.split('\n');
const initCall = bgLines.findIndex((l) => /^void init\(\);/.test(l)) + 1;
const listener = bgLines.findIndex((l) => /^onMessage\(/.test(l)) + 1;
claim('3.5c init is started without being awaited', true, initCall > 0, 'line ' + initCall);
claim('3.5c the listener registers after it, synchronously', true, listener > initCall, 'line ' + listener);

const statsSrc = read('src/background/stats.ts');
claim('3.5c the stats tracker overwrites rather than merges', true, /storage\.local\.set\(\{\s*\[STORAGE_KEY_STATS\]:\s*this\.state/.test(statsSrc));
claim('3.5c the metrics module merges, on the same lifecycle', true, /counts\[k\] = \(counts\[k\] \?\? 0\) \+ v/.test(read('src/shared/metrics.ts')));
claim('3.5d the day key is UTC', true, /toISOString\(\)\.slice\(0, 10\)/.test(statsSrc));
claim('3.5d the rollover archives before resetting', true, /archiveDay\(/.test(statsSrc));

// 3.5 Languages with no marker anywhere in the detection chain --------------
// Counted across the chain, not over langDetect.ts alone. Counting one file
// gave 18 of 42 and a conclusion of 24 unmarked, which was wrong by seven.

const chainFiles = ['content/langDetect.ts', 'shared/laughter.ts', 'shared/romanised.ts', 'shared/transliterationGuard.ts', 'content/filters.ts']
  .filter((f) => existsSync(join(root, 'src', f)));
const chain = chainFiles.map((f) => read('src/' + f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')).join('');
const chainLiterals = new Set([...chain.matchAll(/['"]([a-z]{2}(?:-[A-Za-z]+)?)['"]/g)].map((m) => m[1]));
const offered = [...read('src/shared/languages.ts').matchAll(/code:\s*['"]([a-z]{2}(?:-[A-Za-z]+)?)['"]/g)].map((m) => m[1]);
const unmarked = offered.filter((c) => !chainLiterals.has(c));
claim('3.5 languages offered', 42, offered.length);
claim('3.5 languages with no marker anywhere in the chain', 17, unmarked.length, chainFiles.length + ' files in the chain');

// 3.6 What a clone gets -----------------------------------------------------
// Checkable without cloning: what git tracks is what a clone receives.

const trackedHarness = git('ls-files scratchpad/harness').split('\n').filter((l) => l.endsWith('.mjs')).length;
claim('3.6 harness files tracked, so present in a clone', 56, trackedHarness);

const trackedAudits = git('ls-files scratchpad').split('\n').filter((l) => l.endsWith('.py')).length;
claim('3.6 audit scripts tracked', 8, trackedAudits);

// The frame asserts the opposite of what .gitignore does. Both are checked so
// the contradiction is visible rather than argued.
const frame = read('.agent/PROMPT.md');
claim('3.6 the frame still claims a clone has no harnesses', true, /a fresh clone has no gates, no\s+harnesses and no audits/.test(frame));
const ignore = read('.gitignore');
claim('3.6 .gitignore tracks them by exception', true, /!scratchpad\/harness\/\*\.mjs/.test(ignore));

// The README states a test count. It is a fact in a reader-facing document
// with nothing watching it, which is the profile of a number that drifts.
const readmeCount = (read('README.md').match(/(\d{3,5}) unit tests/) || [])[1];
claim('3.6 README states a unit-test count that is now stale', '1032', readmeCount, 'the suite runs 1034');

// Pass eleven chose the bundled browser as "pinned by package.json". Checked in
// history, not in the current file, so a pin added and removed would show.
// Witness for the search itself: the same command finds vitest in that history.
claim('3.6 commits ever touching Playwright in a manifest', 0, git('log --format=%h -S playwright -- package.json package-lock.json').split('\n').filter(Boolean).length);
const infra = ['scratchpad/harness/playwright.mjs', 'scratchpad/harness/run-gates.mjs', '.agent/state.mjs'].filter((p) => existsSync(join(root, p)));
// "0 of 3", not 0: with the files missing, a bare zero would hold over nothing.
claim('3.6 no gate infrastructure records the browser version', '0 of 3', infra.filter((p) => /\.version\(\)|browserVersion/.test(read(p))).length + ' of ' + infra.length);

// Claims that need what this account did not have ---------------------------

uncheckable('3.1 what a reader sees on an override', 'needs a browser and a built artefact');
uncheckable('5 frequency of any phenomenon in real chat', 'needs a live capture');
uncheckable('5 on-device engine availability', 'needs multiple real browser profiles');
uncheckable('every [yours] number', 'taken on another machine at commits that have moved');

// The handover's own statement of these totals -------------------------------
// Section 1 still said seventeen of seventeen after this script had grown to
// thirty-two, and its next sentence says any other result means the file is
// stale. Last, so both totals are complete; the +1 is this claim.

const handover = readFileSync(new URL('../../HANDOVER.md', import.meta.url), 'utf8');
const stated = handover.match(/It reports (\d+) of (\d+) holding[\s\S]*?and (\d+)\s+claims as unverifiable/);
const totals = (results.filter((r) => !r.uncheckable).length + 1) + ' checkable, ' + results.filter((r) => r.uncheckable).length + ' not';
claim('1 the totals the handover states for this script', totals, stated && stated[1] === stated[2] ? stated[1] + ' checkable, ' + stated[3] + ' not' : 'not found');

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
