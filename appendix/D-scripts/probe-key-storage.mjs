/**
 * Check: does the DeepL key stay out of synced storage, as the product says?
 *
 * 2.7.0's changelog: *Your DeepL key stays on the machine you typed it on. It
 * was stored with the rest of the settings, which sync across every Chrome
 * signed into the same account ... It now lives in local storage.* Chapter 11
 * of this study repeats it as **[reported]** and has never re-run it.
 * `constants.ts` states the reasoning in its own words, beside the key's name:
 * *chrome.storage.sync replicates to Google and to every Chrome signed into the
 * same account. That is right for preferences and wrong for a credential.*
 *
 * `settings.ts` honours that at **all three** of its `storage.sync.set` sites,
 * each wrapped in `withoutKey()`, with a comment explaining the migration order
 * so that no failure loses the key. It is careful work.
 *
 * There is a fourth `storage.sync.set` in the code, in `background/index.ts`,
 * and it is not in `settings.ts`:
 *
 *     if (next.deeplApiKey && !next.providerOrder.includes('deepl')) {
 *       next = { ...next, providerOrder: ['deepl', ...next.providerOrder] };
 *       void chrome.storage.sync.set({ [STORAGE_KEY_SETTINGS]: next });
 *
 * `next` carries the key, and the branch's own guard is that the key exists.
 * The default provider order is `['google', 'mymemory', 'lingva']`, so the
 * condition is true exactly once: **the first time a reader configures DeepL**,
 * which is the moment the key exists and DeepL is not yet in the chain.
 *
 * Reading that is one instrument. This is the second: it loads the built
 * extension, reproduces what the options page does, and then reads
 * `chrome.storage.sync` back out of the extension's own service worker.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Whether Chrome actually replicated the value before it was cleaned up. A
 *   signed-out test profile syncs nothing. What is demonstrated is that the key
 *   is written into the area whose whole purpose is replication; how long it
 *   sits there before the next `loadSettings()` migration removes it is a race
 *   with the sync client, not something this can time.
 * - Whether a real reader's path matches this one. The sequence here is the one
 *   `saveSettings` and `watchSettings` implement, driven through storage rather
 *   than through the options UI.
 *
 *   node appendix/D-scripts/probe-key-storage.mjs /path/to/kick-chat-translator
 */
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-key-storage.mjs <path-to-extension-repo>');
  process.exit(2);
}
const ext = process.env.KT_EXT ?? join(root, 'dist');
for (const p of [join(root, 'scratchpad/harness/playwright.mjs'), join(ext, 'manifest.json')]) {
  if (!existsSync(p)) {
    console.error('cannot check: missing ' + p);
    process.exit(2);
  }
}
const { chromium } = await import(pathToFileURL(join(root, 'scratchpad/harness/playwright.mjs')).href);

const SETTINGS = 'kt.settings.v2';
const KEYNAME = 'kt.deeplKey.v1';
const SECRET = 'ZZ-not-a-real-deepl-key-ZZ';

const profile = mkdtempSync(join(tmpdir(), 'kt-key-'));
const ctx = await chromium.launchPersistentContext(profile, {
  headless: false,
  args: [
    `--disable-extensions-except=${ext}`,
    `--load-extension=${ext}`,
    '--window-position=-2400,-2400',
    '--no-first-run',
    '--no-default-browser-check',
  ],
});

const page = ctx.pages()[0] ?? (await ctx.newPage());
await page.goto('about:blank');
for (let i = 0; i < 40 && ctx.serviceWorkers().length === 0; i++) await page.waitForTimeout(100);
const sw = ctx.serviceWorkers()[0];
if (!sw) {
  console.error('cannot check: the extension service worker never appeared');
  await ctx.close();
  rmSync(profile, { recursive: true, force: true });
  process.exit(2);
}

const read = () => sw.evaluate(async ([s, k]) => {
  const sync = await chrome.storage.sync.get(s);
  const local = await chrome.storage.local.get(k);
  return {
    syncKey: sync[s]?.deeplApiKey ?? null,
    order: sync[s]?.providerOrder ?? null,
    localKey: local[k] ?? null,
  };
}, [SETTINGS, KEYNAME]);

// Let the worker settle its defaults into sync before touching anything.
for (let i = 0; i < 40; i++) {
  if ((await read()).order) break;
  await page.waitForTimeout(100);
}
const before = await read();

// Reading the FINAL state of sync cannot tell "never written" from "written and
// then scrubbed", and the difference is the whole question: a credential that
// touches the replicating area has touched it. So record every value the key
// takes in sync, from an onChanged listener installed before anything is
// written, and read the trace rather than the end state.
await sw.evaluate(([s]) => {
  globalThis.__ktTrace = [];
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes[s]) return;
    globalThis.__ktTrace.push(changes[s].newValue?.deeplApiKey ?? null);
  });
}, [SETTINGS]);

// What the options page does: the key goes to local, and sync gets the settings
// with the key stripped. This is `saveSettings` exactly.
await sw.evaluate(async ([s, k, secret]) => {
  const cur = (await chrome.storage.sync.get(s))[s];
  await chrome.storage.local.set({ [k]: secret });
  await chrome.storage.sync.set({ [s]: { ...cur, deeplApiKey: '' } });
}, [SETTINGS, KEYNAME, SECRET]);

// The sync write above fires chrome.storage.onChanged, which is what
// watchSettings listens to, which re-reads both areas and calls applySettings.
await page.waitForTimeout(1500);
const after = await read();
const trace = await sw.evaluate(() => globalThis.__ktTrace ?? []);

await ctx.close();
rmSync(profile, { recursive: true, force: true });

const show = (v) => (v === null ? '(absent)' : v === '' ? '(empty string)' : JSON.stringify(v));
console.log('before configuring a key:');
console.log('  providerOrder in sync : ' + show(before.order));
console.log('  deeplApiKey in sync   : ' + show(before.syncKey));
console.log('  key in local          : ' + show(before.localKey));
console.log('\nafter writing the key the way the options page does:');
console.log('  providerOrder in sync : ' + show(after.order));
console.log('  deeplApiKey in sync   : ' + show(after.syncKey));
console.log('  key in local          : ' + show(after.localKey));

if (after.localKey !== SECRET) {
  console.log('\nECHEC: the key never reached local storage, so this run measured nothing.');
  process.exit(2);
}
console.log('\nevery value deeplApiKey took in chrome.storage.sync, in order:');
for (const v of trace) console.log('  ' + show(v));
if (trace.length === 0) console.log('  (no sync change observed at all)');

const transited = trace.includes(SECRET);
const leaked = after.syncKey === SECRET;
const promoted = Array.isArray(after.order) && after.order[0] === 'deepl';
console.log('\nDeepL auto-promoted to the head of the chain: ' + promoted);
console.log('The key passed through chrome.storage.sync: ' + transited);
console.log('The key is still in chrome.storage.sync at the end: ' + leaked);

if (leaked) {
  console.log('\nThe key is still there at the end, which is the strong form of this.');
  process.exit(0);
}
if (transited) {
  console.log('\nThe key entered chrome.storage.sync and was taken out again.');
  console.log('The write is background/index.ts:39, the fourth storage.sync.set in this');
  console.log('extension and the only one that does not strip the key; the other three are');
  console.log('in settings.ts and all call withoutKey(). What removes it is the migration');
  console.log('inside loadSettings(), which sees the value and treats it as a stray from an');
  console.log('older build. So the guard that cleans up is the one written for a different');
  console.log('problem, and nothing is aimed at this one (4.99).');
  process.exit(0);
}
console.log('\nThe key never entered sync in this run, and the trace above says whether the');
console.log('branch fired at all. If it fired and wrote no key, 4.99 is fixed and stale.');
process.exit(1);
