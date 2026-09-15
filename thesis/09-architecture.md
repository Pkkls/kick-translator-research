# 09. Architecture

> Three defects in this corpus share a shape: a translation that is correct
> arrives at the wrong place. None of them is visible to a counter, because
> every counter reports success. They are the architectural analogue of the
> confident-wrong-answer failures in Part II.

---

## 9.1 The path of one line

A message appears in the chat DOM. An observer notices it, extracts its text,
and the pipeline decides whether it is language at all
([chapter 8](08-noise.md)), whether it is long enough
([chapter 7](07-brevity.md)), and what language it is in
([chapters 4 to 6](04-script-vs-language.md)). If it survives, the request goes
to a background worker, which consults caches, groups the request with others,
and sends it to the first engine in a fallback chain. The answer returns, and
is attached under the message it belongs to.

Every stage is a place where a correct translation can be produced and still
land wrong.

## 9.2 Grouping by one key and inheriting the rest

**[reported]** The coalescer groups requests by target language and nothing
else. The batch call built its joined request as a spread of the first request
with the joined text substituted. A request went out declaring `sl=ja` while
carrying a Japanese line and an Arabic one, in a file whose own comment
explains that a wrong source language makes the engine translate from the wrong
language.

The general form of this error is precise, and naming it precisely is what
makes it findable elsewhere:

> When records are grouped by a key and the group's non-key fields are taken
> from an arbitrary member, the result is correct only for fields that are
> **functionally dependent on the grouping key**. Every other field must be
> either aggregated explicitly or dropped.

Target language is the grouping key. Source language is not a function of it:
two lines with the same target can have different sources. Inheriting it from
the first member is therefore unsound in exactly the cases the batching exists
to create.

The fix the project adopted is the correct one under this analysis:
disagreeing hints declare nothing. That is the aggregation rule for a field
with no functional dependency on the key, and it degrades to the safe default
of engine auto-detection rather than to a guess.

Note the interaction with Part II. Everything the linguistic work in
[chapters 4 to 6](04-script-vs-language.md) achieves is a better source
language. The batching layer could discard all of it silently, and for a while
did. **A pipeline's accuracy is bounded by its least careful stage**, and the
careful stages give no warning when a later one overwrites their work.

## 9.3 The recycled row

A virtualised chat list reuses DOM nodes: a node that displayed message *n*
displays message *n+40* once *n* has scrolled away.

**The defect the corpus actually measured is simpler and worse than the one
this chapter first described.** An earlier version of this section reasoned
about an asynchronous answer landing on a row that had been reassigned, which
is a real hazard and is not what happened. What happened **[reported]**:

The scroller reuses a row by **replacing its contents**. The row is therefore
the mutation *target* and never an added node. The observer collected
candidates from added nodes and their descendants only. Measured: **eight
recycled rows, no translation, no reason on the line, no provider call.**

Not a translation on the wrong row. No translation at all, and no trace that
one was ever due.

**The comment above that loop is the part to keep.** It states that the
recycling case is covered by watching childList with subtree, and the project's
verdict on its own comment is exact:

> which is true of the events and false of the handling.

The subscription did receive the mutations. The handler discarded them, because
it looked for candidates in the wrong place within an event it was correctly
given. A comment that describes the subscription and is read as describing the
behaviour is a specific and under-named failure: **both halves are true
statements about different things, so nothing in review catches it.**

The fix walks up from the mutation target to the enclosing row. Re-processing a
row whose text has not changed costs nothing, because processing returns early
on the identifier the row already carries, which is also what stops the
extension's own insertions from looping.

**Two witnesses, and the second exposed a hole under 620 tests.** The gate goes
from 9 of 9 to 1 of 9 with the walk removed. And a unit test now fails without
it, which required the test double to **stop discarding the MutationObserver
callback it was handed**: until then no test could deliver a mutation, so
nothing in 620 tests could reach that branch at all.

That is a test double silently defining a whole branch as unreachable. The unit
suite was not weak on this behaviour; it was structurally incapable of
addressing it, and nothing said so.

**And the gate's own assertion needed hardening.** It failed only at zero, so it
passed on one translation for nine rows, which is precisely the failure it
exists to catch. A threshold assertion set at the degenerate case rather than at
the expected value is a gate that only catches total absence.

## 9.4 The cache key

A cache key that omits a dimension on which the answer depends returns a
correct translation of the wrong pair. Target language, source language,
provider and any quality setting all change the answer.

This is the same functional-dependency error as 9.2, seen from the other side:
there, fields not determined by the key were inherited; here, fields that
determine the value are absent from the key. Both are failures to state what
the value is a function of.

The audit specification derived from this study asks for a collision test
rather than an inspection of the key: request the same text under each varying
dimension in turn, and assert the answers differ. Reading a key structure
proves nothing, because the defect is an omission, and omissions are invisible
in the artefact that contains them.

## 9.5 The ephemeral worker

The extension's background worker is terminated whenever the platform decides
it is idle. Two consequences shape the architecture, and the corpus records a
commit for each.

**Nothing may live only in worker memory.** State held there is a cache, not a
store, and must be reconstructible.

**Writes must merge, not overwrite.** This is the subtler of the two. A worker
that wakes, reads state, modifies it and writes it back is performing a
read-modify-write across an interval in which it may have been dead and other
surfaces may have written. Overwriting discards their work. The corpus contains
the specific instance: metrics collected in the worker had to survive a restart
by merging with what storage already held, because every interval would
otherwise re-add the same counts and inflate them geometrically **[reported]**.

The general statement is that an ephemeral process sharing a store with live
surfaces cannot use last-writer-wins for accumulating state. It needs an
operation that is associative and commutative over the writers, which for
counters means merging by addition rather than by assignment. This is the
minimal case of the convergence property that replicated data types are built
around, arrived at by necessity rather than by design.

The corpus also records the startup race in the other direction: a content
script that begins before the worker has settings. Both directions of the same
lifecycle asymmetry, each needing its own fix.

**And a third consumer that received neither fix [new].** The worker starts its
initialisation without awaiting it and registers the message listener on the
next statement, so a message can reach the usage-statistics tracker while its
load is still in flight. That tracker overwrites stored state rather than
merging into it, unlike the metrics module beside it, which merges and explains
why in a comment.

The severity is low and the window is narrow, two storage reads against a
1500 ms flush timer. The interest is structural: **the same lifecycle hazard
was diagnosed and fixed twice in this codebase, and the third consumer of the
same lifecycle was not revisited.** It is the architectural instance of the
generality failure that [chapter 4](04-script-vs-language.md#45-the-finding-about-findings)
describes on writing systems, and it supports the claim there that the pattern
is a property of how fixes are applied rather than of any one subject matter.

## 9.6 The fallback chain, and what a witness proved

The system tries engines in order, so that a reader is not stranded when the
first one refuses or rate-limits.

**[reported]** Truncating the chain to a single engine left the full unit-test
suite green and turned exactly one probe red.

**A unit test did exist, and it is the interesting part.** Removing the chain
from the default settings is caught, but that test asserts a constant: it says
the list has three entries, not that the second is ever reached
**[reported]**. So the suite guards the shape of the configuration and says
nothing about its effect, which is the same distinction as a comment that is
true of the events and false of the handling. **A test over a constant is a
test of the declaration, not of the behaviour it declares.**

**And the probe needed the right interception layer to see anything at all.**
Its first version routed at the page level and measured nothing, because under
this extension runtime the translation requests leave from the background
worker rather than from the page. Routing at the browser-context level sees
them. That was found by noticing the gate reported the engine called once, not
by reasoning about it: **an interception that is attached at the wrong layer
reports zero traffic, which looks exactly like a product that made no
requests.**

This is the clearest available demonstration of the witness rule from
[chapter 3](03-method.md#every-correction-leaves-a-witness). The chain is a
resilience property: it has no effect on any output until something fails.
Tests that assert outputs under nominal conditions therefore cannot see it.
Only a probe that removes the redundancy and observes the consequence can.

The generalisation is that **redundancy is invisible to tests of the nominal
path by construction**, so every redundant mechanism needs a test that removes
it. A fallback nobody has ever seen fall back is a fallback nobody knows works.

## 9.7 Coverage gaps that were not what they looked like

**[reported]** Malay and Hebrew were never identified, two of the forty-two
offered languages, and the product listing sells Hebrew in its right-to-left
claim.

The causes are independent and both mundane: the identifier emits `zlm` for
Malay and the mapping table knew only `msa` and `zsm`; Hebrew is absent from
the minified identifier data *and* was the one unambiguous script missing from
the script pre-check.

The valuable part is the correction of the framing, which the notebooks credit
to a probe rather than to reasoning: *an unidentified language is not dropped,
it goes out with `sl=auto`, so those messages were translated all along. What
the fix buys is a correct source declared to the engine and a correct badge
shown to the reader.*

The first framing, that two languages were broken, was wrong in a specific and
instructive way. It assumed the failure of a component implied the failure of
the feature, without tracing what the component's output actually controls.
This is the same error as the arabizi grid
([chapter 5](05-transliteration.md#53-the-damage-that-the-evaluation-grid-could-not-see))
and the keyboard-smash prior ([chapter 8](08-noise.md#the-prior-claim-and-its-correction)),
appearing for the third time in this corpus on a different subject.

Three independent instances of the same reasoning error, each caught by
measurement, is enough to state it as a property of the domain rather than as
an individual lapse:

> In a pipeline with defaults and fallbacks, the failure of a stage does not
> imply a user-visible failure, and the severity of a defect cannot be inferred
> from where it sits. It has to be traced to an output.

## 9.8 What this chapter licenses

1. Grouping must preserve only fields functionally dependent on the grouping
   key; everything else is aggregated explicitly or dropped.
2. Cache keys must contain every dimension the value depends on, and the check
   is a collision test, not an inspection.
3. Asynchronous work must re-verify the identity it is writing to, because the
   host page may have reassigned it.
4. An ephemeral worker sharing a store must merge rather than overwrite, which
   for counters means addition.
5. Every redundant mechanism needs a test that removes the redundancy.
6. Defect severity is established at the output, not at the failing component.

---

*Sources: daily journal of 2026-08-31, "Three defects the numbers exposed";
`HANDOFF.md` sections 1 and 6; work queue. Analyses of functional dependency,
mutable-identity races and merge semantics are this study's **[new]**.*
