#!/usr/bin/env node
/**
 * Audit the audit specification against the conditions it was built under.
 *
 * This is the script that reported every condition green on a document
 * containing three requirements that could not be met (appendix B). It is
 * published with that result attached, because a mechanical audit of a
 * specification is worth exactly what its conditions are worth, no more.
 *
 * Usage:
 *   node audit-spec.mjs <path-to-specification.md>
 *
 * Exit code: 0 if every condition holds, 1 otherwise.
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('usage: node audit-spec.mjs <path-to-specification.md>');
  process.exit(2);
}
const text = readFileSync(path, 'utf8');
const lines = text.split('\n');

const pass = [];
const fail = [];
const check = (name, ok, detail) => (ok ? pass : fail).push(name + (ok || !detail ? '' : ': ' + detail));

// Spec constants are not repository facts. WCAG ratios and the damage scale
// are allowed to be numbers; a version, a user count or a test tally is not.
const SPEC_CONSTANT = /(200 percent|4\.5:1|3:1|24 by 24|WCAG|from 16 down|scores 16)/;

// 1. No em or en dashes, no double hyphen. House rule for anything a third
//    party reads.
const dashes = lines.filter((l) => /[—–]/.test(l) || /\s--\s/.test(l));
check('no em or en dash', dashes.length === 0, dashes.length + ' line(s)');

// 2. No perishable fact about the repository. These rot within days and teach
//    the next reader something false.
const perishable = lines.filter(
  (l) =>
    !SPEC_CONSTANT.test(l) &&
    (/\b\d+\.\d+\.\d+\b/.test(l) ||
      /\b\d+\s*(percent|users?|stars?|forks?|commits?|tests?|KiB|MB|ms|px)\b/i.test(l) ||
      /\b\d{3,}\b/.test(l)),
);
check('no perishable repository fact', perishable.length === 0, perishable.slice(0, 3).map((l) => l.trim().slice(0, 60)).join(' | '));

// 3. No emoji.
check('no emoji', !lines.some((l) => /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(l)));

// 4-6. Every axis carries four fields, a countable bar, and an actionable
//      witness. A witness in the conditional tense is the most reliable sign
//      that no failure was ever observed.
const axes = [...text.matchAll(/^### (A\d+)\.[^\n]*\n([\s\S]*?)(?=\n### A\d+\.|\n---\n\n## 3\.)/gm)];
// The verb list is a proxy for "the witness is an action you perform", and it
// is incomplete by construction. It was widened once, for "re-run", when A22
// was added and failed this check. Widening a gate to admit your own case is
// exactly how a gate stops guarding, so the rule applied was: widen only when
// the rejected witness is genuinely an action a person can carry out and
// observe, and record the change here. If this comment grows a second entry,
// the check has become a formality and should be replaced by something that
// reads the sentence rather than its first word.
const ACTION = /^\*\*Witness\*\*\s+(break|truncate|remove|shrink|replace|load|add|force|render|delete|bump|expose|widen|feed|disable|kill|clone|run|re-run|rerun|make|push|corrupt|fill|change|inject|set|build)/i;
const problems = [];
for (const m of axes) {
  const id = m[1];
  const body = m[0];
  for (const field of ['**Breaks as**', '**Measure**', '**Bar**', '**Witness**']) {
    if (!body.includes(field)) problems.push(id + ' missing ' + field);
  }
  const bar = (body.split('**Bar**')[1] || '').split('**Witness**')[0];
  if (!/\b(zero|no |every|one |under|never|exactly|nothing|the ceiling|the budget)\b/i.test(bar)) {
    problems.push(id + ' bar not countable');
  }
  const witness = (body.match(/\*\*Witness\*\*[\s\S]*$/) || [''])[0].replace(/\n/g, ' ');
  if (!ACTION.test(witness)) problems.push(id + ' witness not an action');
  if (/\bwould\b/.test(witness)) problems.push(id + ' witness in the conditional');
}
check('axes well formed (' + axes.length + ' found)', problems.length === 0, problems.join(' | '));

// 7. No self-filling ceiling. A bar the author writes after measuring is green
//    by construction, which is the cheat the specification exists to prevent.
const selfFilling = (text.match(/a stated (ceiling|budget|severity|number)/g) || []).length;
check('no self-filling ceiling', selfFilling === 0, selfFilling + ' occurrence(s)');

// 8. No private path, no personal data. The specification is meant to be
//    readable by a stranger.
const privatePaths = lines.filter((l) => /[A-Za-z]:[\\/]Users|\/home\/[a-z]/.test(l));
check('no private path', privatePaths.length === 0);

// 9. Structural sections present.
const required = ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.', '## 6.', '## 7.', '### The index', '### The ledger', '### When to stop'];
const missing = required.filter((r) => !text.includes(r));
check('structural sections present', missing.length === 0, missing.join(', '));

// 10. Line width, so it stays readable pasted anywhere. Tables exempt.
const wide = lines.map((l, i) => [i + 1, l]).filter(([, l]) => l.length > 80 && !l.startsWith('|'));
check('lines within 80 columns', wide.length === 0, wide.length + ' line(s)');

// 11. No robotic connectives or empty courtesies.
check('no banned construction', !/\b(Furthermore|Additionally|In conclusion|Moreover|Great question|Feel free|Happy to help)\b/i.test(text));

// 12. Authority boundaries intact.
check('authority boundaries intact', ['credential', 'tagging', 'submitting to any store', 'rewriting history'].every((k) => text.includes(k)));

// 13. The named cheats are present. Naming a cheat is what makes it visible.
check('cheats named', ['Quoting a command you did not run', 'A witness in the conditional', 'Rewriting the plan and calling it a pass'].every((k) => text.includes(k)));

// 14. Priority is computable rather than a preference.
check('priority computable', text.includes('damage  =  population  x  silence'));

console.log('PASS (' + pass.length + ')');
for (const p of pass) console.log('  ' + p);
console.log('FAIL (' + fail.length + ')');
for (const f of fail) console.log('  ' + f);
console.log('\n' + pass.length + '/' + (pass.length + fail.length) + ' conditions green');
console.log(text.length + ' chars, ' + lines.length + ' lines, ' + axes.length + ' axes');

console.log(
  '\nNote: every condition here passed on a document that contained three\n' +
    'requirements no system could satisfy. Conditions check form.\n' +
    'Only execution checks whether a requirement can be met at all.',
);

process.exit(fail.length === 0 ? 0 : 1);
