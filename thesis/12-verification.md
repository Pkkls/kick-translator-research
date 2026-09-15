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

The same reasoning applies one level down, to the witness itself. **[reported]**
The corpus records a witness for a weight gate that broke nothing: the prose it
was meant to pull into the bundle was referenced through a constant key, the
bundler folded the access, and the gate stayed green while 39 bytes moved. The
witness was valid as an action and void as evidence.

> A witness must be shown to have changed the artefact the assertion reads.
> Otherwise a green gate is reporting on a change that never arrived.

That is the negative control applied to the control: the paired assertion for a
witness is a check that the break is visible in the built output.

## 12.4b Flakiness filed as weather

**[reported]** The work queue once carried the item "the live gates are not
deterministic", with the channel, the chat volume and the network named as
suspects. The project's later verdict on its own framing is worth quoting
because of how it is phrased:

> That framing was mine and it was wrong in the most useful way: it turned
> three separate defects into one property nobody can fix.

The three: one probe setting a value and dispatching a change event on a
control that had stopped being a `<select>` when a shared panel replaced it, so
both lines did nothing and the translation count that followed was counting
whatever the default target produced; one null crash in another of the author's
own probes; and one genuinely unexplained run.

**The mechanism of the first is the general hazard.** A probe that cannot
perform the action it tests will still run, still produce a number, and that
number will vary with whatever the default happens to do. Here it came out
above zero when the browsing endpoint served a channel in a language differing
from the browser default, and zero when it did not, which reads exactly like
environmental noise.

The repair is a read-back: drive the real control, then read the control's own
label before counting anything. **Zero after a target that never moved and zero
after a broken pipeline are the same number, and only the label separates
them.**

The disposition is the part worth transferring:

> Filing weather is easier than reading three stack traces, and it costs the
> next reader the chance to fix anything.

An environmental attribution is a terminal diagnosis: it explains the
observation, requires no further work, and forecloses the investigation. It
should therefore be the most expensive conclusion to reach, not the cheapest,
and reaching it honestly means accounting for each varying run individually.

## 12.4c The probe that must act from the site's own world

**[reported]** Changing channel on this platform is an app navigation: the URL
moves, the chat is remounted, the page never reloads. If the extension fails to
rebind, every message after that is left alone, with no error and no reason on
any line, which is this product's worst failure shape.

One detail decided how to simulate it, and it generalises past this case. The
content script patches the history API to notice the change. But a content
script runs in an **isolated world**, and the site's router calls the **main
world's** function, where that patch does not exist. A probe that navigated
from the isolated world would be triggering the one path the patch can see.

So the harness navigates from the main world, as the site does.

> A probe must trigger an event from the world the event really comes from, not
> from wherever the code under test is best able to observe it. The second
> choice produces a green that describes the probe rather than the product.

The outcome was negative and the project records it as worth the same as a
positive: the container watcher notices its container left the document,
rescans, and the message posted after the remount is translated. The gate then
earns its place on what it alone can see, since disabling the rescan leaves 621
of 621 unit tests green and turns only this gate red.

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

## 12.6 The fresh clone, and a claim that had rotted

This section said something false in an earlier version of this study, taken
from the project's standing frame without being checked. The correction is
kept because the defect it exposes belongs to the project, not only to this
study.

**What the frame says.** Its gates section states that the harness directory is
ignored by version control, so *"a fresh clone has no gates, no harnesses and
no audits at all"*, and directs the reader to the first open item in the plan,
*"which is this problem"*.

**What is true [replicated].** Cloned from the public repository at the same
commit the frame ships at:

| | |
|---|---|
| Harness files in the clone | 56 |
| Audit scripts in the clone | 8 |
| `.gitignore` lines 26 to 29 | explicit exceptions that track exactly those files |
| `npm ci` | succeeds |
| Type check | no errors |
| Lint | no issues |
| Unit tests | 1034 passed, 0 failed |

The directory was tracked deliberately, the plan records the decision as done,
and the frame was never updated. So the frame carries **a fact about the
repository, and it has rotted**, in a file whose own opening paragraph says it
contains no fact about the repository because every such claim rots.

That is not a small irony. It is the strongest available demonstration of the
rule the file states about itself, and it argues that the rule needs a
mechanism rather than a resolution: a generated file cannot rot, and a prose
file will, including one written by someone who knows it will.

**What a fresh clone genuinely cannot do**, and the project handles it well.
The gates need a browser driver, which is deliberately not a dependency: the
continuous integration runs the four npm commands and never the gates, so
adding it would pull browser binaries into two jobs for nothing. Run a gate
without it and the runner **exits non-zero**, prints why, and offers three ways
to supply it **[replicated]**.

That is the correct behaviour and it is worth stating as the positive result it
is: the one failure mode this axis exists to catch, a newcomer seeing a green
that is empty, does not occur here. The suite refuses rather than pretending.

The general statement survives the correction, in a sharper form:

> The verification a project offers is what a clone can run, and the only way
> to know what that is, is to clone it. A statement in a document about what a
> clone can do is a claim with an expiry date, and this one had expired.

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
