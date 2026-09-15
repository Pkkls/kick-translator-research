/**
 * Measure: does the extension grow without bound over a long session?
 *
 * A6's last unmeasured clause is *no unbounded growth in a long session*. By
 * source reading everything that accumulates in the content script is capped:
 * `DECISION_LOG_MAX = 50` with a `shift()`, the context buffer shifts past
 * `MAX_CONTEXT_KEEP`, and the in-tab cache is an LRU that deletes its oldest.
 * Reading caps is not the same as watching them hold, which is the clause.
 *
 * **A flat line means nothing without a positive control**, which is 4.104's
 * lesson paid for once already: a probe that reports a green is the hardest kind
 * to check, because the output looks like the answer you wanted. So this runs
 * the same session twice.
 *
 * - **the product**: N messages through the real extension, the DOM capped the
 *   way a virtualised list keeps it.
 * - **the positive control**: the identical session, with the page itself
 *   retaining every message in an array that nothing ever trims. This leaks by
 *   construction. If the instrument cannot see that, it cannot see anything, and
 *   the run fails rather than reporting the product clean.
 *
 * The heap is read through CDP `Runtime.getHeapUsage` after an explicit
 * `HeapProfiler.collectGarbage`, so a sample is a measurement of what survives
 * collection rather than of what has not been collected yet. Isolated worlds
 * share the renderer's V8 isolate, so the content script's allocations are in
 * the same number as the page's.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - The service worker's heap, which is a separate context. This is the content
 *   script and the page.
 * - Growth slower than the run. A session of a few hundred messages bounds what
 *   can be claimed, and the claim is about that length and no longer.
 * - Detached DOM nodes specifically. They would show in the heap total, but this
 *   does not attribute growth to a cause.
 *
 *   node appendix/D-scripts/probe-long-session.mjs /path/to/kick-chat-translator [messages]
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
const TOTAL = Number(process.argv[3] ?? 400);
if (!root) {
  console.error('usage: probe-long-session.mjs <path-to-extension-repo> [messages]');
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

const MARK = 'ZZLONGZZ';
const SAID = 'buenos dias a todos';
const KEEP = 60;
const SAMPLE_EVERY = 50;
const FIXTURE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>chat</title></head>
<body>
  <div id="channel-chatroom">
    <div class="no-scrollbar" data-which="decoy"></div>
    <div class="no-scrollbar" data-which="messages" style="height:600px;overflow:auto"></div>
    <div contenteditable="true" role="textbox" data-testid="chat-input" class="editor-input" style="min-height:40px"></div>
  </div>
</body></html>`;
const KICK = /^https?:\/\/(www\.)?kick\.com\//;

async function session(leak) {
  const profile = mkdtempSync(join(tmpdir(), 'kt-long-'));
  const ctx = await chromium.launchPersistentContext(profile, {
    headless: false,
    viewport: { width: 1200, height: 800 },
    args: [
      `--disable-extensions-except=${ext}`, `--load-extension=${ext}`,
      '--window-position=-2400,-2400', '--no-first-run', '--no-default-browser-check',
    ],
  });
  await ctx.route('**://translate.googleapis.com/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([[[MARK, SAID, null, null, 10]], null, 'es']) }));
  await ctx.route('**://api.github.com/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{}' }));
  await ctx.route(KICK, (r) => {
    const q = r.request();
    if (q.resourceType() === 'document') return r.fulfill({ status: 200, contentType: 'text/html', body: FIXTURE });
    if (q.url().includes('/api/')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ chatroom: { id: 1 }, livestream: { lang_iso: 'es' } }) });
    return r.fulfill({ status: 204, body: '' });
  });

  const page = ctx.pages()[0] ?? (await ctx.newPage());
  await page.goto('https://kick.com/somechannel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('HeapProfiler.enable');

  const sample = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const { usedSize } = await cdp.send('Runtime.getHeapUsage');
    return Math.round(usedSize / 1024);
  };

  const samples = [];
  for (let i = 0; i < TOTAL; i++) {
    await page.evaluate(({ said, n, keep, leaking }) => {
      const list = document.querySelector('[data-which="messages"]');
      const row = document.createElement('div');
      row.setAttribute('data-index', String(n));
      row.innerHTML = '<div class="w-full min-w-0 shrink-0"><button class="font-bold">u' + (n % 7) +
        '</button><span class="font-normal">' + said + ' ' + n + '</span></div>';
      list.appendChild(row);
      while (list.childElementCount > keep) list.removeChild(list.firstElementChild);
      if (leaking) {
        globalThis.__leak ??= [];
        globalThis.__leak.push(new Array(200).fill(said + ' ' + n));
      }
    }, { said: SAID, n: i, keep: KEEP, leaking: leak });
    await page.waitForTimeout(12);
    if ((i + 1) % SAMPLE_EVERY === 0) samples.push({ at: i + 1, kb: await sample() });
  }
  await ctx.close();
  rmSync(profile, { recursive: true, force: true });
  return samples;
}

const fit = (s) => {
  // Least-squares slope in KB per message, over the samples after the first.
  const pts = s.slice(1);
  const n = pts.length;
  const mx = pts.reduce((t, p) => t + p.at, 0) / n;
  const my = pts.reduce((t, p) => t + p.kb, 0) / n;
  const num = pts.reduce((t, p) => t + (p.at - mx) * (p.kb - my), 0);
  const den = pts.reduce((t, p) => t + (p.at - mx) ** 2, 0);
  return den === 0 ? 0 : num / den;
};
// A capped system and a leaking one both rise at first: the caps fill. What
// separates them is what happens after. A cap that holds gives a slope that
// decays toward zero; a leak gives the same slope in both halves. So the halves
// are the discriminator, and the overall slope alone is not.
const halves = (s) => {
  const mid = Math.floor(s.length / 2);
  return { first: fit(s.slice(0, mid + 1)), second: fit(s.slice(mid)) };
};
const show = (name, s) => {
  console.log('\n' + name);
  console.log('  ' + s.map((p) => p.at + ':' + p.kb + 'KB').join('  '));
  console.log('  slope after the first sample: ' + fit(s).toFixed(3) + ' KB per message');
  const h = halves(s);
  console.log('  first half ' + h.first.toFixed(3) + '  second half ' + h.second.toFixed(3) +
    '   ' + (h.first === 0 ? '' : 'second/first ' + (h.second / h.first).toFixed(2)));
};

console.log(TOTAL + ' messages per session, DOM capped at ' + KEEP + ', heap read after a forced collection.');
const product = await session(false);
show('the product', product);
const control = await session(true);
show('the positive control, page retaining every message', control);

const ps = fit(product);
const cs = fit(control);
console.log('\ncontrol slope / product slope: ' + (ps === 0 ? 'n/a' : (cs / ps).toFixed(1) + 'x'));

if (cs < 0.5) {
  console.log('\nECHEC: the deliberate leak did not register, so this instrument cannot');
  console.log('see growth and the product’s flat line means nothing.');
  process.exit(2);
}
console.log('\nThe control leaks and is seen, so the instrument has the sensitivity the');
console.log('product’s number needs to mean anything.');
process.exit(0);
