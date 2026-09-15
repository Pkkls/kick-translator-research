# 01. Introduction

## 1.1 The problem

Translating live-stream chat in real time is a problem that sits badly between
two fields.

To natural language processing it looks solved: translation engines are good,
language identification is a commodity, and the texts are short. To software
engineering it looks like an integration exercise: read the DOM, call an API,
render the result.

Neither view survives contact with the input. The texts are short enough to
fall below the evidence floor of any statistical identifier. They are written
in scripts that do not identify their languages, in languages typed on the
wrong keyboards, interleaved with non-linguistic strings that occupy the same
positions as words. And the correct answer has to arrive within the few hundred
milliseconds before the message scrolls away, from inside a browser extension
runtime that terminates its own background process, attached to a DOM node the
page may have reassigned to a different message while the request was in
flight.

The interesting failures are not in either half. They are at the seam. A
carefully derived source language is discarded by a batching layer that groups
by target and inherits the rest from the first member. A correct translation is
attached to a recycled row and rendered under the wrong message. A guard
against wrongly-identified language works on one rendering surface and not on
the two others. None of these is a linguistic problem, and none is an
engineering problem; each requires both halves to see.

## 1.2 Why this case

The system studied here is a browser extension that translates the chat of a
streaming platform in both directions, published on two extension stores, with
a real installed user base.

Its value as a research object is not its novelty. It is that it kept its
notebooks. Three months of development left:

- a work queue in which every closed item states what was measured and what the
  number was, including the experiments that failed and the ideas rejected with
  their measurements;
- two long daily journals recording the reasoning as it happened, including
  probes that turned out to be wrong;
- a changelog whose entries carry the measurement behind them;
- sixteen tagged releases over three months;
- a standing methodology document that states the rules the work was done
  under, and why each was adopted.

Software of this size rarely leaves anything comparable. What is normally
reconstructed by inference from diffs is here available as a primary record,
including the negative results, which are the part that inference can never
recover.

## 1.3 What this study does

Four things.

**Reorganises.** The notebooks are chronological and were written to be acted
on, not read. The experiments that bear on one question are spread across
months. This study groups them by question, which makes visible several
patterns that no single entry contains, most importantly the repeated
rediscovery of the same general defect on different material
([ch. 4](04-script-vs-language.md#45-the-finding-about-findings),
[ch. 8](08-noise.md#84-two-opposite-strategies-for-one-problem),
[ch. 11](11-privacy-surface.md#why-it-recurs)).

**Analyses.** The notebooks record what was measured and what was fixed. They
rarely say why a mechanism works, because they did not need to. This study
supplies the analysis: why a keyboard topology beats phonotactics on smash, why
Bulgarian's privative evidence behaves differently from Mongolian's positive
evidence, why grouping inherited the wrong field, why a hand-written marker list
overfits exactly as a model does.

**Replicates where possible.** Several measurements were re-run against the
repository for this study, and a small number of new ones were taken to close
questions the notebooks raise but leave open. These are tagged **[replicated]**
and **[new]**.

**Derives.** The corpus supports a general audit specification, given in
[appendix A](../appendix/A-audit-prompt.md), which was then executed and found
to contain three unsatisfiable or uncheckable requirements
([ch. 3](03-method.md#36-method-applied-to-method-what-execution-falsified)).
That result is itself part of the study's findings.

## 1.4 What this study does not do

It does not evaluate translation quality. The system delegates translation to
external engines, and their output quality is out of scope except where the
system's own choices determine it, as with the source language declared to the
engine and the transliteration behaviour on short input
([ch. 7](07-brevity.md#74-below-the-floor-the-short-expression-table)).

It does not measure real traffic. No live chat capture exists in the corpus,
which is the binding limitation on everything here and is stated at the outset
in [chapter 2](02-object.md#25-the-corpus-problem-stated-at-the-outset) and
developed in [chapter 14](14-limits.md).

It does not claim generality beyond its single case. Where a finding is
proposed as general, it is proposed with its reasoning exposed, so the reader
can judge the transfer.

It does not claim the engineering. The development and the original
measurements were carried out by a different account; see
[Provenance](../README.md#provenance-stated-once-and-honestly).

## 1.5 Contributions

1. **A typology of written laughter across three semiotic mechanisms**, with
   the observation that the three decay differently under borrowing, and the
   demonstration that laughter identifies a language at five characters where
   statistical identification cannot ([ch. 6](06-laughter.md)).
2. **The motivation argument for transliteration detection**: arabizi and Latin
   SMS use the same inventory with opposite motivations, shape against sound,
   and are separable to zero false positives on that basis
   ([ch. 5](05-transliteration.md#52-arabizi-the-motivation-of-the-sign)).
3. **The distinction between positive and privative orthographic evidence**,
   and the consequence that privative evidence requires a length threshold and
   degrades toward the prior ([ch. 4](04-script-vs-language.md#43-positive-and-privative-distinctions)).
4. **A documented instance of overfitting in hand-written rules**, 20 of 20
   fitted against 4 of 12 held out, with the argument that a marker list is a
   model and a bench is a training set ([ch. 3](03-method.md#33-the-bench-that-measured-itself)).
5. **The generality-gap finding**: a correct general diagnosis applied locally
   recurs on new material, observed three times in this corpus on unrelated
   subjects, with a measurement rule that catches it
   ([ch. 4](04-script-vs-language.md#45-the-finding-about-findings)).
6. **An audit specification derived from the corpus**, together with the
   finding that sixteen review passes could not falsify three of its
   requirements and one execution pass falsified all three
   ([appendix A](../appendix/A-audit-prompt.md),
   [appendix B](../appendix/B-prompt-construction.md)).

## 1.6 Structure

[Part I](02-object.md) establishes the object and the method. [Part
II](04-script-vs-language.md) treats the linguistic constraints, one chapter
per class of failure. [Part III](09-architecture.md) treats the architectural
constraints. [Part IV](12-verification.md) covers verification, consolidates
the results, and states the limits.
