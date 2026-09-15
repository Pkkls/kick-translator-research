/**
 * Report: the three stop conditions, counted rather than estimated.
 *
 * The specification ends on three conditions and says to stop when all three
 * hold and not before. The goal installed for each session repeats them and
 * adds "count them at each pass rather than estimate them", which had nothing
 * behind it: the first condition was countable through axis-ledger.mjs, the
 * second was restated from memory in two documents, and the third was never
 * evaluated at all because nothing recorded whether a pass had measured
 * anything.
 *
 * This is a report for two of the three and a gate for the third. It exits 1
 * when the last two passes both declared no measurement, which is the state
 * the goal exists to prevent and the only one of the three that is about this
 * account's own conduct. It exits 2 when it cannot count, which is a missing
 * prerequisite rather than a failure, matching the convention in
 * probe-emote-stripper.mjs and the clone's own harnesses.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Condition 2 reads the clone's queue, which this study is forbidden to
 *   modify. The condition is therefore not satisfiable by the account running
 *   this script, and saying so is the point of printing it: a stop condition
 *   outside your reach is a decision to continue, not a measurement.
 * - Condition 3 reads commit messages for a declaration this repository has to
 *   keep making. A pass that measured nothing and said nothing reads here as a
 *   pass that measured something. The marker is cheap and the honesty is not
 *   enforceable; what is enforced is that two declared ones in a row go red.
 * - Condition 1 is delegated to axis-ledger.mjs rather than re-parsed, because
 *   that parse was wrong once, counting 38 verdicts against 22 axes, and a
 *   second implementation of it would be a second thing to get wrong.
 *
 *   node appendix/D-scripts/stop-conditions.mjs . /path/to/kick-chat-translator
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.argv[2] ?? '.';
const corpus = process.argv[3];
if (!corpus) {
  console.error('usage: stop-conditions.mjs <this repository> <the extension clone>');
  process.exit(2);
}

const refuse = (why) => {
  console.error('cannot count: ' + why);
  process.exit(2);
};

// --- 1. Every axis closed, or open with a number and a named reason ---------
let ledgerOut = '';
try {
  ledgerOut = execFileSync(
    process.execPath,
    [join(root, 'appendix/D-scripts/axis-ledger.mjs'), root],
    { encoding: 'utf8' },
  );
} catch (e) {
  // A non-zero exit still carries the stdout that answers this condition, and
  // the ledger disagreeing with the specification is a different failure from
  // an axis carrying no verdict. Read what it printed, then say it failed.
  ledgerOut = e.stdout ?? '';
  if (!ledgerOut) refuse('axis-ledger.mjs produced no output');
}
const ledgerLine = ledgerOut.split('\n').find((l) => /first stop condition:/.test(l));
if (!ledgerLine) refuse('axis-ledger.mjs printed no "first stop condition:" line');
const c1 = /MET\b/.test(ledgerLine) && !/NOT MET/.test(ledgerLine);
const c1detail = ledgerLine.split('first stop condition:')[1].trim();

// --- 2. PLAN.md holds nothing but items blocked on kil ----------------------
const planPath = join(corpus, '.agent/PLAN.md');
if (!existsSync(planPath)) refuse('no .agent/PLAN.md under ' + corpus);
const plan = readFileSync(planPath, 'utf8').split('\n');
// The queue marks blocked-on-kil items [k], done [x] and open [ ]. Counted over
// the whole file rather than under the "Waiting on kil" heading: two of the [k]
// items sit under "## Open", and a count scoped to the heading reported four.
const mark = (c) => plan.filter((l) => new RegExp('^\\s*-\\s*\\[' + c + '\\]').test(l)).length;
const open = mark(' ');
const blocked = mark('k');
const done = mark('x');
const c2 = open === 0;

// --- 3. Two consecutive passes produced no new measurement ------------------
// A pass is a commit here. The specification's own wording is that a pass which
// changed nothing says so in one line rather than describing the reading as
// work, so the declaration is the marker and its absence means a measurement.
let bodies = [];
try {
  bodies = execFileSync('git', ['-C', root, 'log', '-2', '--format=%B%x00'], { encoding: 'utf8' })
    .split('\0')
    .filter((b) => b.trim());
} catch {
  refuse('git log failed in ' + root);
}
if (bodies.length < 2) refuse('fewer than two commits to read');
const silent = bodies.map((b) => /^No measurement:/m.test(b));
const c3 = silent[0] && silent[1];

// --- output -----------------------------------------------------------------
const say = (n, met, text) =>
  console.log(`  ${met ? 'MET    ' : 'NOT MET'}  ${n}. ${text}`);

console.log('the three stop conditions, counted:');
say(1, c1, `every axis closed or open with a number (${c1detail})`);
say(2, c2, `the queue holds nothing but items blocked on kil (${open} open, ${blocked} blocked on kil, ${done} done, ${open + blocked + done} entries)`);
say(3, c3, `two consecutive passes declared no measurement (last two: ${silent.map((s) => (s ? 'none' : 'measured')).join(', ')})`);

const met = [c1, c2, c3].filter(Boolean).length;
console.log(`\n${met} of 3 hold. The work stops only when all three do.`);

if (!c2) {
  console.log(
    '\nCondition 2 is in the clone and this study does not modify the clone.\n' +
    'It closes when the developing account closes it, so a session here that\n' +
    'is waiting for it is waiting for someone else. Continue on the other two.',
  );
}

if (c3) {
  console.log(
    '\nTwo passes in a row declared no measurement. That is the condition this\n' +
    'report is a gate for: stop, or change method, but do not run a third.',
  );
  process.exit(1);
}
process.exit(0);
