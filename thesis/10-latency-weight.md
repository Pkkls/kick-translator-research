# 10. Latency and weight

> The on-device engine is reported at 22 ms against the cloud's 1618 ms, a
> factor of seventy-three. The comparison is not valid as stated, and the
> corpus contains the reason: the two samples differ on the variable being
> measured. The finding survives anyway, and this chapter explains why.

---

## 10.1 The latency budget is set by the medium

A chat scrolls. A translation that arrives after the reader has scrolled past
its message is not a late translation, it is a missing one attached to
something no longer on screen. The budget is therefore not a preference; it is
fixed by the reading behaviour of the medium, and it is short.

This makes latency a **correctness** property rather than a performance
property in this system, which changes how it must be measured. A p50 that
meets the budget while a p95 misses it does not mean the product is mostly
fast. It means one line in twenty is a line the reader never reads.

## 10.2 The reported measurement

**[reported]** Both series from one live session, message appearing to
translation painted:

| Path | n | min | p50 | p95 |
|---|---|---|---|---|
| on-device | 8 | 6 ms | **22 ms** | 210 ms |
| cloud | 200 | 353 ms | **1618 ms** | 2134 ms |

The conclusion the project drew, that the local-first default is the difference
between a translation appearing with the message and one arriving after the
reader has scrolled past, is correct and well supported at the order-of-
magnitude level.

## 10.3 Why the comparison is not valid as stated [new]

Three problems, in increasing order of severity. The first two are visible in
the table itself; the third is stated elsewhere in the corpus and not connected
to the table.

### The sample sizes are not comparable

n=8 against n=200. A p95 computed on eight samples is not a 95th percentile in
any useful sense; with eight points, the 95th percentile is essentially the
maximum, and one slow sample moves it arbitrarily. The reported local p95 of
210 ms should be read as "the slowest of eight", which is a different and much
weaker statement.

The local p50 at n=8 is more robust than its p95 but still has wide
uncertainty. The cloud figures at n=200 are comparatively solid.

### The dispersion differs by an order of magnitude

Local ranges from 6 ms to 210 ms, a factor of 35 across eight samples. Cloud
ranges from 353 ms to 2134 ms, a factor of 6 across two hundred. The local path
is far more variable relative to its centre, which is consistent with a
mechanism whose cost depends on state the measurement does not record, such as
model residency or scheduling.

Comparing p50s across two distributions of such different shape understates how
often the local path is slow.

### The populations differ on the measured variable

This is the one that matters. **[reported]** The corpus records, in a different
section from the table, that only downloaded language pairs are served by the
on-device API, and gives the state measured on a Japanese channel with a French
target:

```
ja>fr : downloadable      es>fr : downloadable
en>fr : available         ko>fr : downloadable
```

Only `en>fr` had its model present. The notebooks then say that the local
series "stopped at 8 samples, all from the English li...", that is, all from
English-source lines.

So the two rows of the table are not two measurements of the same population
under different conditions. The local row is **English to French only**. The
cloud row is every language pair that occurred in the session. English to
French is plausibly the best-resourced pair in the entire system, on both
paths.

A sound comparison requires the cloud series restricted to `en>fr`, and that
number is not in the corpus. Without it the reported ratio confounds *engine*
with *language pair*.

### Why the finding survives

Two reasons, and both are worth stating because the conclusion is right even
though the comparison is not.

First, the **mechanism** makes a large difference inescapable. The local path
performs no network request. The cloud path's minimum, 353 ms, is a floor set
by a round trip and cannot be reduced by any language pair being easy. Even if
the entire local advantage on `en>fr` were removed, the paths differ by a
network round trip that the medium's budget cannot absorb.

Second, the **decision the number feeds is robust to the error**. The number is
used to choose the default engine order. Local-first remains correct under any
plausible correction to the comparison, because the alternative ordering
spends a round trip before discovering it did not need one.

This is the reverse of the arabizi evaluation error in
[chapter 5](05-transliteration.md#53-the-damage-that-the-evaluation-grid-could-not-see),
where a technically sensitive metric fed no decision. Here a technically
unsound metric feeds a decision that is insensitive to its unsoundness. Both
cases argue for the same discipline: **trace the number to the decision, and
size the rigour to what the decision can absorb.**

## 10.4 The gate on availability

**[reported]** The on-device API is absent on one Chrome 151 and present on
another Chrome 151 on the same machine. Flag, profile, hardware gating or
policy: unresolved.

For the product this is a distribution question, not a performance one. The
fastest path is available to an unknown fraction of users, and the fraction
cannot be estimated from the corpus. The default engine order is correct
regardless, since the fallback chain handles absence, but the *user-visible
performance distribution* is therefore bimodal in a way no single latency
figure represents.

This is recorded in [15](15-future.md) as the highest-value open measurement in
the engineering half of the study, because it is the only quantity that
converts a known 70x mechanism advantage into a statement about actual users.

## 10.5 Cache: a number that cannot be read from one session

**[reported]** Measured over one 29-minute session: the in-tab cache hit 6.7
percent, the persistent cache 1.0 percent, 8 hits in 821 lookups.

The notebooks' disposition is the interesting part: *a persistent cache earns
its keep across sessions, which one session cannot measure, and it costs 0 ms
to read. Do not delete it on that number alone.*

This is a correct reading of a measurement whose design cannot answer the
question asked of it. A persistent cache exists to exploit **inter-session**
locality. Measuring it within a single session measures only the fraction of
intra-session hits that the in-tab cache did not already absorb, which is by
construction a residue.

The asymmetric cost structure is what licenses keeping it: a read costs
approximately nothing, so the expected value is non-negative for any hit rate
above zero, and the only real cost is storage and code. A decision rule that
requires a positive measured hit rate before keeping a zero-cost mechanism
would discard it on evidence that was never capable of supporting the
conclusion.

## 10.6 Weight, and prose that ships

The system's injected script is budgeted: a gate compares against the previous
release with a two percent margin **[reported]**.

Two findings in the corpus are worth preserving.

### The `note` field travels

**[reported]** Writing reasoning into the `note` fields of two table entries
moved the weight from +0.35 to +0.68 percent against the reference: 770 bytes
for two comments.

The cause is a category error that static analysis will not catch: `note` is a
string field of a shipped object, not a comment. It survives minification and
is delivered on every page load.

The follow-up question, which the notebooks credit as the one nobody had asked,
produced the real number: **42 of the table's 45 notes are in the injected
script, 1754 bytes, 0.85 percent of it**, roughly half of what the whole table
was measured to cost. Nothing reads `note` at runtime; its only reader is the
test that requires every entry to carry one.

The disposition is exactly right and worth generalising: the rule that makes
provenance mandatory is what gives the lexicon its scientific value
([chapter 6](06-laughter.md#64-the-absence-of-prior-art-verified)), so the
bytes are recoverable by **stripping the field at build time**, not by
abandoning the discipline. Documentation that must exist and must not ship is a
build problem, not an editorial one.

### Accuracy has a price list

The corpus prices its linguistic features, which is rare and useful:

| Feature | Bytes | Share of injected script |
|---|---|---|
| Laughter lexicon | 3791 isolated, 3555 marginal | 1.55 % |
| Keyboard-smash filter | 424 | |
| Arabizi | 227 | |
| Romanisation markers | 617 | 0.26 % |

**Two numbers for one table, and the difference is the lesson.** The corpus
gives the laughter lexicon as 3555 bytes in the entry that introduces it and
3791 in the entry that accounts for a weight-gate failure. Both are correct and
they measure different things: 3791 is the module minified in isolation, 3555
is what it adds to the page once the bundler has done its work on the whole.
This study first transcribed both, in different chapters, without noticing they
disagreed **[new]**.

The practical point for anyone pricing a feature: **a module's isolated size
and its marginal cost to a bundle are different quantities**, and the gap here
is 236 bytes, or 6 percent of the smaller figure. Say which one a price list
reports, because a reader comparing a feature's cost against a budget needs the
marginal number and a reader deciding whether to vendor a dependency needs the
isolated one.

And it prices the alternative: the statistical identifier's data is 98 KB in
the bundle, against a lighter competitor at 68 KB. **[reported]** Thirty
kilobytes, thirteen percent of the bundle, ride on an accuracy comparison,
which the project ran rather than assumed. Its result is in
[13. Results](13-results.md#the-identifier-duel): the lighter library wins on
global accuracy and loses decisively on the number that was declared decisive
in advance, non-English messages classified as English and therefore dropped in
silence.

That experiment is a model of how to make a size-accuracy trade. The metric was
fixed **before** the experiment, it was chosen because it maps to the failure
that costs a reader a message rather than to aggregate accuracy, and the
verdict went against the option that won on the aggregate.

**[reported]** End-state of the last recorded pass: injected script at +0.15
percent against the previous release reference, with all the above included.

## 10.7 What this chapter licenses

1. In a scrolling medium, latency is a correctness property and belongs at the
   tail, not the median.
2. The 70x engine advantage is sound as a mechanism claim and unsound as the
   stated measurement, because the two samples differ on language pair; the
   decision it feeds is insensitive to the difference.
3. A p95 on eight samples is a maximum. Report n beside every percentile.
4. A cache that exploits inter-session locality cannot be evaluated within one
   session, and a zero-cost mechanism should not be deleted on a measurement
   that could not have supported keeping it.
5. Any string field of a shipped object is shipped prose. Provenance
   discipline and byte budgets are reconciled at build time.
6. A size-accuracy trade must fix its decisive metric before the experiment,
   and that metric should be the failure that costs the user most, not
   aggregate accuracy.

---

*Sources: `HANDOFF.md` section 3; daily journal of 2026-08-31; work queue
entries on weight and on the identifier comparison. Analysis in 10.3 is this
study's **[new]**.*
