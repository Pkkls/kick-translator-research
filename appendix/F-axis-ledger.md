# Appendix F. The axis ledger

The specification in [appendix A](A-audit-prompt.md) defines 22 axes, and each
one carries a **Bar**: the condition under which that axis is closed. The
specification also names three conditions for stopping, and the first is that
every axis is *closed, or open with a number and a named reason*.

Nothing recorded that. The axes live in one file, the findings live in chapters
organised by subject, and no index connected them, so the first stop condition
could not be evaluated at all. Not because the work was missing: chapter 13
publishes upwards of forty numbers and several of them answer a Bar exactly.
What was missing is the row that says which.

This file is that index. It is kept honest by
[`axis-ledger.mjs`](D-scripts/axis-ledger.mjs), which fails if the specification
grows an axis this table does not have, or if this table names one the
specification does not.

## How to read a verdict

- **closed** — the Bar is met and a published number says so.
- **open, with a number** — the Bar is not met, and how far off is measured.
  This is a legitimate resting state under the stop condition. It is not a
  failure, it is the condition being satisfied honestly.
- **no verdict recorded** — nobody has compared this axis to its Bar. This is
  the state the stop condition forbids, and it is the most common state here.

A verdict is entered only where a number in this repository supports it. Where
a subject is discussed at length but never measured against the Bar, the
verdict stays unrecorded, because the Bar asks for a number and prose is not
one. That rule is what keeps this table from becoming a second opinion about
work rather than an index of it.

## The ledger

| Axis | Bar, in short | Verdict | Evidence |
|---|---|---|---|
| A1 | Rows in equals translated plus skipped plus errored, every skip named | open, with a number | 11 of 663 pairs skipped as "already in your language" for messages that are not, 1.7 percent, all at non-English targets ([13.x](../thesis/04-script-vs-language.md), 4.x). The accounting identity itself is never checked |
| A2 | Held-out bench, zero wrong for any unambiguous script | open, with a number | [13.2](../thesis/13-results.md): ar, ja, ko, ru all 25 of 25; **zh 24 of 25**, so the zero is missed by one on an unambiguous script. Latin half es 3/8, fr 4/5, pt 3/6, tr 1/4, which the Bar permits only with the trade written as a number, and it is: 8 silent losses of 483 pairs against 0 of 1125 |
| A3 | What is sent is exactly what the preview showed | no verdict recorded | |
| A4 | Every selector has a fallback or a named reason it cannot | no verdict recorded | |
| A5 | No state lives only in worker memory; every write merges rather than overwrites; after eviction the first message translates within the ceiling in the budget file | open, with a number | Seven pieces of mutable module-level state in the worker, of which **six live only in memory**. `settings` is the exception and is reloaded with `loadSettings()` on start. Four of the six are round-robin indices and quota caches whose loss costs nothing. The seventh matters: `channelBuckets` holds a `TokenBucket` per channel, consulted before every request, and `bucketFor` recreates it **full** after a restart, so the per-channel budget (default 200 a minute) resets on every eviction. The keepalive that would prevent the eviction asks for `KEEPALIVE_INTERVAL_SEC = 25`, which is `periodInMinutes` 0.4167, **below the 0.5 minimum `chrome.alarms` documents** **[outside]**, so the interval it gets is not the interval it asks for, and no comment in the repository records the clamp. The bar's third clause names a ceiling in the budget file, and there is no budget file (4.54). The runtime witness the axis asks for, killing the worker between two messages, has never been run ([4.56](E-method-log.md)) |
| A6 | Injected bytes do not grow release over release without a named reason | open, with a number | [13.4](../thesis/13-results.md): +0.15 percent at the last recorded pass, against a 2 percent margin whose last spend is decomposed per module in `audit_poids.py`. Open rather than closed because the instrument can report green without measuring: on an instrumented build it exits 0 without comparing ([4.49](E-method-log.md)) |
| A7 | No interactive control under 24 by 24 | open, with a named reason | The gate measures the targets it finds and asserts no count of them. Executed: with the bar's two controls hidden by their own stylesheet, `bar-widths.mjs` is green at all ten widths and exits 0 ([4.48](E-method-log.md)). The 24 pixel minimum and the declaration that voids it are in one CSS rule |
| A8 | Zero missing keys, zero identifiers rendered, zero overflow | open, with a number | `scripts/i18n-check.mjs` reports 150 missing keys per locale on files that are complete, so the instrument is wrong rather than the product ([HANDOVER.md](../HANDOVER.md) section 8) |
| A9 | No value outside the declared set, no surface overflowing its frame | no verdict recorded | |
| A10 | Nothing leaves that the privacy text does not name | open, with a number | [13.7](../thesis/13-results.md) counts the observable surface. The count is of call sites, not of what renders, which is the limit stated wherever such a claim appears |
| A11 | Zero advisories above the floor in the budget file; zero instrumentation in a release bundle proven from the archive; every detection shortcut required-and-written-down or gone, so finding the extension costs a page script a read of rendered content and never a query by name | open, with a number | Advisories: **17 in the full tree, 3 critical and 9 high, and 0 of them in production**. The four runtime dependencies are `franc-min`, `idb-keyval`, `preact` and `zod`, and `npm audit --omit=dev` is zero at every severity, so nothing reaches the bundle. **There is no budget file**, no audit script and no audit config, so the bar's own term is undefined and the floor it refers to does not exist. Instrumentation: `check-strip` proves it from the build rather than the archive, and [4.52](E-method-log.md) closes that gap by other means, since the archive rebuilds byte-identical from the tag. Detection: **at least four shortcuts on the host page**, each one query by name, covering four of the eight categories the axis itself enumerates: `#kt-floating-bar` (`injector.ts:338`), `data-kt-id` written onto Kick's own chat rows (`observer.ts:29`), `data-kt-scheme` set on the document element (`injector.ts:152`), and a class toggled on the document element (`injector.ts:189`), beside 79 distinct `kt-` class names. **No document in either repository counts them**, which is the trap this axis names in its own words ([4.54](E-method-log.md)) |
| A12 | The end-to-end path passes on every engine claimed | no verdict recorded | Brave was measured identical to Chromium on one path (the corpus), and the signed-in case is unreachable from this account. The reason is now named to the value ([4.47](E-method-log.md)) |
| A13 | Every gate is in a runner or has a written reason it is launched by hand | open, with a number | 40 gates in the runner. **Three harnesses that build metrics are outside it**, `metrics-offline.mjs`, `latency.mjs` and `run-live.mjs`, and no written reason accompanies their absence ([4.49](E-method-log.md)) |
| A14 | A fresh clone can run the full public verification and get a truthful answer | open, with a number | [13.6b](../thesis/13-results.md). The frame tells every session a fresh clone has no harnesses; it has 56 ([HANDOVER.md](../HANDOVER.md)) |
| A15 | One version everywhere, checked by a gate rather than by eye; a rebuild of the tagged commit matches the digest the forge publishes; store state read from the store | open, with a number, and **its reproducibility half closed** | Rebuilt `v2.10.0` in a detached worktree and packed both archives: sha256 `8c8d7eca262b…` and `4f8450494d7e…`, **2 of 2 byte-identical to the digests GitHub publishes**, on Node 22 where CI builds on the 20 that `.nvmrc` pins ([4.52](E-method-log.md)). Version agreement is not closed: six places, **three answers**, 2.10.0 in `package.json`, the built manifest, the tag and the release assets, 2.9.2 on the Chrome Web Store, 2.7.0 on AMO, both read from the stores. The store lag is a pending submission blocked on kil rather than a disagreement. **No gate checks any of it**: none of the 40 in the runner matches version, release, manifest or tag, and `state.mjs` is a generated report, not a gate |
| A16 | No screenshot older than the feature it shows, and none showing a real person's handle or message; localised documents current or carrying a version line | open, with a documented trade and a number | Screenshots: 4 of 5 are produced by the `captures-readme` gate from a fabricated room and were last committed on the tag date. The fifth carries four real handles from a live channel and is **deliberately kept**, with the reason written in `screenshots/README.md`, which also states that the image it replaced carried them. So the clause is not broken by oversight; it rests on a trade the owner made ([4.53](E-method-log.md)). Localised READMEs: 3 of 3 head their what-new section at 2.8.1 while the product is 2.10.0, 3 of 3 link that heading to `releases/latest` so the heading and its destination disagree, and 0 of 3 carry the version line the bar allows instead. The sections pinned to `/tag/v2.8.0` in the same files are correct, so the only unpinned link in each is the one that goes stale |
| A17 | Every remote branch is live or has a named reason | open, with a number | Branches counted, and the unmerged two never opened ([4.40](E-method-log.md)) |
| A18 | Zero required decisions before the first translation appears | no verdict recorded | |
| A19 | Every counter has its numerator and denominator written beside it; no denominator containing a population it does not describe; no decision recorded against an unreachable counter; a numerator whose denominator does not exist under the same prefix is a gate failure | open, with a number | 20 counters and 16 timings enumerated from the call sites. Applying the pairing rule the bar names, **3 of 20 counters have no denominator readable beside them**: `dom.attach`, `drop.recycled.unrescued` and `google.batch.fallback`, and two of the three carry a word in their own name that implies a ratio. The other 17 pair as siblings, as extensions, or as dynamic families that sum to their own total. The code uses two pairing shapes and the bar names one, which is why a first mechanical count said 12 and was wrong ([4.55](E-method-log.md)). Separately: [13.4](../thesis/13-results.md) publishes a 6.7 percent in-tab cache hit rate and 1.0 percent persistent, 8 hits in 821 lookups, **without saying they come from an instrumented build**, in a chapter that states elsewhere that the release strips instrumentation. No gate checks the pairing convention, which the axis says in its own words a gate can check |
| A20 | Nothing from a chat message or a provider response reaches a markup sink | open, with a number | `probe-render-sinks.mjs` counts sinks and text-node writes and refuses to classify which carry untrusted text, deliberately ([appendix D](D-scripts/)). The unclassified remainder is why this is not closed |
| A21 | A full storage area degrades the product and never corrupts it | no verdict recorded | |
| A22 | Every finding published carries a second, differently-shaped instrument | open, with a number | Nine measurements went through the bar and **five changed** ([14.2b](../thesis/14-limits.md)). Two candidates were executed rather than re-read and both came back stronger than their reading ([4.48](E-method-log.md), [4.49](E-method-log.md)). The rate is the verdict, and it is not zero |

## The instrument each axis needs, and whether it exists here

Step 2 of the specification's own first pass: *walk the index and mark each axis
with the instrument it needs and whether that instrument exists on this machine
today. Now the queue is real.* This table is that step, taken late. "Exists"
means it was run, or it was run in this session and is known to work, not that
something with a plausible name is present.

| Axis | Instrument it needs | Here today |
|---|---|---|
| A1 | An instrumented build plus real traffic, counters read back | build yes, traffic no |
| A2 | The benches in `src/content/langDetect*.test.ts` | yes, run |
| A3 | `compose-kick-live.mjs`, `compose-live.mjs` | present, not run here |
| A4 | Source reading plus a live Kick DOM | source yes, live DOM no |
| A5 | Playwright with the worker evicted by hand | possible, never run |
| A6 | `audit_poids.py` on a release build | yes, run |
| A7 | `bar-widths.mjs` against a copied build | yes, run |
| A8 | `scripts/i18n-check.mjs` | present and known wrong |
| A9 | A live browser against the host's art direction | no |
| A10 | `probe-render-sinks.mjs` | present, classification deliberately manual |
| A11 | `npm audit` for the tree; nothing for the detection surface | half |
| A12 | A signed-in session in a second browser | **no**, and the missing value is named (4.47) |
| A13 | `run-gates.mjs` | yes, read |
| A14 | A fresh clone and the public verification | yes |
| A15 | A worktree at the tag, a rebuild, the forge's digests | yes, run (4.52) |
| A16 | `probe-orphan-assets.mjs` and reading | yes, run (4.53) |
| A17 | `git` | yes |
| A18 | Playwright on a cold profile | possible, never run |
| A19 | `metrics-offline.mjs` | present, not run here |
| A20 | `probe-render-sinks.mjs` | present |
| A21 | A browser with its storage quota filled | possible, never run |
| A22 | This method log and the replication bar | yes |

Seven axes need something that exists and has never been pointed at them. One,
A12, needs something this account does not have, and 4.47 named it down to the
registry value. **No axis is blocked by a missing instrument that could not be
built**, which is a different and more uncomfortable answer than "the work is
hard".

## The other artefact the specification asked for, and nobody made

Eight of the 22 bars, **A3, A5, A6, A11, A13, A18, A21 and A22**, state their
threshold as a ceiling, a floor, a count or a rate *in the budget file*. There
is no budget file. The specification says so itself, under the heading about a
first pass: *the ledger and the budget file are asked for by this document and
will not be there the first time it is read.* Both were asked for, neither was
made, and eight bars are unreadable as a consequence rather than as an
accident. This file closes the first of the two. The second is a page of
numbers and remains the cheapest unbuilt thing in this study (4.57).

## What this table says about the stop condition

Twelve axes carry a verdict and ten do not. The first stop condition is
therefore **not met**, and now it is not met by a count rather than by an
impression. No axis is closed outright. A15 came closest and is the shape to
aim at: its reproducibility half is closed by an exact match against a
published digest, and the two halves that are not closed each carry a number
instead of a silence. That is what *open with a number* is supposed to look
like, and the specification accepts it as a resting state.

The ten unrecorded are not ten pieces of missing work. A15 was one of them one
pass ago and took four minutes of measurement that had been available for two
releases, which is the argument for writing the rows before doing the work:
the table is what told anyone the measurement was missing. A16 is likely the
same shape. The point of the row is that until someone writes the
number down beside the Bar, nobody can tell an unmeasured axis from a measured
one, and the stop condition cannot be read at all.

## The honest limit of this table

The mapping from a chapter's subject to an axis was made by a reader, not by a
script, and a script could not make it: chapter 13 never names an axis, which is
the gap this file exists to close. So the evidence column is a judgement about
where a number belongs, and a different reader could place some of them
differently. What is mechanical is only the axis list itself, which
`axis-ledger.mjs` keeps in step with the specification.
