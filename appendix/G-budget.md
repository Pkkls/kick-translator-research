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
| A3 | Calls to any engine per typed character | **1.000 per character is the bound; the worst constructed case reaches 0.889** | Set, and measured offline rather than live. The decision is a pure function, `decideComposeAction`, and only its `translate` verdict reaches an engine, so the count for a message is the number of its prefixes returning `translate`. `compose-calls.mjs` bundles the clone's own module and walks seven constructed cases: an ordinary sentence 23 of 28, one long word **24 of 27**, pure slang 7 of 19, a bare link 7 of 25, a handle 0 of 9. The bound is the gate chain's, not a preference: past the two-character floor every further character changes the text, so `skip-unchanged` cannot fire twice running. **What binds depends on typing speed and the limiter is the ceiling for most readers** (4.90, corrected by 4.92): `compose.ts:320` consults `new RateLimiter(COMPOSE_MAX_PER_MIN, 60_000)` immediately before the request, **30 a minute**, and measured over a simulated minute it is what binds from about 10 to 40 words a minute, refusing up to 109 decisions. Below that band the gate chain binds; above it `COMPOSE_DEBOUNCE_MS = 320` collapses a message into its final prefix. The per-character bound is the gate chain's; the per-minute ceiling is 30 |
| A5 | Added latency after a worker eviction, first message | *not set* | Evict the worker between two messages and time the first one after the wake. Possible with Playwright, never run, and the same witness A5 asks for (4.56) |
| A6 | Per-row main-thread cost at the highest message rate the harness can generate | **ceiling one frame, 16.7 ms; measured p50 0.2 ms, p95 0.3 ms** | Set, and measured in a real browser for the first time (4.94). The ceiling is the 60 Hz frame rather than a number anybody liked: a row that costs more than a frame drops one. `row-cost.mjs` drives the product's own `inject()` over 600 rows with the DOM capped at 60, the way a virtualised list keeps it, and forces layout after each row so the row pays for what it caused. Warm p50 **0.2 ms**, p95 0.3 ms, max 0.4 ms, flat across all four quarters. One main thread saturates around 5000 rows a second against a fast chat's single digits. Witness, in A6's own words, a deliberate synchronous loop in the row path: a 2 ms plant moves the warm p50 to 2.1 ms. Page-side `performance.now()` is coarsened to 0.1 ms here, so 0.2 is two ticks of the clock and the figure is a ceiling on the cost rather than a precise value |
| A13 | Repeat count over which the flake rate must be zero | **N = 2, and the rate at N = 2 is 4 of 40** | Set, and failing. Two consecutive runs of the unchanged suite, `--no-build --headless` with a driver supplied through `UX_KIT`, gave 34 of 40 and then 38 of 40 (4.88). The four that moved read fixtures another gate writes and git does not track. N was supposed to be chosen before running, which is the specification's requirement and was not possible while nothing had run once; two is what the observation supports, not a ceiling anybody liked. A separate 2 of 40 are red on every run and are not flakes |
| A18 | Time to first visible translation, cold profile | *not set* | Still not set, and now for a narrower reason. `metrics-offline.mjs` was run and gives the per-message figure, `e2e.cloud` p50 44 ms offline with the engine answered locally, of which 40 is the deliberate coalescing window. That is not cold-start to first paint, which is what this row asks for, and measuring it means timing from extension load rather than from message arrival (4.61) |
| A21 | Requests per unit of time under refusal, and the escalation | **6 a minute per provider, 24 a minute across four** | **Derived, not measured**, and labelled so. The `rate_limit` ladder in `translator/index.ts` is `min(10_000, 1500 * 2 ** (cf - 1))`, which settles at one attempt per 10 s per provider, and the candidate list skips providers still cooling, so four providers bound the total at 24 a minute. This is what the code permits, not what was observed; the counters that would observe it were read for the first time in 4.61 and were empty because the fixture engine never refuses |

**6 of the 8 rows carry a number.** That sentence is read by
`axis-ledger.mjs`, which recounts the table and exits 1 if the two disagree,
because this line said *two of seven* for one pass after A21's row was filled in
and four documents copied it (4.80). The rows are eight for seven bars: A6
states two thresholds, a weight ceiling and a per-row main-thread cost, and only
the first of them is set.

That is the result, not a placeholder: five rows remain unreadable and each one
names the measurement that would close it and whether the instrument for that
measurement exists. The aggregate that used to stand here, *five of the six need
an instrument that is already in the repository*, is removed rather than
re-counted: it was written in the same pass as the rows it summarised, and two
of those rows say in their own text that no harness measures the quantity they
ask for. Read the rows.

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
