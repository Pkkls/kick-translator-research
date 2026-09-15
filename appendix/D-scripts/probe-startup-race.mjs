/**
 * Measure: is there a window at startup in which a chat message is lost?
 *
 * A5's bar ends on a clause nothing here had measured: **the startup race has no
 * window in which a message is lost**, and its *measure* names the shape, *a
 * content script that starts before the worker has settings*.
 *
 * The window is real by construction rather than by suspicion. The manifest
 * declares `"run_at": "document_idle"`, so the content script attaches after the
 * document is parsed. A message already in the HTML at that point is found by
 * the observer's initial scan, which `cold-start.mjs` demonstrates. A message
 * that arrives **after the container exists and before the script attaches** is
 * in neither population: too late for the markup, too early for the observer.
 *
 * So this schedules messages across that gap and asks which of them are ever
 * translated. The timeline starts when the chat container first exists, which is
 * during parse, and the delays straddle the attach.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - A real Kick page parses more slowly than this fixture and runs its own
 *   scripts, so the gap here is the narrowest the product will ever face. A
 *   message lost at these delays would be lost at wider ones; the converse does
 *   not follow, and a clean run is evidence about this fixture's timing.
 * - The worker-settings half of A5's *measure* is a different race, between the
 *   content script and the service worker, and is not what this times.
 * - Losses are counted at 15 seconds. A message translated later than that is
 *   counted as lost here and would be a different defect, a very slow one.
 *
 *   node appendix/D-scripts/probe-startup-race.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-startup-race.mjs <path-to-extension-repo>');
  process.exit(2);
}
const ext = process.env.KT_EXT ?? join(root, 'dist');
for (const p of [join(root, 'scratchpad/harness/playwright.mjs'), join(ext, 'manifest.json')]) {
  if (!existsSync(p)) {
    console.error('cannot measure: missing ' + p);
    process.exit(2);
  }
}
const { chromium } = await import(pathToFileURL(join(root, 'scratchpad/harness/playwright.mjs')).href);

const MARK = 'ZZRACEZZ';
const SAID = 'buenos dias a todos';
// Weighted below the attach. A first run used 0, 5, 10, 25, 50, 100, 200, 400,
// 800 and put exactly ONE message inside the window, which clears a clause on
// a sample of one. The attach landed at 29 ms there, so these crowd that range.
const DELAYS = [0, 1, 2, 3, 4, 6, 8, 11, 14, 18, 22, 26, 30, 40, 60, 100, 200, 400, 800];
// No message in the markup: every one arrives on the timeline, so nothing is
// carried by the initial scan and the result is only about the gap.
const FIXTURE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>chat</title></head>
<body>
  <div id="channel-chatroom">
    <div class="no-scrollbar" data-which="decoy"></div>
    <div class="no-scrollbar" data-which="messages" style="height:600px;overflow:auto"></div>
    <div contenteditable="true" role="textbox" data-testid="chat-input" class="editor-input" style="min-height:40px"></div>
  </div>
</body></html>`;
const KICK = /^https?:\/\/(www\.)?kick\.com\//;

const profile = mkdtempSync(join(tmpdir(), 'kt-race-'));
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
await ctx.route('**://translate.googleapis.com/**', (route) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([[[MARK, SAID, null, null, 10]], null, 'es']) }));
await ctx.route('**://api.github.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
await ctx.route(KICK, (route) => {
  const r = route.request();
  if (r.resourceType() === 'document') return route.fulfill({ status: 200, contentType: 'text/html', body: FIXTURE });
  if (r.url().includes('/api/')) {
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ chatroom: { id: 1 }, livestream: { lang_iso: 'es' } }) });
  }
  return route.fulfill({ status: 204, body: '' });
});

const page = ctx.pages()[0] ?? (await ctx.newPage());
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 140)));

// Runs in the page's main world before any page script, so the timeline starts
// at the earliest moment the container can be observed rather than at whatever
// point a test could reach by polling from outside.
await page.addInitScript(({ delays, said }) => {
  const start = () => {
    const list = document.querySelector('[data-which="messages"]');
    if (!list) return false;
    const t0 = performance.now();
    // Without this the run cannot say whether the window was exercised at all.
    // If the content script attaches before the first row, every row is
    // post-attach and only the observer was measured. The extension's first
    // visible mark is the attach, so record when it appears.
    globalThis.__ktAttachAt = null;
    const watch = setInterval(() => {
      if (document.documentElement.hasAttribute('data-kt-scheme') ||
          document.getElementById('kt-floating-bar') ||
          document.getElementById('kt-inject-style')) {
        globalThis.__ktAttachAt = Math.round(performance.now() - t0);
        clearInterval(watch);
      }
    }, 1);
    setTimeout(() => clearInterval(watch), 15_000);
    delays.forEach((d, i) => {
      setTimeout(() => {
        const row = document.createElement('div');
        row.setAttribute('data-index', String(i));
        row.setAttribute('data-arrival', String(d));
        row.innerHTML = '<div class="w-full min-w-0 shrink-0"><button class="font-bold">u' + i +
          '</button><span class="font-normal">' + said + ' ' + i + '</span></div>';
        list.appendChild(row);
        row.setAttribute('data-appended-at', String(Math.round(performance.now() - t0)));
      }, d);
    });
    return true;
  };
  if (!start()) {
    // documentElement can be null this early, so a MutationObserver on it throws
    // and the whole init script dies silently. Poll instead: cheap, and it
    // cannot fail to exist.
    const iv = setInterval(() => { if (start()) clearInterval(iv); }, 1);
    setTimeout(() => clearInterval(iv), 10_000);
  }
}, { delays: DELAYS, said: SAID });

await page.goto('https://kick.com/somechannel', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(15_000);

const rows = await page.evaluate((m) =>
  [...document.querySelectorAll('[data-index]')].map((el) => ({
    i: Number(el.getAttribute('data-index')),
    arrival: Number(el.getAttribute('data-arrival')),
    appendedAt: Number(el.getAttribute('data-appended-at')),
    translated: (el.textContent ?? '').includes(m),
  })).sort((a, b) => a.arrival - b.arrival), MARK);
const attachAt = await page.evaluate(() => globalThis.__ktAttachAt ?? null);

await ctx.close();
rmSync(profile, { recursive: true, force: true });

console.log('messages scheduled from the moment the chat container exists,');
console.log('with nothing in the markup, so the initial scan carries none of them:\n');
console.log('  scheduled   appended    translated');
for (const r of rows) {
  console.log('  ' + String(r.arrival).padStart(6) + ' ms' +
    String(r.appendedAt).padStart(9) + ' ms    ' + (r.translated ? 'yes' : '**NO**'));
}

if (pageErrors.length) {
  console.log('\npage errors seen (these would silence the timeline):');
  for (const e of pageErrors.slice(0, 5)) console.log('  ' + e);
}
if (rows.length !== DELAYS.length) {
  console.log('\nECHEC: ' + rows.length + ' of ' + DELAYS.length + ' rows reached the DOM, so the');
  console.log('timeline did not run and this measured nothing.');
  process.exit(2);
}
console.log('\nthe extension first marked the page at: ' +
  (attachAt === null ? 'never seen' : attachAt + ' ms on this timeline'));
const before = rows.filter((r) => attachAt !== null && r.appendedAt < attachAt);
console.log('rows that arrived BEFORE that mark: ' + before.length +
  (before.length ? '  (' + before.map((r) => r.arrival + ' ms').join(', ') + ')' : ''));
if (attachAt !== null && before.length === 0) {
  console.log('\nECHEC: every row arrived after the extension had already marked the page,');
  console.log('so the startup window was never exercised and the greens below are about');
  console.log('the observer, not about the race.');
  process.exit(2);
}
const lost = rows.filter((r) => !r.translated);
console.log('\n' + (rows.length - lost.length) + ' of ' + rows.length + ' translated.');
if (lost.length === 0) {
  console.log('No window found at these delays. That is evidence about this fixture’s');
  console.log('timing, which is the narrowest the product will meet, and not a proof');
  console.log('that no window exists on a slower page.');
  process.exit(0);
}
console.log('Lost at: ' + lost.map((r) => r.arrival + ' ms').join(', '));
console.log('A message in that window is dropped with nothing on the line to say so,');
console.log('which is the silence A5 exists for.');
process.exit(0);
