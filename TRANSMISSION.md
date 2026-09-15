# Everything transmissible

Written for an account with no memory of the session that produced this
repository. It carries what was learned rather than what was done: the rules,
the traps, the dead ends, and the boundaries. For the current state and the
next thing to open, see [RESUME-HERE.md](RESUME-HERE.md).

---

## 1. What this is, in three sentences

A browser extension translates the chat of a streaming platform, and it kept
unusually complete laboratory notebooks over three months. This repository is a
study of that corpus: fifteen thesis chapters, a handover written for the
account that develops the extension, a twenty-two axis audit specification, and
a method log recording every mistake the study made. The extension lives at
`Pkkls/kick-chat-translator`; nothing here modifies it.

## 2. The rules, in order of how much they cost to learn

Each was paid for. Several were learned twice.

**A diagnosis propagates when something runs, not when it is written down.**
The corpus committed one correct general diagnosis locally six times over three
months. This study, holding that finding and actively hunting for it, committed
its own three times in one session. Neither account was careless. Build the
check, not the rule. A comment is not a check, and it does not even reach the
next file: the fixture harness for the store screenshots drifted to twice the
required scale factor while its sibling, the live harness for the same
screenshots, carried a comment saying to keep it at one. The repair was to read
the dimensions back out of the PNG.

**A guard is a fraction of the surfaces that need it, never a presence.** One
occurrence reads as "handled" to a search and as "handled in one place of
several" to a count. Enumerate the surfaces first, then check each.

**Count the structure, not the text near it.** If the thing being counted has a
built or generated form, count that one. A pattern over source is a guess about
how the source will be interpreted, and you are not the interpreter. This study
broke this rule four times: a gate array by line shape, a manifest by text
pattern, a locale file by indentation, and orphan harnesses by the gate's name
instead of the file the gate runs. A label beside the structure is still text
near it.

**An absence is a claim about what you opened.** The corpus stated flatly that
its analytics held no install figure. The next export had one, and its author's
correction is exact: *a claim about four files stated as a claim about the
subject.* The same pass replaced a language gap inferred from countries with one
read from page titles, and the answer changed from Polish to Czech. Say which
files a negative covers, and prefer the direct reading to the mapped one.

**Two speculations, then an instrument.** The corpus's rule, from a panel
rendering 489 pixels below where its inline style put it: *I speculated twice
about why before instrumenting, and stopped on the second.* Asking the DOM
which ancestor had taken the containing block took one probe; reasoning about
the offset was never going to converge.

**When two instruments disagree, the probability that one is right is not one.**
Settle with a third that shares technique with neither. In the worst case here,
this study's count and the project's own checker disagreed, and a structural
walk found both wrong.

**Replicate with a different instrument, of sufficient scope.** Two probes
agreeing about the same file, when the claim is about a chain of five, is not
replication: they share a blind spot and confirm each other inside it. Declare
the population before replicating.

**A file name is not a population. Pin the revision.** A replication read the
same path the project had measured and disagreed with it on all three rules.
The file had been edited three times since, and the lines added included the
release notes for the change being measured, quoting words it destroyed. On two
of the rules every word of the disagreement came from those lines; the third
was the instrument's own error and was never traced. At the right revision, with
the product's own module instead of retyped expressions, the project's figures
held to within one.

**The direction of a probe's error follows what it was looking for.** Hunting
a guard, a blind spot becomes a false accusation, so discount findings.
Enumerating instances, a blind spot becomes a plausible short list, so
discount the short list. Getting this backwards means trusting exactly the
wrong result.

**Run the artefact that ships, not the one that builds it.** Every gate in the
corpus pointed at the build directory; what reaches a store is the archive. When the archive was finally exercised it passed, but the question had
never been asked, and the same pass found five store screenshots that would
have been rejected on their dimensions alone.

**A probe run against a broken subject answers nothing, including the question
it appeared to refute.** A width hypothesis was tested and came back "no bar at
any width", which reads as a refutation. The build under test was the wrong
browser's and started nothing at all. When it was repaired nobody had answered
the width question, and answering it properly found three touch targets below
the accessibility floor. A negative result from a subject that could not have
produced a positive one is not a negative result.

**Ask whether the artefact under audit can carry the property.** An
accessibility kit's keyboard gate read a saved HTML dump of a menu, which keeps
the markup and none of the listeners, and reported that the arrows never move
focus. Measured on the mounted component, they moved it correctly in all three
renders. A copy of the subject keeps what copying keeps: a dump answers
structure, roles and contrast, and it cannot answer behaviour.

**A user report names one instance. The population is yours to enumerate.** The
same accessibility defect was reported once, fixed once, and the rest of the
class went on sitting there because the audits ran on dumps of two components
and the bar appeared in neither. This is the guard-fraction rule arriving
through a different door, and the report is what makes it dangerous: fixing
what was reported feels like closing the item.

**Validate the witness.** A witness is an action meant to make an assertion
fail, and nothing guarantees it reached the artefact the assertion reads. A
constant folded by a bundler, a patch whose pattern never matched: each produces
a break that never arrived and a green that means nothing. The corpus's
sentence: *a witness that does not break the thing it claims to break proves
nothing.*

**Read why a witness went red, not merely that it did.** A witness can produce
the expected failure through an unintended path: a layout fix removed, the panel
widens, a click target moves out of reach, and the harness throws on a timeout
before its assertion is ever read. The red is real and proves nothing. In that
case the evidence was the direct measurement, not the harness.

**Assert the property that matters, not the one that is visible.** A gate for
the outgoing path does not assert that a preview appears; it asserts which
language the preview targets. And it arranges for the two candidate languages to
differ, because if they are the same every confusion between them passes. **A
probe must make the things it distinguishes differ.**

**Ask whether the number the probe reads could have two causes.** A zero request
count can mean the cache worked, or that something upstream discarded the input
before any cache was consulted. Vary the input so only the mechanism under test
can produce the result, and write in the probe why that variation is there.

**A test over a constant is a test of the declaration, not of the behaviour.**
A test asserting a provider list has three entries does not test that the second
is ever reached. It reports green on any change that keeps the shape.

**Attach interception at the layer the traffic actually leaves from.** Under an
extension runtime, requests may leave the background worker rather than the
page. Interception at the wrong layer reports zero traffic, indistinguishable
from a product that made no requests.

**A blocked item is usually a blocked part attached to an unblocked one**, and
the aggregate reads as wholly blocked. Split before deferring. Same failure as
reporting a population without separating its documented exceptions.

**A defect correlated with a property the reader cannot observe is
indistinguishable from randomness.** A cache that answers without applying makes
every second occurrence of a repeated line show nothing; the pattern exists and
is invisible to the person experiencing it, which makes it nearly unreportable.

**A fallback inside a probe can do the work of a dead primary.** A harness
queried a class that never existed, behind a `??` that found the element
another way, so the selector died and nothing noticed; contrast assertions
gated on a value that was always null could not fire. The corpus swept its
probes for reads that cannot succeed and made the sweep a gate, witnessed by
the count reaching zero on unchanged product code.

**A probe that measured nothing must fail.** A pass over an English chat
translated to English reports zero translations and zero errors, which is
indistinguishable from success.

**Never file variance as an environmental property.** "The live gates are
non-deterministic" is terminal: it explains the observation, requires no work,
and closes the investigation. In the one case recorded here it covered three
separate defects, two of them the author's own probes. Account for each varying
run before blaming the environment.

**A number without its unit or parameter is not a measurement.** Both accounts
produced one: a character count read against a byte reference, and a gzipped
size published without its compression level. The corresponding discipline is
to count in the units the consumer counts in: the corpus's listing auditor
measures UTF-16 code units because that is what a web form counts.

**Look for the instrument before building one. An instrument that exists and is
in no runner is worse than none**, because its presence reads as coverage.

**Read a chronological corpus by position, not by topic.** A theme query returns
statements ranked by relevance; the best-matching passage is often the one a
later pass superseded.

**Establish severity at the output, never at the failing component.** In a
pipeline with defaults and fallbacks, a broken component does not imply a
user-visible failure, in either direction.

**A population with documented exceptions reports two numbers**, the adjusted
one and the raw one, so nobody has to trust your filter.

**A provenance tag certifies that a measurement happened, never that it was
competent.** The worst error in this study carried the tag meaning "executed
here". It was executed. It was wrong.

## 3. Environment traps, all hit at least once

- **Backticks inside JS template literals** break the script. Write long prose
  blocks to a file and insert them, or escape every backtick.
- **`cmd | tail; echo $?` reports the exit code of `tail`.** Read exit codes
  without a pipe. This was done here while measuring the axis whose own frame
  forbids exactly that.
- **The permissions classifier refuses** writing outside the session directory,
  and refuses creating a public repository. Both are correct barriers. For the
  first, move the session with the directory tool. For the second, hand the
  command to the person who decides.
- **Commits here are anonymised** as `anon <anon@users.noreply.github.com>`,
  matching the upstream project's practice. Do not commit with a personal email
  into a public repository.
- **`grep` is rewritten to `rg`** in this environment and `rg` may be missing.
  **`ls` is rewritten too**, into a display with sizes, and a pipeline reading
  it as a list of names returned 91 lines for 56 files. Call `/usr/bin/ls` and
  `/usr/bin/grep` when the output feeds another command.
- **An edit helper that refuses to write when its search string is absent** is
  what kept silent no-op edits out of this work. Keep that property.

## 4. Dead ends, so they are not repeated

- **Seven consecutive review passes over a document produced nothing** that one
  execution pass then found in minutes. The review regime gives no signal that
  it has stopped producing. Execute early, on any single axis.
- **A locale coverage figure was reimplemented** when the project's own script
  already computed it. Its own script is also broken, which is the finding.
- **Searching the journals by theme** repeatedly returned superseded entries.
- **Widening a checker so it admits your own case** is how checkers stop
  guarding. One such widening is recorded inside `audit-spec.mjs` with the rule
  that a second entry there means the check has become a formality.

## 5. What was never measured, and why

- **Nothing was observed in a browser.** Every source-derived claim is about
  call sites, not about what a reader sees.
- **No real chat traffic.** Every frequency claim in the thesis is unsupported,
  which the corpus itself records as its own binding limitation: four of its
  decisions are blocked on a single chat capture that has never been taken.
- **No store figures taken here**, which need accounts. The corpus holds one
  reading: 85 installs to 210 first visits over eight months, and listing views
  by localised page. Both measure the listing, not the product in use. This
  line used to say only that the figures need accounts, which is true of this
  study and false of the corpus.
- **The on-device engine's availability across real installs**, which is the
  single measurement that would convert a known seventy-fold mechanism
  advantage into a statement about users.

## 6. The replication rate, which tells you what to trust

Nine published measurements were re-taken with a second instrument: **five
changed, four held, one was published without its parameter**. Three of the five
over-stated and two under-stated.

Those nine were taken deliberately, by an account that had written the rules
against these exact errors, and published only after being read back. Treat that
as the base rate for measuring a system you did not write, not as a story about
one session.

The corpus under study records its own: at least fifteen false probe findings,
and a single pass in which four wrong accusations preceded one real defect, the
product right every time. Its opening line is the whole lesson: **all of them
caught by a witness, none by a re-reading.**

## 7. If you continue

Read [RESUME-HERE.md](RESUME-HERE.md) for the line numbers still unopened, run
the two scripts, and keep the method log honest. The log is the most valuable
file here precisely because it is the least flattering one.
