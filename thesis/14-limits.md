# 14. Limits and threats to validity

> Every frequency claim in this study is unsupported. The project knows it,
> records it as its own outstanding request, and has taken decisions by
> refusing to move. Refusing to move is not the absence of a guess: at least
> one revert was argued on a frequency nobody measured
> ([15.1](15-future.md#151-one-real-chat-capture)). This chapter states what fails if
> the frequency assumptions are wrong.

---

## 14.1 The binding limitation: no observed input distribution

**[reported]** The project's work queue carries, as a blocked item, a request
for a single real chat capture. Its own wording is that four decisions all end
on the same sentence: *the damage is measured and the frequency is not, because
every corpus here is hand-written.*

The four decisions named there:

1. whether the short-text losses are worth more provider calls;
2. whether trimming the identifier's unmapped languages is a gain or a
   regression;
3. whether a source allowlist should let an unidentified line through;
4. what share of a real chat is code-switched.

A collector exists and has not been run against live traffic.

**One of the four is not the capture's to settle.** **[reported]** The same
queue records the trimming experiment run twice and corrected once: reducing
the identifier to the languages the product maps frees zero bytes, because the
data stays in the bundle either way, so the weight motive does not exist. What
remains is an accuracy trade that *changes sign with the target set*: against
the ten languages the product speaks the decisive loss is 8 and 8, against all
42 targets it is 43 and 50. **[new]** A target is the language a reader
translates into. A chat capture records what is written, not what readers have
chosen, so it cannot say which target set is the real one; that is reader
behaviour, and the product ships no telemetry that could record it. The only
proxy in the corpus is the listing's views by localised page (HANDOVER.md 3.5).
**[replicated]** The collector exports a channel name and timestamped message
text, and nothing about the reader.

**And a second was closed without the capture.** **[reported]** The allowlist
question was measured from both sides: what a reader whose allowlist matches
the chat would lose, and what a reader whose allowlist does not would newly pay
for, are the same lines, message for message. No rule serves both and the
option's wording licenses both readings, so the repair moved into detection,
where it serves both: Portuguese losses 3 of 6 to 1, Turkish 2 of 4 to 1, the
bench 11 to 8. The queue's own entry closes it: *reopening the allowlist itself
needs a case detection cannot reach*. The rate the question was first argued
on, one short message in five, turned out to be a Latin rate; the full bench
gave 11 of 176.

**So two of the four still wait on a capture**: whether the short-text losses
are worth more provider calls, and what share of a real chat is code-switched.
The queue's waiting item still lists all four, beside the two entries that
overtook it. Every other mention of these decisions in this study points here
rather than restating a count.

### What this invalidates

**Nothing about mechanisms.** That a homoglyph defeats a one-character floor,
that a keyboard-row criterion separates smash from Czech syllabic sonorants,
that grouping by target inherits the wrong source, that `dir="auto"` covers one
surface of three: these are demonstrations, and they hold regardless of how
often the triggering inputs occur.

**Everything about priorities.** Every statement in this study of the form
*this matters more than that* rests on an unmeasured frequency. The damage
scale used throughout ([appendix A](../appendix/A-audit-prompt.md)) multiplies
a population estimate by a silence estimate, and the population estimates are
judgements.

**Every benchmark's representativeness.** The benches are hand-written
sentences. They were written by people who knew what they were testing. Section
14.3 develops why that is worse than it sounds.

### Why the hand-written corpus is not merely small

Three distinct problems, which are easy to collapse into one:

- **Distributional.** Hand-written sentences are well formed. Real chat
  contains fragments, repetitions, mid-word cut-offs, pastes, and lines that
  are three emotes and a full stop. A bench of well-formed sentences measures
  the easy tail of the distribution.
- **Selectional.** A bench is written by someone who knows which phenomenon it
  targets, so it contains that phenomenon at a rate unrelated to its natural
  frequency, and usually in its clearest form.
- **Adversarial coverage.** Real chat contains deliberate evasion, spam, and
  copy-paste floods. A hand-written bench contains what its author thought of.

## 14.2 Threats specific to individual findings

### The transliteration marker tables

The five-letter floor is a proxy for "not yet borrowed by global internet
slang" ([ch. 5](05-transliteration.md#54-romanised-russian-greek-and-japanese-the-unambiguity-rule)).
It is a good proxy today. It is not a mechanism, and it will fail for the next
six-letter word that goes global. The table therefore has a decay rate that
nothing in the system measures, and no alarm exists for a marker becoming
ambiguous.

### The keyboard-smash rule

The row-adjacency criterion assumes a QWERTY-family layout
([ch. 8](08-noise.md#the-criterion-that-shipped)). Nothing in the corpus
measures it against AZERTY, QWERTZ, non-Latin layouts, or phone keyboards,
whose adjacency differs. The rule's stated strength, that it models the
generating mechanism, is exactly what makes it layout-specific: a different
device generates a different signature.

The threshold at 0.7 with a six-letter floor was chosen with margin on both
sides of a measured boundary at 0.65, against 33 adversarially chosen real
words. That is a sound procedure on that set, and the set is small.

### The laughter lexicon

43 forms, of which 22 mark a language
([ch. 6](06-laughter.md)). Written laughter is a live convention that changes
faster than orthography: forms appear, spread, and are borrowed. `lol` is
already excluded for exactly this reason. The lexicon needs periodic
re-attestation, and nothing schedules it.

The 3 to 10 improvement was measured on ten messages, all of the same shape
("laughter form + short clause"). That shape is favourable to the mechanism.

### The latency comparison

Fully developed in [ch. 10](10-latency-weight.md#103-why-the-comparison-is-not-valid-as-stated-new):
the two series differ on language pair, the local series has n=8, and its p95
is a maximum. The mechanism claim survives; the ratio does not.

### The cache measurement

One 29-minute session cannot evaluate a cache designed for inter-session
locality ([ch. 10](10-latency-weight.md#105-cache-a-number-that-cannot-be-read-from-one-session)).
The project's disposition, keep it because its read cost is zero, is correct
and is not evidence that it works.

### This study's own measurements

The measurements tagged **[new]** and **[replicated]** were taken against one
checkout at one moment, mostly by reading source rather than by observing a
running build in a browser. For the direction-handling finding in
[ch. 11](11-privacy-surface.md#replication-bidirectional-text-new), the count is a
count of call sites: a surface rendered by a path this study did not identify
would be missed, and the rendered consequence was never observed. A statement
about call sites is weaker than a statement about what a reader sees, and this
study only has the former.

That limitation is what 14.2b measures rather than asserts. The first version
of that same direction finding reported one guarded surface of three; two
further instruments took it to two of two. The text above was itself written
around the withdrawn figure and is corrected here, which is a small instance of
the same point: **a document carries its own stale numbers forward until
something re-reads it against the source.**

## 14.2b The measured revision rate, and what it does to every other chapter

This study put nine of its own published measurements through a replication
bar: each re-measured with an instrument of a different shape, with the
population declared before the second attempt **[new]**.

**Five of the nine changed.** Two of them substantially: a locale coverage
figure that accused complete work of being 22 percent done, retracted in full,
and an enumeration of page-observable signals that under-counted by a factor of
two and a half. Four held. One turned out to have been published without the
parameter it depended on.

Three of the five over-stated and two under-stated, so the errors do not share
a direction. What decides the sign is whether the probe was looking for a guard,
where a blind spot produces a false accusation, or enumerating instances, where
a blind spot produces a short list that looks like a finding.

### What this does to the numbers tagged [new] and [replicated]

Those are this study's own, and five in nine of them moved under scrutiny that
most of them had not received at the time of writing. **The ones now in
[chapter 13](13-results.md) have been through the bar; the rate says what to
expect of any that had not.** Where a measurement here rests on a single
instrument, it is now marked as such.

### What it does to the numbers tagged [reported], which is the harder question

The corpus's measurements were never put through this bar either. It would be
easy, and wrong, to transfer the rate: five in nine came from an account
reading a codebase it did not write, without the authors' knowledge of where
the joins are, and that is the condition under which measurement is hardest.
The development account measured its own code, with witnesses, under a method
that required a number before an explanation.

But the corpus is not silent on its own revision rate, and what it records is
the same phenomenon at a lower intensity. At least four published measurements
were corrected there by their own authors:

- an arabizi evaluation that scored the wrong quantity entirely;
- a keyboard-smash claim of eleven of fifteen filtered, measured directly at
  zero of eleven;
- a framing of Malay and Hebrew as two broken languages, corrected by a probe
  to a badge-and-source problem;
- an identifier comparison whose first published verdict reversed when four
  messages were added to the corpus.

**So both accounts revised published measurements, and both found the revision
worth recording.** The honest statement is not a rate for the corpus, which
nobody has measured. It is this:

> Measurement of a running system is routinely revisable, by the people who
> wrote it and by outside readers alike. A measurement that has not been
> re-taken with a different instrument is a first draft, whoever took it.

That reframes the provenance scheme used throughout this study. **[reported]**,
**[replicated]** and **[new]** certify that a measurement happened and by whom.
None of them certifies that it was competent, and the tags were silently read
as though they did until this rate was measured. The fourth tag added earlier,
**[outside]**, closed a different gap; this one has no tag that closes it, only
the bar.

## 14.3 Threats to the method itself

### The corpus is self-reported

The notebooks were written by the people doing the work, with no external
review. They are unusually candid, and the corpus contains multiple
self-corrections of previously published claims
([ch. 8](08-noise.md#the-prior-claim-and-its-correction),
[ch. 5](05-transliteration.md#53-the-damage-that-the-evaluation-grid-could-not-see),
[ch. 9](09-architecture.md#97-coverage-gaps-that-were-not-what-they-looked-like)),
which is evidence of genuine method rather than of self-presentation.

But a self-reported corpus cannot show what was never noticed. The defects in
this study are the ones the project found or this study found. The distribution
of defects that neither found is unknown and unknowable from this material.

### Selection by survival

The work queue records completed items. Abandoned lines of investigation that
were never written up leave no trace, so the corpus over-represents
investigations that reached a conclusion.

### Single case

One system, one platform, one team, one three-month period. Every generalisation
here is a proposal with its reasoning exposed, not an established result. The
linguistic findings transfer more readily than the architectural ones, because
scripts and borrowing behave the same everywhere while extension runtimes and
host pages do not.

### The analyst is not the experimenter

This study reorganises and analyses measurements it did not witness
([Provenance](../README.md#provenance-stated-once-and-honestly)). Where a
notebook entry is ambiguous, this study has interpreted it. Interpretation can
be wrong, and the tags exist so that a reader can go back to the source.

## 14.4 What would settle the open questions

In order of value per unit of effort:

1. **One real chat capture**, a few thousand lines from two or three channels
   of different languages. It unblocks the decisions in 14.1 still waiting on it and
   converts every mechanism finding in this study into a prioritised one. It is
   by a wide margin the highest-value missing measurement.
2. **The availability rate of the on-device engine** across real installs. It
   converts a known 70x mechanism advantage into a statement about users
   ([ch. 10](10-latency-weight.md#104-the-gate-on-availability)).
3. **Cache counters read across several days** rather than one session.
4. **A held-out bench per language**, written after each rule, applied
   uniformly. The project adopted this discipline partway through; the earlier
   figures do not have it.

## 14.5 The honest summary

This study establishes a set of mechanisms with clarity, and establishes almost
nothing about their relative importance. That asymmetry is not a flaw in the
writing; it is a faithful reflection of a corpus whose authors repeatedly chose
to state a limit rather than guess a frequency, which is the harder and better
choice, and which leaves exactly this gap.
