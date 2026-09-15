# Appendix G. The budget file

The specification asks for two artefacts by name and says neither will exist the
first time it is read: the ledger, which is [appendix F](F-axis-ledger.md), and
this one. **Seven of the 22 bars state their threshold as a ceiling, a floor, a
count or a rate in the budget file**, so those seven cannot be read at all until
it exists. Three passes rediscovered that from three different axes before
anyone counted it (4.57).

This file is the first honest state of it, and most of it is empty on purpose.

## The rule this file follows

The specification's own instruction for a first pass: *record baselines only for
the axis you worked. A baseline for an axis you did not measure is a number
nobody took.* A budget file full of plausible ceilings would read as evidence
and would be worse than no budget file, because a bar compared against an
invented number returns a verdict rather than a silence.

So a row carries a number only where a measurement exists in this repository or
in the clone. Every other row says what would set it, and whether the instrument
for that measurement exists today. Those instrument answers come from the table
in [appendix F](F-axis-ledger.md) rather than being guessed again here.

## The budget

| Bar | Threshold | Value | Where it comes from |
|---|---|---|---|
| A6 | Injected bytes may not grow release over release beyond a margin | **233217 bytes, margin 2 percent** | Set. It already lived in `scratchpad/audit_poids.py` as `REFERENCE_OCTETS` and `MARGE`, with the last spend decomposed per module in a comment beside it |
| A11 | Advisory severity floor | **Zero at any severity in the production tree** | Set. `npm audit --omit=dev` is zero across all severities against four runtime dependencies, so the floor is the measurement rather than a tolerance (4.54). The 17 advisories in the full tree are all dev-only and never enter a bundle |
| A3 | Calls to any engine per typed character | *not set* | Type a known string into the composer harness and count provider calls against characters typed. `compose-kick-live.mjs` exists and has not been run here |
| A5 | Added latency after a worker eviction, first message | *not set* | Evict the worker between two messages and time the first one after the wake. Possible with Playwright, never run, and the same witness A5 asks for (4.56) |
| A6 | Per-row main-thread cost at the highest message rate the harness can generate | *not set* | The weight half of A6 is set above; this half is a different quantity and no harness measures it |
| A13 | Repeat count over which the flake rate must be zero | *not set* | Run the gate suite N times and count non-deterministic failures. `run-gates.mjs` exists; nobody has chosen N, and choosing N before running is the point of putting it here |
| A18 | Time to first visible translation, cold profile | *not set* | Still not set, and now for a narrower reason. `metrics-offline.mjs` was run and gives the per-message figure, `e2e.cloud` p50 44 ms offline with the engine answered locally, of which 40 is the deliberate coalescing window. That is not cold-start to first paint, which is what this row asks for, and measuring it means timing from extension load rather than from message arrival (4.61) |
| A21 | Requests per unit of time under refusal, and the escalation | **6 a minute per provider, 24 a minute across four** | **Derived, not measured**, and labelled so. The `rate_limit` ladder in `translator/index.ts` is `min(10_000, 1500 * 2 ** (cf - 1))`, which settles at one attempt per 10 s per provider, and the candidate list skips providers still cooling, so four providers bound the total at 24 a minute. This is what the code permits, not what was observed; the counters that would observe it were read for the first time in 4.61 and were empty because the fixture engine never refuses |

**Two of seven axes set.** That is the result, not a placeholder: six bars remain
unreadable and each one now names the measurement that would close it and
whether the instrument exists. Five of the six need an instrument that is
already in the repository.

## What this file is not

It is not the product's configuration. `perChannelBudgetPerMin`,
`BATCH_WINDOW_MS`, `KEEPALIVE_INTERVAL_SEC` and the rest are operating
parameters the product runs on; a budget-file entry is a threshold an audit
compares a measurement against. The two are easy to confuse because they are
both numbers in the same subject area, and confusing them would fill this table
with values that describe what the product does rather than what it must not
exceed.

A16's bar is the clearest illustration from the other direction: it sets no
number and needs none, because *no screenshot older than the feature it shows*
is a condition rather than a quantity. Fifteen of the 22 bars are like that.
Only seven asked for this file.

## Where it should eventually live

In the extension's repository, beside the gates that read it, so a gate can
fail against it rather than against a constant compiled into itself. Today the
only entry that is enforced anywhere is A6's, and it is enforced by being
written inside `audit_poids.py` rather than read from a shared file. That is
the shape the other seven would take, and moving A6's out is a change to the
extension, which this study does not make.
