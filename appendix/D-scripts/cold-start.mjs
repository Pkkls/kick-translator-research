/**
 * Measure: how long until the first translation is visible, on a cold profile.
 *
 * A18's *measure* opens with exactly that sentence, *first run on a cold
 * profile, with no settings and no reader action: how long until the first
 * translation is visible*, and its budget row has been empty since the budget
 * was built. 4.61 narrowed the reason: `metrics-offline.mjs` was run and gives
 * `e2e.cloud` p50 44 ms with the engine answered locally, of which 40 is the
 * deliberate coalescing window, and that is per message from arrival. It is not
 * cold start, because it does not include the part that is only paid once: the
 * browser loading the extension, the content script arriving, the observer
 * attaching, and MV3 booting a service worker that is not running yet.
 *
 * Nothing measures that. `extension-load.mjs` loads the real extension on a
 * fresh profile and then waits a flat `waitForTimeout(3000)` before asserting,
 * so it proves the wiring and times nothing. `translate-offline.mjs` drives the
 * whole chain and asserts the text, and also times nothing.
 *
 * This borrows `translate-offline.mjs`'s setup deliberately and says so: the
 * same fixture shape, the same URL interception, the same engine response
 * shape. Reproducing it rather than importing it is the cost of not modifying
 * the clone; where the two differ, that harness is right and this one is stale.
 *
 * Two splits are reported and conflating them is the mistake this is built to
 * avoid:
 *
 * - **launch**, from `launchPersistentContext` to the page being ready. This is
 *   the harness starting a browser and is not a cost any reader pays.
 * - **first paint**, from navigation to the translated text being in the DOM.
 *   This is A18's number: a cold extension, a cold worker, one message.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - The engine is local and instantaneous. A real provider adds its own round
 *   trip, which 13.4 reports separately, so this is the product's share of the
 *   wait and not the reader's whole wait.
 * - A fresh profile is cold for the extension but the disk cache and the
 *   binary are warm. A real first run after an install is slower by whatever
 *   the store install and the first extension parse cost, neither measured.
 * - One machine. The absolute figures are this laptop's.
 *
 *   node appendix/D-scripts/cold-start.mjs /path/to/kick-chat-translator [runs]
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
const runs = Number(process.argv[3] ?? 5);
if (!root) {
  console.error('usage: cold-start.mjs <path-to-extension-repo> [runs]');
  process.exit(2);
}
const ext = process.env.KT_EXT ?? join(root, 'dist');
for (const p of [join(root, 'scratchpad/harness/playwright.mjs'), join(ext, 'manifest.json')]) {
  if (!existsSync(p)) {
    console.error('cannot measure: missing ' + p + (p.endsWith('manifest.json') ? '  (run npm run build, or set KT_EXT)' : ''));
    process.exit(2);
  }
}
const { chromium } = await import(pathToFileURL(join(root, 'scratchpad/harness/playwright.mjs')).href);

const MARK = 'ZZCOLDSTARTZZ';
const SAID = 'buenos dias a todos';
// The shape translate-offline.mjs uses, which is the shape the product's own
// selectors read: a row carrying data-index, the wrapper pickInjectionTarget
// looks for first, a bold username and a font-normal message.
const FIXTURE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>chat</title></head>
<body>
  <div id="channel-chatroom">
    <div class="no-scrollbar" data-which="decoy"></div>
    <div class="no-scrollbar" data-which="messages" style="height:600px;overflow:auto">
      <div data-index="0"><div class="w-full min-w-0 shrink-0"><button class="font-bold" style="color: rgb(1,2,3)">autre</button><span class="font-normal">${SAID}</span></div></div>
    </div>
    <div contenteditable="true" role="textbox" data-testid="chat-input" class="editor-input"
         style="min-height:40px;border:1px solid #333"></div>
  </div>
</body></html>`;
const KICK = /^https?:\/\/(www\.)?kick\.com\//;

const results = [];
for (let i = 0; i < runs; i++) {
  // A new profile every run. Reusing one would measure the second run onwards,
  // which is the thing A18 is not asking about.
  const profile = mkdtempSync(join(tmpdir(), 'kt-cold-'));
  const tLaunch = Date.now();
  const ctx = await chromium.launchPersistentContext(profile, {
    headless: false,
    viewport: { width: 1200, height: 800 },
    args: [
      `--disable-extensions-except=${ext}`,
      `--load-extension=${ext}`,
      '--window-position=-2400,-2400',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });
  let engineHits = 0;
  await ctx.route('**://translate.googleapis.com/**', async (route) => {
    engineHits++;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([[[MARK, SAID, null, null, 10]], null, 'es']),
    });
  });
  await ctx.route('**://api.github.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await ctx.route(KICK, async (route) => {
    const req = route.request();
    if (req.resourceType() === 'document') return route.fulfill({ status: 200, contentType: 'text/html', body: FIXTURE });
    if (req.url().includes('/api/')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ chatroom: { id: 1 }, livestream: { lang_iso: 'es' } }),
      });
    }
    return route.fulfill({ status: 204, body: '' });
  });

  const page = ctx.pages()[0] ?? (await ctx.newPage());
  const launched = Date.now() - tLaunch;

  const tNav = Date.now();
  let paint = null;
  let warm = null;
  try {
    await page.goto('https://kick.com/somechannel', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction((m) => document.body.innerText.includes(m), MARK, { timeout: 30_000 });
    paint = Date.now() - tNav;

    // The control, and the only reason the number above means anything. A second
    // message on the same page pays none of what is paid once: the extension is
    // loaded, the content script is in, the observer is attached and the worker
    // is awake. The difference between the two is the cold premium, measured on
    // this machine in this run rather than taken from another harness.
    const tWarm = Date.now();
    await page.evaluate((said) => {
      const list = document.querySelector('[data-which="messages"]');
      const row = document.createElement('div');
      row.setAttribute('data-index', '1');
      row.innerHTML = '<div class="w-full min-w-0 shrink-0"><button class="font-bold">autre</button>' +
        '<span class="font-normal">' + said + ' otra vez</span></div>';
      list.appendChild(row);
    }, SAID);
    await page.waitForFunction(
      (m) => document.querySelectorAll('[data-index]').length > 1 &&
        (document.querySelector('[data-index="1"]')?.innerText ?? '').includes(m),
      MARK,
      { timeout: 30_000 },
    );
    warm = Date.now() - tWarm;
  } catch {
    /* leave whichever half did not complete as null */
  }
  await ctx.close();
  rmSync(profile, { recursive: true, force: true });
  results.push({ launched, paint, warm, engineHits });
  console.log('  run ' + (i + 1) + ': launch ' + String(launched).padStart(5) + ' ms, ' +
    (paint === null ? 'NEVER PAINTED within 30 s' : 'first ' + String(paint).padStart(5) + ' ms') +
    ', second ' + (warm === null ? '  none' : String(warm).padStart(5) + ' ms') +
    ', engine calls ' + engineHits);
}

const painted = results.filter((r) => r.paint !== null).map((r) => r.paint);
console.log('\n' + painted.length + ' of ' + runs + ' runs painted a translation.');
if (painted.length === 0) {
  console.log('\nECHEC: nothing painted, so this run measured nothing. A probe that');
  console.log('measured nothing must fail rather than report a clean zero.');
  process.exit(1);
}
const sorted = [...painted].sort((a, b) => a - b);
const p = (q) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
console.log('first translation visible, from navigation, on a profile that has never run it:');
console.log('  min ' + sorted[0] + ' ms   p50 ' + p(0.5) + ' ms   max ' + sorted[sorted.length - 1] + ' ms');
const launches = results.map((r) => r.launched).sort((a, b) => a - b);
console.log('  browser launch, reported apart because no reader pays it: p50 ' + launches[Math.floor(launches.length / 2)] + ' ms');

const warms = results.map((r) => r.warm).filter((v) => v !== null).sort((a, b) => a - b);
if (warms.length) {
  const wp50 = warms[Math.floor(warms.length / 2)];
  console.log('\nthe control, a second message on the same page:');
  console.log('  min ' + warms[0] + ' ms   p50 ' + wp50 + ' ms   max ' + warms[warms.length - 1] + ' ms');
  console.log('\ncold premium, the part paid once: ' + (p(0.5) - wp50) + ' ms at the medians.');
  console.log('That is extension load, content script, observer attach and the MV3');
  console.log('worker booting. The engine here is local and instant, so a reader adds');
  console.log('a provider round trip on top of both figures.');
} else {
  console.log('\nno second message completed, so there is no control and the figure above');
  console.log('is a duration with nothing to compare it against.');
}
process.exit(0);
