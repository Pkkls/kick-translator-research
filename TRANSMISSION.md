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
check, not the rule.

**A guard is a fraction of the surfaces that need it, never a presence.** One
occurrence reads as "handled" to a search and as "handled in one place of
several" to a count. Enumerate the surfaces first, then check each.

**Count the structure, not the text near it.** If the thing being counted has a
built or generated form, count that one. A pattern over source is a guess about
how the source will be interpreted, and you are not the interpreter. This study
broke this rule three times: a gate array by line shape, a manifest by text
pattern, a locale file by indentation.

**When two instruments disagree, the probability that one is right is not one.**
Settle with a third that shares technique with neither. In the worst case here,
this study's count and the project's own checker disagreed, and a structural
walk found both wrong.

**Replicate with a different instrument, of sufficient scope.** Two probes
agreeing about the same file, when the claim is about a chain of five, is not
replication: they share a blind spot and confirm each other inside it. Declare
the population before replicating.

**The direction of a probe's error follows what it was looking for.** Hunting a
guard, a blind spot becomes a false accusation, so discount findings. Enumerating
instances, a blind spot becomes a plausible short list, so discount the short
list. Getting this backwards means trusting exactly the wrong result.

**Validate the witness.** A witness is an action meant to make an assertion
fail, and nothing guarantees it reached the artefact the assertion reads. A
constant folded by a bundler, a patch whose pattern never matched: each produces
a break that never arrived and a green that means nothing. The corpus's
sentence: *a witness that does not break the thing it claims to break proves
nothing.*

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
size published without its compression level.

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
- **No store dashboard figures**, which need accounts.
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
