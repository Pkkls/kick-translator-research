#!/usr/bin/env node
/**
 * Check: every relative link in every Markdown file resolves, anchor included.
 *
 * The resume file said "all internal links resolve" with nothing behind the
 * sentence. The first run of this script found nine anchors that did not:
 * eight pointed at headings that had gained a provenance tag, which GitHub
 * folds into the slug, and one at a numbered heading without its number. A
 * fact with nothing watching it rots, so this runs instead of being asserted.
 *
 * Slugs follow GitHub's rule: lowercase, drop everything that is not a
 * letter, digit, space, hyphen or underscore, spaces to hyphens, and suffix
 * repeats with -1, -2. Links inside fenced code are ignored.
 *
 * Usage:
 *   node check-links.mjs <path-to-this-repo>
 *
 * Exit 0 when every link resolves, 1 when any does not, 2 when it found no
 * links at all: a clean run over nothing looks exactly like a clean run.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('usage: node check-links.mjs <path-to-this-repo>');
  process.exit(2);
}

const walk = (d, acc = []) => {
  for (const n of readdirSync(d)) {
    if (n === '.git' || n === 'node_modules') continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (n.endsWith('.md')) acc.push(p);
  }
  return acc;
};
const unfenced = (text) => text.replace(/^```[\s\S]*?^```/gm, '');
const slug = (h) =>
  h.replace(/\*\*|`/g, '').trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');

const cache = new Map();
function anchors(file) {
  if (!cache.has(file)) {
    const seen = new Map();
    const set = new Set();
    for (const m of unfenced(readFileSync(file, 'utf8')).matchAll(/^#{1,6}\s+(.+)$/gm)) {
      const base = slug(m[1]);
      const k = seen.get(base) ?? 0;
      seen.set(base, k + 1);
      set.add(k ? `${base}-${k}` : base);
    }
    cache.set(file, set);
  }
  return cache.get(file);
}

let links = 0;
const broken = [];
for (const file of walk(resolve(root))) {
  for (const m of unfenced(readFileSync(file, 'utf8')).matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^[a-z]+:/i.test(target)) continue;
    links++;
    const [path, anchor] = target.split('#');
    const dest = path ? resolve(dirname(file), path) : file;
    const where = `${relative(root, file)} -> ${target}`;
    if (!existsSync(dest)) broken.push(`missing file   ${where}`);
    else if (anchor && dest.endsWith('.md') && !anchors(dest).has(anchor)) broken.push(`missing anchor ${where}`);
  }
}

for (const b of broken) console.log(b);
console.log(`${links} internal links, ${broken.length} broken`);
process.exit(links === 0 ? 2 : broken.length ? 1 : 0);
