# 12. Verification

> A probe that existed and was in no runner reported a panel four pixels off
> the left edge of the window, correctly, for as long as nobody ran it. An
> instrument that exists and is never launched is worse than one that does not
> exist, because its presence reads as coverage.

---

## 12.1 The layers

The system's verification is stratified, and the strata differ in what they can
possibly see:

| Layer | Sees | Cannot see |
|---|---|---|
| Type checking | contract violations | everything about behaviour |
| Unit tests | pure logic: detection, filters, tables | anything involving a browser, a build, or a page |
| Offline probes | the built artefact in a real browser against a synthetic page | anything requiring the live host site |
| Live probes | the real site, launched by hand | nothing repeatable; they are not in any runner |
| Store validation | packaging and policy | the product |

**[reported]** End state of the last recorded pass: 39 of 39 offline gates
green in headless mode, type checking and linting clean, 1034 unit tests, and
continuous integration green on two consecutive runs after 48 consecutive red
ones.

That last figure deserves a moment. A pipeline red for 48 runs is a pipeline
nobody is reading, and the corpus records the defect it was reporting as real.
A signal ignored long enough stops being a signal, which is a property of the
humans and not of the tooling.

## 12.2 What the probes caught that tests could not

Three instances from the corpus, each of a different class:

**A resilience property.** Truncating the engine fallback chain to a single
engine left every unit test green and turned one probe red **[reported]**.
Redundancy has no observable effect until something fails, so nominal-path
tests are structurally blind to it.

**The product's core function.** The corpus records that nothing offline
verified the one thing the product does, a message arriving and its translation
appearing beneath it, until a probe was written for it **[reported]**. The unit
tests mounted components by hand and never touched the manifest or the path by
which the browser injects the script.

**A layout defect in a probe nobody ran.** The panel-placement probe asserted
correctly and sat outside the runner list, so its true finding went unread
**[reported]**.

## 12.3 The rules that make a green meaningful

The project's standing instructions contain operational rules about reading
results, each of which encodes a specific way a suite has lied:

- **Read the exit code or the structured reporter, never the tee**, which
  rewrites test summaries.
- **Never pipe a gate into a pager or a tail**, and never chain one behind an
  unconditional success echo. The corpus states this is how a script that threw
  an exception once reported green.
- **A probe that measured nothing must fail.** Its canonical example: a pass
  over an English chat translated to English reports zero translations and zero
  errors, which is indistinguishable from success.
- **Do not remove a gate you have not understood.** Retarget it: what it
  guarded has to end up asserted somewhere before the old assertion goes.

The first two are about the transport of a result, which is an underappreciated
failure surface: a correct verdict can be destroyed on its way to the reader by
a shell construct.

## 12.4 The negative control

The instrumentation-stripping check is the corpus's best-designed gate, and it
is worth describing because the design is generalisable.

The build can produce two kinds of bundle: an instrumented one and a release
one. The check asserts that a marker is **absent** from the release bundle. On
its own that assertion is weak: it passes if the marker is absent for the wrong
reason, for instance if the check is looking in the wrong place or the marker
string changed.

So the check also asserts the converse. On an instrumented build the marker
must be **present**, in a named file, and the failure message calls this a
control failure **[replicated]**.

This is a negative control in the experimental sense: an arm of the experiment
whose purpose is to fail, so that the informative arm's success means something.
Very little software testing carries one, and the general form is worth stating:

> An assertion of absence needs a paired assertion of presence under conditions
> where the thing should be there. Without it, the absence check cannot
> distinguish "correctly removed" from "never looked in the right place".

## 12.5 The gate that accused a healthy field

**[reported]** The store-listing gate counts 44 fields against their limits in
UTF-16 code units, which is what the web forms count, plus the ten shipped
descriptions read from the locale files.

Its first version accused a healthy field: it counted the explanatory prose
around a manifest value and reported 376 characters for a value of 90.

This belongs beside the false accusations listed in
[chapter 3](03-method.md#verify-the-failure-is-in-the-product-before-correcting-it).
The pattern across all of them is that the probe measured a superset of its
subject. A gate's extraction step is as much a part of its correctness as its
assertion, and it is the part that is never tested.

## 12.6 The fresh clone

**[reported]** The harness directory is ignored by version control. A fresh
clone therefore has no probes, no gates and no audits; only the type check,
the linter, the unit tests and the build survive.

The project's own instruction on this is the right one: say so plainly rather
than reporting green on a suite that was never present.

The general statement:

> The verification a project actually offers is what a clone can run, not what
> the authoring machine can run. Everything else is a private assurance, and a
> newcomer who runs the documented commands and sees green has been told
> something false.

This is the one axis of the derived specification
([appendix A](../appendix/A-audit-prompt.md)) whose measurement is a clone into
an empty directory, because no amount of reading can substitute for it.

## 12.7 Orphans, and the count that indicts too much

**[replicated]** 56 harness files on disk, 40 entries in the gate runner, 35
files that no runner launches.

That raw number overstates the problem, and this study published it before
qualifying it, which is the error the corpus's own method warns against. The
exclusions are documented and principled:

- live probes open a real session and are launched by hand;
- three shooters draw images for a human and assert nothing, so running them
  would buy runtime and no verdict;
- the runner itself is in the directory.

The useful measurement is therefore **orphans with no written reason**, and
producing it requires reading each exclusion rather than counting files. The
general rule this study adopted afterwards:

> When a population contains documented exceptions, report the
> exception-adjusted count, and report the raw count beside it so nobody has to
> trust your filter. A single number that silently mixes the two is an
> argument, not a measurement.

## 12.8 The derived specification

[Appendix A](../appendix/A-audit-prompt.md) contains an audit specification
built from this corpus: twenty-one axes, each with what breaks, what to
measure, the number that closes it, and what to break to prove the number can
go red.

Its design commitments all come from findings in this study:

| Commitment | Comes from |
|---|---|
| Every bar is a number written before the measurement, in a tracked file | [ch. 3](03-method.md#33-the-bench-that-measured-itself), fitting versus performance |
| Every axis carries a witness, an action rather than a conditional | [ch. 9](09-architecture.md#96-the-fallback-chain-and-what-a-witness-proved) |
| A guard is measured as a fraction of the surfaces that need it | [ch. 4](04-script-vs-language.md#45-the-finding-about-findings), [ch. 11](11-privacy-surface.md#why-it-recurs) |
| Severity is established at the output, not at the failing component | [ch. 9](09-architecture.md#97-coverage-gaps-that-were-not-what-they-looked-like) |
| Counts with documented exceptions report both numbers | 12.7, above |
| Priority is population times silence, on explicit scales | the silent-drop failure class throughout Part II |
| A closed axis costs a ledger line with a command and an exit code | this chapter, sections 12.3 and 12.6 |

And its own execution produced the finding in
[13.8](13-results.md#138-the-three-bars-execution-falsified): three
requirements that sixteen review passes could not falsify, and one execution
pass did.
