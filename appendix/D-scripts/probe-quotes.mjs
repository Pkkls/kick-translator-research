#!/usr/bin/env node
/**
 * Probe: are the corpus's words, where this study quotes them, the corpus's words?
 *
 * Entry 4.39 said nothing structural would catch a translation put in italics
 * as a quotation. This is the structural thing. Run on the commit before it
 * existed, it listed 24 quotations: 14 were translations, paraphrases or a
 * dropped accent presented as verbatim, across the handover, TRANSMISSION.md,
 * the method log and five chapters, one of them the paraphrase the handover's
 * section 2.1 says it had corrected; the other 10 were this study's own rules,
 * word lists, emphasis and a footer. It does not read bold spans, and misses a
 * quotation whose paragraph names no source; three such were found by hand the
 * same day.
 *
 * For each block quote, and each long italic span, in a paragraph that
 * attributes words to the project, it looks for the quoted text verbatim in the
 * tracked files of the extension repository, after normalising whitespace,
 * emphasis marks and comment prefixes. A quote whose paragraph says it is a
 * translation is accepted as one.
 *
 * It reports; it does not gate. Its attribution test is a word list, so it
 * also lists this study's own rules when they sit near the word "corpus", word
 * lists, emphasis and footers. Read every line it prints before acting on it,
 * which is the rule its first run was written against.
 *
 * Usage:
 *   node probe-quotes.mjs <path-to-this-repo> <path-to-extension-repo>
 *
 * Exit 0 when it checked something, 2 when it checked nothing.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const [study, ext] = process.argv.slice(2);
if (!study || !ext) {
  console.error('usage: node probe-quotes.mjs <path-to-this-repo> <path-to-extension-repo>');
  process.exit(2);
}

const tracked = execFileSync('git', ['-C', ext, 'ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /\.(md|ts|mjs|js|py|json)$/.test(f) && !f.includes('node_modules'));
const norm = (s) =>
  s.normalize('NFKC').replace(/[*_`"“”]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const corpus = norm(
  tracked
    .map((f) => {
      try {
        return readFileSync(join(ext, f), 'utf8').replace(/^\s*(\/\/|#|\*)\s?/gm, '');
      } catch {
        return '';
      }
    })
    .join('\n'),
);

// Every Markdown file this study publishes, not a list someone remembers to
// extend. The list used to name three files and the thesis directory, so the
// two appendices written after it was typed were never read, and a correction
// pass that fixed every quotation the probe reported left the same two wrong in
// the file it could not see (4.74). A hardcoded list of what to check is a
// promise to remember, and this one was kept for exactly as long as nobody
// added a document.
const docs = execFileSync('git', ['-C', study, 'ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /\.md$/.test(f) && !f.startsWith('appendix/D-scripts/'));
const ATTRIBUTED = /(project|corpus|notebook|journal|author|their|your|queue|comment)/i;
const TRANSLATED = /(translat|rendered here from|in its french|from its french|from the journal's french)/i;

let checked = 0;
const report = [];
for (const d of docs) {
  const lines = readFileSync(join(study, d), 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('>') || (i > 0 && lines[i - 1].startsWith('>'))) continue;
    const block = [];
    for (let j = i; j < lines.length && lines[j].startsWith('>'); j++) block.push(lines[j].replace(/^>\s?/, ''));
    const before = lines.slice(Math.max(0, i - 4), i).join(' ');
    if (!ATTRIBUTED.test(before)) continue;
    checked++;
    if (TRANSLATED.test(before)) continue;
    const q = norm(block.join(' '));
    const longest = q.split(/(?<=[.;:])\s/).filter((s) => s.length > 25).sort((a, b) => b.length - a.length)[0];
    if (!corpus.includes(q) && !(longest && corpus.includes(longest.replace(/[.;:]$/, '')))) {
      report.push(`${d}:${i + 1}  block  ${q.slice(0, 90)}`);
    }
  }
  // A Markdown table has no blank line between its rows, so a blank-line split
  // hands the whole table over as one paragraph. Appendix F's ledger is 24 rows
  // and 20386 characters in a single one, and it contains the word "translat",
  // which is enough for the TRANSLATED rule to exempt every quotation in all 24.
  // A row is a self-contained unit and is split out as one (4.74).
  const paragraphs = lines
    .join('\n')
    .split(/\n\s*\n/)
    .flatMap((p) => (/^\|/.test(p) ? p.split('\n').filter((r) => /^\|/.test(r)) : [p]));
  for (const para of paragraphs) {
    // `>` belongs here: block quotations are checked by the loop above and would
    // be counted twice. `|` did not. It starts a Markdown table row, and nothing
    // else checks those, so every quotation inside a table was exempt: four of
    // them in appendix F, two carrying an error already corrected elsewhere in
    // the same pass, because the pass fixed what the probe could report (4.74).
    if (!ATTRIBUTED.test(para) || TRANSLATED.test(para) || /^>/.test(para)) continue;
    // The backtick exclusion looks redundant, since `norm` strips backticks
    // before the comparison anyway. It is not. Lifting it was measured: four
    // more quotations get checked, and prose containing two inline code spans
    // with a glob in them, `scratchpad/*` and `scratchpad/harness/*.mjs`, starts
    // matching as a quotation, because those asterisks are italic delimiters
    // once a backtick no longer ends the span. The guard is against code spans,
    // not against backticks. Repair, if the four are ever worth it: mask inline
    // code to a placeholder before scanning, and unmask before comparing (4.73).
    for (const m of para.matchAll(/(?<![*\w`])\*([^*\n`][^*`]{30,}?)\*(?!\*)/g)) {
      checked++;
      const q = norm(m[1]).replace(/[.;:,]$/, '');
      if (!corpus.includes(q)) report.push(`${d}  italic  ${q.slice(0, 90)}`);
    }
  }
}

console.log(`${tracked.length} tracked files in the corpus, ${checked} attributed quotations checked, ${report.length} not found verbatim`);
for (const r of report) console.log('  ' + r);

// Read, not driven to zero. Some of these cannot be matched however carefully
// they were transcribed, and a reader who does not know that will either chase
// them or stop trusting the list. Three classes, all met in one session:
//
//   the specification    `scratchpad/PROMPT-PERFECTION.md` is gitignored, so it
//                        is not among the tracked files searched above. Every
//                        sentence quoted from it is unverifiable here (4.63).
//   a commit message     not a file, so not in the corpus text at all.
//   this study's words   quoting a chapter of this study is not a corpus
//                        attribution, and the heuristic above cannot tell.
//
// What is left after those three is what to look at. Three of them were real
// in 4.72: a colon become a comma, and two parentheticals lost.
if (report.length) {
  console.log('\nBefore chasing one: three classes here are unmatchable by construction,');
  console.log('quotations from the untracked specification, commit messages, and this');
  console.log("study quoting itself. See this file's tail comment. The rest is real.");
}
process.exit(checked === 0 ? 2 : 0);
