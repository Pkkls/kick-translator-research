#!/usr/bin/env node
/**
 * Probe: what the inline emote-name stripper destroyed, before and after the
 * commit that repaired it.
 *
 * Built as the second instrument for thesis 8.3b. The first one tokenised a
 * cleaned copy of the store listing and tested each word against a retyped
 * copy of the regular expressions. This one differs in the three places that
 * could move the answer:
 *
 *   1. It runs the product's own module, taken out of git at the repair commit
 *      and its parent, not a copy of its expressions.
 *   2. It feeds each line whole, as a chat message would arrive, so word
 *      boundaries, capitals and diacritics behave as they did in production.
 *   3. It declares the population per corpus and per revision, because the
 *      listing was edited three times after the project measured it.
 *
 * Attribution to a rule needs the expressions separately. They are extracted
 * from the old module's source, and the extraction is then checked against the
 * module itself on every line: if applying them in order does not reproduce
 * the module's output exactly, the probe refuses to report.
 *
 * Usage:
 *   node probe-emote-stripper.mjs <path-to-extension-repo>
 *
 * Needs Node 22.18 or later, which imports TypeScript by stripping types.
 * Writes a temporary copy of the modules under the OS temp directory and
 * removes it. Exit 0 when it measured something, 2 when it measured nothing or
 * its reconstruction disagreed with the module.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: node probe-emote-stripper.mjs <path-to-extension-repo>');
  process.exit(2);
}
const FIX = '7c64018'; // "Stop deleting ordinary words before translating them"
const PARSER = 'src/content/emoteParser.ts';
const LOCALES = ['ar', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'tr', 'zh'];

const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });
const tmp = mkdtempSync(join(tmpdir(), 'kt-strip-'));
let n = 0;
async function load(rev, path, tail = '') {
  const file = join(tmp, `m${n++}.ts`);
  writeFileSync(file, git('show', `${rev}:${path}`) + tail);
  return import(pathToFileURL(file).href);
}
function fail(msg) {
  console.error('FAIL: ' + msg);
  rmSync(tmp, { recursive: true, force: true });
  process.exit(2);
}

const EXPORT = '\nexport { stripInlineEmoteNames };\n';
const before = await load(`${FIX}^`, PARSER, EXPORT);
const after = await load(FIX, PARSER, EXPORT);

// The expressions, out of the old module's own source.
const oldSrc = git('show', `${FIX}^:${PARSER}`);
const fnSrc = oldSrc.slice(oldSrc.indexOf('function stripInlineEmoteNames'));
const rules = [...fnSrc.matchAll(/\.replace\(\/(.+?)\/([a-z]*),\s*' '\)/g)].map((m) => new RegExp(m[1], m[2]));
if (rules.length !== 4) fail(`expected 3 rules and a whitespace collapse, extracted ${rules.length}`);
const NAMES = ['mixed-case', 'length', 'suffix'];

// What parseKickContent hands the stripper, rebuilt from its returned tokens.
const rawReal = (m, s) =>
  m.parseKickContent(s).tokens.filter((t) => t.kind === 'text').map((t) => t.value).join(' ').replace(/\s+/g, ' ').trim();

const toks = (s) => (s.match(/[\p{L}\p{M}\p{N}]+/gu) ?? []).filter((t) => /\p{L}/u.test(t)).map((t) => t.toLowerCase());
function lost(a, b) {
  const left = new Map();
  for (const t of toks(b)) left.set(t, (left.get(t) ?? 0) + 1);
  const out = [];
  for (const t of toks(a)) {
    const k = left.get(t) ?? 0;
    if (k > 0) left.set(t, k - 1);
    else out.push(t);
  }
  return out;
}

function measure(units) {
  const r = { tokens: 0, types: new Set(), before: new Set(), after: new Set(), seq: [new Set(), new Set(), new Set()], alone: [new Set(), new Set(), new Set()], suffixEz: new Set() };
  for (const u of units) {
    const s0 = rawReal(before, u);
    const out = before.stripInlineEmoteNames(s0);
    if (out !== before.parseKickContent(u).realText) fail('rebuilt input disagrees with parseKickContent: ' + JSON.stringify(u.slice(0, 60)));
    let s = s0;
    const steps = [s0];
    for (const re of rules) steps.push((s = s.replace(re, ' ')));
    if (s.trim() !== out) fail('extracted rules disagree with the module on: ' + JSON.stringify(u.slice(0, 60)));
    for (const t of toks(u)) { r.tokens++; r.types.add(t); }
    for (const t of lost(s0, out)) r.before.add(t);
    for (let k = 0; k < 3; k++) {
      for (const t of lost(steps[k], steps[k + 1])) r.seq[k].add(t);
      for (const t of lost(s0, s0.replace(rules[k], ' '))) r.alone[k].add(t);
    }
    for (const m of s0.matchAll(rules[2])) if (/ez\d*$/i.test(m[0])) for (const t of toks(m[0])) r.suffixEz.add(t);
    const a0 = rawReal(after, u);
    for (const t of lost(a0, after.parseKickContent(u).realText)) r.after.add(t);
  }
  return r;
}

const lines = (rev) => git('show', `${rev}:store-listing.md`).split('\n').filter((l) => l.trim());
const atFix = lines(FIX);
const atHead = lines('HEAD');
const fixSet = new Set(atFix);
const added = atHead.filter((l) => !fixSet.has(l));

const show = (label, r) => {
  console.log(`\n${label}`);
  console.log(`  word tokens ${r.tokens}, distinct ${r.types.size}`);
  console.log(`  distinct words destroyed: before ${r.before.size}, after ${r.after.size}`);
  console.log(`  in order applied: ${NAMES.map((x, k) => `${x} ${r.seq[k].size}`).join(', ')}`);
  console.log(`  each rule alone:  ${NAMES.map((x, k) => `${x} ${r.alone[k].size}`).join(', ')}`);
  console.log(`  length rule, in order: ${[...r.seq[1]].sort().join(' ') || '-'}`);
  console.log(`  suffix rule, in order: ${[...r.seq[2]].sort().join(' ') || '-'}`);
  console.log(`  after the repair:      ${[...r.after].sort().join(' ') || '-'}`);
};

const listingFix = measure(atFix);
const listingHead = measure(atHead);
const listingAdded = measure(added);
show(`store-listing.md at ${FIX}, what the project measured (${atFix.length} non-empty lines)`, listingFix);
show(`store-listing.md at HEAD (${atHead.length} non-empty lines)`, listingHead);
show(`lines at HEAD absent at ${FIX}, written after the repair (${added.length})`, listingAdded);

console.log('\ninterface strings at HEAD, by locale: shared and content catalogues, manifest messages');
const shared = {};
for (const l of LOCALES) if (l !== 'en') shared[l] = (await load('HEAD', `src/shared/i18n/${l}.ts`))[l];
let measured = 0;
for (const l of LOCALES) {
  const units = [];
  if (l === 'en') units.push(...Object.keys(shared.fr)); // keys are the verbatim English source strings
  else {
    units.push(...Object.values(shared[l]));
    units.push(...Object.values((await load('HEAD', `src/content/i18n/${l}.ts`))[l]));
  }
  const msgs = JSON.parse(git('show', `HEAD:public/_locales/${l}/messages.json`));
  units.push(...Object.values(msgs).map((v) => v.message));
  const r = measure(units.filter((u) => typeof u === 'string'));
  measured += r.tokens;
  console.log(`  ${l}  strings ${String(units.length).padStart(3)}  types ${String(r.types.size).padStart(4)}  destroyed ${String(r.before.size).padStart(3)}  by ez ${String(r.suffixEz.size).padStart(2)}  ${[...r.suffixEz].sort().join(' ')}`);
}

console.log('\nTurkish negative aorist through the old module, constructed witnesses');
for (const w of ['gitmez', 'gelmez', 'istemez', 'görmez', 'içmez', 'geçmez', 'yapmaz', 'olmaz', 'anlamaz', 'kalmaz']) {
  console.log(`  ${w.padEnd(8)} -> ${JSON.stringify(before.parseKickContent(`bu ${w} tabii`).realText)}`);
}

rmSync(tmp, { recursive: true, force: true });
if (listingFix.tokens === 0 || measured === 0) fail('measured nothing');
