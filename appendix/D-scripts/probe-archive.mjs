/**
 * Check: A11's clauses that name the archive, read from the archive.
 *
 * A11's bar says *zero instrumentation in a release bundle, **proven from the
 * archive***, *zero web-accessible resource unless a named feature needs one*,
 * and *every bundled licence satisfied in the shipped artifact*. The ledger
 * recorded that `check-strip` proves the instrumentation clause **from the
 * build** rather than from the archive, which is a different artefact: the
 * build is what a machine produced, the archive is what a store serves.
 *
 * So this reads the published zip. It takes the path to an unpacked archive,
 * because downloading is a separate concern and a probe that needs the network
 * to say anything is a probe that says nothing offline:
 *
 *   gh release download v2.10.0 --repo <owner/repo> --pattern '*chromium.zip'
 *   unzip -q kick-chat-translator-2.10.0-chromium.zip -d ext
 *   node appendix/D-scripts/probe-archive.mjs ext
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether a dependency is present, by name. The bundle is minified and
 *   package names do not survive minification, so a name search proves nothing
 *   in either direction and is not attempted. Presence is established
 *   elsewhere, by the corpus's own byte accounting.
 * - Whether shipping without a licence file satisfies a licence. That is a
 *   legal judgement and is not made here. What is reported is the fact the bar
 *   asks about: whether any licence text is in the artifact.
 * - Whether the archive matches its own build. That needs a build of the
 *   archive's tag, which 4.52 did; comparing against a `dist/` from a later
 *   commit measures the commits in between and nothing else.
 * - Which files nothing references. A version of this carried that check and it
 *   was removed: it flagged the `_locales` files, which Chrome loads by
 *   convention rather than by name, and its substring match let
 *   `icons/icon16.png` be "referenced" by the manifest's
 *   `public/icons/icon16.png`, hiding the one real instance. **A check that
 *   returns thirteen results of which eleven are wrong is worse than no check**,
 *   because the next reader pays to triage it. The duplicate icons are in 4.106
 *   as a measurement instead.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2];
if (!root || !existsSync(join(root, 'manifest.json'))) {
  console.error('usage: probe-archive.mjs <path to an UNPACKED extension archive>');
  console.error('the directory must hold manifest.json at its top level');
  process.exit(2);
}

const walk = (d, acc = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};
const files = walk(root);
const rel = (p) => relative(root, p).replace(/\\/g, '/');
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));

console.log(files.length + ' files in the archive, manifest version ' + manifest.version + '\n');

// ── instrumentation, proven from the archive ────────────────────────────────
const MARKERS = ['__KT_METRICS__', 'KT_METRICS', 'metricsBridge', 'sourceMappingURL', '//# sourceURL'];
const hits = [];
for (const f of files) {
  if (/\.(png|jpg|jpeg|woff2?|zip)$/i.test(f)) continue;
  const text = readFileSync(f, 'utf8');
  for (const m of MARKERS) if (text.includes(m)) hits.push(rel(f) + '  ' + m);
}
console.log('instrumentation and source-map markers found: ' + hits.length);
for (const h of hits) console.log('   ' + h);

// ── web-accessible resources ───────────────────────────────────────────────
const war = manifest.web_accessible_resources ?? null;
console.log('web_accessible_resources in the shipped manifest: ' + (war === null ? 'none' : JSON.stringify(war)));

// ── licence text ───────────────────────────────────────────────────────────
const licences = files.filter((f) => /licen[cs]e|notice|third[-_]?party/i.test(rel(f)));
console.log('licence or notice files in the artifact: ' + licences.length +
  (licences.length ? '  ' + licences.map(rel).join(' ') : ''));

// A probe that measured nothing must fail: an archive with no scannable text
// would report every clause clean.
const scanned = files.filter((f) => !/\.(png|jpg|jpeg|woff2?|zip)$/i.test(f)).length;
console.log('\ntext files scanned: ' + scanned);
if (scanned < 5) {
  console.log('ECHEC: too few text files to have checked anything.');
  process.exit(2);
}
if (hits.length || war !== null) {
  console.log('\nECHEC: an instrumentation marker or a web-accessible resource is in the');
  console.log('shipped artifact, which two of A11’s clauses forbid.');
  process.exit(1);
}
console.log('\nBoth forbidding clauses hold in the artifact a store serves.');
console.log('The licence count is reported, not judged.');
process.exit(0);
