# Translating live chat

**Linguistic and architectural constraints of real-time machine translation on a
streaming platform. A measurement-driven case study of
[kick-chat-translator](https://github.com/Pkkls/kick-chat-translator).**

---

## What this is

A thesis-length study of one working system: a browser extension that
translates the chat of a live-streaming platform as it scrolls, in both
directions, for a real installed user base.

The system is unusual as a research object because it kept its laboratory
notebooks. Three months of development left behind a work queue that records
every experiment with its numbers, including the ones that failed, two long
daily journals, a changelog that states the measurement behind each entry, and
a version history of sixteen releases. This study reads that corpus as primary
material, reorganises it around the questions it actually answers, replicates
what can be replicated, and states plainly what cannot.

The double framing is deliberate. Half the difficulty of translating live chat
is linguistic: a chat line is a short, noisy, code-switched, often
transliterated object that violates nearly every assumption a language
identifier is built on. The other half is architectural: the translation must
arrive within the few hundred milliseconds a scrolling chat leaves it, inside a
browser extension runtime that kills its own background worker, against a page
that recycles the DOM nodes the translation was attached to. Neither half can
be studied alone, because most of the interesting failures live exactly where
the two meet.

## Provenance, stated once and honestly

This document was written by a different account from the one that carried out
the development and the original measurements. That separation matters enough
to be declared rather than blurred:

- **Reported measurements** come from the project's own notebooks. They are
  attributed as such and dated. They were taken by the development account on
  its own machine, and this study did not witness them.
- **Replicated measurements** are the ones re-run here against the repository
  as it stands. They are marked as replications and carry the command that
  produced them.
- **Original analysis** is this study's contribution: the systematisation, the
  comparison across experiments that were run months apart without reference to
  each other, and a small number of new measurements taken to answer questions
  the notebooks raise but do not close.

Where the notebooks and a replication disagree, both are given. Nothing here
claims authorship of the engineering.

## Plan

### Part I. The object and the method

| | |
|---|---|
| [01. Introduction](thesis/01-introduction.md) | The problem, why live chat resists translation, what the case offers |
| [02. Live chat as a linguistic object](thesis/02-object.md) | Genre, brevity, written orality, the emote as a lexical unit |
| [03. Method](thesis/03-method.md) | Measurement-driven development, held-out benches, the witness rule, what counts as evidence |

### Part II. Linguistic constraints

| | |
|---|---|
| [04. A writing system is not a language](thesis/04-script-vs-language.md) | Persian read as Arabic, Mongolian and Ukrainian and Bulgarian read as Russian, and the emoji that erased a script |
| [05. Transliteration and romanisation](thesis/05-transliteration.md) | Arabizi, shlyokavitsa, romanised Russian, Greeklish, and how a digit betrays its own motivation |
| [06. Written laughter](thesis/06-laughter.md) | A cross-linguistic lexicon of laughter, and why it identifies a language where no detector can |
| [07. The brevity floor](thesis/07-brevity.md) | How short a line can be and still carry an identifiable language |
| [08. Non-linguistic noise](thesis/08-noise.md) | Emotes, handles, hostnames, and the cost of deleting a word that was language |

### Part III. Architectural constraints

| | |
|---|---|
| [09. Architecture](thesis/09-architecture.md) | The path of one line, and the three ways a correct translation lands wrong |
| [10. Latency and weight](thesis/10-latency-weight.md) | The engine budget, the on-device path, and what accuracy costs in bytes |
| [11. Privacy and observable surface](thesis/11-privacy-surface.md) | What leaves the machine, and what the host page can tell about the reader |

### Part IV. Verification and results

| | |
|---|---|
| [12. Verification](thesis/12-verification.md) | Gates, witnesses, and the audit surface derived from this corpus |
| [13. Results](thesis/13-results.md) | Every measurement, consolidated and dated |
| [14. Limits and threats to validity](thesis/14-limits.md) | What the corpus cannot support, starting with the absence of a real chat capture |
| [15. Open questions](thesis/15-future.md) | What the next measurement should be, and why |

### Appendices

| | |
|---|---|
| [A. The audit prompt](appendix/A-audit-prompt.md) | A twenty-one axis quality specification derived from this study |
| [B. How the prompt was built](appendix/B-prompt-construction.md) | Thirty refinement passes, and the three bars that only execution could falsify |
| [C. Replication protocol](appendix/C-replication.md) | How to re-derive every number this study took |
| [D. Scripts](appendix/D-scripts/) | The probes, as they were actually run |
| [E. Method log](appendix/E-method-log.md) | How this was produced: the commands, every mistake, what was efficient, what was refused |
| [F. The axis ledger](appendix/F-axis-ledger.md) | The 22 axes against their own bars: 11 carry a verdict, 11 do not |
| [G. The budget file](appendix/G-budget.md) | The thresholds seven bars compare against: two set, five naming the measurement that would set them |

## Start here if you are continuing this work

[START-PROMPT.md](START-PROMPT.md) is the text to paste into a fresh session.
[TRANSMISSION.md](TRANSMISSION.md) carries everything transmissible: the rules
learned, the environment traps, the dead ends, and what was never measured.
[RESUME-HERE.md](RESUME-HERE.md) carries the exact state: what is verified, what
the two scripts must report, and the journal sections still unread with their
line numbers. The unfinished reading is the productive part.

## The one document meant to be acted on

[HANDOVER.md](HANDOVER.md) is written for the account that develops the system,
not for a reader of the study. It carries what an outside reading found in its
own notebooks, what was measured here, an ordered list of what to do first with
the cost of each, and the rate at which this account's own probes were wrong.

Everything in it is re-derivable in one command:

```bash
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
```

## The result that reframes the others

**Nine of this study's own published measurements were re-taken with a second
instrument. Five changed.** Two substantially: an accusation that complete
localisation work was 22 percent done, retracted in full, and an enumeration
that under-counted by a factor of two and a half.

Three over-stated and two under-stated, so there is no single direction to
correct for. What decides the sign is whether the probe hunts a guard, where a
blind spot becomes a false accusation, or enumerates instances, where a blind
spot becomes a plausible short list.

The corpus under study records at least four of its own published measurements
being corrected by their authors. Both accounts revised, and both thought it
worth writing down. The transferable statement is in
[14.2b](thesis/14-limits.md#142b-the-measured-revision-rate-and-what-it-does-to-every-other-chapter):
a measurement not re-taken with a different instrument is a first draft,
whoever took it.

## Three results worth reading first

**A marker list scored 20 out of 20 on the bench that produced it, and 4 out of
12 on lines written afterwards.** The notebooks caught this and re-measured. It
is the clearest statement of overfitting-to-the-bench available in this corpus,
and it reframes every other accuracy number in the project.
See [03. Method](thesis/03-method.md).

**A writing system was treated as a language, three times, on three different
scripts, months apart.** Arabic script answered Persian. Cyrillic answered
Russian for Mongolian, Ukrainian and Bulgarian alike. Each was diagnosed
independently, and the second fix's own comment already contained the general
statement of the defect. A correct diagnosis written once and applied in one
place is not a fix.
See [04. A writing system is not a language](thesis/04-script-vs-language.md).

**Laughter identifies a language at five characters, where no statistical
detector can.** The project built a lexicon of written laughter across nine
writing systems because none exists to import: the academic literature on
social-media normalisation treats laughter as a category and publishes no
inventory. On mixed messages, usable source-language identification went from 3
in 10 to 10 in 10.
See [06. Written laughter](thesis/06-laughter.md).

## How to read the numbers

Every number in this study carries a tag:

- **[reported]** taken from the project notebooks, by the development account.
- **[replicated]** re-run for this study; the command is given.
- **[new]** measured or analysed here for the first time; the method is given.
- **[outside]** general knowledge invoked from beyond the corpus and **not
  verified by this study**: an etymology, a claim about how a class of system
  behaves, a linguistic fact. Treat these as the weakest statements here and
  refutable by anyone who knows the domain.

A number with no tag is an error in this document. Report it.

The fourth tag was added late, after an adversarial reading of this study
found three claims about the outside world wearing the **[new]** tag, which
says "this study's own analysis". An etymology is not an analysis, it is a
fact, and a scheme with no slot for borrowed facts pushes them into whichever
slot is nearest. The gap is recorded in
[appendix E](appendix/E-method-log.md).

## Licence

MIT, matching the system it studies. See [LICENSE](LICENSE).
