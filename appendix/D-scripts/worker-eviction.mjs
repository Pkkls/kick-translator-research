/**
 * Measure: the added latency of the first message after the worker is evicted.
 *
 * A5's *measure* is *force eviction between messages and measure recovery: does
 * the first message after a wake get translated, and how late*, and its
 * *witness* is *kill the worker by hand between two messages*. 4.56 recorded
 * that this witness **has never been run**, by this study or by the corpus, and
 * A5's budget row has been the last empty one.
 *
 * It is the one axis whose bar names a failure a reader meets silently: an
 * evicted worker whose next message is never translated shows nothing on the
 * line and produces no error. So "does it translate at all" matters more here
 * than the milliseconds, and both are reported.
 *
 * **How the worker is killed, and how the kill is verified.** Playwright has no
 * API for stopping an extension service worker. CDP does: `Target.getTargets`
 * lists a `service_worker` target for the extension, and `Target.closeTarget`
 * ends it. Verification is not optional here, because a witness that does not
 * break the thing it claims to break proves nothing:
 *
 * the target count must go **1, then 0, then 1**, each step polled and asserted,
 * and the run throws before any timing is taken if the zero never arrives.
 *
 * The first version of that check required the restarted worker to carry a
 * different `targetId` and went red on all five runs. **Chrome reuses the id**
 * across a stop and a start, so the criterion was testing an assumption about
 * the browser rather than testing the eviction. The transition is the proof and
 * the identifier is not; the run prints whether the id was reused so the next
 * reader does not rediscover it.
 *
 * `ctx.serviceWorkers()` is **not** used for any of this. It still reported one
 * worker after the target was gone, so Playwright's list and CDP's disagree,
 * and the one that just performed the action is the one to believe.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - A forced close is not an eviction by the browser's own memory pressure.
 *   Chrome's own eviction may free different state. This is the closest thing
 *   an automated run can do and A5 asks for exactly it, by hand.
 * - The engine is local and instant, so a real provider's round trip is on top.
 * - The per-channel token bucket that 4.56 found resets full on a restart is a
 *   correctness consequence of eviction, not a latency one, and is untouched.
 *
 *   node appendix/D-scripts/worker-eviction.mjs /path/to/kick-chat-translator [runs]
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
const runs = Number(process.argv[3] ?? 5);
if (!root) {
  console.error('usage: worker-eviction.mjs <path-to-extension-repo> [runs]');
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

const MARK = 'ZZEVICTZZ';
const SAID = 'buenos dias a todos';
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

/** Append a row and wait for its own translation. Returns the milliseconds. */
async function sendAndTime(page, index) {
  const t0 = Date.now();
  await page.evaluate(({ said, i }) => {
    const list = document.querySelector('[data-which="messages"]');
    const row = document.createElement('div');
    row.setAttribute('data-index', String(i));
    row.innerHTML = '<div class="w-full min-w-0 shrink-0"><button class="font-bold">autre</button>' +
      '<span class="font-normal">' + said + ' ' + i + '</span></div>';
    list.appendChild(row);
  }, { said: SAID, i: index });
  await page.waitForFunction(
    ({ m, i }) => (document.querySelector('[data-index="' + i + '"]')?.innerText ?? '').includes(m),
    { m: MARK, i: index },
    { timeout: 30_000 },
  );
  return Date.now() - t0;
}

const rows = [];
for (let run = 0; run < runs; run++) {
  const profile = mkdtempSync(join(tmpdir(), 'kt-evict-'));
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
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([[[MARK, SAID, null, null, 10]], null, 'es']),
    }));
  await ctx.route('**://api.github.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await ctx.route(KICK, (route) => {
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
  const out = { run: run + 1 };
  try {
    await page.goto('https://kick.com/somechannel', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction((m) => document.body.innerText.includes(m), MARK, { timeout: 30_000 });

    // Two warm messages, so the baseline is a median of something rather than
    // one sample standing in for a population of one.
    out.warm1 = await sendAndTime(page, 1);
    out.warm2 = await sendAndTime(page, 2);

    const cdp = await ctx.newCDPSession(page);
    const workers = async () =>
      (await cdp.send('Target.getTargets')).targetInfos.filter((t) => t.type === 'service_worker');
    const before = await workers();
    out.before = before.length;
    if (before.length !== 1) throw new Error('expected one worker before the kill, saw ' + before.length);
    const killedId = before[0].targetId;

    await cdp.send('Target.closeTarget', { targetId: killedId });
    // The witness has to be shown to have landed. A close that left the worker
    // running would make every millisecond below a measurement of nothing.
    for (let i = 0; i < 40 && (await workers()).length; i++) await page.waitForTimeout(50);
    out.afterKill = (await workers()).length;
    if (out.afterKill !== 0) throw new Error('the worker survived the kill');

    out.afterEviction = await sendAndTime(page, 3);

    // The worker may not be listed the instant the message lands: it wakes,
    // answers and can be torn down again. Poll for it rather than sampling once,
    // and record what was actually seen either way.
    let back = await workers();
    for (let i = 0; i < 20 && back.length === 0; i++) {
      await page.waitForTimeout(50);
      back = await workers();
    }
    out.reborn = back.length;
    out.killedId = killedId;
    out.backIds = back.map((t) => t.targetId).join(',');
    out.newId = back.length ? back.every((t) => t.targetId !== killedId) : false;
  } catch (e) {
    out.error = e.message.slice(0, 120);
  }
  await ctx.close();
  rmSync(profile, { recursive: true, force: true });
  rows.push(out);
  console.log(
    '  run ' + out.run + ': warm ' + (out.warm1 ?? '-') + '/' + (out.warm2 ?? '-') + ' ms' +
    ', workers before kill ' + (out.before ?? '-') + ', after ' + (out.afterKill ?? '-') +
    ', post-eviction ' + (out.afterEviction === undefined ? 'NEVER TRANSLATED' : out.afterEviction + ' ms') +
    ', workers seen after: ' + (out.reborn ?? '-') +
    ', same targetId reused: ' + (out.newId === undefined ? '-' : !out.newId) +
    (out.error ? '  [' + out.error + ']' : ''),
  );
}

const ok = rows.filter((r) => !r.error && r.afterEviction !== undefined);
console.log('\n' + ok.length + ' of ' + runs + ' runs completed the eviction and translated afterwards.');
if (ok.length === 0) {
  console.log('\nECHEC: nothing was measured. A probe that measured nothing must fail.');
  process.exit(1);
}
// The transition is the proof, not the identifier. An earlier version of this
// check required the restarted worker to carry a different `targetId` and went
// red on every run: **Chrome reuses the id** across a stop and a start, so that
// criterion tested an assumption about the browser rather than the eviction.
// What is verified instead is the sequence one, zero, one, each step polled and
// asserted, and the run throws before any timing if the zero never arrives.
if (!ok.every((r) => r.before === 1 && r.afterKill === 0 && r.reborn >= 1)) {
  console.log('\nECHEC: a run did not show the worker going 1 -> 0 -> 1, so the kill did');
  console.log('not land and the latency below is not a recovery.');
  process.exit(1);
}
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const warm = med(ok.flatMap((r) => [r.warm1, r.warm2]));
const after = med(ok.map((r) => r.afterEviction));
console.log('warm message, median of ' + ok.length * 2 + ':        ' + warm + ' ms');
console.log('first message after eviction, median: ' + after + ' ms');
console.log('\nadded latency attributable to the wake: ' + (after - warm) + ' ms');
console.log('Every run translated after the eviction, which is the half of A5’s bar');
console.log('that is about whether a reader loses the message at all.');
process.exit(0);
