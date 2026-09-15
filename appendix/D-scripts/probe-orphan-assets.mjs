/**
 * Probe: which tracked images does nothing produce and nothing reference?
 *
 * Entry 4.53. A16's bar forbids a screenshot showing a real person's handle or
 * message. The repository has a harness written to guarantee that, and its own
 * header explains that the harness before it followed a live channel and
 * therefore carried the handles of people who had not been asked. The
 * replacement was written, it was put in the gate list, and the file it was
 * written to replace stayed in the tree: three months older than its
 * neighbours, produced by nothing, referenced by nothing, and showing four real
 * handles in a public repository.
 *
 * Nothing found it because every check in that repository works by following
 * references, and an artefact that nothing points at is invisible to all of
 * them. This one enumerates instead.
 *
 * Two questions per tracked image, and an image needs one yes:
 *
 *   produced  — some harness or script writes a file of that name
 *   referenced — some Markdown document links or embeds it
 *
 * An image with neither is not necessarily wrong. An icon is produced by a
 * generator and referenced by a manifest rather than by prose, so the output is
 * a list to read rather than a count to keep at zero. What it guarantees is
 * that such a file is never again invisible.
 *
 *   node appendix/D-scripts/probe-orphan-assets.mjs /path/to/kick-chat-translator
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, basename } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('usage: node probe-orphan-assets.mjs /path/to/kick-chat-translator');
  process.exit(2);
}

const git = (cmd) => execSync('git ' + cmd, { cwd: root, encoding: 'utf8' }).trim();
// Listed without a pathspec and filtered here: a quoted glob survives a POSIX
// shell and reaches cmd.exe with its quotes intact, where it matches nothing,
// and "nothing" is the one answer this probe must never report quietly.
const images = git('ls-files')
  .split('\n')
  .filter((p) => /\.(png|jpe?g|webp|gif)$/i.test(p));

if (!images.length) {
  console.error('no tracked images found, which is not a result this probe can produce honestly');
  process.exit(2);
}

// Every text file that could name an image: documents that reference them and
// scripts that write them. Read once, searched by basename, because a harness
// builds its path from a directory constant and a bare name.
const haystack = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'release', 'coverage'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(md|mjs|js|ts|tsx|json|py|yml|yaml)$/.test(e.name)) haystack.push(p);
  }
};
walk(root);

const docs = haystack.filter((p) => /\.md$/.test(p));
const code = haystack.filter((p) => !/\.md$/.test(p));
const textOf = new Map(haystack.map((p) => [p, readFileSync(p, 'utf8')]));

console.log(`${images.length} tracked images, ${docs.length} documents, ${code.length} scripts\n`);

const orphans = [];
for (const img of images) {
  const name = basename(img);
  const stem = name.replace(/\.[a-z]+$/i, '');
  const hit = (list) => list.filter((p) => {
    const t = textOf.get(p);
    return t.includes(img) || t.includes(name) || t.includes(`'${stem}'`) || t.includes(`"${stem}"`);
  });
  const refs = hit(docs);
  const made = hit(code);
  const date = git(`log -1 --format=%ad --date=short -- "${img}"`);
  const state = refs.length ? 'referenced' : made.length ? 'produced' : 'ORPHAN';
  if (state === 'ORPHAN') orphans.push({ img, date });
  // The path, never the basename. Printing basename(refs[0]) here once reported
  // a reference from screenshots/README.md as coming from README.md, which sent
  // a reader looking in the wrong file and nearly cost a false accusation.
  const rel = (p) => p.slice(root.length + 1).replace(/\\/g, '/');
  console.log(
    `  ${state.padEnd(11)} ${img.padEnd(34)} ${date}` +
    (refs.length ? `   doc: ${rel(refs[0])}` : '') +
    (!refs.length && made.length ? `   by: ${rel(made[0])}` : ''),
  );
}

console.log();
if (!orphans.length) {
  console.log('Every tracked image is produced by something or referenced by something.');
} else {
  console.log(`${orphans.length} image(s) that nothing produces and nothing references:`);
  for (const o of orphans) console.log(`  ${o.img}   last committed ${o.date}`);
  console.log('\nOpen each one and look at it. An orphan is not a defect by itself;');
  console.log('it is a file no check can reason about, which is how 4.53 happened.');
}
