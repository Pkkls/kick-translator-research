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

const docs = ['HANDOVER.md', 'TRANSMISSION.md', 'appendix/E-method-log.md', ...readdirSync(join(study, 'thesis')).map((f) => 'thesis/' + f)];
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
  for (const para of lines.join('\n').split(/\n\s*\n/)) {
    if (!ATTRIBUTED.test(para) || TRANSLATED.test(para) || /^[>|]/.test(para)) continue;
    for (const m of para.matchAll(/(?<![*\w`])\*([^*\n`][^*`]{30,}?)\*(?!\*)/g)) {
      checked++;
      const q = norm(m[1]).replace(/[.;:,]$/, '');
      if (!corpus.includes(q)) report.push(`${d}  italic  ${q.slice(0, 90)}`);
    }
  }
}

console.log(`${tracked.length} tracked files in the corpus, ${checked} attributed quotations checked, ${report.length} not found verbatim`);
for (const r of report) console.log('  ' + r);
process.exit(checked === 0 ? 2 : 0);
