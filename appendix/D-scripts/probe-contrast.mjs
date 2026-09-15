/**
 * Check: the contrast ratios the product asserts in its own comments.
 *
 * `inject.css` carries tables like
 *
 *     text on chip        #FFFFFF on #171A1C   17.49:1
 *     dimmed code         #9FA6AD on #171A1C    7.10:1
 *     resting outline     #5E5E5F on #0B0B0C    3.04:1   (WCAG 1.4.11)
 *
 * and the 2.8.1 changelog is built almost entirely out of figures of this
 * shape. They are the best kind of claim to check and the worst kind to trust:
 * **contrast is a pure function of two colours**, so a stated ratio is either
 * right or wrong with nothing in between, and it is written in a comment, which
 * this study's opening rule says is not a check. A colour can be edited and the
 * number beside it cannot notice.
 *
 * So this recomputes every ratio the sources state next to the pair it states
 * it for, by the WCAG 2.x relative-luminance formula, and reports the ones it
 * cannot reach as a second number rather than dropping them. The population
 * that can be checked is the one where both colours and the ratio sit on one
 * line; a ratio whose ground is a sentence away is counted and named, not
 * guessed at, because guessing which ground a prose figure meant is how a probe
 * invents a finding.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether the colour in the comment is the colour that renders. A comment can
 *   be right about a pair that no longer appears together. This checks the
 *   arithmetic of the claim, not that the claim is about the product.
 * - Alpha. Several figures say "flattened", meaning a translucent value was
 *   composited first. A pair given as two opaque hexes is checkable; one given
 *   as `rgba(...)` is not, and is counted in the second number.
 * - Whether the ratio clears the threshold its sentence names. WCAG 1.4.3 and
 *   1.4.11 ask different numbers of different things, and which applies is a
 *   judgement about what the element is.
 *
 *   node appendix/D-scripts/probe-contrast.mjs /path/to/kick-chat-translator
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-contrast.mjs <path-to-extension-repo>');
  process.exit(2);
}
if (!existsSync(join(root, '.git'))) {
  console.error('cannot check: ' + root + ' is not a git checkout');
  process.exit(2);
}

/** WCAG 2.x relative luminance, then the ratio. */
const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};
const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const files = execFileSync('git', ['-C', root, 'ls-files', '*.css', '*.ts', '*.tsx'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const STATED = /(\d+\.\d+)\s*:\s*1/;
// The checkable shape: two opaque hexes and a ratio, in that order, on one line.
const PAIR = /(#[0-9A-Fa-f]{6})\D+(#[0-9A-Fa-f]{6})\D+(\d+\.\d+)\s*:\s*1/;

const checked = [];
const unreachable = [];
for (const f of files) {
  const lines = readFileSync(join(root, f), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!STATED.test(line)) return;
    const m = line.match(PAIR);
    const where = f + ':' + (i + 1);
    if (!m) {
      unreachable.push({ where, text: line.trim().slice(0, 96) });
      return;
    }
    const [, fg, bg, said] = m;
    const actual = ratio(fg, bg);
    checked.push({ where, fg, bg, said: Number(said), actual, ok: Math.abs(actual - Number(said)) <= 0.05 });
  });
}

console.log(checked.length + ' ratios stated beside the pair they are for, and checkable.');
console.log(unreachable.length + ' more state a ratio whose colours are not on the line, and are not guessed at.\n');

const w = Math.max(...checked.map((c) => c.where.length));
for (const c of checked) {
  console.log((c.ok ? 'ok     ' : 'WRONG  ') + c.where.padEnd(w) +
    '  ' + c.fg + ' on ' + c.bg + '  says ' + c.said.toFixed(2) + ', is ' + c.actual.toFixed(2));
}

const wrong = checked.filter((c) => !c.ok);
console.log('\n' + (checked.length - wrong.length) + '/' + checked.length + ' agree to within 0.05.');
if (unreachable.length) {
  console.log('\nnot reachable by this instrument, listed rather than skipped:');
  for (const u of unreachable.slice(0, 12)) console.log('  ' + u.where + '  ' + u.text);
  if (unreachable.length > 12) console.log('  ... and ' + (unreachable.length - 12) + ' more');
}

// A probe that measured nothing must fail: an empty checked set means the shape
// moved and every "ok" above is vacuous.
if (checked.length === 0) {
  console.log('\nECHEC: no ratio was checkable, so this run measured nothing.');
  process.exit(2);
}

// The exit code asserts the finding rather than the health of the clone, the
// same way probe-link-guards.mjs does. One mismatch is known and diagnosed in
// 4.98; a gate that stayed red on it forever would be a gate nobody can make
// green, which is the thing A13 is about. Red here means the population moved:
// the known one was fixed, or a new one appeared, and either way this study is
// out of date.
const KNOWN = ['src/content/inject.css:956'];
const unexpected = wrong.filter((c) => !KNOWN.includes(c.where.replace(/\\/g, '/')));
const fixed = KNOWN.filter((k) => !wrong.some((c) => c.where.replace(/\\/g, '/') === k));
if (unexpected.length) {
  console.log('\nECHEC: a mismatch this study has not recorded: ' + unexpected.map((c) => c.where).join(', '));
  process.exit(1);
}
if (fixed.length) {
  console.log('\nECHEC: ' + fixed.join(', ') + ' agrees now, so 4.98 is fixed and this study is stale.');
  process.exit(1);
}
console.log('\nThe one mismatch is the known one, diagnosed in 4.98: both figures in that');
console.log('comment were taken against grounds it does not name.');
process.exit(0);
