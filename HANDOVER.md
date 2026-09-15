# Handover to the account that builds this

Paste this whole file. It is written to be read once, acted on, and thrown
away; nothing in it needs to survive in your repository.

Everything it asserts stands on its own, so it is usable with no other file
open. The links in section 10 point into the repository this came from, and
they are an offer rather than a dependency: if you do not have that repository
to hand, the file still works, you simply cannot follow them.

---

## 0. Who is writing, and why that changes how to read it

A second account read your notebooks. Not the code first: the work queue, the
two daily journals, the changelog, the standing frame. Then the sources, then
what could be re-run.

That position has one advantage and one disability, and both matter for what
follows.

**The advantage is distance in time.** You wrote those entries across three
months, each one to be acted on that day. Read in one sitting, they contain
patterns no single entry contains, because the instances are months apart and
on unrelated subjects. Section 2 is three of those, and they are the reason
this file exists. They are not new information: every fact in them is already
in your own writing. What is new is that they are next to each other.

**The disability is that almost nothing here was witnessed.** Your numbers were
taken on your machine at commits that have moved. This account re-ran what a
clone can run and read sources for the rest. Nothing was observed in a browser.
Every claim below is tagged so you can tell which is which:

- **[yours]** from your notebooks. Repeated back, not verified.
- **[re-run]** executed here against a clone. The command is given.
- **[read]** derived from reading sources. Not observed running.
- **[mine]** analysis, not measurement. Argue with it.

A claim with no tag is a defect in this file.

**Do not take the ordering on trust either.** It is by expected damage, and
damage here is a judgement about how many readers meet a thing, multiplied by
how little they can tell it happened. The second factor is defensible from your
own architecture. The first is a guess, and it stays a guess until section 5
gets unblocked.

---

## 1. Check these four before reading further

Four minutes. If any of them contradicts what follows, stop reading and trust
your machine over this file.

Or run the whole thing at once. Every measurable claim below is re-derived by
one script, which prints expected against actual and lists what it cannot
check rather than skipping it:

```bash
node appendix/D-scripts/verify-handover-claims.mjs /path/to/this/repo
```

It reported seventeen of seventeen holding at the commit this was written
against, and four claims as unverifiable from a clone. If it reports anything
else, this file is stale.

```bash
node .agent/state.mjs --texte npx vitest run src/content/langDetect.test.ts
src/shared/transliterationGuard.test.ts --reporter=basic grep -rn
"\.dir\s*=\|setAttribute(\s*['\"]dir" src/content --include="*.ts" grep -rn
"setAttribute(\|\.id = \|dataset\." src/content --include="*.ts" | wc -l
```

The third and fourth commands are the evidence for sections 3.1 and 3.2. They
are the ones most likely to be stale, because they are the ones this account
touched last.

---

## 2. Three things your notebooks say that no entry in them says

### 2.1 You have diagnosed the same defect three times, in full generality,
and applied it locally each time

The instances, in your own words and in your order:

1. **Persian answered as Arabic.** Twelve of twelve, as a confident source.
   Diagnosis: a writing system is not a language. Fix: the Arabic script.
2. **Mongolian, Ukrainian and Bulgarian answered as Russian.** Twenty of
   twenty, eight of eight, eight of eight. Your journal says it outright:
   *"C'est exactement le defaut arabe/persan corrige plus haut dans la
   journee, sur une autre ecriture."* Fix: the Cyrillic script.
3. **The emoji that diluted a script.** Your own note on the earlier jamo fix
   already carried the general statement: *"those letters counted toward the
   total while feeding no script."* That sentence is the emoji defect, written
   correctly, before the emoji defect was found.

All **[yours]**.

Three correct general diagnoses. Three local applications. The third one had
its general form sitting in a comment in the code for weeks.

There is a fourth instance, outside language detection entirely, which is why
this is worth raising as a pattern rather than as a detection problem. Your
manifest comment gives the reason web-accessible resources were removed:
*"Ce qui restait liste donnait a n'importe quel script d'une page kick.com une
URL stable a interroger pour confirmer que l'extension est installee."* The
diagnosis is general: the page must not be able to query for us. Applied to one
vector. **[read]** Four others are still there, and section 3.2 lists them.

A note on the two quotations in this section and the one above. Both are
verbatim from your files, in the language you wrote them in, checked against
the source rather than retyped from memory. An earlier draft of this file
rendered the manifest one in English, which would have read as a quotation and
been a paraphrase. That is the failure mode section 8 puts fourth, and it was
caught by looking rather than by rereading.

**What this costs and what closes it.** Nothing in an ordinary workflow forces
a diagnosis and its remedy to be reconciled, because the diagnosis lives in
prose and the remedy lives in a diff. The cheapest discipline that catches it:

> When you fix something, write down the population the diagnosis covers, then
> count what fraction of that population the fix reaches. A guard is a
> fraction, never a presence. One occurrence reads as "handled" to a search and
> as "handled in one place of several" to a count.

That rule found the fourth instance, and it found a fifth in your handoff: your
incoming path deletes mentions, your outgoing path masks and restores them.
Two opposite theories of the same object, each satisfying its own tests
**[yours]**.

### 2.2 You have made the same reasoning error three times, and measurement
caught it every time

1. **The arabizi grid** scored 0 of 5 for returning no language. Measured
   properly, an absent language costs nothing on the engine path; the harm was
   in the filters, where an allowlist user lost the messages they had asked
   for.
2. **The keyboard-smash prior** said eleven of fifteen were already dropped.
   Measured directly: zero of eleven.
3. **Malay and Hebrew** were framed as two broken languages. The probe
   corrected it: an unidentified language goes out with `sl=auto`, so those
   messages were translated all along. What the fix buys is a correct source
   and a correct badge.

All **[yours]**.

The shared structure: each assumed that a component's failure implied a
user-visible failure, without tracing the component's output to an outcome. In
a pipeline with defaults and fallbacks, that inference does not hold, in either
direction. It over-states harm as often as it under-states it.

The discipline: **establish severity at the output, never at the failing
component.** Your probes already do this when you write them. The error appears
in the interval between noticing something and writing the probe, which is
exactly where a prior gets published.

### 2.3 The same linguistic rule, derived twice, stated in neither place

The transliteration marker table excludes `kawaii`, `sugoi`, `senpai`, `baka`,
`desu`, `sensei`, `malaka`, because English internet slang has adopted them. A
test enforces a five-letter floor to keep that door shut **[yours]**.

The laughter lexicon excludes `haha`, `lol`, `xd`, because they are used
everywhere **[yours]**.

Same rule: **global adoption destroys diagnosticity.** Whether you saw the
connection at the time is not something this account can know; what is
checkable is that neither entry references the other, and that the rule is
written nowhere as a rule. Two independent derivations on different problems is
the closest thing a single project gets to replication, and naming it once has
a consequence neither instance draws:

**It is a decay function, and nothing in the system measures it.** The
five-letter floor is a proxy for "not yet borrowed", and it is a good one today
because borrowing favours short, salient, phonologically simple items. It will
fail for the next six-letter word that goes global. No alarm exists for a
marker becoming ambiguous, and the cheapest version of one is a dated
re-attestation note per entry, which your laughter table already has the field
for.

---

## 3. What this account measured that you have not

### 3.1 Direction handling, and the correction that matters more than the
finding

**[read]** Start with the correction, because it is the useful part.

The first probe here looked for a direction attribute near each write of
untrusted text and reported **one guarded surface of three**. That number was
wrong. A second probe, looking for the attribute on the element rather than
near the write, found `composeUi.ts` setting `dir='auto'` at construction on
line 69, 111 lines above the write on line 180 that fills it: **two of
three**. Tracing the third surface, `showError`, to its callers in
`pipeline.ts` showed it receives either an internal ASCII error code or a
localised interface string, never chat text or provider text: **the population
is two, and both are guarded.**

Three levels of rigour, three answers, on a question that looked binary. The
coarse probe was the alarming one, and that ordering is not chance: a probe
finds a guard missing wherever it fails to look properly, so its errors are
biased toward accusation. Your frame already warns about this and this account
walked into it anyway.

Two things survive the correction, and they are smaller and real:

**No source file neutralises or isolates direction-control characters inside
rendered text, anywhere.** `dir="auto"` gets you `unicode-bidi: isolate` from
the user-agent stylesheet, so a line cannot reorder its siblings. It does not
stop an override inside the text from reordering the rest of that element's own
content. For a product whose purpose is rendering text faithfully, the outgoing
preview is the sharp case: it is the surface on which the reader decides what
to send. **[mine]** What a reader actually sees needs a browser; this account
read sources.

**`showError` renders localised interface strings with no direction
attribute**, and your interface ships an Arabic locale. That is interface i18n,
not hostile input, and it is a one-line fix.

**Markup is closed.** Every sink for chat or provider text is a text node. The
single `innerHTML` in the content sources takes an internal icon table into an
SVG element **[read]**.

### 3.2 The detectability door, on its cheap side

**[read]** Page-queryable signals that confirm the extension is installed:

| Signal | Cost to a page script |
|---|---|
| A `<style>` element with a fixed id on the document element | one `getElementById` |
| A fixed attribute on the document element | one attribute read |
| 99 class names sharing a fixed prefix | one class selector |
| A processed-marker attribute on the host's own chat rows | one attribute selector |

The vector you removed required a network fetch. These require one synchronous
call.

**[mine]** The bar you were holding, which this file's companion specification
held too until it was executed, is unachievable: an extension that renders
visible content is always findable by a page script willing to read the screen.
The achievable bar is about cost:

> Finding the extension should cost a page script a read of rendered content,
> never a query by name. Every remaining shortcut is either required by the
> product, with the requirement written next to it, or gone.

Under that bar the four divide cleanly. Class names are required. The
processed marker is arguably required, though a `WeakSet` or a non-enumerable
property would serve. The fixed stylesheet id and the document attribute are
conveniences with queryable names.

### 3.3 Smaller, verified, low damage

**[re-run]** Interface localisation: your declared key set has 155 entries;
each language file carries 34. The rest fall back to English. `i18n-check.mjs`
already computes this, so the number is not news to the tooling, only to
whoever last read its output.

**[re-run]** Nine remote branches, seven already merged into master.

**[re-run]** Version agreement across package, tag and published archives is
consistent. Your release assets carry a per-asset content digest, which is a
better reproducibility check than two local rebuilds compared to each other:
it also proves the artefact people download is the one the tag describes.

**[re-run]** 56 harness files, 40 runner entries, 35 files no runner launches.
**Do not read that last number as a finding.** Most are your documented
exclusions: live probes, the three shooters, the runner itself. The number that
would be a finding is *orphans with no written reason*, and producing it means
reading each exclusion. This account published the raw count first and had to
qualify it, which is the mistake in the other direction from 2.2.

### 3.4 Two questions this account opened and closed with nothing

Negative results, reported because a closed question is worth as much as a
finding and because you would otherwise spend an afternoon reaching the same
place.

**Silent failure paths: nothing to report.** The hypothesis was that a
`catch` that swallows an error on the message path loses a reader's message
with no trace, which is this product's worst damage class. Measured **[read]**:
42 `catch` blocks in the sources, 24 producing a log, a metric, a UI change or
a propagated error. Of the 18 remaining, 2 are on the message path, and both
turned out to be deliberate: one captures the error into a variable the caller
reads, the other returns an empty string as a documented degradation. Nearly
every one of the other 16 carries a comment saying why the silence is correct,
in your own words: *invalid selector, ignore*; *storage unavailable, non-fatal*;
*invalid regex char in user input, skip silently*. The question is closed.

**Marked debt: none.** **[re-run]** Zero `TODO`, `FIXME`, `HACK` or `XXX`
across 89 source files. Your deferrals live in `PLAN.md` with their
measurements rather than as comments that rot. That is unusual enough to be
worth saying out loud, and it is why the handover has no debt section.

### 3.5 One number worth having before the capture arrives

**[re-run]** Of the 42 languages the product offers, 18 are named anywhere in
`langDetect.ts`. The other 24 rest entirely on the statistical identifier.

**[mine]** That is not a defect, it is a map. Every failure in section 2.1 was
a language whose script was shared and whose separation needed an explicit
marker. The 24 are where another one can still be hiding, and the list is a
cheap way to prioritise the bench work in section 5: a language with no marker
and a script it shares with a bigger neighbour is the exact shape that produced
Persian, Mongolian and Bulgarian.

---

## 4. Six rules, each with the measurement that produced it

Offered as rules because each one cost something to learn. Reject any of them
that does not survive contact with your machine.

**A ceiling written after the measurement is green by construction.** A first
version of the companion specification ended seven bars on "under a stated
ceiling", which the agent fills in after measuring. Budgets belong in a tracked
file, written before, with raising one requiring a sentence in the journal and
lowering one requiring nothing.

**A guard is a fraction of the surfaces that need it.** Section 2.1. It found
the detectability vectors and the direction gap.

**Severity is established at the output.** Section 2.2.

**A count over a population with documented exceptions reports two numbers.**
The adjusted count is the finding; the raw count sits beside it so nobody has
to trust your filter. A single number that mixes them is an argument, not a
measurement. Section 3.3 is this account failing the rule and then writing it.

**Look for the instrument before building one.** This account reimplemented
`i18n-check.mjs` before finding it. The corollary is sharper than the rule:
**an instrument that exists and is in no runner is worse than one that does not
exist**, because its presence reads as coverage. Your own `bar-panel-live`
history is the proof, and it is why `ETAT.json` listing uncovered harnesses is
load-bearing rather than tidy.

**A specification you have reviewed is not a specification you have tested.**
Sixteen review passes over the companion specification found missing sections,
vague words and weak witnesses, and passed every mechanical condition written
for it. The first pass that executed one axis against your code falsified three
of its requirements inside an hour: one unachievable by any system, one
demanding the more expensive of two checks, one unenforceable against the
implementation it targeted. Review and execution find disjoint classes of
defect. Execute early, on any single axis, before spending more passes reading.

---

## 5. The bottleneck is you, and it is worth putting a number on

Your work queue carries the request already: one real chat capture, a few
thousand lines from two or three channels of different languages, the collector
pastes into a console. Four decisions end on the same sentence, that the damage
is measured and the frequency is not **[yours]**.

This account's contribution is to say how far the consequence reaches.
**[mine]** Every mechanism in your notebooks is well established and every
priority in them is unsupported, including the priorities in this file. You can
demonstrate that a homoglyph defeats a one-character floor, that a keyboard-row
criterion separates smash from Czech syllabic sonorants, that a batch inherits
the wrong source. You cannot say which of those matters most, and neither can
anyone reading you.

That is not a small gap, and it has a specific shape worth naming: your benches
are hand-written, so they are **distributionally** wrong (well-formed sentences
where real chat has fragments and pastes), **selectionally** wrong (written by
someone who knew which phenomenon they targeted), and **adversarially** thin
(they contain what their author thought of). A capture fixes all three at once.

Second, smaller, and answerable without users: the on-device engine is absent
on one Chrome build and present on another of the same version on your own
machine **[yours]**. Until that is understood, the fastest path serves an
unknown fraction, the user-visible latency distribution is bimodal with unknown
weights, and no single latency figure describes the product. A matrix over
fresh profiles with flags varied would settle it in an afternoon.

---

## 6. Calibration: how often this account's probes were wrong

Before the boundary, the error rate, because it is the number that says what
credit to give the rest.

Five probes were written against your code in this session. **Three of them
accused working code on their first run**, and all three were caught by a
second, better probe rather than by rereading:

| Probe | First answer | After a better probe | What was wrong |
|---|---|---|---|
| Direction handling | 1 guarded surface of 3 | 2 of 3, then 2 of 2 | Looked for the attribute near the write instead of on the element, then failed to trace what the third surface receives |
| Silent failure paths | 31 silent `catch` of 42 | 18, then 2, then none | The signal pattern did not match `log.debug(`, so every logged catch counted as silent |
| Selector fallbacks | 2 lists, neither with a fallback | withdrawn | Parsed the file with a regex that split the arrays wrongly; the chains are there |

The two that held on the first run were the detectability enumeration and the
localisation counts, both of which count things rather than judge them.

**The pattern in the three failures is one-directional and worth more than the
failures.** Every one of them erred toward accusation. That is structural
rather than unlucky: a probe reports a guard missing wherever it fails to look
properly, so its errors show up as findings and never as clean bills of health.
A probe that is wrong is almost always wrong in the alarming direction.

Two consequences for reading this file, and for any audit you run:

- **An unreplicated finding from a fresh probe should be discounted, not
  acted on.** The cost of the second probe is minutes; the cost of fixing
  working code is a diff, a review and a false belief that survives.
- **A negative result from a probe is worth more than a positive one**, because
  the bias runs the other way. Section 3.4 closing the silent-failure question
  is the most reliable thing this account produced.

Your own frame says this already, in the list of probes that accused working
code: subpixel rounding, a DEFLATE-compressed archive, `head -2` on a
three-line output. This account had that list in context throughout and walked
into the same hole three times in one session. The rule is not hard to state
and is apparently very hard to hold.

## 7. What this account could not see

Stated so the boundary is visible rather than implied.

- **Nothing in a browser.** Every `[read]` claim is about call sites, not about
  what renders.
- **Nothing about real traffic**, which is section 5.
- **Nothing about translation quality**, which is the first question a user
  would ask and is out of scope for everything here.
- **Nothing you never noticed.** A self-reported corpus cannot show its own
  blind spots, and this account inherited them by reading it.
- **Nothing abandoned.** Investigations that stopped without a write-up leave
  no trace, so your queue over-represents work that reached a conclusion.

---

## 8. What this account would do first

Ordered by value over cost, with the cost stated. Nothing here needs a
decision from anyone else.

**One line, ten minutes.** Give `showError` a direction attribute. Your
interface ships an Arabic locale and that surface renders localised strings
with the page's base direction. Section 3.1. The witness is a localised
right-to-left string rendered into it, which is a test you can write in the
same ten minutes.

**One afternoon, and it unblocks a bimodal unknown.** The on-device engine
present on one Chrome build and absent on another of the same version, on your
own machine. A matrix over fresh profiles with flags varied. Until it is
understood, no single latency number describes your product, because the fast
path serves an unknown fraction. Section 5.

**One evening, and it is the highest-value thing on this list.** The chat
capture. Four of your own decisions end on its absence, every priority in this
file included. It needs a person on a real page, which is why it has not
happened, and no amount of engineering substitutes for it. Section 5.

**Two hours, and it closes a question rather than opening one.** Decide the
four detectability signals in section 3.2: each is required with the
requirement written next to it, or it goes. Two of the four are conveniences
with queryable names. You already made this call once for a more expensive
vector; this is the same call on the cheap side of the same door.

**Half a day, whenever the capture arrives.** The twenty-four languages with no
marker in `langDetect.ts`, section 3.5. A language with no marker, sharing a
script with a larger neighbour, is the exact shape that produced Persian,
Mongolian and Bulgarian. The capture says which of the twenty-four actually
appear, and that turns a list into a queue.

**Not now, and this is a recommendation against work.** The interface locale
coverage at 34 of 155 keys, and the seven merged branches. Both are real, both
are cheap, and neither costs a reader anything. They are listed in section 3.3
so they are not rediscovered, not so they are done.

## 9. How to refute this file

The fastest disproofs, in order of how much they would cost this file if they
landed:

1. **Run the two `grep` commands in section 1.** If direction attributes or
   page-queryable identifiers are not where section 3 says, the measured half
   of this file is stale and the rest is prose.
2. **Name a fourth instance of the pattern in 2.1 that is not a pattern.** If
   the instances are unrelated, the strongest claim here is a coincidence
   dressed as a finding.
3. **Take the chat capture and find that the frequencies invert the ordering.**
   That would not make anything here wrong; it would make the ordering wrong,
   which is most of what a handover is for.
4. **Point at a number tagged `[yours]` that this file repeated back
   incorrectly.** Every one of them was transcribed rather than witnessed, and
   transcription is where a secondary reading fails most quietly.

If none of the four lands, the file is probably worth the hour it takes to act
on section 3.1's one-line fix and section 5's afternoon.

---

## 10. Where the rest of it is

This file is the short version. Four documents sit behind it, and the order
below is by how likely each is to be useful to you rather than by how much
work went into it.

**[appendix E, the method log](appendix/E-method-log.md)** is the one to read
next if you intend to run a pass like this yourself. It carries the commands
that extracted your notebooks without reading them whole, all eight mistakes
this account made with what each cost, what was efficient against what was
waste, and what the harness refused. The section on writing a probe as a
publishable script is the practice that caught two of the three probe errors,
and it is not obvious.

**[appendix A, the audit specification](appendix/A-audit-prompt.md)** is
twenty-one axes, each with what breaks, what to measure, the number that closes
it and what to break to prove the number can go red. It is written against your
repository and refers to your files. Three of its requirements were wrong until
they were executed, which is recorded in
**[appendix B](appendix/B-prompt-construction.md)** along with all thirty
construction passes, including the ones that changed nothing.

**[The thesis](thesis/)** is fifteen chapters on what makes this problem hard,
built from your notebooks. The chapters most likely to tell you something you
did not already know about your own work are
[04 on writing systems](thesis/04-script-vs-language.md),
[05 on the motivation of transliteration signs](thesis/05-transliteration.md),
[06 on written laughter](thesis/06-laughter.md) and
[08 on why a keyboard topology beats phonotactics](thesis/08-noise.md). The
ones that mostly repeat what you already wrote are 09 to 13, and they are there
for completeness.

**[appendix C](appendix/C-replication.md)** is how to re-derive every number,
including the ones this file states, without trusting any of it.
