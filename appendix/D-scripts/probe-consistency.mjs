/**
 * Probe: does this study state the same quantity twice, with two values?
 *
 * Entry 4.45 is a chapter publishing a constant that another chapter of the
 * same study had already recorded as reverted. Nothing could have caught it:
 * verify-handover-claims.mjs re-derives HANDOVER.md against the clone and
 * reads no chapter, and of the three scripts that open thesis/, one checks
 * quotations and two are instruments built for a single section. So the rule
 * chapter 14 states, that a document carries its own stale numbers forward
 * until something re-reads it against the source, had nothing behind it.
 *
 * Two halves, and they are not equally strong.
 *
 *   Ratios. Every "N of M" in the study, keyed by denominator and the words
 *   around it, reporting keys that carry more than one numerator. This is a
 *   report to read rather than a gate to keep green, for the reason 4.42
 *   gives: two chapters can state different numerators against one
 *   denominator when they count different populations, and only a reader can
 *   tell. It would NOT have caught 4.45, which was a constant, not a ratio.
 *
 *   Constants. Every value written as `NAME = n`, checked against the clone.
 *   This is the half that would have caught 4.45, and it only works on
 *   constants written in that form, which is why the form is worth keeping.
 *
 *   node appendix/D-scripts/probe-consistency.mjs . [/path/to/kick-chat-translator]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.argv[2] ?? '.';
const corpus = process.argv[3];
// Every tracked Markdown file, not a list that has to be extended by hand. This
// probe was written naming appendices A, B, C and E, in the same session that
// added F and G, and never read either of them: the ledger is 24 rows of ratios
// and the budget is a table of thresholds, which is precisely what the two
// halves below look for. It is the defect 4.74 found in probe-quotes, in the
// instrument written to catch that class, one pass later (4.75).
const docs = execFileSync('git', ['-C', root, 'ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /\.md$/.test(f) && !f.startsWith('appendix/D-scripts/'));

const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'at', 'in', 'on', 'to', 'is',
  'are', 'was', 'were', 'it', 'its', 'that', 'this', 'with', 'for', 'by', 'as',
  'from', 'per', 'over', 'out', 'only', 'now', 'then', 'so', 'but', 'which']);

const key = (words) => words
  .map((w) => w.toLowerCase().replace(/[^a-z0-9-]/g, ''))
  .filter((w) => w && !STOP.has(w) && !/^\d+$/.test(w))
  .slice(-3).join(' ');

const seen = new Map();
for (const doc of docs) {
  readFileSync(join(root, doc), 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/\b(\d{1,5})\s*(?:of|\/)\s*(\d{1,5})\b/g)) {
      const [num, den] = [Number(m[1]), Number(m[2])];
      if (den < 4 || num > den) continue;
      const left = line.slice(0, m.index).split(/\s+/).slice(-6);
      const right = line.slice(m.index + m[0].length).split(/\s+/).slice(0, 4);
      const k = den + '  ::  ' + (key(left) || key(right));
      if (!seen.has(k)) seen.set(k, new Map());
      if (!seen.get(k).has(num)) seen.get(k).set(num, []);
      seen.get(k).get(num).push(doc + ':' + (i + 1));
    }
  });
}

const split = [...seen].filter(([, byNum]) => byNum.size > 1);
console.log(docs.length + ' documents, ' + seen.size + ' keyed ratios, '
  + split.length + ' carrying more than one numerator\n');
console.log('The key is a denominator plus three content words, so two chapters');
console.log('naming one quantity differently never collide here. A clean run is');
console.log('evidence about the wording, not about the numbers.\n');

for (const [k, byNum] of split.sort()) {
  const [den, ctx] = k.split('  ::  ');
  console.log('denominator ' + den + ', "' + ctx + '"');
  for (const [num, where] of [...byNum].sort((a, b) => a[0] - b[0]))
    console.log('   ' + num + ' of ' + den + '   ' + where.join(', '));
  console.log('');
}
if (split.length) {
  console.log('Read each one. Two populations under one denominator is normal;');
  console.log('two values for one population is 4.45 again.');
}

console.log('\n--- constants asserted as `NAME = n` ---');
const asserted = new Map();
for (const doc of docs) {
  readFileSync(join(root, doc), 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/`([A-Z][A-Z0-9_]{3,})\s*=\s*(\d+)`/g))
      asserted.set(m[1], { value: m[2], where: doc + ':' + (i + 1) });
  });
}
// Declared out here because the exit code at the bottom reads it. It was
// block-scoped when the exit was added, so the first run threw a ReferenceError
// rather than passing, which is the right way round for a mistake in a check.
let bad = 0;
if (!asserted.size) {
  console.log('none asserted');
} else if (!corpus) {
  for (const [name, a] of asserted)
    console.log('  ' + name + ' = ' + a.value + '   ' + a.where + '   (pass the clone to check)');
} else {
  let skipped = 0;
  for (const [name, a] of asserted) {
    const hits = [];
    (function walk(d) {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
        const fp = join(d, e.name);
        if (e.isDirectory()) walk(fp);
        else if (/\.(ts|js|mjs)$/.test(e.name))
          for (const m of readFileSync(fp, 'utf8').matchAll(new RegExp(name + '[ ]*=[ ]*([0-9]+)', 'g')))
            hits.push(m[1]);
      }
    })(join(corpus, 'src'));
    // A name absent from src/ is an environment variable or a shell flag quoted
    // in an example, not a disagreement. Counted apart rather than as damage.
    const absent = hits.length === 0;
    const agree = !absent && hits.every((h) => h === a.value);
    if (absent) skipped++;
    else if (!agree) bad++;
    console.log('  ' + (absent ? 'n/a ' : agree ? 'ok  ' : 'DIFF') + '  ' + name + ' = ' + a.value
      + '   ' + a.where + '   source says '
      + (hits.length ? [...new Set(hits)].join(', ') : 'nothing in src/'));
  }
  const checked = asserted.size - skipped;
  console.log('  -> ' + (checked - bad) + '/' + checked + ' agree with the clone, '
    + skipped + ' not in src/ and therefore not checked');
}

// Every other gate here counts something that must exist, so none of them sees
// a paragraph that exists twice. That is what an editing mistake produces most
// often: a replacement whose new text carries the following bullet along while
// the text it replaced stopped short of it. 4.50 is the instance, pushed.
console.log('\n--- bullets appearing more than once in one document ---');
let dup = 0;
for (const doc of docs) {
  const counts = new Map();
  for (const line of readFileSync(join(root, doc), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t.startsWith('- **')) continue;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  for (const [text, n] of counts) {
    if (n < 2) continue;
    dup++;
    console.log('  ' + doc + '  x' + n + '   ' + text.slice(0, 72));
  }
}
console.log(dup ? '  -> ' + dup + ' duplicated bullet(s)' : '  none');

// This file is two reports and two checks, and until now it exited 0 on every
// one of them, which 4.72 says makes it a thing that gets read once. The ratio
// half stays a report: it lists false positives beside real ones and only a
// reader can tell them apart. The other two cannot produce a false positive. A
// constant that disagrees with the clone is wrong, and a bullet that appears
// twice in one document is wrong, so both now fail (4.76).
if (bad > 0 || dup > 0) {
  console.log(`\nECHECS:\n  ${bad} constant(s) disagreeing with the clone, ${dup} duplicated bullet(s)`);
  console.log('  The ratio half above is a report and is not counted here.');
  process.exit(1);
}
process.exit(0);
