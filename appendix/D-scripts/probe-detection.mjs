/**
 * Measure: what a script on the host page can query to find this extension.
 *
 * A11's real question, in the specification's own words: *How cheaply can a
 * script on the host page tell that this extension is installed?* Perfect
 * concealment is not available, because anything that renders is observable.
 * The quantity that is controllable is the **cost** of that detection, and the
 * failure is a dedicated signal that collapses it to a single call.
 *
 * Its bar asks that finding the extension cost a page script *a read of rendered
 * content, never a query by name*, and its witness is explicit about where the
 * measurement has to happen:
 *
 * > For detection, the probe runs in the page's own world and not the
 * > extension's: add one identifier to a shared node and confirm the probe names
 * > it. A probe running anywhere else is measuring a world the page does not
 * > have.
 *
 * Chapter 13.7 reports **11** such signals and derives them from source. This
 * runs in the page's world instead: Playwright's `page.evaluate` executes in the
 * main world, which is the world a hostile script has, and not the isolated
 * world the content script runs in. The two counts are of the same product by
 * different routes, which is what replication means here.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Behaviour. A page could also detect the extension by watching text change,
 *   which the axis says is unavoidable and is not what the bar is about. This
 *   counts only what is queryable **by name**.
 * - Anything that appears later than the probe runs. It fires after a
 *   translation is on screen, which is the state with the most surface; a
 *   signal that only exists during some other interaction is not counted.
 * - Firefox. One browser, one build.
 *
 *   node appendix/D-scripts/probe-detection.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-detection.mjs <path-to-extension-repo>');
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

const MARK = 'ZZDETECTZZ';
const SAID = 'buenos dias a todos';
const FIXTURE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>chat</title></head>
<body>
  <div id="channel-chatroom">
    <div class="no-scrollbar" data-which="decoy"></div>
    <div class="no-scrollbar" data-which="messages" style="height:600px;overflow:auto">
      <div data-index="0"><div class="w-full min-w-0 shrink-0"><button class="font-bold">autre</button><span class="font-normal">${SAID}</span></div></div>
    </div>
    <div contenteditable="true" role="textbox" data-testid="chat-input" class="editor-input" style="min-height:40px"></div>
  </div>
</body></html>`;
const KICK = /^https?:\/\/(www\.)?kick\.com\//;

const profile = mkdtempSync(join(tmpdir(), 'kt-detect-'));
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
await page.goto('https://kick.com/somechannel', { waitUntil: 'domcontentloaded' });
await page.waitForFunction((m) => document.body.innerText.includes(m), MARK, { timeout: 30_000 });

/**
 * Everything below runs in the page's MAIN world, which is the world a script on
 * kick.com has. The content script lives in an isolated world and none of its
 * variables are reachable from here, which is the point: what this finds is what
 * a hostile page can find.
 */
const survey = () => page.evaluate(() => {
  const PREFIX = /^kt[-_]/i;
  const out = { ids: [], docAttrs: [], docClasses: [], classNames: [], rowAttrs: [], globals: [] };
  for (const el of document.querySelectorAll('[id]')) if (PREFIX.test(el.id)) out.ids.push(el.id);
  for (const a of document.documentElement.attributes) if (PREFIX.test(a.name) || /^data-kt/i.test(a.name)) out.docAttrs.push(a.name);
  for (const c of document.documentElement.classList) if (PREFIX.test(c)) out.docClasses.push(c);
  const classes = new Set();
  for (const el of document.querySelectorAll('[class]')) for (const c of el.classList) if (PREFIX.test(c)) classes.add(c);
  out.classNames = [...classes].sort();
  const rowAttrs = new Set();
  for (const el of document.querySelectorAll('*')) for (const a of el.attributes) if (/^data-kt/i.test(a.name)) rowAttrs.add(a.name);
  out.rowAttrs = [...rowAttrs].sort();
  // A dedicated global is the cheapest signal of all: one property read.
  for (const k of Object.keys(globalThis)) if (PREFIX.test(k) || /kick.?chat.?translator/i.test(k)) out.globals.push(k);
  return out;
});

const found = await survey();

// The witness A11 names, run from the page's own world: add one identifier to a
// shared node and confirm the probe names it. If it does not, every zero above
// is a statement about the probe rather than about the product.
await page.evaluate(() => {
  const n = document.createElement('div');
  n.id = 'kt-witness-node';
  n.className = 'kt-witness-class';
  document.documentElement.setAttribute('data-kt-witness', '1');
  document.body.appendChild(n);
});
const after = await survey();

await ctx.close();
rmSync(profile, { recursive: true, force: true });

const kinds = [
  ['element ids', found.ids],
  ['attributes on the document element', found.docAttrs],
  ['classes on the document element', found.docClasses],
  ['data-kt attributes anywhere', found.rowAttrs],
  ['prefixed class names', found.classNames],
  ['globals on window', found.globals],
];
console.log('queryable by name, from the page\'s own world, with a translation on screen:\n');
let signals = 0;
for (const [name, list] of kinds) {
  if (list.length) signals++;
  console.log('  ' + String(list.length).padStart(3) + '  ' + name +
    (list.length && list.length <= 12 ? '   ' + list.join(' ') : ''));
}
console.log('\n' + signals + ' kinds of signal are present.');
console.log('The cheapest single call: ' + (found.globals.length ? 'a property read on window'
  : found.ids.length ? 'document.getElementById on a fixed id'
  : found.docAttrs.length ? 'an attribute read on the document element'
  : 'a class query'));

const witnessed =
  after.ids.includes('kt-witness-node') &&
  after.classNames.includes('kt-witness-class') &&
  after.docAttrs.includes('data-kt-witness');
console.log('\nwitness, added from the page and re-surveyed: ' + (witnessed ? 'named by the probe' : 'NOT NAMED'));
if (!witnessed) {
  console.log('ECHEC: the probe did not name an identifier put in front of it, so every');
  console.log('count above is a statement about the probe and not about the product.');
  process.exit(2);
}
if (signals === 0) {
  console.log('ECHEC: nothing was found at all, which a rendering extension cannot manage.');
  process.exit(2);
}
process.exit(0);
