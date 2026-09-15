/**
 * Gate: one version everywhere, checked rather than read by eye.
 *
 * A15's bar has three clauses. Two are met and were measured in 4.52: a rebuild
 * of the tagged commit matches both digests the forge publishes, and the store
 * versions were read from the stores rather than from a note. The third clause,
 * *one version everywhere, checked by a gate rather than by eye*, had nothing
 * behind it: none of the clone's 40 offline gates matches version, release,
 * manifest or tag, and `state.mjs` is a generated report rather than a gate.
 * The axis could not close for want of an instrument that takes an afternoon.
 *
 * This is that instrument, in this repository rather than in the clone, because
 * this study does not modify the extension. Where it belongs is beside the
 * gates that would run it, which is the same thing appendix G says about the
 * budget file, and moving it is the developing account's to do.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - `manifest.config.ts` sets `version: pkg.version`, so the manifest cannot
 *   disagree with the package by construction. Counting it as an independent
 *   place would inflate the agreement: six places are five answers and one
 *   derivation. The check asserts the derivation instead, because the day
 *   someone types a literal there is the day the sixth place becomes real.
 * - The store versions are not read here. They need the network and they are
 *   allowed to lag: a pending submission is not a disagreement. A15's bar says
 *   store state is read from the store and never quoted from a file, which is a
 *   rule about provenance, not a number this gate can hold.
 * - The archive CONTENTS are not read. The published zips would have to be
 *   downloaded, and 4.52 already compared their digests against the forge's,
 *   which is the stronger claim and was made by hand.
 *
 *   node appendix/D-scripts/version-agreement.mjs /path/to/kick-chat-translator
 *   node appendix/D-scripts/version-agreement.mjs <clone> --with-network
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.argv[2];
const withNetwork = process.argv.includes('--with-network');
if (!root) {
  console.error('usage: version-agreement.mjs <the extension clone> [--with-network]');
  process.exit(2);
}
const pkgPath = join(root, 'package.json');
if (!existsSync(pkgPath)) {
  console.error('cannot read: no package.json under ' + root);
  process.exit(2);
}

const rows = [];
const say = (place, expected, actual, note = '') =>
  rows.push({ place, expected, actual, ok: expected === actual, note });
const skip = (place, why) => rows.push({ place, skipped: why });

const version = JSON.parse(readFileSync(pkgPath, 'utf8')).version;
console.log('package.json says ' + version + ', and every row below is measured against it.\n');

// The manifest is derived, so the check is that it is still derived.
const cfg = readFileSync(join(root, 'manifest.config.ts'), 'utf8');
const derived = /^\s*version:\s*pkg\.version\s*,?\s*$/m.test(cfg);
say('manifest.config.ts derives from pkg.version', true, derived,
  derived ? 'so it cannot disagree; one place, not two' : 'a literal here is a sixth place that can drift');

// The built manifest is the artefact Chrome reads, and it is the one that ships.
const distManifest = join(root, 'dist', 'manifest.json');
if (existsSync(distManifest)) say('dist/manifest.json', version, JSON.parse(readFileSync(distManifest, 'utf8')).version);
else skip('dist/manifest.json', 'no dist/, run a build to check the artefact that ships');

// Tags, sorted by version rather than by date: a date sort answers with
// whichever tag was pushed last, which is not the same question.
const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim();
let latestTag = '';
try {
  latestTag = git('tag', '--sort=-v:refname').split('\n')[0].trim();
} catch {
  console.error('cannot read: git tag failed in ' + root);
  process.exit(2);
}
say('the newest tag', 'v' + version, latestTag);

// A tag that names this version but points somewhere else is the failure the
// axis describes: the archive and the tag give different answers.
let described = '';
try { described = git('describe', '--tags', '--abbrev=0'); } catch { described = '(no tag reachable from HEAD)'; }
say('the newest tag reachable from HEAD', 'v' + version, described,
  'a mismatch here means HEAD is not the release');

if (withNetwork) {
  try {
    const out = execFileSync('gh', ['release', 'view', '--repo', 'Pkkls/kick-chat-translator', '--json', 'tagName,assets',
      '-q', '.tagName + "|" + ([.assets[].name] | join(","))'], { encoding: 'utf8', cwd: root }).trim();
    const [tagName, assets] = out.split('|');
    say('the latest release tag', 'v' + version, tagName);
    const named = assets.split(',').filter((a) => a.includes(version)).length;
    say('release assets naming this version', assets.split(',').length, named, assets);
  } catch {
    skip('the published release', 'gh could not read it; network, or not signed in');
  }
} else {
  skip('the published release', 'pass --with-network to read it');
}

const width = Math.max(...rows.map((r) => r.place.length));
for (const r of rows) {
  if (r.skipped) { console.log('----   ' + r.place.padEnd(width) + '  NOT CHECKED: ' + r.skipped); continue; }
  console.log((r.ok ? 'ok     ' : 'WRONG  ') + r.place.padEnd(width) +
    '  expected ' + r.expected + ', actual ' + r.actual + (r.note ? '  (' + r.note + ')' : ''));
}

const checked = rows.filter((r) => !r.skipped);
const failed = checked.filter((r) => !r.ok);
console.log('\n' + (checked.length - failed.length) + '/' + checked.length + ' places agree on ' + version +
  ', ' + rows.filter((r) => r.skipped).length + ' not checked and named above rather than skipped silently.');

if (failed.length) process.exit(1);
process.exit(0);
