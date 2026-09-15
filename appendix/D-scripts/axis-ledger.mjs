/**
 * Check: does the axis ledger still describe the specification?
 *
 * The specification defines 22 axes, each with a Bar, and the first of its
 * three stop conditions asks that every axis be closed or open with a number.
 * Nothing recorded a verdict against any Bar, so that condition could not be
 * read at all. Appendix F is the index that makes it readable, and an index
 * drifts the moment the thing it indexes moves.
 *
 * This is a gate rather than a report. It fails when the specification and the
 * ledger disagree about which axes exist, which is the only part of appendix F
 * a machine can judge: the evidence column is a reader's mapping from a
 * chapter's subject to an axis, and chapter 13 never names an axis, which is
 * the whole reason the file had to be written by hand.
 *
 * It also prints how many axes carry a verdict, because that count IS the first
 * stop condition and there is no reason to make a person total a table.
 *
 *   node appendix/D-scripts/axis-ledger.mjs .
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] ?? '.';
const spec = readFileSync(join(root, 'appendix/A-audit-prompt.md'), 'utf8').split('\n');
const ledger = readFileSync(join(root, 'appendix/F-axis-ledger.md'), 'utf8').split('\n');

// In the specification an axis is a heading; in the ledger it is the first cell
// of a table row. Anchored both times so a mention in prose is not an axis.
const inSpec = spec
  .filter((l) => /^#{1,4}\s*A\d{1,2}\./.test(l))
  .map((l) => l.replace(/^#+\s*/, '').split('.')[0]);

// Scoped to the ledger table, not to every table in the file. Appendix F grew a
// second table keyed by the same axis labels and this filter counted both,
// reporting 38 verdicts against 22 axes without failing: a check that silently
// widened its population, which is the defect A19 exists to catch in a counter.
const from = ledger.findIndex((l) => /^##\s+The ledger\s*$/.test(l));
if (from < 0) {
  console.error('appendix F has no "## The ledger" heading, so there is no table to read');
  process.exit(2);
}
const to = ledger.findIndex((l, i) => i > from && /^##\s/.test(l));
const rows = ledger
  .slice(from, to < 0 ? ledger.length : to)
  .filter((l) => /^\|\s*A\d{1,2}\s*\|/.test(l))
  .map((l) => l.split('|').map((c) => c.trim()));
const inLedger = rows.map((c) => c[1]);

const missing = inSpec.filter((a) => !inLedger.includes(a));
const extra = inLedger.filter((a) => !inSpec.includes(a));
const dupes = inLedger.filter((a, i) => inLedger.indexOf(a) !== i);

console.log(`specification: ${inSpec.length} axes    ledger: ${rows.length} rows`);

// The verdict column is the third cell. "no verdict recorded" is a real state
// and is counted apart rather than treated as an empty row.
const unrecorded = rows.filter((c) => /no verdict recorded/i.test(c[3] ?? ''));
const closed = rows.filter((c) => /^closed\b/i.test(c[3] ?? ''));
const open = rows.length - unrecorded.length - closed.length;
console.log(`  closed ${closed.length}, open with a number ${open}, no verdict recorded ${unrecorded.length}`);
console.log(`  first stop condition: ${unrecorded.length === 0 ? 'MET' : 'NOT MET, ' + unrecorded.length + ' axes carry no verdict'}`);
if (unrecorded.length) console.log('    ' + unrecorded.map((c) => c[1]).join(' '));

// The specification asks for two artefacts, not one. An axis whose bar states
// its threshold "in the budget file" cannot be read until that file carries a
// row for it, so the same drift check applies to appendix G.
const needsBudget = [];
for (let i = 0; i < inSpec.length; i++) {
  const from = spec.findIndex((l) => new RegExp('^#{1,4}\\s*' + inSpec[i] + '\\.').test(l));
  // Stop at the next heading of ANY level, not at the next axis. The last axis
  // has no next axis, so bounding by axis alone ran its body to end of file and
  // swallowed the prose after it, which is how A22 was first reported as naming
  // the budget file when its bar does not. Fifth first count in this study to
  // come out too high.
  const next = spec.findIndex((l, k) => k > from && /^#{1,4}\s/.test(l));
  const body = spec.slice(from, next < 0 ? spec.length : next).join('\n');
  if (/budget file/i.test(body)) needsBudget.push(inSpec[i]);
}
const budgetPath = join(root, 'appendix/G-budget.md');
let budgetRows = [];
if (existsSync(budgetPath)) {
  budgetRows = readFileSync(budgetPath, 'utf8')
    .split('\n')
    .filter((l) => /^\|\s*A\d{1,2}\s*\|/.test(l))
    .map((l) => l.split('|')[1].trim());
}
const budgetMissing = needsBudget.filter((a) => !budgetRows.includes(a));
const setRows = existsSync(budgetPath)
  ? readFileSync(budgetPath, 'utf8').split('\n')
    .filter((l) => /^\|\s*A\d{1,2}\s*\|/.test(l) && !/\*not set\*/.test(l)).length
  : 0;
console.log(`budget file: ${needsBudget.length} bars name it, ${budgetRows.length} rows present, ${setRows} carrying a number`);

// Appendix G states its own set count in prose, and that sentence went stale the
// pass after A21's row was filled in: the table said three and four documents
// said two, for a whole session, with this script printing the right number
// beside them (4.80). The count is cheap to recompute and the sentence is not,
// so the sentence is now read back and compared. The form is fixed:
// "N of the M rows carry a number", digits, in appendix G and nowhere else. The
// other three documents cite this script instead of copying the figure, which
// is the convention 4.30 set for counts a script already reads.
let claimed = null;
if (existsSync(budgetPath)) {
  const m = readFileSync(budgetPath, 'utf8')
    .match(/(\d+)\s+of\s+the\s+(\d+)\s+rows\s+carry\s+a\s+number/i);
  if (m) claimed = { set: Number(m[1]), rows: Number(m[2]) };
}

const problems = [];
if (existsSync(budgetPath) && !claimed) {
  problems.push('appendix G states no set count in the form "N of the M rows carry a number"');
} else if (claimed && (claimed.set !== setRows || claimed.rows !== budgetRows.length)) {
  problems.push(`appendix G says ${claimed.set} of the ${claimed.rows} rows carry a number; the table says ${setRows} of ${budgetRows.length}`);
}
if (missing.length) problems.push('in the specification, absent from the ledger: ' + missing.join(', '));
if (extra.length) problems.push('in the ledger, absent from the specification: ' + extra.join(', '));
if (dupes.length) problems.push('listed twice in the ledger: ' + [...new Set(dupes)].join(', '));
if (budgetMissing.length) problems.push('bars naming the budget file with no row in appendix G: ' + budgetMissing.join(', '));

if (problems.length) {
  console.log('\nECHECS:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log('\nthe ledger names exactly the axes the specification defines');
process.exit(0);
