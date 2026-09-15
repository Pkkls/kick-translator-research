/**
 * Gate: does this directory's README still describe this directory?
 *
 * The table in `README.md` is a hardcoded list of what is here, and this
 * study's own rule is that **a hardcoded list of what to check is a promise to
 * remember**. It was written after two probes named their documents by hand and
 * neither read the appendices written in the same session (4.74, 4.75).
 *
 * The promise has been kept four times in thirteen passes, by hand, each time a
 * script was added. That is not evidence the list is safe. It is the same
 * "it has never caused a problem" that 4.75 says reads exactly like the presence
 * of a blind spot, and the one time it was not kept, the count went to nine in
 * one place and ten in another on the same day (4.81).
 *
 * Three things drift and all three are checked here: a script with no row, a row
 * naming a script that is gone, and the count the prose states.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether a row's description is true. A row saying the wrong thing about the
 *   right file passes, and no mechanical check can do better.
 * - The "Used in" column, which points at method-log entries. `check-links.mjs`
 *   already resolves those anchors, so a second check here would be a second
 *   thing to get wrong rather than a second instrument.
 *
 *   node appendix/D-scripts/scripts-index.mjs .
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? '.';
const dir = join(root, 'appendix/D-scripts');
const readmePath = join(dir, 'README.md');
if (!existsSync(readmePath)) {
  console.error('cannot check: no ' + readmePath);
  process.exit(2);
}

// Walk the directory rather than reading a list of names from anywhere. The
// gate that walks the tree is the one that never missed a file.
const onDisk = readdirSync(dir).filter((f) => f.endsWith('.mjs')).sort();
const readme = readFileSync(readmePath, 'utf8');

// A row is a table line whose first cell is a backticked filename.
const inTable = [...readme.matchAll(/^\|\s*`([\w.-]+\.mjs)`\s*\|/gm)].map((m) => m[1]);
const dupes = inTable.filter((n, i) => inTable.indexOf(n) !== i);

const missingRow = onDisk.filter((f) => !inTable.includes(f));
const missingFile = inTable.filter((f) => !onDisk.includes(f));

const WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};
// Compounds past twenty are written with a hyphen, and the first count to cross
// that line made this gate refuse to read its own README rather than pass it
// silently (4.104). Refusing was the right failure; the map was simply short.
//
// It was short a second time at **thirty** (4.114), because 4.104 added the
// compound path and stopped at the word that had just broken. The tens are all
// here now: the next crossing is at a hundred, and fixing only the number in
// front of you is how a gate gets to fail twice for one reason.
const wordToNumber = (w) => {
  const k = w.toLowerCase();
  if (k in WORDS) return WORDS[k];
  if (k.includes('-')) {
    const parts = k.split('-').map((x) => WORDS[x]);
    if (parts.every((n) => typeof n === 'number')) return parts.reduce((a, b) => a + b, 0);
  }
  return Number(w);
};

// Both places the count is written, so that fixing one and not the other is
// caught. That is exactly how nine and ten came to stand in one file (4.81).
const stated = [
  [/\*\*([A-Za-z-]+|\d+) scripts\.\*\*/, 'the bold count'],
  [/All ([A-Za-z-]+|\d+) take a path argument/, 'the "All N take a path argument" line'],
].map(([re, what]) => {
  const m = readme.match(re);
  return { what, raw: m && m[1], value: m ? wordToNumber(m[1]) : null };
});

console.log(onDisk.length + ' scripts on disk, ' + inTable.length + ' rows in the README');
for (const s of stated) {
  console.log('  ' + s.what.padEnd(40) + ' says ' + (s.raw ?? 'nothing'));
}

const problems = [];
if (missingRow.length) problems.push('on disk with no README row: ' + missingRow.join(', '));
if (missingFile.length) problems.push('a README row names a script that is not here: ' + missingFile.join(', '));
if (dupes.length) problems.push('listed twice in the README: ' + [...new Set(dupes)].join(', '));
for (const s of stated) {
  if (s.value === null) problems.push(s.what + ' is missing or in a form this gate cannot read');
  else if (s.value !== onDisk.length) problems.push(s.what + ' says ' + s.raw + '; there are ' + onDisk.length);
}

if (problems.length) {
  console.log('\nECHECS:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('\nthe README names exactly the scripts in this directory, and both counts agree');
process.exit(0);
