# Appendix E. How this was produced, and what it cost

A record of the session that made this repository: the order things happened
in, the commands that produced the corpus, every mistake and what it cost, the
things that were refused, and what was efficient against what was waste.

It exists because the account that develops the system may want to run the
same kind of pass again, and the expensive part of this session was not the
writing. It was finding out which approaches work on this material. That part
is reusable and is written down here rather than left to be rediscovered.

Nothing here is flattering by design. The mistake list in section 4 is the
longest section and that is the correct proportion.

---

## 1. The order it happened in

Four regimes, and the transition between the second and third is the only
interesting thing about the sequence.

### Regime 1: survey (two tool calls)

Two batched command runs against the repository, each pairing a set of shell
commands with a set of questions, so that the output is indexed and only the
matching sections come back. The first established structure, stack, build,
gates and release shape. The second established the working method: the
standing frame, the plan, the generated state file, the journals.

**Cost: two round trips for what would otherwise have been twenty file reads.**
This is the single most reusable thing in this log and section 5 gives the
commands.

### Regime 2: build a specification by review (passes 1 to 16)

Wrote a twenty-one axis audit specification, then reviewed it sixteen times:
falsifiability of every bar, blind spots, reading cost, cheat surface, cold
clone behaviour, priority arithmetic, conflicts with the existing frame,
sandbox rules, redundancy, vocabulary, resumption, witness quality,
portability, bootstrap, and a full mechanical audit.

Eleven of the sixteen passes changed the document. The mechanical audit at the
end reported every condition green.

### Regime 3: execute the specification (passes 17 to 30)

Ran its axes against the real code. **Three of its requirements turned out to
be unsatisfiable or uncheckable**, none of which sixteen review passes had
found. Full account in [appendix B](B-prompt-construction.md).

The transition between regimes 2 and 3 is the finding of this log: review and
execution find disjoint classes of defect, and the review regime cannot tell
you it has stopped producing.

### Regime 4: the study, and the handover

Indexed the notebooks, queried them by theme, wrote fifteen chapters and four
appendices, wrote three runnable scripts, ran them, and corrected the chapters
where running them contradicted what had been written. Then thirty passes over
a handover document written for the developing account rather than for a
reader.

---

## 2. What was produced, and which question each thing answers

| Artefact | Answers | Read it if |
|---|---|---|
| [thesis/](../thesis/) | What is hard about translating live chat, linguistically and architecturally | You want the analysis |
| [HANDOVER.md](../HANDOVER.md) | What an outside reading found, what to do first, how wrong this account was | You develop the system |
| [appendix A](A-audit-prompt.md) | What to audit, with a bar and a witness per axis | You want the specification |
| [appendix B](B-prompt-construction.md) | How the specification was built and where it was wrong | You want the method behind the specification |
| [appendix C](C-replication.md) | How to re-derive every number | You do not trust a number here |
| [appendix D](D-scripts/) | The probes as run | You want to run them |
| This file | How the work was done, and what it cost | You want to repeat the exercise |

---

## 3. The corpus extraction, with the commands

The notebooks are roughly 310 KB: a work queue, two daily journals, a
changelog, a handoff, a standing frame. Reading them into context directly
would have consumed most of the session's capacity on raw bytes and left
little for the analysis.

What worked: index them once, then query by theme as each chapter needed
material.

```bash
# Establish the shape of the history without reading the history
git log --reverse --date=short --pretty=format:'%ad %h %s' | head -3
git tag --sort=creatordate --format='%(creatordate:short) %(refname:short)'
wc -c CHANGELOG.md .agent/PLAN.md HANDOFF.md .agent/PROMPT.md
ls .agent/JOURNAL/
```

Then index the four large documents in one batched run and query them per
theme. Queries that produced usable material, in the order the chapters needed
them:

```
franc tinyld duel comparaison detecteur mesure
script ecriture majorite non-ASCII emoji dilue
persan declare arabe source confiante separation
mongol ukrainien bulgare lus comme russe
arabizi chiffres forme son piege SMS latin
romanised russe grec japonais latin table
rire formes ecritures sources attestation
texte court deux caracteres plancher mesure
smash filter clavier aleatoire bruit
latence millisecondes moteur on-device
cache en onglet persistant taux de hit
coalescer batch file d attente chaine de repli
poids du script injecte octets marge
service worker MV3 tue etat fusionne storage
```

**Two practical notes.** The queries work better in the language the notebooks
are written in, which here is French for the journals and English for the
frame; mixed queries returned both. And one batched run of five large files
plus eleven queries exceeded the response limit, which cost a round trip: index
first with few queries, then query separately.

---

## 4. Every mistake, and what each cost

Twenty-eight. Listed in full because a method log that omits them is an
advertisement.

### 4.1 Direction handling: accused working code, twice over

**What happened.** A probe looked for a direction attribute near each write of
untrusted text and reported one guarded surface of three. Writing it up as a
publishable script forced it to look at the element rather than near the write:
two of three. Tracing the third surface to its callers showed it never receives
untrusted text: two of two.

**Cost.** Three chapters and the handover had to be corrected after publication
of the wrong number inside this repository. Roughly an hour.

**What would have prevented it.** Tracing the callers before writing the number
down. The corpus's own frame says exactly this and it was in context.

### 4.2 Silent failure paths: thirty-one false positives

**What happened.** A probe classified a `catch` as silent when its body matched
no signal pattern. The pattern included `log(` but not `log.debug(`, so every
logged catch counted as silent. Reported 31 of 42. The real answer, after two
more refinements, is that the remaining silences are deliberate and carry a
comment saying why.

**Cost.** Would have been a fabricated finding in the handover. Caught before
publication because the four hottest hits were inspected before writing.

**What would have prevented it.** Reading four of the thirty-one before
counting them. The number was produced first and the reading second.

### 4.3 Selector fallbacks: a parsing error reported as an absence

**What happened.** A regex meant to extract selector arrays split them wrongly
and reported two lists with no fallback chain. The chains exist.

**Cost.** Low; withdrawn before it reached any document.

### 4.4 "Twenty lines above"

**What happened.** The handover said a construction sat twenty lines above the
write it guards. It is 111.

**Cost.** Low, and it is the one that says something: the number was plausible,
unimportant, and wrong, which is the profile of a detail nobody checks. It was
caught by a script written to re-derive every claim, not by rereading.

### 4.5 A translation presented as a quotation

**What happened.** A comment written in French in the manifest was quoted in
English, in quotation marks, in a draft of the handover.

**Cost.** None, caught before publication. It is the failure the handover's own
refutation section lists fourth, which is why that section exists.

### 4.6 Two counts of the same conditions

**What happened.** An ad-hoc audit counted fourteen conditions; the published
script groups them and counts twelve. Both were reported as totals in different
documents.

**Cost.** Low, and the fix was to stop reporting the total. The failure count
is the number that carries meaning; a total that depends on how checks were
bundled carries none.

### 4.7 An orphan count published without its exceptions

**What happened.** Reported 35 harness files launched by no runner, without
separating the documented exclusions. The raw number indicts a project that
had already reasoned about most of them.

**Cost.** One correction, and it produced the rule that a population with
documented exceptions reports two numbers.

### 4.8 Reimplemented an instrument that already existed

**What happened.** Wrote a locale coverage counter. `scripts/i18n-check.mjs`
already computes it.

**Cost.** Minutes, and it produced the more useful corollary: an instrument
that exists and is in no runner is worse than one that does not exist, because
its presence reads as coverage.

### 4.9 A pipe swallowed an exit code, in the session that wrote about it

**What happened.** Measured a gate runner's exit code as `cmd | tail; echo $?`,
which reports the exit code of `tail` and not of the command. Read 0, which
would have made the runner look like it reports a false green when a
dependency is missing. Re-run without the pipe: the real code is 1, and the
runner behaves correctly.

**Cost.** None, caught within a minute, because the number was surprising
enough to re-check.

**Why it is the worst one in this list.** The project's own frame carries the
rule *"never pipe a gate into tail"* as one of its named traps, this study
quotes that rule in [chapter
12](../thesis/12-verification.md#123-the-rules-that-make-a-green-meaningful),
and the mistake was made anyway, in the pass that was measuring that exact
axis. Knowing a trap and holding it are different skills, and only the second
one is worth anything at the moment it matters.

### 4.10 Repeated a claim from the frame without checking it

**What happened.** The frame says a fresh clone has no gates, harnesses or
audits. The study repeated it in a chapter, in the audit specification's index,
and in the specification's own degradation rules. A later pass cloned the
repository and found 56 harnesses and 8 audits present, at the same commit.

**Cost.** One chapter rewritten, one table in the results, the specification's
instrument tags, and the handover gaining a section. Perhaps ninety minutes.

**What would have prevented it.** The study's own tagging scheme, applied
honestly. The claim was tagged as coming from the notebooks, which was true,
and then used as though it had been verified, which it had not. A tag that
records provenance does nothing if the text then reasons from the claim as
settled.

**What it produced.** The best finding in the study's verification chapter, and
the most actionable item in the handover. A rotted claim in a file that opens
by explaining why claims rot is worth more than the ninety minutes it cost.

### 4.11 Two incompatible counts of the same thing, and a verifier that could
not have caught it

**What happened.** The gate runner's entries were counted twice with two
line-anchored regular expressions, giving 40 and then 33. Both cannot be true.
A third count, by bracket depth and therefore independent of line formatting,
gave **40**: seven entries carry their arguments across several lines and the
stricter regex missed them. The first number was right and the second was the
error.

**Cost.** Minutes, because the disagreement was visible.

**What it exposed, which is worth more than the count.** The claim verifier
written for this study used the *same* regular expression as the original
measurement. Had that regex been the wrong one, the verifier would have
confirmed the error and reported it green. **A verifier written by the same
author with the same technique tests stability, not truth.**

The remedy is not more care. It is to measure the second time by a different
technique: here, parsing structure instead of matching lines. Where that is
impossible, the verifier should say so rather than imply independence it does
not have. The script now counts by bracket depth and carries the reason in a
comment.

The generalisation, which applies to every self-check in this repository:

> Repeating a measurement with the same instrument confirms the instrument is
> deterministic. It says nothing about whether the instrument is correct. Only
> a second instrument of a different kind can do that.

### 4.12 Counted a manifest with a regex instead of reading the built JSON

**What happened.** Reported ten host permissions, from a regular expression
over `manifest.config.ts`. The expression also matched the two entries of the
content script's `matches` block. Building the extension and reading
`dist/manifest.json` gives **8**, and the source agrees once it is read
structurally.

**Cost.** One wrong number published in the handover for about two hours.

**Why it is the same mistake as 4.11 and not a new one.** Both counted a
structure by matching text that happens to sit near it, instead of parsing the
structure. In both cases the correct instrument existed and was cheaper: bracket
depth for the gate array, and the generated JSON for the manifest. A build
produces structured artefacts precisely so that nobody has to guess from the
source.

The rule this pair yields, which is narrower and more useful than "be careful":

> If the thing you are counting has a built or generated form, count that. A
> pattern over the source is a guess about how the source will be interpreted,
> and you are not the interpreter.

### 4.13 The provenance scheme had no slot for borrowed facts

**What happened.** This study tags every claim **[reported]**, **[replicated]**
or **[new]**. An adversarial reading of its own chapters found three claims
about the outside world carrying **[new]**, which says "this study's own
analysis": the etymology of a Chinese laughter form, the conventionalisation
chain behind a Japanese one, and an assertion about how neural translation
systems behave on very short input, introduced with the words "this is a known
behaviour of".

None of the three is analysis. They are facts borrowed from general knowledge,
none verified here, and two of them are the kind of internet etymology that is
widely repeated and rarely sourced.

**Cost.** Low in substance, because no argument in the study depends on any of
them. High in what it says about the instrument.

**Why it is not a slip.** The scheme had three slots and these claims fit none
of them, so they went into the nearest one. **A provenance scheme with a
missing category does not leave those claims untagged, which would be
visible; it silently mislabels them as whichever neighbouring category is
closest.** The absence of a slot is invisible precisely where it does the most
damage.

**The fix.** A fourth tag, **[outside]**, for general knowledge invoked and not
verified, declared in the README as the weakest class of statement in the study
and refutable by anyone who knows the domain. The three claims now carry it,
and each is followed by a sentence saying what survives if the borrowed fact is
wrong.

The general form, which applies to any classification used for quality control:

> Before trusting a tagging scheme, ask what it has no name for. Whatever that
> is will not appear as missing. It will appear as a member of the nearest
> category that does have a name.

### 4.14 The same diagnosis, applied locally, three times, by this account

**What happened.** A coherence probe compared every measured number across the
thesis and the handover, looking for a figure that had drifted between two
documents written hours apart. It raised five discrepancies. **All five were
false**: two compared different subjects that share a word, three compared a
project's stated number against the measured one, which is the discrepancy the
study exists to report.

No real divergence between the two documents. That negative result is worth
having and took two minutes.

**The finding is what produced the false alarms.** The probe compared numbers
by matching text near them, without modelling what each number referred to.
That is the same defect as 4.11, which counted an array by line shape instead
of by structure, and as 4.12, which counted a manifest by pattern instead of
reading the generated JSON.

Three instances, one diagnosis, and the diagnosis was **already written down**
after the first: *if the thing being counted has a built or generated form,
count that one; a pattern over the source is a guess about how the source will
be interpreted, and you are not the interpreter.* This account wrote that
sentence, published it, and then did it twice more in the same session.

**Why this belongs in the study rather than only in this log.** The central
finding about the project under study is that a correct general diagnosis
written in prose does not propagate to the other places it applies ([thesis
4.5](../thesis/04-script-vs-language.md#45-the-finding-about-findings)),
demonstrated there across six instances over three months. That finding was
open to a comfortable reading: that the developers were moving fast and a more
careful reader would have caught it.

This account was that reader. It held the diagnosis in working memory, had
written it out, was actively looking for instances of exactly this pattern in
someone else's work, and reproduced it three times in one sitting.

The pattern is therefore not a property of that project, of fatigue, or of
insufficient care. **Writing a general rule down is a weak mechanism for
applying it**, including for the person who wrote it, including immediately
afterwards, including while looking for violations of it. What propagates a
diagnosis is a check that runs, not a sentence that exists.

### 4.15 The specification had no axis for the thing producing its findings

**What happened.** The session's fourteen recorded mistakes were used as a test
corpus against the specification's own twenty-one axes. Seven classes matched
something in the document, and that number flatters itself: several matched
only because the lesson had been poured into the specification earlier in the
same session, *after* the mistake. The figure before the session started
feeding itself back is much lower.

The structural count is the one that matters and does not move: **19 axes watch
the product, 2 watch the tooling, 0 watch the auditor.**

**Why that is not a small gap.** This session measured its own error rate on a
real corpus and found three probes of five accusing working code on their first
run, all three erring toward accusation. An audit specification with no axis for
its own reliability is a specification that models everything except the largest
measured source of false findings in the pass that wrote it.

**Why it happened is the worse part.** The lessons were not missing. They were
in the preamble, as prose: measure at the decision, count the structure,
replicate with a different instrument. Prose with no bar, no witness and no
ledger entry, in a document whose entire thesis is that a bar and a witness are
what make a rule hold. The previous entry in this log,
[4.14](#414-the-same-diagnosis-applied-locally-three-times-by-this-account),
had just concluded that writing a diagnosis down is a weak mechanism for
applying it. The response to that conclusion was to write it down.

**The fix.** A22, the auditor, in the same four-field shape as every other
axis, with bars that fail and a witness that can be run. Its distinctive bar is
the asymmetry: an unreplicated finding is discounted, an unreplicated negative
result is comparatively safe, because probe errors are not symmetric.

**One honest note about the fix.** A22's witness failed the specification's own
mechanical audit, because its first word was not in the checker's verb list.
Widening a gate so it admits your own case is how gates stop guarding, so the
widening is recorded in a comment inside the checker, with the rule that a
second entry in that comment means the check has become a formality.

### 4.16 A22 caught a published error on its first run

**What happened.** The new auditor axis was applied retroactively to findings
already published, starting with its replication bar: every accusation must be
confirmed by an instrument of a different shape.

Two were re-run. Both results were worth having.

**The class-name count was wrong.** The published figure, 98 in the current
text and 99 as first published, came from matching a pattern across the whole
stylesheet. Counting over selectors with comments stripped gives 98. The extra
one, `kt-flag-xx`, exists only inside a comment discussing CSS specificity,
where it stands for "each kt-flag-something rule". It is a placeholder, not a
class.

That is the sixteenth mistake here and the third of its exact kind, after the
gate array and the manifest. **It is also the first error caught by a check
rather than by luck or by surprise**, which is the whole argument of
[4.14](#414-the-same-diagnosis-applied-locally-three-times-by-this-account): a
diagnosis propagates when something runs, not when it is written down. The
sentence had been written three times and failed three times. The axis caught
it on its first execution.

**The startup-race finding survived, with its limit sharpened.** The
replication used the most independent instrument available, the project's own
test suite: if a test already covered a message arriving before the tracker
loads, the finding would be void. `stats.test.ts` holds eight cases, one of
which is adjacent, "archives the stored day when it loads on a later date".
That tests the rollover, not the race. No case covers a record arriving before
the load resolves.

The honest reading of that, and it is weaker than it looks: **an absent test
does not prove a defect exists, it proves the defect would not be caught.**
The finding stands as unreplicated in the sense that matters, since no
instrument observed the behaviour, and the handover says so. What the
replication added is that the project's own strongest instrument is silent on
the case.

### 4.17 Published a false accusation against complete work

**What happened.** This study reported that each locale file carried 34 of 155
declared keys, with the rest falling back to English, and published it in the
handover, the results table and the construction log. **Every locale file
carries all 155. The coverage is complete.**

The probe matched `/^\s{2}[a-zA-Z][a-zA-Z0-9_]*\s*:/` against the file. 121 of
the 155 keys are quoted, because they are whole English sentences with spaces
in them, and the pattern saw none of them.

**Cost, and it is the highest of the session.** Finished work was accused of
being 22 percent done, in a public repository, for about two hours. Every other
mistake in this log was either caught before publication or cost a number.
This one cost a judgement about someone else's work, in the direction that
damages.

**What caught it.** A22's replication bar, applied retroactively, and
specifically its instruction to replicate with an instrument of a different
shape. The different instrument chosen was the project's own checker, which is
the most independent one available.

**What the replication found instead.** The project's checker is itself broken.
It reports 5 keys and 150 missing per locale, listing as absent keys that are
plainly present. Two instruments disagreed, a third settled it by walking the
object structure, and **both of the first two were wrong**.

That is worth stating as a rule, because the obvious reading of a disagreement
is that one side is right:

> When two instruments disagree, the probability that one of them is correct is
> not one. Settle it with a third that shares technique with neither, and be
> prepared for both originals to fall.

**The deeper failure is that the tag lied.** This claim carried **[re-run]**,
which in this study's scheme means executed here against a clone. It was
executed. The execution was wrong. A provenance tag certifies that a
measurement happened, never that it was competent, and nothing in the scheme
distinguishes a careful measurement from a careless one. That gap has no fix
here beyond A22's replication bar, which is precisely why that bar exists and
why it is the one thing in the specification with a cost attached.

### 4.18 Measured one file and concluded about a chain

**What happened.** Counted how many of the product's 42 languages are named in
`langDetect.ts`: 18. Robust, and confirmed by a second instrument that strips
comments first, which agreed exactly. Then published the conclusion that the
other 24 rest entirely on the statistical identifier.

**The count was right and the conclusion was wrong.** Detection is a chain of
five files. Widening the same count across it gives 25 of 42 marked somewhere:
seven languages carry their markers in the laughter lexicon, the romanisation
table or the filters. The number with no marker anywhere is **17**, not 24.

**Cost.** A wrong denominator in a handover section whose purpose is to tell
someone where to look next. The list it produced was 40 percent too long, which
is the kind of error that wastes the reader's time rather than damaging them.

**Why it is distinct from the counting errors.** 4.11, 4.12, 4.16 and 4.17
measured the wrong way. This one measured correctly and then generalised from
the part to the whole. Two instruments agreed, which felt like replication and
was not: **they agreed about the same file.** Replication requires a different
instrument, and it also requires the instrument to be pointed at the right
scope. Agreement between two probes with the same blind spot is worth nothing.

That refines A22's replication bar, which as written asks for an instrument of
a different shape and says nothing about scope:

> Two instruments agreeing on the wrong subject is not replication. Before
> replicating a measurement, state what population the claim is about, and
> check that the instrument sees all of it.

### 4.19 An enumeration that under-counted, which inverts the bias rule

**What happened.** The detectability finding listed four page-queryable
signals, from a probe that read three content-script files. Declaring the
population first, as the previous entry's rule requires, puts the scope at all
nineteen. The re-run finds **eleven**: seven fixed element ids, an attribute
and a class on the document element, a marker written onto the host's own rows,
and the prefixed class names. All string literals, none generated at runtime.

A second instrument confirmed the part that mattered most: no identifier is
computed, so a page script can hard-code any of them.

**Cost.** The published figure was low by a factor of two and a half. Unlike
every other probe error in this log, it under-stated rather than over-stated.

**Why that matters more than the number.** This log had already concluded that
probe errors run toward accusation, and A22's replication bar was built on that
asymmetry: discount findings, trust absences. **That rule is only true for
probes looking for a guard.** A probe enumerating instances fails in the
opposite direction, because a scope that is too narrow returns a plausible
short list rather than an obvious blank.

So the asymmetry is real and its sign is not fixed:

> The direction of a probe's error follows what it was looking for. Searching
> for a guard, a blind spot becomes a false accusation. Enumerating instances,
> a blind spot becomes an under-count. Decide which of the two you are doing
> before reading the number, and discount the outcome that a scope error would
> have produced.

A22 now carries both directions. The version written one pass earlier carried
only one, and would have told a reader to trust exactly the result that was
wrong here.

### 4.20 Two replications that confirmed, and a probe colliding with the
product's own languages

**What happened.** Two more published measurements went through A22's
replication bar. Both held, which is worth recording because the four before
them did not, and a log that only lists failures misrepresents the rate.

**Marked debt: zero, confirmed.** The published claim was no `TODO`, `FIXME`,
`HACK` or `XXX` in the sources. The replication widened both the vocabulary
(`@todo`, `NOTE:`, "for now", "temporary", "workaround", "unfixed", and French
and Spanish equivalents) and the scope (scripts and the agent directory, not
just `src`). Twelve lines matched and **none is a debt marker**: a log message
saying "skipping network for now", a doc comment describing a temporary toast,
prose explaining a workaround that had been removed, and a French idiom.

**The twelfth is the finding.** `src/shared/i18n/es.ts` contains
`'Translate everything to': 'Traducir todo a'`. The Spanish word *todo*, "all",
matched the debt-marker pattern `TODO`.

That is exactly the failure [chapter
8](../thesis/08-noise.md#a-suffix-rule-against-turkish-morphology) documents
in the product, where an English gaming interjection in a suffix list deleted
a Turkish grammatical morpheme. **The same defect, one level up: an audit
probe is a substring rule, and it over-generates into the same languages the
product handles.** In a codebase carrying forty-two languages, every textual
probe collides with some of them.

**Unit tests: 1034, confirmed.** The runner reports 1034 with exit code zero.
A static count of `it()` and `test()` calls gives 600, plus 44 parameterised
tables that generate the remainder. The two agree once generation is accounted
for, and the static count alone would have under-stated by forty percent, which
is the counting-the-source failure of 4.12 in its mildest form.

**The replication rate so far.** Five published measurements put through the
bar: three changed, two held. A bar that never fails is not a bar, and one that
always fails would mean the pass produced nothing worth keeping.

### 4.21 A number whose parameter was not stated, and a hash taken without
clearing the output

**What happened.** The last two unreplicated measurements went through the bar.

**The gzipped size was published as "90 425 bytes" with no compression level.**
Measured across levels: 100 982 at `-1`, 90 425 at the default, 90 198 at
`-9`. The figure is correct at the default and moves **12 percent** across the
range. A number that depends on a parameter, published without the parameter,
is not reproducible, and nobody reading it can tell which of the three they
would get.

Worse, it is not the number the question wants. No one ships gzip at a chosen
level: a store measures the archive, and transfer size depends on what a server
negotiates. The raw size, 233 601 bytes, is the parameter-free one and should
have led.

**The identical-hash claim was taken without deleting the output directory
between the two builds.** If the second build had reused its output, the
comparison would have been a file against itself. Re-run with `dist` removed,
it holds, and it also holds against a clone built an hour earlier, which is a
stronger claim than the original: **the build reproduces across clones, not
just within one tree.** The replication strengthened the finding rather than
weakening it, which had not happened before in this series.

**The rule this pair yields:**

> A measurement that takes a parameter is two facts, the value and the
> parameter, and publishing one of them publishes neither. A measurement that
> compares two artefacts must establish that they were separately produced,
> because the cheapest explanation for two identical things is that they are
> one thing.

**A third missing parameter, found much later, in the same table.** The hashes
and sizes were taken without recording the Node version they were built under.
It surfaced only when the older journal's fourth pass, never listed for
reading, turned out to record the corpus's own releases built on Node 22
against a pin of 20. The rule above was written about this very table and did
not reach its third parameter, because the parameter nobody names is the one
nobody thinks to state.

### The replication rate, complete

Nine published measurements were put through A22's replication bar, each with a
second instrument of a different shape. The series is finished, so the rate can
be stated rather than sampled:

| Measurement | Outcome |
|---|---|
| Direction handling, 1 of 3 guarded | **changed** to 2 of 2, population re-scoped |
| Prefixed class names, 99 | **changed** to 98, one was a comment placeholder |
| Locale coverage, 34 of 155 | **changed** to 155 of 155, retracted entirely |
| Languages without a marker, 24 | **changed** to 17, scope was one file of five |
| Page-queryable signals, 4 | **changed** to 11, scope was three files of nineteen |
| Silent catch blocks | held, nothing to report |
| Marked debt, zero | held, against a wider vocabulary and scope |
| Unit tests, 1034 | held, against a static count plus generated cases |
| Identical content.js across engines | held, and strengthened: reproducible across clones |
| Gzipped size, 90 425 | incomplete: correct at the default level, published without the level |

**Five of nine changed. Four held. One was published without its parameter.**

Every one of those measurements was taken deliberately, by an account that had
written the rules against these exact errors, and published only after being
read back. The rate is not a story about carelessness; it is what the base rate
looks like when someone measures a codebase they did not write.

Two things follow that are worth more than the individual corrections.

**The direction of the error is not constant.** Three of the five were
over-statements, and two were under-statements. Which one you get depends on
whether the probe was looking for a guard, where a blind spot becomes a false
accusation, or enumerating instances, where a blind spot becomes a short list.

**Replication is not a formality with a high pass rate.** At five in nine it is
the most productive single step in this entire session, more than any axis and
more than any amount of re-reading. That is the argument for making it a bar
with a cost rather than a principle in a preamble.

### 4.22 Read an early entry, missed the later one that settled it

**What happened.** Chapter 5 said Latin-script Bulgarian was diagnosed and
deliberately left unrepaired, citing a notebook entry that defers it. **A later
pass in the same corpus solves it**, and this study read the first entry and
never found the second.

**Cost.** A chapter section asserting an open question that was closed, and,
worse, the loss of the best material in the corpus: the repair contains an
overfitting measurement of **10 of 20 fitted lines against zero of four
held-out**, which is sharper than the 20-of-20 against 4-of-12 the method
chapter was built on, plus a conjunction rule with zero false positives across
187 lines in 19 languages.

**Why it happened.** The corpus is chronological and was queried by theme. A
theme query returns the passages that match, ranked by relevance, not the most
recent state of a question. Two entries about the same subject, months apart,
look alike to a search; only their position in the file says which one won.

**The rule this yields, and it applies to any chronological corpus:**

> Searching a journal by topic returns statements, not conclusions. Before
> reporting that a question is open, find the last thing written about it, not
> the best-matching thing. Sort by position, then read backwards.

This is the same shape as the frame that asserted a fresh clone has no
harnesses ([4.10](#410-repeated-a-claim-from-the-frame-without-checking-it)): a
statement that was true when written, read later as though it still were. There
it was the project's own file that had rotted; here it was this study reading
a correct file at the wrong point in its history.

### 4.23 The corpus had already counted its own false probes, and said the same
thing first

**What happened.** Reading the most recent journal by position rather than by
relevance turned up a section titled "the probes that were wrong, four more",
opening with "twelfth and following". **The project has been counting its own
false probe findings all along**, at least fifteen of them, and its first line
is the conclusion this log spent a session arriving at, in its French and then
in translation:

> Toutes rattrapees par un temoin, aucune par une relecture.

All of them caught by a witness, none by a re-reading.

**Cost.** None to any published claim, and considerable to this study's sense
of originality. The calibration section in the handover, written as though an
outside account measuring its own error rate were a novel contribution, was
describing something the corpus already does explicitly.

**The part that stings is the fourth probe in their list.** A Bulgarian probe
had read one bench file of two, because the two have different shapes, so it
covered 63 lines where there are 187. **It refused to continue rather than
report zero false positives over an amputated control.**

That is precisely the failure this study committed twice, in
[4.18](#418-measured-one-file-and-concluded-about-a-chain) and
[4.19](#419-an-enumeration-that-under-counted-which-inverts-the-bias-rule), and
in both cases the number was published rather than withheld. The difference is
not care and not attention. **They had built the guard and this study had only
written the rule.** Their probe carried an assertion that fires when its own
denominator looks wrong; the probes here carried a sentence in a preamble
saying denominators matter.

Which is, once more and now from the other side, the conclusion of
[4.14](#414-the-same-diagnosis-applied-locally-three-times-by-this-account): a
diagnosis propagates when something runs. The corpus is the control group, and
it won this comparison.

**And a second thing the same read turned up**, which is worth recording for
what it says about the corpus rather than about this study: a section titled
"two numbers quoted from memory, two wrong", where the project records having
published a store-version claim in the plan, in a pushed commit and in a report,
all three wrong, and then finds that a third item rested on the same false
premise. Their revision rate is not an inference from this study. It is written
down by them, with the same candour this log aims for.

### 4.24 The corpus's best single sentence, which this study did not have

**What happened.** Continuing to read the newest journal by position turned up
three sections never opened by any theme query. One of them contains a
refinement of the rule this entire study is built on, and the study did not
have it.

> **Un temoin qui ne casse pas la chose qu'il pretend casser ne prouve rien.**

A witness that does not break the thing it claims to break proves nothing.

The instance: a weight gate asserting that table prose stays out of the bundle.
The witness referenced that prose from live code through a **constant** key.
The bundler folded the access, the object shipped anyway, 39 bytes moved, and
**the gate stayed green**. Through a dynamic key it goes red on all thirty
notes.

**Why this matters more than another example.** Every chapter here treats the
witness as binary: break it, see red. The corpus shows the witness has a second,
invisible failure mode. It can be performed correctly and have no effect on the
artefact under assertion, because a toolchain sits between the edit and the
build and is entitled to optimise the edit away. The result is a confident
green that certifies nothing.

The same shape appears in their eleventh false probe, where a scripted patch
failed silently on a bad escape, the file never changed, and six tests went red
for unrelated reasons. Their note: the rule *verifie que le remplacement a eu
lieu*, check that the replacement happened, was already in their standing
prompt and was not applied.

**This study has that guard by accident rather than by design.** Every edit in
this session goes through a helper that refuses to write when its search string
is absent and prints NOT FOUND, which is why no silent no-op edit is in this
log. That was written for convenience, not as a witness check, and it has been
doing the job of one for twenty-three entries.

**A third section, and a trap worth carrying elsewhere.** A repair that looked
free: use the engine's own detected source language to separate cases. Measured,
the engine answers `en` for *bonjour*, *merci*, *gracias*, *ciao* and *lindo*,
**because it failed to identify them**. The rule would have killed five repairs
of six and kept none of the six witnesses, the exact inverse of its promise.
A failing component's output is a symptom of the failure, so a rule keyed on it
is anti-correlated with what it means to catch.

### 4.25 The corpus states the rule this study's results table breaks

**What happened.** Continuing through unread sections found the project
discovering, mid-corpus, that its own bench covered 14 languages all in Latin
script, so **every detection number it had published was a Latin number** and
five of the ten languages its interface speaks had never been measured once.

Extended to 176 lines in 19 languages, the two halves separate completely: zero
silent losses in 1125 non-Latin pairs, eight in 483 Latin ones; per-language,
25 of 25 across Arabic, Japanese, Korean and Russian against 3 of 8 for Spanish
and 1 of 4 for Turkish.

Their rule: **reported per language, never as a total**, because the half
decided by writing system is clean and all the damage lives in the other.

**This study's results chapter breaks that rule.** It carries aggregate figures
transcribed from earlier entries, which average a near-perfect population with a
lossy one. The chapter now says so, but the honest fix would be to re-derive
each figure per language, which the corpus supports and this study did not do.

**And it is the same error as
[4.18](#418-measured-one-file-and-concluded-about-a-chain) at one level up.**
There, a count over one file of five became a claim about a chain. Here, a
measurement over one script family became a claim about a detector. In both
cases the instrument was sound and the population was not the one the claim
was about. The corpus caught its version; this study caught its own only after
reading theirs.

**Also recovered, and it matters more than the correction**: the silent-drop
rate the whole thesis rests on had a measured value in the corpus all along.
663 pairs, 11 skipped as "already in your language" for messages that are not,
1.7 percent, all at non-English targets. Ten chapters asserted that this failure
class is the worst one here without ever stating its size, because a theme query
had never surfaced the entry that measured it.

### 4.26 The journal this study never opened, and the gate it did not credit

**What happened.** The older of the two daily journals, 1101 lines and
twenty-eight numbered passes, had never been read at all. Two sections in it
bear directly on things this study published.

**The detectability finding was reported unfairly.** Pass twelve of that journal
does not merely remove the reachable resources. It establishes that the content
script fetches nothing at runtime, removes six resources, and **builds a gate**
that loads the real extension against a local fixture at the host's own URL,
asserts the manifest exposes nothing, and carries two witnesses. This study's
handover and chapter 11 both implied an unexamined question where there is an
instrumented one. Corrected in both, with the finding narrowed to what is
actually unguarded: the DOM identifiers.

**And the corpus frames the stake better than this study did.** Its note: this
matters more here than in most extensions, *since this site already walls off
what it detects*. This study had argued the axis on reader privacy. The real
exposure is product survival, and it is the stronger argument by a distance.

**Their typology of self-inflicted probe failures is better than this log's.**
A section titled "four ways I broke my own probes this pass" opens with the base
rate stated plainly:

> Most red is mine before it is the product's.

The four are each a distinct mechanism, and two are not in this log at all: a
probe that **crashed on a null instead of measuring**, where a crashed probe
reads as a red gate and so as a product defect; and a runner whose exit code 2
meant two different prerequisites while its label named only one, so the
diagnosis was confidently wrong about why. The other two are familiar: a bulk
rewrite producing a self-referential constant, and a heredoc eating an escape
**an hour after the author had written down that heredocs do this**.

**One more unit error, theirs, matching one of this study's.** A first reading
reported the content script at 200874, with no unit, and called it a 12 percent
drop.
It was a character count against a byte reference; the file holds multi-byte
UTF-8 and was 228406 bytes. Same class as this study's gzip figure published
without its compression level: **a number whose unit or parameter is unstated
is not a measurement**, and both accounts produced one.

### 4.27 Two failure modes this log did not have, both from the unread journal

**What happened.** Two more passes of the older journal, and each names a probe
failure absent from these twenty-six entries.

**Flakiness filed as an environmental property.** The work queue carried "the
live gates are not deterministic", blaming channel, chat volume and network.
The author's own later verdict: *that framing was mine and it was wrong in the
most useful way: it turned three separate defects into one property nobody can
fix.* Two of the three were their own probes, including one that set a value and
dispatched an event on a control that had stopped being an input, so it measured
the default and varied with what the default happened to do.

This is the most expensive failure in either record, because it is **terminal**:
an environmental attribution explains the observation, requires no further work,
and closes the investigation. Every other error here was eventually caught by
somebody looking again. This one is designed not to be looked at again. Their
sentence: *filing weather is easier than reading three stack traces, and it
costs the next reader the chance to fix anything.*

**A probe acting from the wrong world.** The site's router calls the main
world's history function; the content script's patch of it lives in an isolated
world and never sees it. A probe navigating from the isolated world would
trigger the one path the patch can observe, and pass by flattering the product.
Theirs navigates from the main world, as the site does.

This study wrote the same rule for detectability, that the probe must run in the
page's own world, and did not generalise it to events. **A22 now carries both,
plus the read-back requirement and the question about weather.**

**What this says about the reading order.** Twenty-six entries of this log were
written before either journal was read by position. The oldest one, never
opened at all until two passes ago, has now produced the gate that corrected the
detectability finding, a better typology of probe failures, the base-rate
sentence, a unit error matching one of this study's, and these two failure
modes. **The corpus was answering questions this study was deriving from
scratch, in a file the search had never surfaced.**

### 4.28 Four wrong accusations before one real bug, and what the real one was

**What happened.** The most complete account of the probe-error rate in either
record is a single pass of the older journal, titled "a real bug, found behind
four wrong accusations". Its opening: getting to the defect took four probes
that accused working code, **and the product was right every time**.

The four, each a different mechanism: a driver that destroyed what the
extension had inserted; a mock that returned one segment where the adapter
joins a batch and splits by lines, so the product correctly reported that the
translation came back identical to the original and the author fixed the wrong
thing after reading that message; a skip reason read off the wrong element,
returning null, which produced **a confident written finding that bursts of
messages were being silently dropped** and was withdrawn with "the claim was
mine, not the product's"; and a witness that exited on a timeout rather than on
its assertion.

**The real defect was better than any of the four accusations.** The scroller
recycles a row by replacing its contents, so the row is the mutation target and
never an added node, while the observer collected candidates from added nodes
only. Eight recycled rows, no translation, no reason, no request. And the
comment above the loop says the case is covered by watching childList with
subtree, which the journal calls **true of the events and false of the
handling**.

**Two things this study had wrong and has now fixed.** Chapter 9 described the
recycling hazard as an answer landing on a reassigned row, which is plausible,
general, and not what the corpus measured. And the chapter credited a gate for
covering the class without noting that the unit suite was structurally unable
to: the test double discarded the MutationObserver callback it was handed, so
no test among 620 could deliver a mutation, and **that branch was unreachable
by construction** until the double was fixed.

**The ratio is the transferable number.** Four false accusations to one real
defect, from an author with the product's own source, its journals, and a
standing rule about verifying the failure is in the product first. This study's
own series ran five changed of nine. Neither number is a story about
competence; together they are the base rate for measuring a system from a
position of partial knowledge.

### 4.29 A draft nobody committed, and what replication left of it

**What happened.** The resume file said the working tree was clean. It was not.
A previous session had read passes twenty-five to twenty-eight of the older
journal, which the resume file still listed as unread, and left an uncommitted
draft: three rules for TRANSMISSION.md and a new section 8.3b of chapter 8. The
draft tagged its numbers with the handover's vocabulary instead of the
thesis's, and tagged a fact about French grammar **[new]**, which is
[4.13](#413-the-provenance-scheme-had-no-slot-for-borrowed-facts) committed
again by an account that had the entry in its repository.

The first false claim was the corpus's own founding one. The older journal
opens on a handoff whose four statements about the repository were all wrong,
the first of them that the tree was clean, and on the rule it drew: a frame and
a state cannot live in the same file. This study's resume file was a frame
carrying a state, and it repeated the first of the four.

Nothing in it had been published, so it went through the replication bar before
anything else. The second instrument,
[`probe-emote-stripper.mjs`](D-scripts/probe-emote-stripper.mjs), differs from
the first in the three places that could move the answer: it runs the
product's own module out of git at the repair commit and its parent instead of
retyped expressions, it feeds whole lines with their capitals and diacritics,
and it declares the revision of every corpus. It refuses to report unless its
extracted expressions reproduce the module's output on every line.

| Draft claim | Outcome |
|---|---|
| Listing damage 37 before, 8 after; by rule 8, 16, 13 | **changed**: read a later revision. At the project's revision the project's 30, 13 and 13, 8, 9 hold as 29, 13 and 13, 8, 8 |
| "The gap is tokenisation, not a different file" | **changed**: three commits and 54 lines later, a different file |
| The two readings rank the rules in opposite orders | **withdrawn** |
| The length rule's sixteen words, six of them English | **changed** as a finding: eight came from lines written after the repair; on the right population, five of eight |
| `ez` damage by locale: fr 13, tr 2, es 0, pt 0 | three **held**, one **changed**, pt 1 (`talvez`); the French list gave twelve words for a count of thirteen |
| The old suite passed because it asserted what the parser kept | **changed**: exact equalities; the blind spot was its inputs |
| A screenshot harness drifted beside its own comment | **changed**: the comment was in the sibling harness |
| The rule shipped for months | **held**: thirteen tagged releases |

**Six of eight changed or withdrawn, one partly, one held**, before publication,
from an account holding every rule in TRANSMISSION.md. The nine-measurement
table above counts published measurements and is left as it is; this is the
same bar applied one step earlier, and it produced more.

**Two published sentences fell with it.** Chapter 8.3 had said from the start
that the `ez` rule deleted *every* Turkish negative aorist and inverted meaning
by deleting precisely the negation. Its own next paragraph gave the suffix as
`-mez` or `-maz`, and a rule ending in `ez` cannot match `-maz`. Through the
module, `yapmaz` and `olmaz` pass, `gitmez` vanishes whole, and meaning inverts
only where a non-ASCII letter ends the match and leaves a stem: `içmez` becomes
`iç`. The sentence wore **[reported]**. The notebooks never said "every".

**This session's own errors in the same pass**, because a log that lists only
the draft's would misstate whose errors they were:

- A line count of the two journals by `Measure-Object -Line`, which skips blank
  lines, gave 859 and 1198 for files of 1100 and 1536. Caught because it
  disagreed with the resume file, before it was used.
- Seeing the ASCII character class, this account expected the draft had counted
  accented words the rule cannot reach. The newer listing lines are written
  without diacritics. The prior was wrong, and it cost nothing only because the
  probe ran before the sentence was written.
- The corrected chapter first said the 54 added lines "are the release notes
  for the repair". They come from three commits, one of them about permissions.
  It first said the draft disagreed with the project "on two rules of three";
  it disagreed on all three. And it first tagged a claim about emote coverage
  **[replicated]** that the probe does not measure. All three were caught by
  reading the sentence against the probe's output rather than against the
  sentence before it.

**And a sentence in the resume file with nothing behind it.** It recorded "all
internal links resolve". Checking the links added in this pass meant checking
all of them, and nine of 208 did not, across seven files. Eight pointed at two
headings that had since gained a provenance tag, which GitHub folds into the
anchor; one pointed at a numbered heading without its number. Nobody broke a
link on purpose; a heading changed and nothing was watching. The sentence is now
[`check-links.mjs`](D-scripts/check-links.mjs), validated by running it on an
export of the last commit, where it reports the nine and exits 1.

**Cost.** The longest pass of the session, most of it spent establishing which
revision each number belonged to.

**The rule, which is now in TRANSMISSION.md:**

> A file name is not a population. Pin the revision, and when a replication
> disagrees, check the population's history before the instrument's logic.

**One candidate left open, deliberately.** Pass twenty-eight's width gate skips
any target of zero size, not only the chip that is absent by design, and the
bar gate asserts the gear and the pause button by DOM presence. Read together,
a gear hidden by a stylesheet would pass both. That is two readings of source,
not a second instrument, and the witness that would settle it needs a browser
and a build. It is in the resume file as a candidate, not in the handover as a
finding.

### 4.30 Corrections that stayed in the section they were made in

**What happened.** Reading the handover top to bottom at the start of this
session, which is how it is meant to be read, found corrections that had
reached the section where the error was caught and nowhere else:

- Section 3.5 corrected the unmarked languages from twenty-four to seventeen.
  Section 8 said twenty-four, twice.
- Section 3.2 corrected the page-queryable signals from four to eleven. The
  paragraph sorting them against the bar, in the same section, still sorted
  "the four", and so did section 8 and the matching paragraph of chapter 11.
- Section 2.1 numbered the worker race the sixth instance of its pattern.
  Section 3.5c called it the fifth.
- Section 1 said the verifier reported seventeen of seventeen, and that any
  other result means the file is stale. The verifier reported thirty-two.
- Section 11, chapter 12 and the specification's own preamble said twenty-one
  axes. The specification has twenty-two, counted by `audit-spec.mjs` and by
  its headings, A1 to A22.

And one defect of form: the four commands in section 1 had been joined into a
single wrapped paragraph, which pastes as one broken command.

**Cost.** Five numbers wrong in the document written for the one reader who
would act on it, and a sentence that told that reader, correctly by its own
rule, that the whole file was stale.

**Why it happened.** It is [4.14](#414-the-same-diagnosis-applied-locally-three-times-by-this-account)
again, on this study's own prose. The diagnosis "this number is wrong" covers
every place the number is restated. The remedy was a diff to the place it was
noticed. Nothing enumerated the restatements, so each correction was a guard
applied to one surface of several.

**What changed.** Section 8 no longer restates counts; it points at the
sections that hold them. The one restatement that has to stay, the verifier's
own total in section 1, is now a claim the verifier checks, and the check has a
witness: a copy of the handover stating 32 turns it red.

> State a number once and point at it. Where it must be restated, make the
> restatement something a script reads.

### 4.31 A transcription that raised the certainty of what it copied

**What happened.** Pass twenty-four of the older journal had been used in a
commit before the resume file was updated, so it was still listed as unread.
Read by position against what chapter 12 had made of it, the numbers held and
one was re-derived: one `box-sizing` declaration in the stylesheet before the
repair. Two sentences had drifted. The journal says adding the host's reset to
a test page *said* no reader on the site sees the overflow; the chapter said it
*established* it, about a site nobody measured. And the chapter said the
extension's elements *inherited* their box model from the host, which is the
journal's loose word copied into a mechanism that does not exist:
`box-sizing` is not inherited, and a reset reaches an element by matching it.

**Cost.** Small in each case, and both in the direction of confidence. The
second one mattered more than it looked, because the mechanism decides the
shape of the repair and the population it covers.

**Why it happened.** Transcription is paraphrase, and paraphrase drifts toward
the stronger verb. [4.5](#45-a-translation-presented-as-a-quotation) was a
translation passed off as a quotation; this is the same drift inside a single
language, and a **[reported]** tag certifies the source, not the fidelity.

> When repeating a finding, keep its verb. "Said", "suggested", "indicated" and
> "established" are four different claims about the same measurement.

**A third instance, found later in the same session, and the worst placed.**
Entry 4.26 quoted the corpus's unit error as a first reading of "200874 bytes".
The journal wrote "200,874" with no unit, because the whole point was that it
was a character count. The transcription supplied the unit the error lacked,
inside the entry about numbers whose unit is not stated. It surfaced only
because a search for the number failed: the journal writes it with a comma, and
the first pattern allowed a space or an underscore.

### 4.32 A pattern argued without the instance where the corpus had cured it

**What happened.** The handover's section 2.1 argues that the corpus diagnoses
in prose and repairs in a diff, with nothing holding the two together. The
older journal's sixth pass, never opened until now, is a counter-instance: a
gesture copied into three harnesses, two of them beside a comment warning about
the trap, diagnosed as *copied instead of shared* and moved into one module,
with the sweep that found the dead selectors turned into a gate. Both are in
the repository today.

**Cost.** Not a wrong claim, an unfair one, of the same kind as
[4.26](#426-the-journal-this-study-never-opened-and-the-gate-it-did-not-credit),
and in the section most likely to read as criticism.

**What it changed.** The credit made the recommendation sharper rather than
weaker. The same mechanism recurred seven hours later in another pair of
harnesses, and was repaired there too, by a check. The corpus does apply the
cure; what it skips is enumerating the other copies once a diagnosis names the
mechanism. Section 2.1 now says that instead of implying the cure was unknown.

**The credit's first check was scoped to the journal's own list.** It confirmed
the module was imported by the three harnesses the journal names. When the
claim went into the verifier, which counts importers across the directory, its
first run said four: the offline translation gate, written that evening,
imports the module too. The sentence as first published was true and
incomplete, and incomplete in the direction that mattered, because a later
harness reusing the shared module is the cure working, which three named files
could never show.

### 4.33 A recipe that counted labels, and a generator that agreed with it

**What happened.** The older journal's third pass classifies the project's
orphan harnesses by measurement. Holding this study's published count against
the project's own state file produced a disagreement: 35 here, 32 there. Four
documents carried the 35, three of them tagged **[replicated]**.

A third instrument, derived from the file each runner entry launches, found 34
files that no entry runs, of which two are runners and three are modules that
gates import, leaving 29 orphans. Then both published counts were reproduced
exactly and explained item by item. This study's recipe in appendix C.3
compared gate *names* with file *names*: it counted the three modules and both
runners as orphans, and it counted `store-shots-fixture.mjs` as one although
the runner launches it on every pass under the name `captures-readme`. The
project's generator makes the same comparison, excludes three infrastructure
files from a list written by hand that morning, and so reports 32: the same
fixture, plus the two modules created that afternoon.

**Cost.** A wrong count in four documents for the life of the study, carrying
the tag that means "executed here". It was executed. The recipe counted labels.

**Why it happened.** It is the rule about counting the structure rather than
the text near it, broken a fourth time. A gate's name is a label beside the
script it runs, and the recipe matched labels because names and files usually
coincide. The verifier's comment on its runner parse already warned that line
shape gives different answers from structure; the orphan recipe lived in
another file and was never ported to that parse. And it is
the pattern TRANSMISSION.md opens its instruments rule with, repeated: two
counts disagreed, and a third instrument found both wrong.

**Two more errors inside the same pass, both caught before publication.**

- Running the old recipe to reproduce the 35 first returned 91 lines for 56
  files. The environment rewrites `ls` for display, and `xargs basename` read
  sizes and columns as names. Re-run with the unwrapped binary, it gives 35.
- An attempt to separate hand-launched orphans from the rest, by whether a
  harness navigates to the host and whether its header says so, agreed with
  itself on 24 of 29 and was discarded. The offline gates serve the host's URLs
  from fixtures, so a URL does not say where a harness runs, and one header
  said "measured on Kick" in words the pattern did not know. Nothing from it
  was published.

**What changed.** The verifier now counts orphans by launched file and checks
all three numbers, including the generator's three false orphans, so the
correction goes red when the project fixes its generator. Adding those claims
also turned the handover's stated total wrong, and the claim added in 4.30
caught it on its first real use.

### 4.34 Listed as out of reach, while the corpus held a reading of it

**What happened.** TRANSMISSION.md, the resume file and axis A18 all said store
figures were unavailable because they need an account, and A18 said the ratio
of listing visits to installs was blocked. The older journal's eighth pass
records one: 85 installs to 210 first visits over eight months, with listing
views broken down by localised page. Earlier in this session, reading pass six,
this account had left the question open in the resume file rather than settle
it, because pass six said the opposite and pass eight had not yet been read.

**Cost.** The only population figure in the corpus went unused for the whole
study, in the section of the handover that asks how to rank seventeen languages
before a capture exists. Czech is on that list and drew the fourth most listing
views.

**Why it happened.** "This account cannot read the dashboards" was written as
"the figures are out of reach". The corpus's author made the same error one
pass earlier and corrected it in a sentence this study now carries as a rule:
*a claim about four files stated as a claim about the subject.* An absence is a
statement about what was opened.

### 4.35 An axis called clean without asking for its instrument's version

**What happened.** The handover's section 3.6 closed the apparatus axis as a
clean pass: the gates refuse to run without a browser driver and say how to
supply one. The older journal's eleventh pass moved those gates to a bundled
browser for reproducibility, saying it was pinned by `package.json`. The
repository's history has no commit touching Playwright in `package.json` or
the lockfile, the resolver says it is not a dependency, and nothing records the
browser version a run used.

**Cost.** A clean bill on an axis whose measurements are pixels taken on an
unrecorded browser. This study had already published a size without its
compression level ([4.21](#421-a-number-whose-parameter-was-not-stated-and-a-hash-taken-without));
it did not ask the same question of the corpus's gates.

**Why it happened.** The check was whether the apparatus refuses to run empty,
which it does. Whether what it measures carries its parameter is a different
question, and a clean answer to the first reads as a clean axis.

**What changed.** Section 3.6 now carries it, and two verifier claims hold it:
no commit ever touching Playwright in a manifest, witnessed by the same search
finding `vitest`; and no infrastructure file recording a version, counted as
"0 of 3" so that missing files cannot make it pass.

### 4.37 An estimate joined to the experiment that replaced it

**What happened.** Chapter 10 priced the identifier swap at thirty kilobytes,
thirteen percent, from the weight gate's header, and pointed at the comparison
in 13.1 as its result. The header's figures are the sizes of two libraries'
data, written eleven minutes before the comparison was committed, and the
header says the comparison has not run. The comparison measured what each
library adds to the bundle: 93703 bytes, forty percent. The study carried both
numbers, in two chapters that link to each other, and 13.1 used the right one.

**Cost.** A stake understated by a factor of three in the chapter about weight,
directly under a paragraph of the same chapter explaining that a module's
isolated size and its marginal cost to a bundle are different quantities.

**Why it happened.** Two sources, two dates, two instruments, one topic. A
header comment reads as current because it sits in the current file. It is
[4.22](#422-read-an-early-entry-missed-the-later-one-that-settled-it) with a
comment in place of a journal entry, and the rule that would have caught it is
the one in TRANSMISSION.md about pinning a number to its revision: the header's
number belonged to 18:23.

**And one suspicion of this account's, refuted before it was written.** Reading
the duel, 13.1's italic quotation looked like a paraphrase of the journal. It is
verbatim, from the work queue's entry on the same experiment. The comparison had
been made against the wrong file.

**And a commit message that described an edit which had not happened.** The
next pass added a rule to TRANSMISSION.md in the same batch as two other edits.
The edit helper refused it, because the search string began "the replication:"
where the file says "replication:", and printed so. The other two succeeded,
the checks were green, and the commit message said the rule was "now in
TRANSMISSION.md". It was not, until the following commit. The helper did its
job; the message was written from the plan of the batch rather than from its
results, which is the witness rule again: a green run says nothing about an
edit that never reached the file. The mechanism was specific: the commit ran in
the same parallel batch as the edits, so it could not see their results. The
practice since is that a commit never shares a batch with the edits it records.

### 4.38 Four decisions, counted from the item the same file had overtaken

**What happened.** The thesis, the handover and TRANSMISSION.md all said four
decisions were blocked on a chat capture, quoting the queue's waiting item. The
newer journal and two done entries in that same queue say otherwise. The
allowlist question was measured from both sides, found to be the same lines
lost by one reader and paid for by the other, and repaired in detection, with
the entry saying reopening it needs a case detection cannot reach. The trimming
question became an accuracy trade that changes sign with the readers' target
languages, which the collector does not record. Two remain.

**Cost.** Nine restatements of the count across six files, and the handover's
top item argued the capture's value on four decisions where the corpus supports
two. The capture's value survives the correction, since every priority rests on
a frequency. Its stated case does not.

**Why it happened.** An open item reads as current because it is open. The
waiting item was never updated when the done items closed half of it, and this
study took the count from the item rather than from the entries after it:
[4.22](#422-read-an-early-entry-missed-the-later-one-that-settled-it) inside a
single file, and [4.30](#430-corrections-that-stayed-in-the-section-they-were-made-in)
in the count's nine restatements. The correction now lives in chapter 14.1, the
other mentions point there, and three verifier claims hold the facts it rests
on, including that the waiting item still says four.

### 4.39 A translation in italics, three times in one session, after 4.5 was in the log

**What happened.** Reading the newer journal's French sections, this account
put English renderings in italics as though they were the corpus's words: the
rule about what was not observed, in chapter 4, and the replay rule, in chapter
12, both caught on the read-back before commit. Writing this entry turned up a
third, already pushed: chapter 10 had put the weight gate's French header in
italics as *has not run yet*. All three now quote the French and translate
outside the italics.

**Cost.** One published, and it stood for four commits. It is recorded because
[4.5](#45-a-translation-presented-as-a-quotation) is the same error, the
handover's section 2.1 explains why it matters, and neither stopped it: the
switch of language between source and prose is exactly where a paraphrase
slips into quotation marks without a decision being taken. The read-back
caught both; nothing structural would have.

### 4.40 Branches counted, and the unmerged two never opened

**What happened.** The handover counted nine remote branches, seven merged,
and closed the subject with a recommendation against work. The newer journal's
live-debugging sequence, the last unread stretch of it, ends with a reader's
report on their own build: pausing one stream turned translation off on the
next. The fix was written and deliberately left on one of the two unmerged
branches, because one case of four fails. The released build and master still
write the global, synced switch.

**Cost.** The most visible defect in the corpus's final state was absent from
the document written for the account that would fix it, in a section that told
that account the branches needed nothing.

**Why it happened.** The branch count was a population measured as a number
and never enumerated; the rule in TRANSMISSION.md about a guard being a
fraction says to open the members, and the two that differed from the rest
were exactly the two worth opening. It was also reachable only by reading the
journal to its end, which is why the resume file listed that stretch last and
called it the whole live-debugging sequence.

**What changed.** Section 3.7 of the handover states it with its evidence,
section 8 ranks it second, and five verifier claims hold it, including that
the per-channel pause exists on the branch and not on master, so the claim
goes red the day it is merged.

### 4.41 The method chapter's number stopped where the corpus kept going

**What happened.** Chapter 3 opens on the corpus's most important number, a
marker list at 20 of 20 on its own bench and 4 of 12 on lines written after,
and the results chapter lists Cyrillic Bulgarian as a stated limit, unresolved.
Both come from one section of the newer journal. The section immediately after
it resolves the limit, and completes the list by grammatical paradigm, never
from the missed lines, to 7 of 12 held out, which is the figure the corpus
publishes. Neither section was ever listed for reading.

**Cost.** A shipped rule's held-out recall understated by three lines in
twelve, a resolved limit reported as open, and a method chapter that never set
its sharpest contrast beside itself: the same paradigm repair that lifted the
Cyrillic set took nothing of the Latin one.

**Why it happened.** [4.36](#436-the-pass-after-the-one-quoted-corrected-it)
exactly, again. The number was taken from the section that produced it, and
the correction sat in the next one. The earlier reading list had named topics
rather than line numbers for this journal, so the section after was not even
visible as unread.

### 4.42 Quotations that were not the corpus's words, found by something that runs

**What happened.** Entry 4.39 recorded three translations put in italics as
quotations and concluded that nothing structural would have caught them.
Reading the newer journal's never-listed sections turned up a fourth, a whole
block quote in chapter 7, and this time the answer was to build the structural
thing. [`probe-quotes.mjs`](D-scripts/probe-quotes.mjs) looks for each
attributed quotation verbatim in the extension's tracked files. On the last
commit before it, it listed 24; 14 were real, and three more were found by hand
beside them, two in bold and one block quote whose paragraph the probe did not
read as attributed.

The seventeen, by kind: the corpus's most quoted line, *toutes rattrapees par
un temoin, aucune par une relecture*, given in English as its words in the
handover, TRANSMISSION.md, chapter 3 and this log; its witness sentence the
same way in three places; its prompt rule, its paradigm diagnosis, its
per-language rule and its dictionary verdict, each translated from French and
presented as quoted; "walls off what it detects" with its conjunction changed
in two places; the manifest's reason, paraphrased in chapter 11 in exactly the
form the handover's section 2.1 says it had removed from the handover; two
journal titles translated inside quotation marks; and one quotation checked
"against the source" that had dropped the source's accent.

**Cost.** Seventeen places where a reader was told they were reading the
corpus and were reading this study, most of them in the passages written to
credit the corpus. Where an English original existed, in the older journal or
the work queue, the quotation now uses it; where the original is French, it is
quoted in French and translated outside the quotation.

**Why it happened.** Every one was written by an account that had 4.5 in its
log, and the handover's section 2.1 explains the risk in its own text. A rule
about quoting lives in the writer's attention, and translation is where
attention does the work silently. The probe is not a gate: its test of
attribution is a word list and it lists this study's own rules beside real
cases, so it reports and a person reads it. That is weaker than a gate and much
stronger than the sentence in 4.39 that nothing would have caught them.

### 4.43 The study's central limit, stated about a document it cited and never read

**What happened.** TRANSMISSION.md, chapter 14, the handover and the resume
file all said there was no real chat traffic in the corpus, and chapter 14
built its first section on the queue's line that every corpus is hand-written.
The corpus's handoff of 2026-08-16, which chapter 8 cites by section number,
reports a live capture: 804 unique messages from one Spanish channel over
eight and a half hours, with their length distribution, and a live session's
skip reasons. Nothing from that section had been carried into anything this
study published.

**Cost.** The limit this study leans on hardest, repeated in four documents,
was wrong in its strong form. It survives in a weaker and more useful one: one
channel, one language, figures without the lines, so nothing about which
languages appear. The handover's case for a capture now asks for a
multilingual one, and its section on hand-written benches carries the numbers
that show the distributional gap.

**Why it happened.** [4.34](#434-listed-as-out-of-reach-while-the-corpus-held-a-reading-of-it)
again, one level up. There it was store figures; here it is the one thing the
study said the corpus most lacked. The queue had forgotten its own capture,
and a study that took the queue's summary of the corpus for the corpus
inherited the forgetting. A document cited by section is not a document read
to the end.

### 4.36 The pass after the one quoted corrected it

**What happened.** Chapter 11 and entry 4.26 credit the older journal's twelfth
pass with a gate that loads the extension against a local fixture served at the
host's own URL. The thirteenth pass, which begins on the next line of the
journal, says it did not: the route glob missed the bare domain, the page came
from the real site, and the 70 interceptions the gate printed were a symptom
read as success. The pattern was fixed that day, so the gate as it stands today
matches the description; the gate as quoted did not.

**Cost.** A chapter and a log entry that described a guarantee as holding at a
point in the history where the author had recorded it as false, in the
section this study used to correct its own unfairness to the corpus.

**Why it happened.** It is [4.22](#422-read-an-early-entry-missed-the-later-one-that-settled-it)
again, at the shortest possible distance. That entry was about topic search
returning an early passage. This time the journal was read by position, and
the reading still stopped at the end of the section that answered the question
being asked. A correction in a chronological record lands in the next entry at
the earliest, so a section read for a claim has not been read until the one
after it has.

### 4.44 Three structural findings in the file the reading list named next, and two of them died on contact

**What happened.** `.agent/PLAN.md` was opened by line number for the first
time, the first of the two files [4.22](#422-read-an-early-entry-missed-the-later-one-that-settled-it)
names as searched but never read. It holds **114 entries under seven headings:
7 open, 6 blocked on kil, 101 done**, and the section titled `## Open` holds
40 of them, of which 31 are done and 2 are blocked. Three defects followed from
that shape and two of them did not survive being checked. The heading looked
like it must corrupt the count `state.mjs` publishes: it does not, the script
counts marks rather than sections, and `ETAT.json` reads 7, 6 and 101 against
an independent count of the same file. The handover's sentence about reading
"the first open item in `PLAN.md`" looked like it reproduced the defect its own
paragraph documents, that item being `[x]`: it does not, the sentence quotes
the frame, and the paragraph around it is the accusation rather than the
instruction. Three chapters cite `"Done, kept for the record"`, a heading that
occurs four times in the file: each citation names its subject, and each subject
resolves to exactly one of the four.

**Cost.** None published, which is the point of recording it. Three corrections
against sound work were drafted and dropped, one of them against the section of
the handover whose subject is that exact error.

**Why it happened.** It is [the pattern across the first three](#the-pattern-across-the-first-three)
one level up, applied to a document instead of a probe. Reading a structural
file by position produces structure-shaped suspicions, and a heading that has
drifted from its contents is the cheapest possible thing to be wrong about,
because the drift is real and visible while the consequence has to be traced.
Each of the three was killed by the rule in [4.36](#436-the-pass-after-the-one-quoted-corrected-it):
open what surrounds the thing quoted before trusting the quotation. The
survivor is not a defect at all. `A-audit-prompt.md` names three conditions
that must all hold before stopping, and the second is that the queue holds
nothing but items blocked on kil. Seven entries carry `- [ ]`. That condition
has been an impression for the length of this study and is now a number.

### 4.45 A chapter published a constant that another chapter of the same study had already recorded as reverted

**What happened.** Chapter 7.5 opened with "the short-word table was given a
thirty-character reach" and said nothing more about the number. The shipped
bound is twenty: `d261ca1` let the table reach thirty under a veto from franc,
`3cf87f5` took it back, and `src/content/langDetect.ts:131` reads
`SHORT_TEXT_MAX = 20`. Chapter 15.1 already carried the reversal, correctly and
with the deciding case, as the second of the quantities a real capture would
settle. The study held the correction and the error at the same time, in two
chapters, for as long as both have existed.

**Cost.** The chapter that owns the brevity bound described a state that had
been undone, and it is the chapter a reader goes to for that bound. Chapter 15
was not going to reach that reader, because its subject is what is unmeasured
rather than what shipped.

**Why it happened.** Not [4.22](#422-read-an-early-entry-missed-the-later-one-that-settled-it),
and not [4.36](#436-the-pass-after-the-one-quoted-corrected-it): the later
entry was read, and it was published. It was filed under the argument that
needed it. In 15.1 the reverted bound is an illustration of an assumption no
measurement supports, which is that chapter's subject, so it entered there and
nothing walked it back to the chapter whose subject is the bound itself. A fact
arrives in a document through the argument that wanted it, and the place that
wanted it is rarely the place that owns it. The check that follows is cheap and
was not being run: for any fact used as an example, open the chapter that owns
the object and confirm it says the same thing.

### 4.46 The rule about stale numbers had nothing behind it

**What happened.** Chapter 14 states the rule plainly: *a document carries its
own stale numbers forward until something re-reads it against the source*.
Nothing re-read it. `verify-handover-claims.mjs` re-derives HANDOVER.md against
the clone and opens no chapter, which is why its headline is 63 of 63 handover
claims and not a figure about the thesis at all. Three scripts do open
`thesis/`: one checks quotations, two are instruments built for a single
section. So none of the 153 **[reported]**, 12 **[outside]** and 2 **[read]**
markers in the chapters is read by anything that runs, and
[4.45](#445-a-chapter-published-a-constant-that-another-chapter-of-the-same-study-had-already-recorded-as-reverted)
went undetected for exactly as long as that was true. The study's own closing
lesson, build the check rather than the rule, had been applied to the corpus
and not to itself.

**What was built.** `probe-consistency.mjs`, in two halves of unequal strength.
The ratio half keys every "N of M" by denominator and the three content words
around it: 104 keyed ratios, one key carrying two numerators, and that one is a
false positive, Turkish against a denominator of four, where the method log
counts lines identified and chapter 14.1 counts losses after a repair. The
constant half checks every value written as `NAME = n` against the clone: three
asserted, two of them environment variables quoted in shell examples and so not
checkable, one checked and agreeing. It was proved by planting thirty where the
source says twenty and watching it report the difference.

**What it does not do, stated because the motive invites the opposite reading.**
The ratio half would not have caught 4.45, which was a constant and not a
ratio. The constant half sees only values written in one form, and this study
uses that form once, in the sentence 4.45 itself produced. The check is
therefore exactly as wide as the convention, and its worth is the second drift
rather than the first.

**Two defects in the instrument, both found by running it.** The regular
expression built to find the constant in the source lost its escapes in transit
and matched nothing, so every constant was reported as absent from the clone,
which is the alarming direction [the pattern across the first three](#the-pattern-across-the-first-three)
predicts. And environment variables quoted in shell examples were counted as
product constants that disagreed. Both were visible in one reading because the
output prints the source value beside the asserted one rather than a verdict.
An instrument that prints what it compared can be debugged by its reader; one
that prints only its conclusion has to be trusted, and this study has no reason
left to trust one.

### 4.47 A limit accepted as structural was one measurement from being named

**What happened.** The list of what this study never measured opens with
"anything observed in a browser", under the heading that each of them needs
something this account did not have. That sentence was never tested. The
corpus's queue says what the missing thing is, twice, and the two statements
contradict each other inside one entry: one paragraph reads the registry and
concludes *So it is neither the registry nor the install: the extension simply
is not CONNECTED, which is a click in its own UI*, and the paragraph after it
restates the version that reading had just retracted, *the unblock is a
native-messaging registry key copied from Chrome to Brave*, and hands it to kil
as worth more than the bug it was blocking.

Read off the machine, both are part right and neither is the answer. Brave has
one Anthropic native-messaging host registered,
`com.anthropic.claude_code_browser_extension`, and not the other,
`com.anthropic.claude_browser_extension`, which is the host the tool reporting
no connected browser speaks to. So a key is missing, as the retracted paragraph
said, and it is one key rather than the class of them, which is what the
retraction was reaching for and overshot. Chrome has both.

**Cost.** None published: nothing in this study ever carried either version,
because this part of the queue had never been read. What it cost was the
limit's shape. "Needs something this account did not have" was carried in four
documents as though the missing thing were unknown, and it was one read-only
registry query away from being named.

**Why it happened.** A limit is easier to state than to measure, and stating it
honestly feels like the end of the work rather than the middle. The rule that
follows is the one this log keeps arriving at from new directions: **measure a
limit to its boundary, do not stop at declaring it.** A limit named to the
value, the key, the permission or the account that would lift it is an item
someone can act on. A limit named as a category is a closed door with no handle
drawn on it. The check was one query and this study ran it in the forty-seventh
entry rather than the first.

**What was not done.** The key was not written. Changing a native-messaging
registration is a change to system settings, which this account does not make,
so the finding is reported to the person whose machine it is and stops there.

### 4.48 The witness could not be run as written, and running half of it beat the prediction

**What happened.** The first candidate in the resume file carried a fully
specified experiment: hide `.kt-float-opts` in a copy of a Chrome build, never
in the working `dist/`, run `bar-widths.mjs` and `bar-live.mjs`, and if the
reading is right both stay green. It had sat there as one instrument, a
reading, waiting for something differently shaped.

It cannot be run as one gesture. `bar-widths.mjs` loads a built extension
through `KT_EXT`, and `bar-live.mjs` bundles `src/content/injector` with
esbuild when it starts and takes no build at all. A stylesheet edited inside a
copied build is invisible to the second gate, so the sentence "hide it and run
both gates" names one action that reaches one gate. Reaching the other means
editing the working tree, which is what the witness forbids.

The half that runs was run. Baseline on the intact build is green, and prints
what the reading predicted: `kt-float-lang` 41 by 24, `kt-float-power` 26 by
24, `kt-float-opts` 25 by 24, and the on-device chip already at 0 by 0, skipped
by the guard `(c.l > 0 || c.h > 0)`. On a copy with the controls hidden by
their own stylesheet, the gate is **green at all ten widths and exits 0**, and
both controls report 0 by 0, which is indistinguishable from the chip that is
absent by design.

**What beat the prediction.** Two things, and neither was in the candidate. The
declaration is a grouped selector, `.kt-float-power,.kt-float-opts`, so a single
`display:none` takes the gear and the pause button together: the experiment
that was meant to remove one route to the options page removed every control on
the bar, and the gate still reported that no width breaks it. And the 24 pixel
minimum that the gate exists to enforce, `min-inline-size:24px;min-block-size:24px`,
is a declaration in that same rule. The guarantee and the change that voids it
are one property apart, and the instrument watching the guarantee is silent.

**A mistake caught before it produced a result.** The first copy edited the
first `.kt-float-opts{` in the bundle. A later rule in the same stylesheet sets
`display:inline-flex` on the grouped selector and would have overridden it, so
the run would have come back green with the gear fully visible, and green is
the predicted answer. It would have read as confirmation. What caught it was
printing the two occurrences before running rather than after, and the habit
comes from [4.19](#419-an-enumeration-that-under-counted-which-inverts-the-bias-rule):
an instrument that can only fail toward the expected answer has to be checked
against something other than its own output.

**Why the specification was wrong.** The witness was written while reading both
gates for what they assert, and never for what they consume. Two gates that
check the same object look interchangeable in a note about the object. They are
not interchangeable in a command line, and the difference does not appear until
someone tries to type it. **An experiment is not specified until its inputs
are, and a witness nobody has run is a plan, not a witness.**

### 4.49 A gate that cannot measure reports the same exit code as one that measured

**What happened.** The second candidate said `audit_poids.py` exits 0 with a
message when `dist/` holds the instrumented build. Run against both builds with
one command, it does: on the release build it prints `228.1 Ko, ecart +0.4 Ko,
+0.16 %` and exits 0, and on the instrumented build it prints *poids non
compare* and exits 0 as well. Nothing downstream that reads an exit code can
tell those apart.

The file already owns the distinction it needs. Eight lines above the metrics
check, a missing `dist/` exits **2**, with the comment that says to build
first. An instrumented build is the same class of event, a measurement that
cannot be taken rather than one that failed, and it is the one case given the
code that means success.

**The unread question, answered, and narrower than the candidate assumed.** The
runner cannot reach it. There are 40 gates and `audit-poids` is the 38th, and
none of the three harnesses that run `build:metrics`, `metrics-offline.mjs`,
`latency.mjs` and `run-live.mjs`, appears in the gate list at all. The default
path runs a release build whose own `check-strip` step verifies that no
measurement key survives. So the gate suite never puts an instrumented build
under the weight gate. What is open is the hand path, and it is the ordinary
one: those three harnesses exist to be run by a person, and a person who reads
the counters with `metrics-offline.mjs` and then runs the gates with
`--no-build` gets a weight gate that is green without looking.

**What was not concealed, stated because a demonstration invites the opposite
reading.** The instrumented build measured 231.4 Ko, +1.62 percent against the
reference, inside the 2 percent margin. Had the gate measured it, it would have
passed. This shows the mechanism and not a regression it hid.

**Why it is worth the entry.** The candidate was a reading and it was right,
which is the less interesting half. What running it added was the exit code
next to the other exit code in the same file. That comparison is not available
to a reader of one branch: you see `sys.exit(0)` and it looks like a decision
about this case, and only the run puts it beside the `sys.exit(2)` eight lines
up and makes it an inconsistency. **A branch reads as intentional until it is
placed beside its sibling.**

### 4.50 An edit that duplicated the paragraph after it, pushed, found by reading the file for something else

**What happened.** Rewriting the first candidate in the resume file
([4.48](#448-the-witness-could-not-be-run-as-written-and-running-half-of-it-beat-the-prediction))
was done with a replacement whose new text carried the following bullet along
with it, while the text being replaced stopped short of that bullet. The result
was the weight-gate entry printed twice, identically, and committed and pushed
that way. It was found one pass later, by opening the file to edit that same
bullet for [4.49](#449-a-gate-that-cannot-measure-reports-the-same-exit-code-as-one-that-measured).

**Cost.** One pushed commit of a public repository carrying a paragraph twice.
Nothing downstream broke: the link gate counts links and the spec gate counts
conditions, and a repeated paragraph is neither.

**A second reach in the same pass, worth one sentence.** The check above was
proved by planting a duplicate and reverting it with `git checkout --` on the
file, which also discarded an uncommitted edit to that same file made minutes
earlier, and the edit had to be written twice. Both slips are one shape: an
operation whose blast radius was read as the thing it was aimed at. A probe is
planted in the file you are editing, so the revert has to be as narrow as the
plant, and it was not.

**Why it happened, and why nothing caught it.** Every gate in this repository
counts things that must exist. None counts things that must not exist twice,
and duplication is what an editing mistake produces most often, because the
common failure of a replacement is including context in the new text that was
not included in the old. The check is four lines and now runs in
`probe-consistency.mjs`, which already had the shape for it. **A suite built
entirely of existence checks is blind to duplication**, and the entry is here
rather than being quietly fixed because the same slip is available to anyone
editing these files the same way.

### 4.51 A stop condition with a term nobody could evaluate

**What happened.** The specification names three conditions for stopping and
the first is that every axis A1 to A22 is *closed, or open with a number and a
named reason*. Each of the 22 axes carries a **Bar**, the condition under which
it closes, and all 22 bars are present and specific. No verdict was ever
recorded against any of them. The axes live in appendix A, the findings live in
chapters organised by subject, and chapter 13 never names an axis once, so
there was no way to read the condition at all: not a hard way, no way.

**Corrected by [4.57](#457-the-specification-asked-for-this-file-by-name-and-for-one-more-nobody-made).**
The specification asks for this ledger by name and tells the first pass to
build it. So the gap was not unnoticed; it was an instruction that went
unfollowed for fifteen chapters, which makes the omission larger than this
entry described and makes the ledger less of an idea than a debt.

Counted by label, 19 of the 22 axes are never mentioned outside the
specification. **That number is not the finding and must not be reported as
one.** It measures citation, not coverage: chapter 13 publishes upwards of
forty numbers on detection, latency, weight, the gates and the observable
surface, and several of them answer a Bar exactly while naming no axis.
Publishing "19 axes unaddressed" would have been
[4.17](#417-published-a-false-accusation-against-complete-work) with a bigger
denominator.

**What was built.** [Appendix F](F-axis-ledger.md), one row per axis: the bar,
a verdict, and the number the verdict rests on. Entering a verdict required a
published number, so a subject discussed at length and never measured against
its bar stays unrecorded. The result: **11 axes carry a verdict, 11 do not, and
none is closed.** The most any axis reaches is open with a number, which the
specification accepts as a resting state and which is the honest description of
an audit that measured a great deal and finished nothing.

Three of the eleven verdicts came from this session's own passes without anyone
having named them as axis work at the time: A7 from the hidden-control run
(4.48), A6 and A13 from the weight gate (4.49). The ledger did not need new
measurement so much as it needed somewhere to put the measurements that
existed.

**Cost.** The first stop condition has been unreadable for the length of the
study, which means every earlier statement about how near this work was to done
rested on the other two conditions and on an impression standing in for the
first.

**Why it happened.** The specification and the results were written at
different times for different readers, and the axis is a unit that only the
specification uses. A document organises by what it is arguing; a condition
counts by what it was specified against; and when those two shapes differ,
nothing fails, the count just silently stops being possible. The check now
runs: `axis-ledger.mjs` fails if the specification and the ledger disagree
about which axes exist, and prints the verdict count, which is the condition.

**The same mistake, twice in two passes.** [4.50](#450-an-edit-that-duplicated-the-paragraph-after-it-pushed-found-by-reading-the-file-for-something-else)
records reverting a planted test value with `git checkout --` on a file that
also held uncommitted work. The negative control for this pass planted a
deleted row in appendix F and reverted it the same way, and appendix F was
untracked, so git restored nothing and the row stayed deleted. Same operation,
same pass structure, a different reason for it to fail. This log already says
that a diagnosis propagates when something runs and not when it is written
down, and this is the third time this study has proved it on itself. **Plant
the control in a copy, or write the restore before the plant.**

### 4.52 The reproducibility claim nobody had run, and it holds exactly

**What happened.** A15's bar asks three things and the middle one is the
expensive one: a rebuild of the tagged commit must match the digest the forge
publishes for that release, or the difference must be named and attributed to a
specific non-deterministic input. Nothing in this study had ever rebuilt
anything.

It was run. `v2.10.0` was checked out into a detached worktree so the working
tree was never touched, the lockfile was confirmed unchanged between the tag and
`master` so the installed dependencies were the tag's, and both archives were
built and packed:

| archive | rebuilt | published |
|---|---|---|
| chromium | `8c8d7eca262b1942cf5736bbe4b47e7b6d907d836b88d17d6503422d56c0c8a6` | identical |
| firefox | `4f8450494d7e30f051295a4572209a3280479184b579a55e14f42ef642a14d24` | identical |

**Two of two, byte for byte**, and on Node 22 while `.nvmrc` pins 20 and CI
builds on it, so the result is stronger than the bar asks: reproducible across a
Node major, not merely on the machine that made it.

**Why it held, which is the part worth transferring.** `scripts/pack.ts` does
not use a zip library. It emits the format by hand, sorts every directory entry,
and writes a fixed DOS date of 1980-01-01 with the comment *so the output is
reproducible*, then prints the archive's own sha256 next to a note that the
build used a different Node than CI pins. Someone built this expecting exactly
this comparison to be made, and then nobody made it for two releases. The
instrument was waiting.

**What is not closed.** Six places carry a version and there are three answers:
2.10.0 in `package.json`, the built manifest, the tag and both release assets;
**2.9.2 on the Chrome Web Store**, 112 users, updated 30 August; **2.7.0 on
AMO**, 4 users, updated 16 August. Both store figures were read from the stores,
which the bar requires in those words. The lag is a pending submission that the
queue already records as blocked on kil, so it is a waiting state rather than a
disagreement, and it is recorded as a number rather than excused.

And the bar's first clause is unmet outright: *checked by a gate rather than by
eye*. None of the 40 gates in the runner matches version, release, manifest or
tag. `state.mjs` computes the comparison into `ETAT.json`, but that file's own
header says it is generated and that the committed copy describes the state
before the commit that generated it, which is a report about the past, not a
gate on the present.

**Why the entry.** The measurement cost one worktree and four minutes, and the
claim it settles is the one a reader of a release actually depends on: that the
archive they download is the one the tag describes. It sat unmade while this
study wrote fifteen chapters, because it was filed under an axis nobody had a
row for, which is [4.51](#451-a-stop-condition-with-a-term-nobody-could-evaluate)
in its practical form. **The ledger's first act was to point at a four-minute
measurement that had been waiting for two releases.**

### 4.53 A probe built for one finding refuted the finding, before it was published

**What happened.** A16's bar forbids a screenshot showing a real person's
handle or message, in those words. Five screenshots are tracked. Four are
produced by `store-shots-fixture.mjs`, a harness written so that the room, the
handles and the messages are invented and the engine is answered locally. The
fifth, `screenshots/japanese-chat.jpg`, is three months older, is the only one
that is not a `.png`, is produced by no harness, and opened and looked at, it
shows four real handles and their messages. The handles are not reproduced
here.

A search over the reader-facing documents for the file's name found nothing, so
the account being written was: the replacement was built, the old artefact was
left behind, nothing pointed at it and that is why it survived, and no check
that works by following references could ever see it.

**That account is wrong.** The probe written to support it,
[`probe-orphan-assets.mjs`](D-scripts/probe-orphan-assets.mjs), enumerates
tracked images instead of following references, and it reported the file as
referenced. The reference is in `screenshots/README.md`, a file the search had
not covered because the search ran over a hand-written list of top-level
documents. That README states the whole thing plainly: it says the image this
replaced *carried four real handles*, and it says `japanese-chat.jpg` *is kept
as the record of what the earlier capture looked like* and *is no longer
referenced by any README*.

So nothing was left behind by oversight. The team diagnosed it, wrote the
replacement, removed every reference, documented the decision, and chose to
keep the file. Publishing the first account would have been
[4.17](#417-published-a-false-accusation-against-complete-work) again, against
work that is not merely complete but unusually careful about exactly this.

**What survives, and it is smaller and real.** The bar is about what the
repository contains, not about what its READMEs link. A tracked file in a
public repository shows four real handles whether or not anything points at it,
and the retention reason, being *the record of what the earlier capture looked
like*, is now also served by the sentence in `screenshots/README.md` that
describes it. The prose carries the record; the image adds the handles. So A16
rests open with a documented trade rather than closed, and the trade is the
owner's to make, not this study's.

**Why the entry.** The probe was written to demonstrate a finding and refuted it
on its first run, which is the best thing an instrument built this way can do
and the reason to build it before writing rather than after. The reading and
the enumeration disagreed, and the enumeration was right because the reading had
a hand-written list in it. **A search over a list you wrote is a search over
your own assumptions**, and a search over what the repository actually contains
is not.

One defect in the probe, found in the same minute. It printed the basename of
the referencing document, so `screenshots/README.md` appeared as `README.md`,
which is the top-level file the search had already covered. For a moment the two
results looked like a contradiction rather than a location. It prints the path
now, and the comment says why.

### 4.54 Seventeen advisories, none of which ship

**What happened.** A11's bar opens with *zero advisories above the severity
floor in the budget file*. `npm audit` on the repository reports **17: three
critical, nine high, four moderate, one low.** That number was not written down,
because the bar is about what the extension ships and `npm audit` is about the
whole tree. Re-run against production only: **zero, at every severity.** The
four runtime dependencies are `franc-min`, `idb-keyval`, `preact` and `zod`, and
not one of them carries an advisory. All 17 are in the twenty devDependencies,
which never enter a bundle.

Reporting 17 would have been the alarming direction again, and this log has now
recorded that direction enough times that the split was done before the number
was written rather than after. **The rule that produced the right answer was
cheap: before publishing a count, ask which population the bar is about.**

**What the bar cannot be read against.** There is no budget file. No audit
script, no audit configuration, nothing that names a severity floor. The clause
refers to a document that does not exist, which is
[4.51](#451-a-stop-condition-with-a-term-nobody-could-evaluate) at the scale of
a single axis rather than of the whole specification: a condition that reads as
a requirement, and cannot be evaluated because the thing it measures against was
never written.

**What is genuinely open, and it is the part the axis says it is really about.**
The bar ends *finding the extension costs a page script a read of rendered
content, never a query by name.* Enumerated in the content script, there are at
least four queries by name on the host page, and they cover four of the eight
categories the axis lists in its own text:

- an identifier on a node attached to a shared root: `#kt-floating-bar`
- a marker written onto the host's own nodes: `data-kt-id`, on Kick's chat rows
- an attribute set on the document element: `data-kt-scheme`
- a class toggled on the document element, beside 79 distinct `kt-` names

Each has a plausible product need and at least one has its rationale written
beside it. What no document does is **count them**, and the axis names that
exact failure: *the trap this axis is really about: closing one vector and
recording the question as settled.* Nothing in either repository names the
detection surface, so there is no record of a vector having been closed, and no
record of one having been left open either.

**One clause closed sideways.** The bar asks that zero instrumentation in a
release bundle be *proven from the archive*, and `check-strip` proves it from
the build directory instead. Those are the same claim here, but only because
[4.52](#452-the-reproducibility-claim-nobody-had-run-and-it-holds-exactly)
showed the archive rebuilds byte-identical from the tag. A clause that was
weaker than it asked for is carried by a measurement taken two passes earlier
for a different axis, which is an argument for the ledger: the evidence for one
bar frequently sits under another.

### 4.55 The fourth alarming first number in five passes, and the rate is now the finding

**What happened.** A19's bar contains one clause the axis says a gate can
check: a counter and the population it is divided by share a prefix and differ
by a final segment, and *a numerator whose denominator does not exist under the
same prefix is a gate failure*. Thirty-six counters and timings were enumerated
from the call sites, and the rule was applied mechanically: 20 counters under 15
prefixes, **12 of 15 prefixes holding a single counter**.

That number is wrong by a factor of four. The rule was applied as written and
the code uses a shape the rule does not describe: `retry.normalized` and
`retry.normalized.answered` are a pair, a total and a sub-count, and the
mechanical grouping split them because one is a prefix of the other rather than
a sibling of it. Dynamic keys are a third shape: `skip.${reason}` expands at
runtime into a family that sums to its own denominator. Counting all three
shapes, **3 of 20 counters have no denominator readable beside them**:
`dom.attach`, `drop.recycled.unrescued`, `google.batch.fallback`. Two of those
three carry a word in their own name that implies a ratio, which is what makes
them worth naming at all.

**The rate, which is the reason this entry is not just another correction.**
Counting this session's passes over the specification:

| pass | first number | after checking |
|---|---|---|
| [4.44](#444-three-structural-findings-in-the-file-the-reading-list-named-next-and-two-of-them-died-on-contact) | three structural defects in the queue | one, and it was not a defect |
| [4.53](#453-a-probe-built-for-one-finding-refuted-the-finding-before-it-was-published) | an artefact left behind unnoticed | kept deliberately, documented |
| [4.54](#454-seventeen-advisories-none-of-which-ship) | 17 advisories, 3 critical | 0 reaching the bundle |
| this one | 12 of 15 prefixes unpaired | 3 of 20 counters |

Four passes, four first numbers that were alarming and wrong in the same
direction. That is not four accidents. [The pattern across the first three](#the-pattern-across-the-first-three)
in this log says a probe that is wrong is almost always wrong in the alarming
direction, and states it about probes. **It is a property of first passes, not
of probes.** A first count applies a rule to a population before the population
has told you which rule it obeys, and a rule applied early fails by finding
violations, never by finding compliance. So the useful form of the rule is a
number rather than a warning: on this specification, in this session, the first
count has been wrong four times out of four, and it has always been too high.

**What else A19 leaves open.** [Chapter 13](../thesis/13-results.md) publishes a
6.7 percent in-tab cache hit rate and a 1.0 percent persistent rate, 8 hits in
821 lookups, and does not say that these come from an instrumented build. The
same chapter says elsewhere that the release strips instrumentation, so the two
statements sit a few lines apart without being connected, and a reader can take
figures that only an instrumented build can produce as describing the product
they installed. The figures are `[reported]` and there is no reason to doubt
them; what is missing is the build they describe.

### 4.56 A keepalive that asks for less than the platform will give

**What happened.** A5's bar opens with *no state lives only in worker memory*.
Seven pieces of mutable module-level state exist in the service worker and six
of them live only there. Four are round-robin indices and quota caches whose
loss costs a refetch and nothing else, and `settings` is the exception: it is
reloaded with `loadSettings()` when the worker starts, so it is not
memory-only at all.

The one that matters is `channelBuckets`, a `TokenBucket` per channel, sized
from `perChannelBudgetPerMin` and consulted before every request. `bucketFor`
recreates a missing bucket **full**, both capacity and initial tokens set to the
budget, so a worker restart hands every channel a fresh minute's allowance
regardless of how much of it was spent a second earlier. The default budget is
200 a minute. Under MV3 the worker is evicted after about thirty seconds idle,
so a per-minute limit that resets on eviction is not a per-minute limit; it
under-limits, which is the opposite of the direction the axis's *breaks as*
sentence describes and is the more interesting one, because the endpoints this
product calls are the kind that soft-ban per IP.

**The part worth the entry.** A keepalive exists and is wired in, an alarm that
touches `storage.session` with the comment *to keep the MV3 service worker alive
across burst-idle periods*. It asks for `KEEPALIVE_INTERVAL_SEC = 25`, which
reaches `chrome.alarms.create` as `periodInMinutes` 0.4167. **[outside]** The
minimum `chrome.alarms` documents is 0.5, thirty seconds, and a smaller period
is raised rather than honoured. The number 25 was almost certainly chosen to sit
just under the thirty-second eviction timeout, which is exactly the reasoning
the clamp defeats: the one value that would have worked is the one value the
platform will not accept.

Nothing in the repository records the clamp. Not a comment beside the constant,
not a note in the queue, not a line in the journals. A constant chosen against a
platform limit, with the limit unwritten, reads as a deliberate margin to
everyone who comes after, and there is no way to tell from the code whether the
author knew.

**What this is not.** It is not a measurement of eviction. A busy chat keeps the
worker alive on traffic alone, so how often this happens in use is unknown, and
the axis asks for the witness that would settle it: kill the worker by hand
between two messages and see whether the first one after the wake translates.
That witness has never been run, here or in the corpus. The finding is that the
protection asks for something it cannot get, not that the protection is known to
fail.

**And the third clause cannot be read.** The bar asks that the added latency
after eviction be under *the ceiling in the budget file*. There is no budget
file, which [4.54](#454-seventeen-advisories-none-of-which-ship) established
against a different axis. Two of the 22 bars now refer to that same missing
document, so it is not a local omission in one axis's wording: the
specification was written expecting a file that was never created.

### 4.57 The specification asked for this file by name, and for one more nobody made

**What happened.** [4.51](#451-a-stop-condition-with-a-term-nobody-could-evaluate)
records building the axis ledger to make the first stop condition readable, and
describes the gap as something nobody had noticed. That is not what happened.
The specification asks for the ledger explicitly, under a heading about the
first pass, and tells the reader how to make it: *create the ledger with one
line per axis, every one of them marked unexamined. That is an honest state and
it takes minutes.*

So the ledger was not an idea this study had. It was an instruction this study
was given and did not follow, through fifteen chapters, and the correction to
4.51 is that the omission is larger rather than smaller than that entry says.
The same passage names the failure mode it was guarding against: *the failure
mode of a first pass is spending it on the file and not on the product.* This
study spent every pass on the product and never made the file, which is the
same error reflected.

**The second artefact, and it is the one that matters now.** That sentence asks
for two things: *the ledger and the budget file are asked for by this document
and will not be there the first time it is read.* There is no budget file.
Counted across the 22 axes, **seven bars state their threshold as a ceiling, a
floor, a count or a rate in the budget file**: A3, A5, A6, A11, A13, A18 and
A21. The first count said eight and included A22, whose bar does not name it at
all; [4.58](#458-the-budget-file-exists-now-and-the-count-that-justified-it-was-wrong)
records how the extraction produced that and what it cost. Those seven are not
open because measurement is hard. They are unreadable because the document they
compare against was never written, and each pass that reaches one of them
rediscovers that at its own cost. This has now been found three times from
three different axes before anyone counted it.

**The step this file was still missing.** The same first pass has a step two:
*walk the index and mark each axis with the instrument it needs and whether that
instrument exists on this machine today. Now the queue is real.* Appendix F had
verdicts and no instruments. It has both now, and the answer is uncomfortable:
seven axes need an instrument that exists in the repository and has never been
pointed at them, one needs something this account does not have and whose
missing value is named to the registry key, and **no axis is blocked by an
instrument that could not be built**.

**And a defect in the gate, made by this edit and caught by running it.**
`axis-ledger.mjs` counted every table row whose first cell is an axis label.
Adding the instrument table gave it a second population and it reported 38
verdicts against 22 axes **without failing**, because both tables happen to
contain all 22 labels so the missing-and-extra checks stayed green. A check that
silently widens its population is precisely what
[A19](#455-the-fourth-alarming-first-number-in-five-passes-and-the-rate-is-now-the-finding)
exists to catch in a counter, and it was in the gate written to read the file
that records A19. It is scoped to the ledger table now, and it exits 2 rather
than 0 if that heading ever disappears.

### 4.58 The budget file exists now, and the count that justified it was wrong

**What happened.** [4.57](#457-the-specification-asked-for-this-file-by-name-and-for-one-more-nobody-made)
reported that eight of the 22 bars state their threshold in the budget file, and
listed A22 among them. A22's bar does not mention it. The match came from the
sentence *the ledger and the budget file are asked for by this document*, which
sits in the section about a first pass, after the last axis in the file.

The extraction bounded each axis's body by the next axis heading. The last axis
has no next axis, so its body ran to the end of the document and absorbed every
section after it. That is the whole error: a boundary rule that is correct for
21 cases and silently wrong for the one at the end. It is bounded by the next
heading of any level now, and the comment says why.

The real count is **seven**: A3, A5, A6, A11, A13, A18, A21. The wrong number
had reached four documents and one pushed commit before the check that found it
was written, which is the argument for writing the check in the same pass rather
than the next one.

**Fifth in a row, and the rate has stopped being a surprise.**
[4.55](#455-the-fourth-alarming-first-number-in-five-passes-and-the-rate-is-now-the-finding)
counted four first numbers that were too high. This is the fifth, and it differs
from the other four in a way worth recording: the first four were rules applied
to a population before the population had shown which rule it obeyed. This one
was an off-by-one at a boundary, which is the oldest bug there is. **The rate
does not have a single cause, and a rate with several causes is not a lesson
about method, it is a reason to check.** A study that has been wrong high five
times out of five on first counts should publish no first count.

**What was built.** [Appendix G](G-budget.md), the second artefact the
specification asks for, in its first honest state: **two of the seven axes carry
a number**, A6's weight reference and margin, which already existed inside
`audit_poids.py` rather than in a shared file, and A11's advisory floor, which is
zero in the production tree and is a measurement rather than a tolerance. The
other five say what would set them and whether the instrument exists, and for
five of those the instrument is already in the repository.

The empty rows are the point. A budget file full of plausible ceilings would
read as evidence, and a bar compared against an invented number returns a
verdict instead of a silence, which is worse than having no file at all.

`axis-ledger.mjs` now fails when a bar names the budget file and appendix G has
no row for it, so the two cannot drift apart again without something going red.

### 4.59 A bar that is satisfied while the failure its own axis names is reachable

**What happened.** A3's bar reads *what is sent is exactly what the preview
showed*, and the outgoing path meets it. `handleInsert` inserts
`this.lastTranslation`, which is the same value `updateComposePreview` rendered,
so the two cannot disagree. Handles and URLs are stronger still: `maskProtected`
swaps them for `⟦n⟧` sentinels before the request, the engine never sees them,
and `unmaskProtected` puts the originals back before the text becomes
`lastTranslation`. Character-identical by construction rather than by assertion.

The same axis opens with *breaks as the reader ... sends the preview text rather
than their own*, and that is reachable. When the composer's own limiter refuses,
`compose.ts` returns with the comment *keep last preview; next pause will retry
as the window slides*, and calls `setComposeThrottle(true)`, which writes
`panel.dataset.throttled` and nothing else. The panel is a styling hook away
from unchanged: it stays mounted, `isComposePreviewVisible()` stays true,
`Ctrl+Enter` still routes to `handleInsert`, and `handleInsert` guards on
nothing but the composer and the translation existing. So a reader who types,
gets a preview, types more, is throttled, and presses the shortcut inserts the
translation of what they had typed a moment ago.

**Both sentences are true at once**, and that is the entry. What is sent is
exactly what the preview showed. The preview is not what the reader is looking
at in their own composer. The bar guarantees preview-to-insert agreement and the
risk lives in preview-to-composer agreement, which no clause in the axis names,
though the axis's first paragraph describes its consequence.

**Why it is worth recording as a defect in the specification rather than in the
product.** A bar is a sentence someone writes while looking at a mechanism, and
the mechanism it was written against here is the insertion. Nothing about the
wording is careless: it names an invariant, the invariant holds, and a gate
built on it would be green forever. The distance between *the thing the bar
says* and *the thing the axis is afraid of* is one hop, and a single hop is
exactly the distance a specification cannot see across, because whoever wrote
both sentences believed they were about the same event.

The generalisable form, and this study has now met it three times from three
directions: [4.49](#449-a-gate-that-cannot-measure-reports-the-same-exit-code-as-one-that-measured)
found a branch that reads as intentional until placed beside its sibling,
[4.56](#456-a-keepalive-that-asks-for-less-than-the-platform-will-give) found a
constant that reads as a margin until placed beside a platform limit, and this
one finds a bar that reads as a guarantee until placed beside the failure its own
axis describes. **Each is a statement that is locally true and wrong about what
it is for, and none of the three is findable by checking the statement.**

### 4.60 One selector without a fallback, in a file that gives fallbacks to everything else

**What happened.** A4's bar asks that every selector have at least one fallback
or a named reason it cannot. Five groups of host-page selectors exist and four
of them are better than the bar asks. `containers` lists six candidates and
labels three of them *Legacy fallbacks*. `COMPOSE_SELECTORS` lists seven, says
they are ordered most-specific first, records that the live shape was verified
in 2026, and names what happens if all seven miss: *the feature simply doesn't
mount (graceful no-op)*. `extractUsername` tries four in sequence, each with a
comment saying which Kick variant it is for, one of them dated to a live check
in August. `pickInjectionTarget` falls back to the row's first child and then to
the row itself, so it cannot return nothing.

The fifth is `messageRows: ['div[data-index]']`. One selector. No alternative,
and no sentence anywhere saying why it has none. The file explains what
`data-index` is, that the virtualiser recycles it, and that it is too weak to
serve as an identifier on its own, which is why `buildSyntheticId` hashes a
username and a text prefix into it. Every one of those sentences is about the
attribute's value, and none is about the selector's fragility.

**Why it is the one that matters.** It is the load-bearing selector. The
container has six ways to be found, so if Kick renames the row attribute the
observer still attaches to a real container, the status still reports a live
attachment, and no row is ever recognised. That is A4's *breaks as* sentence
returned verbatim: *Kick ships a class name change on a Tuesday and the
extension goes quiet, with a green bar still claiming it is live.* The axis
describes the failure, and the one selector positioned to cause it is the one
without the protection the axis asks for.

**What this is not.** It is not a careless file. Four groups out of five exceed
the bar and one of them carries a dated live verification, which is rarer in
selector code than any fallback. The gap is a single line among two hundred, and
the interesting question is how a line like that survives in work of that
standard.

The answer visible from here: **a fallback chain is written when the author has
seen the thing break more than one way.** Containers, composers and username
markup have all changed shape on Kick and each change left a candidate behind in
the list, which is why those lists are long. `div[data-index]` has never
changed, so nothing has ever added a second entry to it. A fallback list is a
scar record, and the selector with no scars is the one with no protection,
which inverts the intuition that the stable thing is the safe one.

### 4.61 Deleting the dependency tree of the repository under study, through a junction

**What happened, and it is the worst thing this session did.** Measuring A15
([4.52](#452-the-reproducibility-claim-nobody-had-run-and-it-holds-exactly))
needed a build of the tagged commit, so `v2.10.0` went into a detached worktree
under the system temp directory and its `node_modules` was supplied as a
**directory junction** pointing at the corpus's own, because the lockfile was
unchanged between the tag and `master` and copying 280 packages was avoidable.

When the worktree was removed, the cleanup was `git worktree remove --force`
followed by `rm -rf` on the same path. `rm -rf` walked through the junction and
deleted what it pointed at. The corpus's `node_modules` went from 280 entries to
zero.

Nothing noticed for two passes. `node_modules/` is gitignored, so
`git status --short` stayed empty and the sentence this study repeats after every
pass, *working tree clean*, stayed true and stopped meaning anything. It
surfaced only when `npm run build:metrics` could not find `cross-env`, four
commands into an unrelated measurement.

**Cost.** None permanent. `npm ci` restored 280 entries from the lockfile, the
release build produced a byte-identical `content.js` at 228.1 KB, and the weight
gate read `+0.16 %` exactly as it had before. But for two passes this study held
a broken checkout of the repository it exists to describe, and reported clean
trees the whole time.

**The third of its family, and the family now has a name.**
[4.50](#450-an-edit-that-duplicated-the-paragraph-after-it-pushed-found-by-reading-the-file-for-something-else)
reverted a planted test value with `git checkout --` on a file that also held
uncommitted work, and lost the work. [4.51](#451-a-stop-condition-with-a-term-nobody-could-evaluate)
did the same on a file that was untracked, so git restored nothing and the
planted deletion stayed. This one reached through a junction. Three different
operations, three different mechanisms, **one shape: a cleanup whose reach was
read as the thing it was aimed at.** A junction is the sharpest of the three
because the whole point of a junction is that it is not a copy, and the whole
point of `rm -rf` on a scratch directory is that nothing inside it matters.

**What the check would have been.** Not vigilance. `git status` cannot see an
ignored directory emptying, and that is correct behaviour, so the check has to
be somewhere else: a harness that needs `node_modules` should say so when it is
absent instead of failing four commands later on a missing binary. The corpus
already does this in two places, `playwright.mjs` exits 2 with instructions when
Playwright is missing and `metrics-offline.mjs` exits 2 when `dist/` carries no
metrics, and both of those distinctions are the reason this was diagnosed in one
command once it did surface. **The repository had the pattern; the thing that
broke was outside everything that uses it.**

**And do not link a live tree into a scratch directory.** Copy, or point the
tool at the original. The four minutes saved bought a two-pass silent breakage.

### 4.62 Three numbers the code says were guessed, and the run that read them back was empty

**What happened.** A21 asks that requests under refusal never exceed a count,
and that a refusal escalate the chain rather than repeat it. Both are answerable
from the source, and both answer well. Per-provider health carries
`consecutiveFailures` and `cooldownUntilMs`, the candidate list is filtered to
providers whose cooldown has expired, and the `rate_limit` ladder is
`min(10_000, 1500 * 2 ** (cf - 1))`. So the chain escalates by construction, and
sustained refusal settles at one attempt per ten seconds per provider: **six a
minute per provider, twenty-four across the four**. That is now the budget
file's A21 entry, marked as derived from the ladder rather than observed,
because it is what the code permits and not what anything watched.

**The comment beside it is the finding.** Three lines under the ladder:

> Which provider cools down, on what code, and for how long. Those are the
> three numbers the backoff ladder above was guessed from, and none of them has
> ever been read back.

The author wrote the constants, knew they were guesses, instrumented the two
counters that would check them, said in the file that nobody had read them, and
shipped. That is an unusually complete piece of honesty and it is also a
complete failure loop: the diagnosis, the instrument, and the note that the
instrument is unread, all in one place, with nothing running.

**And the run that finally read them was empty.**
[4.61](#461-deleting-the-dependency-tree-of-the-repository-under-study-through-a-junction)
records `metrics-offline.mjs` being run for the first time in this study. It
prints every counter that fired, and `cooldown.trip` and `cooldown.ms` are not
among them, because that harness answers the translation engine from a local
fixture and a fixture never refuses. **So the three numbers have still never
been read back, and the instrument that would read them cannot, in the only
configuration anyone runs it in.**

That is a sharper thing than an unread counter. A counter nobody looks at is a
habit. A counter whose only offline harness makes its subject impossible is a
structural hole: the harness was built to remove the network, the counter exists
to measure what the network does when it refuses, and the two cannot be in the
same room. Closing it needs a fixture that refuses on purpose, which is one
branch in a file that already intercepts every request, and the same branch
would serve A21's rate clause and the whole `chain.depth` family.

**What is still open in A21 and is not about refusal.** `saveSettings` takes a
`Partial<Settings>` and writes `{ ...current, ...patch }`, so it merges rather
than overwrites, which is what A5's bar asks for and what this one asks for
under concurrency. But the read and the write are separate awaits. Two tabs that
both read before either writes will each merge onto the same stale `current`,
and the second write wins on every field the first one changed. The bar says no
setting loses a write under concurrent tabs, and this one can.

### 4.63 The specification survives only in this study, and the frame never mentions it

**What happened.** A9's bar asks that no value fall outside *the declared set*.
Counted from `inject.css`: 13 custom properties, all `--kt-lp-*` and scoped to
one surface, against 135 distinct literal colours, 5 radii and 22 transition
declarations. No document in either repository declares a palette. So the
clause refers to a set nobody wrote, which is the third artefact in that
position after the budget file and the ledger.

Looking for that set turned up something larger. The only occurrences of the
phrase *declared set* anywhere in the corpus are in
`scratchpad/PROMPT-PERFECTION.md`, which is the audit specification itself,
living in the repository under study.

**Two copies exist and they are not the same.** The corpus's is 967 lines and
**21 axes**. This study's [appendix A](A-audit-prompt.md) is 1153 lines and
**22**, the extra one being A22, the auditor, which
[4.15](#415-the-specification-had-no-axis-for-the-thing-producing-its-findings)
records adding. Compared section by section, nothing was removed: the study's
copy is a superset, the same 21 axes plus A22 and about 11,800 characters of
refinement.

**And the corpus's copy is not in the repository.** `.gitignore` line 25 is
`scratchpad/*`, and the exceptions beneath it un-ignore `scratchpad/harness/*.mjs`
and `scratchpad/audit_*.py`. `PROMPT-PERFECTION.md` is neither, so it is
untracked: it exists on one machine, and a fresh clone gets nothing. Worse for
its chances of being found, `.agent/PROMPT.md`, the frame every session is
handed, **never mentions the specification at all**.

So the finding is the opposite of the one being drafted. The study did not fail
to return its improvements to the corpus. **This study's appendix A is the only
published copy of the specification that exists**, and it is also the better
one.

**The parallel is exact and it is already in the handover.** The first item
there says the frame tells every session a fresh clone has no harnesses when it
has 56, and the reason 56 survive is that someone added two exception lines to
`.gitignore` so that tracked scripts would survive a machine. The file that
tells a session what to audit did not get those lines. The repair is one more
exception, or a pointer in `.agent/PROMPT.md` to the published appendix, and the
second is better because the published copy is the one with A22 in it.

**Why the first draft of this entry was wrong, which is the fifth time.** It
read "two copies, the corpus's is the one sessions use, the study's improvements
never went back" and that is a coherent story built on one unchecked assumption:
that a file sitting in a working tree is in the repository. `git ls-files` is
one command and it inverted the conclusion. **A file you can open is not
evidence that anyone else can.**

### 4.64 The first stop condition is met, and none of the 22 axes is closed

**What happened.** A12 was the last axis without a verdict and was recorded as
blocked, because 4.47 had named the missing value that would let this account
see a signed-in browser. Reading the bar rather than the note showed the block
covers one clause of three. *Cross-browser reality* is about engines claimed in
the README, and two of its three clauses are answerable from a build.

Both engines were built and their manifests compared key by key. They differ in
**exactly two of fourteen**, `background` and `browser_specific_settings`, and
those are exactly the two branches in `manifest.config.ts`. Nothing else
diverges. So the property the bar's missing gate would protect is **true today**,
and no gate protects it: none of the 40 in the runner matches firefox, gecko,
drift or parity. A measured invariant with nothing watching it is the same
shape as [4.46](#446-the-rule-about-stale-numbers-had-nothing-behind-it), a rule
with nothing behind it, arriving from the other end.

One of the two branches carries the version comment the bar asks for, and it is
exact: `strict_min_version: '121.0'` with *FF 121+ : ES-module background scripts
(`background.type: module`) and storage.session both require it*. The `background` branch carries
none, although that sentence is its reason too. The knowledge exists and sits
beside the other branch.

And the README claims four engines, Chrome, Brave, Edge and Firefox. Chromium's
end-to-end path passes. Brave was measured identical to Chromium on one path by
the corpus, anonymously. **Edge has never been measured and Gecko has never
been run end to end**, the second because Playwright has no extension-loading
equivalent for Firefox, which is a limit of the instrument and not of the
product.

**Where that leaves the specification's own three conditions.**

| | |
|---|---|
| Every axis closed, or open with a number and a named reason | **MET**, 22 of 22 |
| `PLAN.md` holds nothing but items blocked on kil | not met, 7 open, 6 blocked, 101 done |
| Two consecutive passes produced no new measurement | not met, every pass produced one |

The first is met for the first time, and it took building the file that records
it ([4.51](#451-a-stop-condition-with-a-term-nobody-could-evaluate)), finding
that the specification had asked for that file by name
([4.57](#457-the-specification-asked-for-this-file-by-name-and-for-one-more-nobody-made)),
and then measuring the twelve axes that had never been compared to their bars.

**And the number that matters is the other one: zero axes are closed.** Every
one of the 22 is *open with a number*, which the specification accepts as a
resting state and which is the honest description of an audit that measured a
great deal and finished nothing. A15 came closest, with its reproducibility half
closed against a published digest. Three bars refer to artefacts nobody made,
two of which now exist because this session made them. **Meeting a stop
condition is not the same as being done, and the specification is careful enough
to say so: it requires all three.**

### 4.65 Measured a thing whose answer was fifty-six lines further down the file I had stopped reading

**What happened.** [4.53](#453-a-probe-built-for-one-finding-refuted-the-finding-before-it-was-published)
measured the three localised READMEs and reported that their what-new sections
head at 2.8.1 while the product is at 2.10.0, that all three link that heading
to `releases/latest` so the heading and its destination disagree, and that none
carries the version line the bar allows instead. Every one of those is correct.

The corpus's queue holds an open item saying the first of them, at
`.agent/PLAN.md:486`: *their release-note sections stop at 2.8.1 while the
product is at 2.10.0.* The reading position recorded at the time was L430. **The
answer was fifty-six lines past where the reading had stopped.**

And the entry carries a second defect that was not found by measuring: *the alt
strings written for the new images were written without a native reader, in es,
pt-BR and ja*. That is an accessibility fault in three languages, it is already
known, already open, and nothing in this study mentioned it until now.

**Cost.** A finding published as this study's own that the corpus had already
recorded, and a second one beside it missed entirely. Nothing false was
published: the numbers agree, which is a small mercy and also the reason it
went unnoticed for six passes.

**Why it happened, and it is not [4.22](#422-read-an-early-entry-missed-the-later-one-that-settled-it).**
That entry is about searching by topic and landing on a superseded passage. This
reading was by position, which is the correct method, and it was interrupted:
the pass stopped at L430 to go and measure, and the measurement was about
exactly the subject the next page of the file discusses. The method was right
and the sequencing was wrong.

**The rule, and it is cheap.** A reading and a measurement of the same subject
compete, and the reading is the one that can tell you the measurement is
unnecessary. **Finish the file before measuring what the file is about**, or
accept that every measurement taken mid-read is a coin flip between a discovery
and a rediscovery. This study has now spent one pass on the wrong side of that
flip, and the flip was avoidable by reading fifty-six more lines.

### 4.66 A store figure that moved, found by reading the entry that already held it

**What happened.** [4.52](#452-the-reproducibility-claim-nobody-had-run-and-it-holds-exactly)
read both store pages, as A15's bar requires in those words, and recorded Chrome
at 2.9.2, updated 30 August, **112 users**, and AMO at 2.7.0, **4 daily users**.
Continuing the reading of the queue, the open item on the install rate records
the same two pages: *Chrome carries 2.9.2, updated 2026-08-30, **75 users**, and
its description opens on "NEW IN 2.9.2"* and *AMO carries 2.7.0, reviewed
2026-08-16, 4 daily users*.

Read further, the queue dates that reading: *read off their own pages on
**2026-08-31**, rather than taken from a note*. So the interval is exact.
And the same item already states the rule this entry was reaching for: *do
not take a store version from this file: it is a page, it changes without a
commit, and it has already rotted once here.* The rule was written. What was
missing was anyone re-reading the page it warns about.

Version, date and the AMO figure agree exactly. The Chrome user count does not:
75 there, 112 here, **up 49 percent**, and both readings describe the same
version updated on the same day. Re-read a second time in this session to be
sure it reproduces: 112.

**What it is worth.** The queue's item is blocked on kil because the analytics
behind the 40.5 percent install rate need an account. The user count does not:
it is on the public page, which is why both readings exist. And the growth
happened on a listing that did not change, which speaks to that item's own
proposed experiment. The item says *the experiment is a rewrite rather than a
resubmission*; the baseline moved 49 percent without either, so a rewrite
measured against the old number would credit itself with movement that was
already happening.

**And it is [4.65](#465-measured-a-thing-whose-answer-was-fifty-six-lines-further-down-the-file-i-had-stopped-reading)
again, with the sign reversed.** Both were measurements taken while the file
that discusses them was still unread. The first turned out to be a rediscovery
of something the queue already had, at the same value. This one turned out to be
an update, because the value had moved. **The same mistake produced a waste once
and a finding once**, and nothing about how it was made distinguishes the two
cases in advance. That is the argument for finishing the read: not that
measuring mid-read is always wasteful, but that it makes the outcome a matter of
luck rather than of method.

### 4.67 Four figures re-read, three confirmed, and the fourth is not re-checkable

**What happened.** The queue's item on `node_modules` in the history carries
four measurements this study can take again without an account, and taking them
again is what [4.66](#466-a-store-figure-that-moved-found-by-reading-the-entry-that-already-held-it)
argues for.

**Confirmed, all four social figures.** *0 forks, 0 stars, 0 watchers and 0 open
pull requests*, unchanged. That matters more than it reads: the item's whole
argument for a history rewrite being safe rests on nobody downstream having a
history to break, and that premise still holds.

**Confirmed, the tooling.** `git filter-repo` is still not installed, so the
operation still needs `pip install git-filter-repo` first, exactly as recorded.

**Corrected, the clones.** The item says a sweep found *a second clone of this
repository*. Swept again: there are **three**. Two are current and sit at the
same commit, `226a176`, one under `02 - Projects` and one directly under
`Downloads`, and a hand reaching for either gets the same tree. The third is the
stale one, `_doublons/kick-chat-translator-STALE-jun2026`, HEAD `6c5d42b` of
2026-06-15, and it has been renamed since the sweep to say so in its own path.
A fourth clone matched the name but is a different repository.

**Verified by hash, which the queue could only assert.** The item says the stale
clone's five uncommitted entries hold nothing unique any more, because
`feat/transliteration-guard` is pushed. `transliterationGuard.ts` and its test
hash to `cc221f0de97714b1` and `5c0d1ec812f945be` in both places. The commit
message says *Rescue transliterationGuard exactly as it was found*, and it is
exact. The three modified source files were not compared: master has moved far
past June and a hash there would answer a different question.

**Not re-checkable, and that is the finding.** The item also says *9.49 MB of
16.41 MB on disk, 57.8 percent of the repository*. `git count-objects -vH`
answers 11.84 MiB in 7928 objects here, and the two numbers cannot be compared,
because nothing records which command produced the 16.41. A repack would change
it; so would counting the working tree, or `.git` including loose objects. **The
figure is not wrong, it is unverifiable**, which is what
[4.21](#421-a-number-whose-parameter-was-not-stated-and-a-hash-taken-without)
in this log already names: a number whose parameter was not stated. Three of
these four figures survived eight months and a change of reader. The fourth did
not survive the absence of one command line.

### 4.68 Reading the rest of the queue: what it already held, and what it does not

**What happened.** `.agent/PLAN.md` read from L700 to the end of *Waiting on
kil*. Three of this session's findings meet their counterparts there, and they
land differently.

**The store figure, dated.** [4.66](#466-a-store-figure-that-moved-found-by-reading-the-entry-that-already-held-it)
reported Chrome at 112 users against the queue's 75, and could not say over what
interval. The queue dates its reading: *read off their own pages on
**2026-08-31***. So the interval is exact, and the same item closes with the
rule the entry was reaching for, already written: *do not take a store version
from this file: it is a page, it changes without a commit, and it has already
rotted once here.* The rule existed. Nothing was re-reading the page it warns
about, which is the gap, and it is a smaller and more specific gap than a
missing rule.

**The touch targets, and the halves do not overlap.** The queue records the
same two controls this study measured, at their pre-fix sizes: the gear 25 by
19, the pause 26 by 18, and a retry arrow at 10 by 15, all against WCAG 2.5.8's
24 by 24, all made 24 tall, with `bar-widths` promoted to a gate and the witness
*removing the rule turns it red at all ten widths*. This study's run measured
the post-fix sizes, 25 by 24 and 26 by 24, which agree.
[4.48](#448-the-witness-could-not-be-run-as-written-and-running-half-of-it-beat-the-prediction)
is not the same finding and is not covered by that entry: **a control that is
shrunk is caught, a control that is hidden is not.** Hiding takes it to 0 by 0,
which the guard `(c.l > 0 || c.h > 0)` skips by design, for the on-device chip
that is legitimately absent. The gate the queue built to catch one regression
cannot see the other, and nothing says so.

**The hazard this session walked into twice, and the corpus had already named.**
An entry records that `package:all` used to leave `dist/` holding the Firefox
build, so anyone loading `dist/` unpacked got a silent extension, and *this is
what broke kil's browser after the 2.9.3 packaging*. The fix was to end the
script on `npm run build`. This session put a non-Chrome build in `dist/` twice,
once instrumented for metrics and once for Firefox, and restored with
`npm run build` both times, which is the same instinct arriving at the same
place. It was not knowledge: the entry had not been read yet. **The difference
between a habit and a rule is that the rule survives the person who had the
habit**, and the corpus wrote the rule into the script rather than into a note,
which is the version that works.

### 4.69 The changelog and the releases are two records that disagree about which versions exist

**What happened.** `CHANGELOG.md` had never been opened by this study, which
[RESUME-HERE](../RESUME-HERE.md) has said for every pass. Opened, it holds 17
version sections. Compared against the tags and against the published releases,
which A16 asks for in the words *every changelog entry against the commit that
carries it*, four versions sit in exactly one record:

| version | tag | GitHub release | changelog section |
|---|---|---|---|
| 2.8.0 | yes | **yes** | **no** |
| 2.8.1 | **no** | **no** | yes, 253 lines, the largest in the file |
| 2.9.3 | yes | no | no, and the queue explains it |
| 2.3.1 | **no** | no | yes |

**It is not a numbering slip, which was the first guess.** `v2.8.0` was
published on 2026-08-27 and its release notes describe a language button inside
Kick's message box and a light-against-dark fix. The `2.8.1` section is dated
2026-08-28 and describes a batching window and the latency it costs. Different
work. So 2.8.0's changes exist only in a GitHub release body, and 2.8.1's exist
only in a changelog, and neither record knows about the other's version.

**A statement in the queue is wrong.** It says *2.9.3 and 2.9.4 were tagged and
never published, so the changelog folds both in*. `git tag -l 'v2.9.*'` answers
v2.9.0, v2.9.1, v2.9.2, v2.9.3. **There is no v2.9.4.** The folding-in is
correct for 2.9.3; the second half of the sentence describes a tag that does not
exist.

**And it reaches the reader.** The three localised READMEs head their what-new
section at **2.8.1**, which is the version with no tag and no release, and link
that heading to `releases/latest`, which serves 2.10.0. So a Spanish, Japanese
or Brazilian reader is shown the name of a release that was never made, above a
link to a different one.

**Why this survived.** Both records are written by hand at the moment of a
release, and each is complete on its own terms: the changelog reads as a
changelog and the releases page reads as a releases page. Nothing compares them,
because comparing them requires holding both at once and no document does.
`state.mjs` reads the release, `audit-fiche` reads the listing, and the
changelog is read by people. **Two honest records disagreeing is not a lie
anywhere; it is the absence of a third thing that reads both**, which is the
same shape as [4.45](#445-a-chapter-published-a-constant-that-another-chapter-of-the-same-study-had-already-recorded-as-reverted)
one level up: a fact arrives where the argument wanted it, and nothing walks it
to the other place that owns it.

### 4.70 One table, four numbers, and the only document that tracked the drift was the one that owns it

**What happened.** The 2.10.0 changelog says *45 forms across nine writing
systems*. Counted by parsing `src/shared/laughter.ts`: **45 entries, 22 marking
a language**. The changelog is right. So is the README, which says 45.

Then the same quantity, elsewhere:

| where | forms |
|---|---|
| `src/shared/laughter.ts`, counted now | **45** |
| `CHANGELOG.md`, `README.md` | 45 |
| `scratchpad/audit_poids.py` | 44 |
| `.agent/PLAN.md`, thesis 13, thesis 14 | 43 |

**And chapter 6 already had it right, in full.** It states the reported 43, then
says *that count belongs to an earlier revision and was published without one*,
gives 44 at `16c4ce6` and 45 at the current revision, 22 in both, and records
that it counted **by importing the module rather than reading it**. That is
better than this pass did: the count here came from a regular expression, and
the first three attempts at it returned 0 because the table is named `FORMES`
and its key is `langue`, not the English words being searched for.

**So the finding is not that the number is wrong somewhere.** It is that the
chapter that owns laughter corrected the number carefully, and the two chapters
that summarise, results and limits, quote the uncorrected one. This is
[4.45](#445-a-chapter-published-a-constant-that-another-chapter-of-the-same-study-had-already-recorded-as-reverted)
running the other way: there a fact reached the chapter that wanted it and never
reached the chapter that owned it, and here it was the owner who had it and the
summarisers who did not. **Both directions fail, so proximity to the subject is
not what decides whether a correction travels. Nothing decides it. Nothing
carries corrections between chapters at all.**

Both are corrected now, and 13's row is retagged `[replicated]` because the
figure it carries is one this study counted rather than inherited.

**A fifth reading of the same quantity, in a script.** `audit_poids.py` holds 44
in a comment decomposing the weight it charges to the laughter table. It is
frozen at exactly the revision chapter 6 names, `16c4ce6`, which makes it a
fourth honest snapshot rather than an error. Left alone: it is a comment
explaining a byte count taken at that revision, and changing it would make the
arithmetic beside it wrong.

### 4.71 A version that was never cut, whose work is in the product

**What happened.** [4.69](#469-the-changelog-and-the-releases-are-two-records-that-disagree-about-which-versions-exist)
found `2.8.1` holding the largest section in the changelog, 253 lines, with no
tag and no release, and left the obvious question open: is the work there, or
does the changelog describe something that never shipped?

It shipped. The section's first claim is about the batching window, and the
reasoning it gives, *expected arrivals are rate times window, so 180ms needs
roughly five and a half lines a second*, appears **verbatim as a comment beside
`BATCH_WINDOW_MS` in `constants.ts`**. `MIN_BATCH_WINDOW_MS = 40` is the floor
the section describes. `coalescer.ts` carries `adaptiveWindowMs()` and, in a
comment, the exact defect the section's second bullet reports: *this runs only
when a new window opens, so counting here counted WINDOWS rather than messages*.

**And a measurement taken here for another reason confirms it from the
outside.** [4.61](#461-deleting-the-dependency-tree-of-the-repository-under-study-through-a-junction)
ran `metrics-offline.mjs` and read `coalesce.window` at p50 **40 ms**, which is
`MIN_BATCH_WINDOW_MS` exactly. On a fixture where messages arrive slowly, the
adaptive window sits on its floor, which is what the section says the change was
for. A `[reported]` claim about a shipped behaviour, confirmed by a runtime
reading taken before the claim was read.

**So the missing thing is a label.** No feature is absent, no reader is being
told about work that does not exist, and the version number 2.8.1 names a set of
changes that are in every build since. What it does not name is anything a user
can install, which is the whole of the defect, and it reaches three translated
READMEs that head their what-new section with it.

**Why the first framing was worth abandoning.** A changelog section with no
release invites the reading that something was written and never done, and that
reading is the alarming one, which by now is enough on its own to slow down and
check: this study's first count has been too high or too dark five times out of
five when it was not checked, and this is the sixth. The check was one grep for
a sentence from the section, in the source. **A claim that quotes its own
mechanism is cheap to verify**, and this changelog quotes its mechanisms
everywhere, which is why the check took one command.

### 4.72 Running the quotation probe on this session's own entries

**What happened.** Twenty-eight entries were added to this log in one session,
most of them quoting the corpus, and `probe-quotes.mjs` had not been run once.
It exists for exactly this: [4.42](#442-quotations-that-were-not-the-corpuss-words-found-by-something-that-runs)
built it after [4.39](#439-a-translation-in-italics-three-times-in-one-session-after-45-was-in-the-log)
found a translation set in italics as though it were verbatim.

Run: 78 attributed quotations checked, **18 not found verbatim, and 8 of them
were added this session**. Three were real.

| entry | what was written | what the source says |
|---|---|---|
| 4.47 | `it is neither the registry nor the install, the extension simply is not CONNECTED` | *So it is neither the registry nor the install**:** the extension simply is not CONNECTED* |
| 4.60 | `the feature simply doesn't mount, graceful no-op` | *the feature simply doesn't mount **(**graceful no-op**)*** |
| 4.64 | `FF 121+ : ES-module background scripts and storage.session both require it` | *FF 121+ : ES-module background scripts **(`background.type: module`)** and storage.session both require it* |

A colon turned into a comma, parentheses turned into a comma, and a
parenthetical dropped. None changes the meaning, and that is the point: the
italics say *these are the corpus's words* and in three places they were not
quite. All three are corrected and the probe now reports 15.

**The five of mine that remain are not errors, and each names a real blind
spot.** Three quote `scratchpad/PROMPT-PERFECTION.md`, the specification, which
[4.63](#463-the-specification-survives-only-in-this-study-and-the-frame-never-mentions-it)
found is gitignored and therefore not among the 234 tracked files the probe
reads. One quotes a commit message, which is not a file. One quotes this study's
own chapter 14, which is not a corpus attribution at all.

**And the first of those is the finding.** A quotation can only be verified
against a source the verifier can open. The specification is not in the
repository, so **every sentence this study quotes from it is unverifiable by
construction**, and will stay unverifiable however carefully it is transcribed.
4.63 recorded that the file is unpublished; this is what unpublished costs
downstream, arriving from a direction nobody was watching. The repair is the
same one: one exception line, or a pointer to the published appendix.

**Why it took twenty-eight entries to run it.** The probe is listed in
`RESUME-HERE.md` as one of two reports to read rather than gates to keep green,
and a report that nothing fails on is a report nobody runs. The two gates added
this session both **exit non-zero**, which is why they were run on every pass
since. **A check that cannot fail is read once**, and this one had been read
once, by the session that wrote it.

### 4.73 Removed a guard whose reason was not written down, and measured what it was for

**What happened.** [4.72](#472-running-the-quotation-probe-on-this-sessions-own-entries)
left a loose end: the probe's italic pattern excludes backticks, so any
quotation reproducing inline code is never checked at all. Counted: **3 of the
53 italic spans in the method log**, and they are the most exact ones, because
reproducing code precisely is what requires the backticks. The exclusion looked
redundant, since `norm` strips backticks before the comparison anyway.

It was lifted, and the effect measured rather than assumed: **77 checked becomes
81, and 15 reported becomes 16.** Three of the four newly visible quotations
pass. The fourth is not a quotation:

> `` `scratchpad/*` ``, and the exceptions beneath it un-ignore `` `scratchpad/harness/*.mjs` ``

That is this log's own prose from 4.63, and the literal asterisks inside those
two glob patterns become italic delimiters the moment a backtick no longer ends
the span. **The guard is against code spans, not against backticks**, and
nothing beside it said so.

Reverted. The three quotations stay unchecked, which is now a recorded
limitation with a number rather than an invisible one, and the comment beside
the pattern says what the guard is for and what the repair would be: mask inline
code to a placeholder before scanning, unmask before comparing.

**The shape, for the fourth time.** A line reads as redundant, and is doing
something its wording does not mention.
[4.49](#449-a-gate-that-cannot-measure-reports-the-same-exit-code-as-one-that-measured)
had an exit code that looked like a decision about its own branch.
[4.56](#456-a-keepalive-that-asks-for-less-than-the-platform-will-give) had a
constant that looked like a margin. [4.59](#459-a-bar-that-is-satisfied-while-the-failure-its-own-axis-names-is-reachable)
had a bar that looked like a guarantee. This one had a character class that
looked like a formatting detail. **In all four, reading the line was not enough
and reading it beside the thing it interacts with was**, which is an argument
for changing a guard only after measuring what happens without it, and this is
the first of the four where that measurement was actually taken before the
conclusion was written.

**And a correction inside this pass.** Before measuring, 4.72's table of three
wrong quotations was re-marked from italics to code, on the theory that the
probe was flagging the specimens. It was not: the count did not move by a single
entry. The specimens sit in a table row and the paragraph they belong to carries
none of the attribution words the probe requires, so they were never checked.
The re-marking is right in principle, a specimen of an error is not a quotation,
and it fixed nothing.

### 4.74 A correction pass is bounded by its instrument, and this one had three blind spots

**What happened.** [4.72](#472-running-the-quotation-probe-on-this-sessions-own-entries)
ran `probe-quotes.mjs`, found three quotations reshaped, and fixed all three.
The same two errors were still sitting in appendix F, uncorrected, and the probe
had no way to say so. Three separate reasons, each a different shape.

**One, the document list was written by hand.** `docs` named three files and the
thesis directory. Appendix F and appendix G were written after that line was
typed, so neither was ever read. It enumerates every tracked Markdown file now.
**A hardcoded list of what to check is a promise to remember**, and it was kept
for exactly as long as nobody added a document.

**Two, table rows were exempt.** The italic loop skipped any paragraph matching
`/^[>|]/`. The `>` is right, because block quotations are checked by the loop
above and would count twice. The `|` is a Markdown table row, and nothing else
checks those.

**Three, and this is the one that decided it.** Paragraphs are split on blank
lines, and a Markdown table has none between its rows. Appendix F's ledger is
therefore **one paragraph of 24 rows and 20386 characters**, and somewhere in it
is the word *translat*, which is all the `TRANSLATED` rule needs to exempt every
quotation in all 24. A rule written to skip a sentence that says "this is
translated from the French", applied to a twenty-kilobyte table, in a study of a
translator.

Rows are split out individually now. Measured across the three repairs: **77
quotations checked becomes 84, and 15 reported becomes 20.** Two of the five new
reports were the real errors, fixed; the other three are the classes 4.72
already named, a commit message and the untracked specification. Nothing
spurious appeared, which was the risk.

**The lesson is not about this probe.** A correction pass fixes what its
instrument reports and stops, and it feels complete while it does that, because
the report is empty at the end. **The report being empty is a statement about
the instrument's reach, not about the document**, and there is no way to tell
the two apart from inside the pass. What separated them here was going back to
ask what the instrument could not see, which is the adversarial step the
specification asks for after every probe and which this study had been applying
to the corpus's instruments and not to its own.

### 4.75 The same defect, in the instrument written to catch that class

**What happened.** [4.74](#474-a-correction-pass-is-bounded-by-its-instrument-and-this-one-had-three-blind-spots)
ended on the rule that an instrument's reach has to be questioned separately
from its report. Applied immediately to the probes this session wrote:
`probe-consistency.mjs` names its documents by hand, `README.md`,
`HANDOVER.md`, `TRANSMISSION.md`, `RESUME-HERE.md`, appendices A, B, C and E,
plus the thesis directory. **Not F and not G**, which were written in the same
session as the probe.

So the ledger, 24 rows of ratios, and the budget, a table of thresholds, were
invisible to the instrument built to compare ratios and thresholds. Written in
the same week, by the same reader, without the connection being made once.

**Widened to every tracked Markdown file and measured**: 23 documents becomes
26, 110 keyed ratios becomes 119, and the constant half goes from 1 checked to
3. `KEEPALIVE_INTERVAL_SEC = 25`, quoted in appendix F, is now compared against
the clone and agrees. The ratio half still reports one collision and it is the
same Turkish false positive as before. **Nothing new was wrong.**

**And that is the part worth keeping.** The identical defect in
`probe-quotes.mjs` was hiding two real errors; here it was hiding nothing. The
cost of a blind spot is not a property of the blind spot: it is a property of
what happened to be standing in it, which nobody can know until they look. A
blind spot that has never cost anything and one that has cost two errors are
indistinguishable before the measurement, so **"it has not caused a problem" is
not evidence about a blind spot, it is the absence of evidence** and it reads
exactly like the presence of it.

**Three self-inflicted breakages while doing this**, all caught by running the
thing afterwards: a replacement that reported success while matching nothing, an
import trimmed until the half of the file that still needed `readdirSync` threw,
and before them the guard in
[4.73](#473-removed-a-guard-whose-reason-was-not-written-down-and-measured-what-it-was-for)
that had to go back. The pattern across the three is the same as the pattern
across the findings: the edit was reasoned about, and the run was what settled
it.

### 4.76 Two of the three checks this session wrote could not fail

**What happened.** [4.72](#472-running-the-quotation-probe-on-this-sessions-own-entries)
ended on the observation that a check which cannot fail is read once, by the
session that wrote it. The suite's exit behaviour was then mapped, which nobody
had done:

| script | exit |
|---|---|
| `check-links.mjs` | `links === 0 ? 2 : broken.length ? 1 : 0` |
| `audit-spec.mjs` | `fail.length === 0 ? 0 : 1` |
| `verify-handover-claims.mjs` | `failed.length === 0 ? 0 : 1` |
| `axis-ledger.mjs` | 2, 1 or 0 |
| `probe-quotes.mjs` | `checked === 0 ? 2 : 0`, a report by design |
| `probe-orphan-assets.mjs` | 2 only, a report by design |
| `probe-consistency.mjs` | **no `process.exit` at all** |

`check-links` is the model and its three states say why: **2 when it measured
nothing, 1 when it found something, 0 when it looked and the answer was clean.**
It also walks the directory tree rather than naming files, so it has no list to
forget, which is the defect [4.74](#474-a-correction-pass-is-bounded-by-its-instrument-and-this-one-had-three-blind-spots)
and [4.75](#475-the-same-defect-in-the-instrument-written-to-catch-that-class)
found in the two that do. Proved by planting a broken link in each of the two
appendices: both named, exit 1.

**Of the three scripts written this session, two could not fail.**
`probe-orphan-assets` is defensible: its own header says an orphan is not
necessarily wrong and the output is a list to read. `probe-consistency` was not.
It is two reports and two checks in one file, and the two checks cannot produce
a false positive: a constant that disagrees with the clone is wrong, and a
bullet that appears twice in one document is wrong. Both exit 1 now, the ratio
half stays a report and is excluded from the exit code, and each was proved by a
planted control: a duplicated bullet and a constant drifted from 20 to 31.

**The first version of that exit threw.** `bad` was block-scoped inside the
branch that runs when a clone is given, so the exit condition at the bottom of
the file could not see it and the clean run died with a ReferenceError instead
of passing. That is the right way round for a mistake in a check: **a check
whose bug makes it throw is safe, and a check whose bug makes it pass is worse
than no check**, because the second one is indistinguishable from good news. The
only reason this one was noticed in the same minute is that the clean run was
run, and a clean run is the case nobody thinks to try.

### 4.77 The privacy policy describes version 2.0.0, and two things leave that it does not name

**What happened.** A10's bar is *nothing leaves that the privacy text does not
name*, and `PRIVACY.md` had never been opened by this study. Sixty-one lines. Its
table names four translation providers and one Lingva host, and the sentence
above it says that is what gets sent off-device.

Every `https://` host in the source, enumerated: ten, of which one is an SVG
namespace and one is the host page. Eight are real destinations. **Two of them
are not in the policy.**

- **`api.github.com`.** `GITHUB_LATEST_RELEASE_API`, called by
  `updateChecker.ts` behind `UPDATE_CHECK_TTL_MS`, six hours. It carries no chat
  content. What it does carry is the reader's address and the fact that they run
  this extension, to a third party, on a schedule, and no reader-facing document
  says so. The policy's parenthetical about *your IP, beyond what the browser
  sends to any HTTP endpoint* arguably covers the address; it does not cover an
  endpoint the table omits.
- **`lingva.ml`**, and this is the serious one. `LINGVA_POOL` holds two hosts,
  `lingva.lunar.icu` and `lingva.ml`, *rotated round-robin to spread load*. The
  policy names the first and offers *or your instance*. So a reader who selects
  Lingva has their **chat message text** sent to a host the privacy policy does
  not mention, half the time, by design. `PROVIDER_ENDPOINTS` lists only
  `lingvaDefault`, so the pool is a separate constant and the policy was written
  against the first list.

**And the frame for both.** `PRIVACY.md` was written in `d09b25c`, 2026-05-28,
whose subject is *feat: complete v2 rewrite*. That is the 2.0.0 commit, and the
file has not been edited since. **The product is at 2.10.0.** Sixteen releases,
including every provider change, have shipped over a policy that describes the
first of them. Its own header says *Last updated: 2026-05-28*, which is honest
and is the only reason this was quick to establish.

**Why it is the finding this session was least likely to reach.** It required
opening a document no axis pointed at directly: A10's evidence column said
*13.7 counts the observable surface*, which is a count of render sinks, and
counting sinks is about what a page script can see rather than about what leaves
the machine. The two questions live under one axis and use different
instruments, and the ledger's own row had the first and not the second until
now. **A row that carries one instrument reads as a row that is covered.**

### 4.78 The axis about the auditor is the second least evidenced, and its clauses name this session's mistakes

**What happened.** [4.77](#477-the-privacy-policy-describes-version-200-and-two-things-leave-that-it-does-not-name)
ended on the observation that a ledger row carrying one instrument reads as a
row that is covered. Measured across all 22: each bar split into clauses, each
row's evidence counted in characters, and the ratio taken.

| axis | clauses | evidence | per clause |
|---|---|---|---|
| A1 | 6 | 219 | **37** |
| A22 | 6 | 286 | **48** |
| A20 | 4 | 204 | 51 |
| … | | | |
| A16 | 4 | 2170 | 543 |
| A12 | 2 | 1201 | 601 |

A1 is thinnest and that is unsurprising: its six clauses are about an accounting
identity nothing measures. **A22 is second**, and A22 is the axis about the
auditor, added by this study, to itself.

**Its clauses name what this session did wrong.** Read one at a time:

- *Zero exit codes read through a pipe.* Done once, in
  [4.76](#476-two-of-the-three-checks-this-session-wrote-could-not-fail): an
  `$?` after a pipe reported `tail`'s status rather than the gate's, and the
  gate was then re-run without the pipe.
- *Zero quotations that are translations.* Three found among 78 in
  [4.72](#472-running-the-quotation-probe-on-this-sessions-own-entries), and
  three blind spots in the checker that hid two more.
- *Zero counts taken over text where a structured form exists.* That is exactly
  how the laughter table was first counted here, by regular expressions against
  a file whose table is named `FORMES` and whose key is `langue`, returning 0
  three times, while chapter 6 had counted the same table **by importing the
  module**.
- *The pass reports its own false-positive count beside its findings.* It has
  not been. It is now: **about nine findings were drafted and withdrawn before
  publication across 34 passes.**

**And the measurement above was itself the ninth.** The first version of it
reported 0 evidence characters for all 22 axes. The pattern was built by string
concatenation inside a `node -e` command, where `\|` collapsed to `|` on its
way through the shell, turning `^\|\s*A1\s*\|` into an alternation with an empty
left branch, which matches every line of every file. It reported *136 matching
rows* for an axis that has one. **A matcher that matches everything returns
zero for every question you ask it**, and a table of zeros reads like a finding
about the subject rather than a failure of the instrument. It was caught by the
uniformity: real measurements are not all exactly zero.

Third time this session that shell-to-JavaScript escaping has produced a
confident wrong instrument. The rule that follows is environmental rather than
methodological, and it is written here because this log is where the
environment traps go: **build no pattern by concatenation inside `node -e`;
write the script to a file.**

### 4.79 The cache key holds two of six dimensions, and its test is thorough about the two

**What happened.** A1's last clause asks that every dimension changing the
answer be in the cache key, proven by a collision test. The key is
`` `${targetLang}::${normalizeForKey(text)}` ``. Two dimensions.

At least four more change the answer and are absent: the **provider**, four of
which are configurable and give different translations; the **source-language
hint**, sent as `sl=` and, by the changelog's own account, capable of turning a
translation into something the text is not; DeepL's **formality**; and DeepL's
**channel context**, built from recent lines.

**The provider is stored in the entry and unused in the key.** A cache entry
carries `translatedText`, `detectedLang`, `provider`, `storedAtMs`. So the
system knows which engine produced each answer and does not consult that when
deciding whether the answer fits the current question. Switching provider
returns the previous one's output, labelled with the previous one's name, which
is at least honest. Nothing invalidates on a settings change: the only clear is
a button on the options page.

**And the collision test is good, which is the part worth keeping.**
`cache.test.ts` proves cosmetic variants collapse, `WWWW` with `wwww`, `lol!!`
with `LOL`, that three-or-more repeats fold to two in Latin and in Han, and that
target languages stay apart. Every assertion is about a dimension the key has.
**A test written against a key can only test the dimensions the key has**, so a
narrow key and its thorough test agree perfectly and the agreement proves
nothing about what was left out. That is A22's *zero verifier sharing its
technique with its subject*, arriving in the mildest possible form: not a
verifier reusing its subject's code, but one reusing its subject's idea of what
matters.

### 4.80 The table moved, the sentence under it did not, and three documents had copied the sentence

**What happened.** The session opened on the seven commands `START-PROMPT.md`
names, which exist so that a fresh account can tell a stale repository from a
current one before changing anything. One of them disagreed with the documents.
`axis-ledger.mjs` printed *8 rows present, 3 carrying a number*; appendix G's
own summary line said **Two of seven axes set**, and `RESUME-HERE.md` said it
twice and `START-PROMPT.md` once. The script had been printing the right figure
directly above the wrong sentences for a full session. Nobody read the two
together, which is the entire value of running a gate and reading its output
rather than its exit code.

**The cause is dated and takes two commits.** `54ad020` built the budget with
two rows carrying a value and wrote the summary under the table. `24c8cf7`, two
commits later, measured A21 and filled its row in. The table moved and the
sentence did not, and the three documents that had copied the sentence could not
have moved, because **nothing carries a correction between documents** (4.45,
4.70). That rule has now cost something three times. Its new form is narrower
and worse: this instance is a summary and its own table, nine lines apart in one
file, so proximity does not help either.

**The sentence was also counting two populations.** *Two of seven* put a count
of rows over a count of bars. Seven bars name the budget file; the table has
eight rows, because A6 states two thresholds, a weight ceiling and a per-row
main-thread cost, and only the first is set. So even before A21 moved the
numerator, the fraction compared a numerator drawn from one population against a
denominator drawn from another, which is the reason the replacement sentence
counts rows on both sides.

**What was built, because the rule is not the fix.** `axis-ledger.mjs` now reads
appendix G's summary back and compares it against the table it summarises,
exiting 1 when they disagree and when the sentence is absent altogether. The
form is fixed and stated in the comment: `N of the M rows carry a number`, in
digits, in appendix G and nowhere else. Three witnesses were planted in a copy
and restored from it, never with `git checkout`:

| Planted | Exit | What it printed |
|---|---|---|
| Summary says 2, table says 3 | 1 | `appendix G says 2 of the 8 rows carry a number; the table says 3 of 8` |
| Summary deleted | 1 | `appendix G states no set count in the form "N of the M rows carry a number"` |
| A13's row given a value, summary untouched | 1 | `appendix G says 3 of the 8 rows carry a number; the table says 4 of 8` |

The third is the one that matters, because it is the direction this defect
actually arrived from: the next session to fill a row in is now stopped by a
gate rather than trusted to remember a sentence nine lines below it.

That table is also a false positive in `probe-consistency`, named here in the
pass that created it so nobody spends a pass on it: its ratio half now reports
*denominator 8, "number table says"* with numerators 3 and 4, which are the
planted value and the true one sitting in adjacent rows of a witness record. Two
numerators under one denominator is what that half is built to surface, and this
is the shape of it that is correct.

**The other three documents state no count at all now.** They cite the script.
This is 4.30's convention, *counts that a script reads are not restated*, applied
in the one place it had been written down and not followed. A check comparing
four copies would have been the larger build and the worse answer: there is one
owner of this number and three readers, and readers should read.

**One aggregate was deleted rather than recounted.** The prose also claimed
*five of the six need an instrument that is already in the repository*. It was
written in the same pass as the rows it summarises, and two of those rows say in
their own text that no harness measures the quantity they ask for, so the
aggregate contradicts its own table. Recounting it here would publish a first
count (4.55), and the honest move is to delete it and read the rows. What each
empty row actually needs is the next pass.

**A fourth document was corrupted by the same class of edit**, found while
reading the region. `daea424` replaced a sentence in `RESUME-HERE.md` and its
search string ended one character inside the number of a following citation,
leaving `(4.64).47 named,` where `(4.64), and none is` was meant. It survived a
push and a session because it sits mid-paragraph in a file that is read for its
lists. An edit helper that refuses to write when its search string is absent
cannot catch this: the search string was present, and it was the wrong one.

### 4.81 The goal said to count the three stop conditions, and two of them had no instrument

**What happened.** Every session here opens on a goal whose last clause is *les
compter a chaque passe plutot que les estimer*, count them at each pass rather
than estimate them. The first condition had `axis-ledger.mjs` behind it, which
is why the previous session could say it was met. The second was restated from
memory in two documents. The third had never been evaluated by anybody, in any
pass, because nothing recorded whether a pass had measured anything. **A goal
that says to count and leaves two thirds of the count to an impression is the
same defect as a rule with nothing behind it**, and it survived because the one
third with an instrument printed a number and the sentence read as if all three
had.

**Condition 2 is not in this account's power, and that is the finding.** It
asks that the clone's `PLAN.md` hold nothing but items blocked on kil. That file
is in the extension's repository, and the first of the four standing constraints
here is *do not modify the extension*. So the condition closes when the
developing account closes it and not before, whatever this study does. The
previous session replaced a stop condition that was already satisfied, the
journal reading list, with one taken from the specification because it *can be
counted*, which is true and is not the same as being reachable. **A stop
condition outside your reach is a decision to continue, not a measurement**, and
`stop-conditions.mjs` prints that sentence rather than leaving the next session
to rediscover it.

**The queue, counted over the whole file.** 114 entries: **7 open, 6 blocked on
kil, 101 done**, which is what `RESUME-HERE.md` already said and is now read by
something. Counting the blocked ones under the `## Waiting on kil` heading gives
**four**, because two `[k]` items sit under `## Open`, and that was this pass's
first count. It was too low, which is the first time in seven that a first count
here has erred in that direction: the rule recorded in 4.55 and carried into
TRANSMISSION is *the first count is too high*, six times out of six. The common
factor is not the direction. It is that a first count is taken over the
population that was convenient, and a heading is exactly that.

**Condition 3 needed a convention before it could need an instrument.** The
specification says a pass that changed nothing says so in one line rather than
describing the reading as work. That line is now a marker: a commit message here
that produced no measurement carries `No measurement:` and its reason, and the
script exits 1 when the last two commits both carry it. Nothing enforces the
honesty, and the script says so in its own header. What is enforced is that two
declarations in a row go red rather than accumulating quietly, which is the
failure mode the goal exists to prevent.

**A witness went red for the wrong reason and was caught by reading it.** The
first attempt at condition 3's witness made a worktree at the current commit,
committed two declared-silent passes into it, and ran the script from there. It
exited 1, the expected code. It exited 1 because the script is untracked and the
worktree did not have it: `MODULE_NOT_FOUND`, printed above the exit code and
read only because the output was printed beside it rather than the code alone.
The repaired witness copies the script in, and adds the control that the first
one lacked: **one** declared-silent commit, which must stay green. It prints
`last two: none, measured` and exits 0; the second one turns it red. A probe
must make the things it distinguishes differ, and the first version could not
tell one from two because it could not tell anything from anything.

**Found on the way, the same class as 4.80 and in the same file.**
`RESUME-HERE.md` said **Nine runnable scripts** in its inventory and **Ten
scripts** a hundred lines further down, and there were nine. Both sentences were
written on the same day by the same session. The count now lives once, in the
D-scripts README, which is the table that would have to be edited anyway for the
number to change; the two state documents cite it. This is 4.30 and 4.80's
convention applied a second time, and it is worth noting that the convention
existed, in writing, in the file that broke it.

### 4.82 A replicated count that was wrong by the whole of the second runner

**What happened.** Reading `.agent/PLAN.md` by position from L760, the four
`Done` sections, turned up a bullet whose own arithmetic does not close:
*Runner coverage: 31 harnesses of 33*, followed by six named files left out with
a stated reason. Thirty-one plus six is thirty-seven. Chasing which of the three
numbers was wrong led to this study's own count of the same quantity, and that
is where the finding is.

**The study published 29 orphans, and 29 is wrong by exactly ten.** The number
is in five places, tagged `[new]` in three of them, and green in
`verify-handover-claims.mjs` on every run this session and the last. The
verifier builds its set of launched files from `run-gates.mjs`'s `GATES` array.
`run-live.mjs` appears in the same function, one line below, in a constant named
`RUNNERS`, used only to keep the two runners out of the orphan list. It carries
nine live gates of its own and spawns `latency.mjs` as a phase that is not a
`GATES` row at all. Nine plus one is the ten.

| | files |
|---|---|
| harness `.mjs` on disk | 56 |
| launched, reading one runner | 22 |
| launched, reading both and the metrics phase | 32 |
| no entry launches | 34, then **24** |
| of those, runners and imported modules | 5 |
| orphans | 29, then **19** |

**The gate could not go red, because the gate is where the error lives.** This
is A22's clause about a verifier sharing its technique with its subject, in its
purest form: the claim and the instrument that checks it are the same parse, so
the check restates the claim rather than testing it. The study's own rule says
two probes agreeing about the same file share a blind spot and confirm each
other inside it. Here there were not two probes. There was one, counted twice.

**It propagated to a second claim on the same run.** With both runners read,
`3.3 state.mjs orphans that are launched or imported` went from 3 to **13**: the
project's own `ETAT.json` generator has the identical blind spot, and its list of
32 orphans contains every live gate and the latency phase. That is a finding for
the developing account rather than for this study, and it is now in the
handover. Two independent implementations made the same mistake, which says the
mistake is in the shape of the artefact: one runner is obvious and the second one
is a file like any other.

**The line that caused it was sitting beside the line that knew better.**
`RUNNERS` names `run-live.mjs`. A reader of that function has the second
runner's name in front of them while writing a count that omits it. This is the
fifth instance of *a line reads as redundant until it is placed beside what it
interacts with*, and the first where the two lines are adjacent.

**This study reproduced the trap it had already documented, on the way in.** The
first count taken this pass matched gate rows by their first cell, the gate's
**name**, against file names. That is precisely 4.33's finding, written into
TRANSMISSION.md as *orphan harnesses by the gate's name instead of the file the
gate runs*, and it produced the same two errors 4.33 records:
`store-shots-fixture.mjs`, which runs on every pass as `captures-readme`, counted
as an orphan, and `latency.mjs` counted as reached because the string `'latency'`
appears in a phase constant. **Knowing a trap and holding it are different
skills**, which 4.9 said about a different trap in a different pass. The
correction came from the arithmetic, not from the rule: 34 minus 24 is exactly
the ten entries of the second runner, and a difference that lands on a round
structural boundary is a stronger signal than either count.

**A question the study twice called unanswerable has a structural answer.**
Chapter 12.7, chapter 15.8 and the handover all say the useful number is
*orphans with no written reason*, that producing it means reading each
exclusion, and that classifying by content fails because offline gates serve
kick.com URLs from fixtures. True of *what a harness is for*. Not true of
*whether it can report anything*: a file with no `process.exit(1)` cannot go
red, so its absence from a runner costs nothing whatever its author meant.
**7 of the 19 carry a failing exit**, `headless-probe`, `live-profile`,
`metrics-offline`, `nav-monde`, `readme-rendu`, `shlyokavitsa-bout-en-bout` and
`store-shots`, and `metrics-offline` is reachable through `npm run metrics`. The
open question is six files wide rather than nineteen. Measuring a limit to its
boundary rather than declaring it (4.47), for the second time.

**The witnesses reconstruct the old number exactly, which is the proof.** Each
addition was disabled in turn, in a copy restored from a backup rather than with
`git checkout`, and the counts move by the amount the diagnosis predicts:

| Planted | launched | no entry launches | orphans | `ETAT.json` wrong |
|---|---|---|---|---|
| nothing | 32 | 24 | **19** | 13 |
| the latency phase not read | 31 | 25 | 20 | 12 |
| run-live's `GATES` empty | 23 | 33 | 28 | 4 |
| both | **22** | **34** | **29** | 3 |

The last row is the published measurement, to the file: 22 launched, 34 not, 29
orphans. A diagnosis that reproduces the wrong answer on demand is settled, and
this is the difference between finding a discrepancy and explaining one.

**One of these witnesses first went red for the wrong reason, again.** The
first attempt at the run-live witness rewrote the loop header with a comma
operator, which still evaluated the original expression, so the plant changed
nothing; the script exited 1 from a syntax error elsewhere in the same edit and
the grep that read the output filtered the error away, leaving a bare `rc=1`
that looked like the expected result. It was caught by the same habit that
caught the one in 4.81: printing what the run said, not only what it returned.
Twice in two passes. **The rule is not "read the exit code carefully", it is
that a witness's output is the evidence and its exit code is a summary of it.**

**What is not claimed.** That 19 is final. It is a third count of a quantity
whose first two were both too high, taken by an account that has now made the
label-versus-file error once itself, and the rule says publish no first count.
What is different about this one is that it is pinned: the clone at `226a176`,
both runners read, the arithmetic closing at 56 on four disjoint buckets, and a
verifier that now fails if any of the four moves.

### The pattern across the first three

All three accused working code, and all three erred in the same direction. A
probe reports a guard missing wherever it fails to look properly, so its errors
surface as findings and never as clean bills of health. **A probe that is wrong
is almost always wrong in the alarming direction**, which means an unreplicated
finding from a fresh probe should be discounted rather than acted on, and a
negative result from a probe is worth more than a positive one.

---

## 5. What was efficient, and what was waste

**Efficient, in order.**

1. **Index once, query per chapter.** 310 KB of notebooks were used across
   fifteen chapters without ever being read whole.
2. **Writing a probe as a publishable script.** This is the highest-yield
   practice in the session and it is not obvious. Two of the three probe errors
   in section 4 were exposed by the act of adding arguments, a usage line and a
   fail-on-empty assertion, not by rereading the result. Publication is a
   verification step.
3. **A claim verifier.** One script that re-derives every measurable claim in a
   document and prints expected against actual. It caught 4.4 immediately and
   makes the document falsifiable by its reader in one command.
4. **Executing one axis early.** The cheapest pass in the whole sequence, pass
   9, produced the rule the rest of the work was organised around.

**Waste, in order.**

1. **Passes 10 to 16.** Seven review passes over a document that had stopped
   yielding, when one execution pass would have found more. The review regime
   gives no signal that it is finished.
2. **Producing numbers before reading the instances behind them.** Sections
   4.2 and 4.7 are both this.
3. **Not looking for existing instruments first.** Section 4.8.

---

## 6. What was refused, and why that was right

Three actions were blocked by the harness during this session. All three are
recorded because a method log that hides its friction is less useful.

**Writing a file outside the session's working directory.** Refused. The fix
was to move the session to the directory that was actually being worked in,
which is the correct fix rather than a workaround.

**A batch of shell commands copying files across directories.** Refused. Same
resolution.

**Creating the public repository.** Refused, and this one is the right barrier
in the right place. Publishing is outward-facing and irreversible in practice,
and the surrounding work being finished does not make the last step automatic.
The repository exists locally with its commits, and the command that publishes
it is handed to the person who decides.

The general point for anyone repeating this exercise: the friction is on the
boundary between analysis and distribution, not inside the analysis. Nothing in
the reading, measuring or writing was constrained.

---

## 7. What this session deliberately did not do

- **Did not modify the system under study.** Not one line. Every finding is a
  measurement and a recommendation; the diffs are for the account that owns the
  code.
- **Did not run the full gate suite.** It needs the ignored harness directory,
  and running a subset then reporting the suite would be the failure the study
  spends a chapter on.
- **Did not open a browser.** Every source-derived claim is about call sites,
  and that limit is stated wherever such a claim appears.
- **Did not touch the stores, the accounts or any credential.**
- **Did not evaluate translation quality**, which is the first thing a user
  would ask about and is out of scope for all of it.

---

## 8. If you are repeating this on another project

The shortest version of what worked:

1. Read the working method before the code. If the project has a standing
   frame, a plan and a generated state file, those three tell you more in ten
   minutes than the source does in an hour.
2. Index the long-form notebooks and query them per question. Never read them
   whole.
3. Pick the axis with the highest damage among those whose instrument you
   actually have, and execute it before writing any more specification.
4. Write every probe as a script someone else could run, with a fail-on-empty
   assertion. Do this even for a one-off, especially for a one-off.
5. Trace every number to the decision it feeds before reporting it, and read
   four instances behind any count before publishing the count.
6. Write a verifier for your own claims and hand it to the reader.
7. Report your own error rate. It is the number that tells the reader what the
   rest is worth.
