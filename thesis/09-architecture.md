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
displays message *n+40* once *n* has scrolled away. Translation is
asynchronous. A request issued against a node can therefore return after that
node has been reassigned to a different message.

The result is a correct translation attached to the wrong line. Every counter
reports success: a request was made, an answer returned, a node was updated.

This is an instance of a general hazard: **asynchronous work holding a
reference to a mutable identity**. The node is identity; the message is
content; the code assumes the binding between them is stable for the duration
of a network round trip, and the host page guarantees no such thing.

The remedy is to key the response to content rather than to position, and to
verify the binding at the moment of attachment rather than at the moment of
request. The corpus shows the project holds a dedicated gate for row recycling,
which is the correct disposition: this class cannot be caught by unit tests,
because it requires the host's recycling behaviour to be in play.

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

## 9.6 The fallback chain, and what a witness proved

The system tries engines in order, so that a reader is not stranded when the
first one refuses or rate-limits.

**[reported]** Truncating the chain to a single engine left the full unit-test
suite green and turned exactly one probe red.

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
