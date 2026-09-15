/**
 * Measure: main-thread cost per arriving chat row, in a real browser.
 *
 * A6's bar has four clauses. The bytes clause is set and enforced by
 * `audit_poids.py`. The second, *per-row main-thread cost under the budget file
 * entry at the highest message rate the harness can generate*, has been empty
 * in [appendix G](../G-budget.md) since the budget was built, with the note
 * that no harness measures it. That note was checked again before this script
 * was written and it held: of the clone's 56 harnesses, three mention a clock
 * and none of the three is in the row path. `chat-live.mjs` renders real rows
 * through the product's own `inject()` and measures **density in pixels**,
 * which is the number that mattered when it was written.
 *
 * So this is the fourth instrument written here for a bar that had none, after
 * the ledger, the budget and the version gate. It borrows `chat-live.mjs`'s
 * bundling exactly, because the point is to drive the product's own `inject()`
 * rather than a copy of it.
 *
 * Two measurement decisions, both stated because they change the number:
 *
 * - **Layout is forced after every injection.** Without it the browser batches
 *   style and layout to the end of the loop and the per-row figure measures
 *   only the DOM calls, which is the flattering half. `getBoundingClientRect()`
 *   after each row makes each row pay for itself.
 * - **The first rows are reported apart.** A cold call carries parsing, style
 *   resolution and JIT that no later row pays. Both numbers are printed, since
 *   a reader's first translated line really does cost the cold number once.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - This is `inject()` alone: the observer that finds the row, the detector and
 *   the network are all upstream and are not timed here. A6's clause is about
 *   the row path's main-thread cost, which is what `inject()` is, but a reader
 *   meets the sum.
 * - One machine, one Chromium, one page. The absolute milliseconds are this
 *   laptop's. The ratio between the planted witness and the baseline is not.
 * - Nothing here recycles. The virtualised list's reuse path is A6's third
 *   clause, memory over a long session, and it is untouched.
 *
 *   node appendix/D-scripts/row-cost.mjs /path/to/kick-chat-translator
 *   node appendix/D-scripts/row-cost.mjs <clone> --witness   plant a 2ms loop
 */
import { readFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
const witness = process.argv.includes('--witness');
if (!root) {
  console.error('usage: row-cost.mjs <path-to-extension-repo> [--witness]');
  process.exit(2);
}
for (const p of ['node_modules/esbuild/lib/main.js', 'scratchpad/harness/playwright.mjs', 'src/content/injector.ts']) {
  if (!existsSync(join(root, p))) {
    console.error('cannot measure: ' + root + ' has no ' + p);
    process.exit(2);
  }
}

// The clone's own shim, so UX_KIT and its three-way lookup apply and a missing
// driver exits 2 with its instructions rather than throwing here.
const { chromium } = await import(pathToFileURL(join(root, 'scratchpad/harness/playwright.mjs')).href);
const esbuild = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href);

// Into the system temp directory, never into the clone's harness directory.
// Four gates there read a fixture a fifth writes and git tracks none of it
// (4.88); adding a sixth writer to that directory would be joining the defect.
const tmp = mkdtempSync(join(tmpdir(), 'kt-rowcost-'));
const bundle = join(tmp, 'injector.js');
await esbuild.build({
  entryPoints: [join(root, 'src/content/injector.ts')],
  bundle: true,
  format: 'iife',
  globalName: 'Injector',
  define: { __KT_METRICS__: 'false' },
  alias: { '~': join(root, 'src') },
  outfile: bundle,
  logLevel: 'silent',
});

const css = readFileSync(join(root, 'src/content/inject.css'), 'utf8');
let js = readFileSync(bundle, 'utf8');

// A6's witness, in its own words: add a deliberate synchronous loop in the row
// path; the budget goes red. Planted in the bundle, which is a copy, never in
// the clone's sources.
const PLANT = 'window.__ktPlant=function(){const t=performance.now();while(performance.now()-t<2){}};';
if (witness) {
  js = PLANT + js.replace(/function inject\(/, 'function inject(/*witness*/');
}

const LINES = [
  ['viewer_23', 'hola a todos, alguien sabe cuando empieza', 'es', 'hi everyone, does anyone know when it starts'],
  ['another_one', 'que jogada incrivel', 'pt', 'what an incredible play'],
  ['third_user', 'この配信めっちゃおもしろい', 'ja', 'this stream is really fun'],
  ['fourth', 'kann jemand den ton lauter machen bitte', 'de', 'can someone turn the sound up please'],
  ['fifth_one', 'gg', 'en', 'gg'],
  ['sixth', 'هذا البث رائع جدا', 'ar', 'this stream is really great'],
];
const ROWS = 600;
// The visible window of a chat, which is what a virtualised list keeps in the
// DOM. 60 is generous: measured on the product's own harness the visible count
// is in the teens to the twenties.
const KEEP = 60;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.setContent(
  '<style>' + css + '</style><style>*{transition:none!important;animation:none!important}</style>' +
  '<div class="chat" id="chat"></div><script>' + js + '<\/script>',
);

const r = await page.evaluate(
  ({ lines, rows, planted, keep }) => {
    const { inject } = window.Injector;
    const chat = document.getElementById('chat');
    const times = [];
    for (let i = 0; i < rows; i++) {
      const [who, said, lang, meaning] = lines[i % lines.length];
      const row = document.createElement('div');
      row.className = 'row';
      const name = document.createElement('span');
      name.className = 'font-bold';
      name.textContent = who + ': ';
      const text = document.createElement('span');
      text.className = 'font-normal';
      text.textContent = said;
      row.append(name, text);
      chat.appendChild(row);
      // Kick's list is virtualised: it recycles rows and the DOM holds a
      // bounded window. Without this cap the forced layout below pays for the
      // whole document and the per-row figure grows with the row count, which
      // is what the first version of this probe measured and published nothing
      // about (4.94). The cap is what makes this a per-row number.
      while (chat.childElementCount > keep) chat.removeChild(chat.firstElementChild);

      const t0 = performance.now();
      if (planted) window.__ktPlant();
      inject(
        row,
        { messageId: 'row-' + i, translatedText: meaning, detectedLang: lang, provider: 'google', cached: false },
        { displayStyle: 'sous', showOriginal: true, showSourceBadge: true, showProviderBadge: false },
        () => undefined,
      );
      // Force style and layout so the row pays for what it caused, rather than
      // letting the browser batch it past the end of the measurement.
      row.getBoundingClientRect();
      times.push(performance.now() - t0);
    }
    return times;
  },
  { lines: LINES, rows: ROWS, planted: witness, keep: KEEP },
);
await browser.close();
rmSync(tmp, { recursive: true, force: true });

const WARM = 20;
const stat = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return {
    n: s.length,
    p50: s[Math.floor(s.length * 0.5)],
    p95: s[Math.floor(s.length * 0.95)],
    max: s[s.length - 1],
    mean: s.reduce((t, v) => t + v, 0) / s.length,
  };
};
const cold = stat(r.slice(0, WARM));
const warm = stat(r.slice(WARM));
const f = (v) => v.toFixed(3).padStart(7);

console.log('inject() per row, ' + ROWS + ' rows, DOM capped at ' + KEEP + ', layout forced after each' + (witness ? '  [WITNESS: 2ms loop planted]' : ''));
console.log('                     p50      p95      max     mean');
console.log('  first ' + String(WARM).padStart(3) + ' rows  ' + f(cold.p50) + '  ' + f(cold.p95) + '  ' + f(cold.max) + '  ' + f(cold.mean) + '  ms');
console.log('  the rest       ' + f(warm.p50) + '  ' + f(warm.p95) + '  ' + f(warm.max) + '  ' + f(warm.mean) + '  ms');

// A6 asks for the cost "at the highest message rate the harness can generate",
// so the useful derived figure is where this saturates one main thread.
// Does the per-row figure grow with the number of rows already on the page?
// If it does, the forced layout is paying for the whole document and this is
// not a per-row cost at all. Quartiles of the warm set answer it directly.
const q = (a, i) => stat(a.slice(Math.floor(a.length * i / 4), Math.floor(a.length * (i + 1) / 4)));
const rest = r.slice(WARM);
console.log('\n  trend across the warm set, p50 per quarter:');
console.log('    ' + [0, 1, 2, 3].map((i) => q(rest, i).p50.toFixed(3)).join('   ') + '  ms');

const rate = 1000 / warm.p50;
console.log('\nat the warm p50, one main thread saturates at ' + Math.round(rate) + ' rows a second.');
console.log('A fast chat is single digits a second, so the headroom is about ' + Math.round(rate / 10) + 'x.');

if (witness) {
  console.log('\nThe plant adds a 2 ms synchronous loop, so a warm p50 near 2 ms above');
  console.log('the baseline is the witness landing where A6 says to put it.');
}
process.exit(0);
