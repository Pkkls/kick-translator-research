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
| A5 | No state lives only in worker memory | no verdict recorded | |
| A6 | Injected bytes do not grow release over release without a named reason | open, with a number | [13.4](../thesis/13-results.md): +0.15 percent at the last recorded pass, against a 2 percent margin whose last spend is decomposed per module in `audit_poids.py`. Open rather than closed because the instrument can report green without measuring: on an instrumented build it exits 0 without comparing ([4.49](E-method-log.md)) |
| A7 | No interactive control under 24 by 24 | open, with a named reason | The gate measures the targets it finds and asserts no count of them. Executed: with the bar's two controls hidden by their own stylesheet, `bar-widths.mjs` is green at all ten widths and exits 0 ([4.48](E-method-log.md)). The 24 pixel minimum and the declaration that voids it are in one CSS rule |
| A8 | Zero missing keys, zero identifiers rendered, zero overflow | open, with a number | `scripts/i18n-check.mjs` reports 150 missing keys per locale on files that are complete, so the instrument is wrong rather than the product ([HANDOVER.md](../HANDOVER.md) section 8) |
| A9 | No value outside the declared set, no surface overflowing its frame | no verdict recorded | |
| A10 | Nothing leaves that the privacy text does not name | open, with a number | [13.7](../thesis/13-results.md) counts the observable surface. The count is of call sites, not of what renders, which is the limit stated wherever such a claim appears |
| A11 | Zero advisories above the severity floor | no verdict recorded | |
| A12 | The end-to-end path passes on every engine claimed | no verdict recorded | Brave was measured identical to Chromium on one path (the corpus), and the signed-in case is unreachable from this account. The reason is now named to the value ([4.47](E-method-log.md)) |
| A13 | Every gate is in a runner or has a written reason it is launched by hand | open, with a number | 40 gates in the runner. **Three harnesses that build metrics are outside it**, `metrics-offline.mjs`, `latency.mjs` and `run-live.mjs`, and no written reason accompanies their absence ([4.49](E-method-log.md)) |
| A14 | A fresh clone can run the full public verification and get a truthful answer | open, with a number | [13.6b](../thesis/13-results.md). The frame tells every session a fresh clone has no harnesses; it has 56 ([HANDOVER.md](../HANDOVER.md)) |
| A15 | One version everywhere, checked by a gate rather than by eye; a rebuild of the tagged commit matches the digest the forge publishes; store state read from the store | open, with a number, and **its reproducibility half closed** | Rebuilt `v2.10.0` in a detached worktree and packed both archives: sha256 `8c8d7eca262b…` and `4f8450494d7e…`, **2 of 2 byte-identical to the digests GitHub publishes**, on Node 22 where CI builds on the 20 that `.nvmrc` pins ([4.52](E-method-log.md)). Version agreement is not closed: six places, **three answers**, 2.10.0 in `package.json`, the built manifest, the tag and the release assets, 2.9.2 on the Chrome Web Store, 2.7.0 on AMO, both read from the stores. The store lag is a pending submission blocked on kil rather than a disagreement. **No gate checks any of it**: none of the 40 in the runner matches version, release, manifest or tag, and `state.mjs` is a generated report, not a gate |
| A16 | No screenshot older than the feature it shows | no verdict recorded | |
| A17 | Every remote branch is live or has a named reason | open, with a number | Branches counted, and the unmerged two never opened ([4.40](E-method-log.md)) |
| A18 | Zero required decisions before the first translation appears | no verdict recorded | |
| A19 | Every counter has its numerator and denominator written next to it | no verdict recorded | |
| A20 | Nothing from a chat message or a provider response reaches a markup sink | open, with a number | `probe-render-sinks.mjs` counts sinks and text-node writes and refuses to classify which carry untrusted text, deliberately ([appendix D](D-scripts/)). The unclassified remainder is why this is not closed |
| A21 | A full storage area degrades the product and never corrupts it | no verdict recorded | |
| A22 | Every finding published carries a second, differently-shaped instrument | open, with a number | Nine measurements went through the bar and **five changed** ([14.2b](../thesis/14-limits.md)). Two candidates were executed rather than re-read and both came back stronger than their reading ([4.48](E-method-log.md), [4.49](E-method-log.md)). The rate is the verdict, and it is not zero |

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
