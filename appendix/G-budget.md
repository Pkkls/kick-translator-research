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
| A5 | Added latency after a worker eviction, first message | **ceiling 250 ms; measured +35 ms, and the message is never lost** | Set, and the witness A5 names has now been run for the first time by anybody (4.96). `worker-eviction.mjs` loads the built extension into a fresh profile, translates two warm messages, kills the MV3 service worker through CDP `Target.closeTarget`, and sends a third. Five runs of five: warm median **46 ms**, first message after the eviction **81 ms**, so the wake costs **35 ms**. **All five translated**, which is the half of the bar that matters, since an evicted worker whose next message is silently dropped shows the reader nothing. The kill is verified as a 1 to 0 to 1 transition in the CDP target list, not by the target id, which Chrome reuses across a restart. The ceiling is a judgement and is labelled one: 250 ms is where a chat line stops feeling immediate, and the measurement sits 7x under it |
| A6 | Per-row main-thread cost at the highest message rate the harness can generate | **ceiling one frame, 16.7 ms; measured p50 0.2 ms, p95 0.3 ms** | Set, and measured in a real browser for the first time (4.94). The ceiling is the 60 Hz frame rather than a number anybody liked: a row that costs more than a frame drops one. `row-cost.mjs` drives the product's own `inject()` over 600 rows with the DOM capped at 60, the way a virtualised list keeps it, and forces layout after each row so the row pays for what it caused. Warm p50 **0.2 ms**, p95 0.3 ms, max 0.4 ms, flat across all four quarters. One main thread saturates around 5000 rows a second against a fast chat's single digits. Witness, in A6's own words, a deliberate synchronous loop in the row path: a 2 ms plant moves the warm p50 to 2.1 ms. Page-side `performance.now()` is coarsened to 0.1 ms here, so 0.2 is two ticks of the clock and the figure is a ceiling on the cost rather than a precise value |
| A13 | Repeat count over which the flake rate must be zero | **N = 2, and the rate at N = 2 is 4 of 40** | Set, and failing. Two consecutive runs of the unchanged suite, `--no-build --headless` with a driver supplied through `UX_KIT`, gave 34 of 40 and then 38 of 40 (4.88). The four that moved read fixtures another gate writes and git does not track. N was supposed to be chosen before running, which is the specification's requirement and was not possible while nothing had run once; two is what the observation supports, not a ceiling anybody liked. A separate 2 of 40 are red on every run and are not flakes |
| A18 | Time to first visible translation, cold profile | **ceiling one second; measured p50 278 ms** | Set, and measured on a profile that has never run the extension (4.95). `cold-start.mjs` loads the built extension into a fresh persistent profile, serves kick.com and the engine locally, and times from navigation to the translated text being in the DOM: 5 of 5 runs, **min 269, p50 278, max 300 ms**. The control is a second message on the same page, **p50 47 ms**, so the cold premium is **231 ms** and that is extension load, content script, observer attach and the MV3 worker booting. **The control replicates a figure taken by a different instrument**: `metrics-offline.mjs` reads the product's own counters and reports `e2e.cloud` p50 44 ms, against 47 here, and 40 of those milliseconds are `MIN_BATCH_WINDOW_MS`, a deliberate wait. The ceiling is one second because A18's population is a reader who installs and sees nothing happen; the engine here is local, so a real provider round trip is added to both figures |
| A21 | Requests per unit of time under refusal, and the escalation | **6 a minute per provider, 24 a minute across four** | **Derived, not measured**, and labelled so. The `rate_limit` ladder in `translator/index.ts` is `min(10_000, 1500 * 2 ** (cf - 1))`, which settles at one attempt per 10 s per provider, and the candidate list skips providers still cooling, so four providers bound the total at 24 a minute. This is what the code permits, not what was observed; the counters that would observe it were read for the first time in 4.61 and were empty because the fixture engine never refuses |

**8 of the 8 rows carry a number.** That sentence is read by
`axis-ledger.mjs`, which recounts the table and exits 1 if the two disagree,
because this line said *two of seven* for one pass after A21's row was filled in
and four documents copied it (4.80). The rows are eight for seven bars: A6
states two thresholds, a weight ceiling and a per-row main-thread cost, and both
are set now.

**The file is full.** It opened at two of eight and closed at eight of eight,
and what filled it was not measurement capacity. Five of the six empty rows
named an instrument that did not exist, and one named a live harness nobody here
was going to run. Writing the instrument was the work in every case:
`compose-calls.mjs` for A3, `row-cost.mjs` for A6's second half,
`cold-start.mjs` for A18, `worker-eviction.mjs` for A5. A13 needed nothing new
at all, only running the suite twice and reading both answers.

**Two of the eight thresholds are judgements and say so in their own rows**,
A18's one second and A5's 250 ms. Two need no taste at all: A6's 60 Hz frame and
A6's byte reference, which the product already enforced. A21's is derived from
the code and labelled *derived, not measured*. A11's is a measurement standing
in for a tolerance. That distinction matters more than the numbers, because a
ceiling resting on a judgement can be argued with and a reader should not have
to open the method log to find out which ones those are.

The aggregate that used to stand here, *five of the six need an instrument that
is already in the repository*, was removed rather than re-counted. The passes
since say why it was wrong in both directions: the instruments were not in the
repository, and four of them had to be written.

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
