# 06. Written laughter

> Written laughter identifies a language in five characters, which no
> statistical identifier can do. It is the cheapest high-confidence signal
> available on chat text, and there was no lexicon to import: the project had
> to build one and check that the absence was real rather than assumed.

---

## 6.1 Why laughter is the right object

A trigram language identifier needs volume. The shorter the line, the flatter
its posterior, and chat lines are short. Everything in
[chapter 7](07-brevity.md) follows from that constraint.

Laughter escapes it, for reasons that are structural rather than lucky:

- **It is extremely frequent.** In entertainment chat it is plausibly the most
  frequent single speech act. Whatever else a line contains, laughter is a
  large share of the tokens available.
- **It is a closed class.** Unlike the open lexicon, the inventory of laughter
  forms in any given community is small and enumerable.
- **It is community-specific in its written form**, even though the underlying
  act is universal. This is the crucial property, and section 6.2 takes it
  apart.
- **It is orthographically deviant.** Most laughter forms are not words of the
  language in any dictionary sense. They therefore do not compete with the
  ordinary lexicon and can be matched by exact lookup, which is fast and
  produces no partial matches.

The combination is unusual: a high-frequency, closed, community-marked class
that a statistical model is structurally unable to exploit, because the model
works on letter sequences within words of a language and these are neither.

## 6.2 A typology of written laughter [new]

*The forms below are drawn from the project's lexicon; the three-way typology
and the analysis are this study's, not the notebooks'. The individual
etymologies are **[outside]**: invoked from general knowledge, not verified
here, and the typology does not depend on any single one of them being right.*

The same non-verbal vocal act is conventionalised in writing by at least three
distinct semiotic mechanisms, and which mechanism a community uses is itself
diagnostic.

### Type 1: phonetic transcription

The written form transcribes the sound, through the target orthography's own
grapheme-phoneme conventions. Because those conventions differ, the same sound
produces different strings.

| Form | Community | Mechanism |
|---|---|---|
| `jajaja` | Spanish | Spanish `j` spells /x/, so `ja` transcribes the aspirate the same way `ha` does in English |
| `hahaha` | English and many others | the default |
| `хахаха` | Russian | the same sequence in Cyrillic |
| `kkkk` | Korean, and separately Brazilian Portuguese | see below |

The Spanish case is the cleanest illustration of why laughter is diagnostic at
all. The sound is the same as English laughter. The spelling differs because
the orthography differs. Nothing about the act is Spanish; everything about its
transcription is.

### Type 2: sub-lexical and sub-syllabic notation

| Form | Community | Mechanism |
|---|---|---|
| `ㅋㅋㅋ` | Korean | a bare consonant jamo, /kʰ/, written without a vowel |

This form is worth isolating because it is orthographically impossible outside
its own tradition. Korean orthography composes jamo into syllable blocks;
writing a bare initial consonant in a row is a chat-native convention that no
standard text produces. It is therefore close to a perfect marker, and it also
explains why the project needed a separate counter for bare jamo in its script
detection (see [chapter 4](04-script-vs-language.md)): these characters are
Hangul, they are frequent in chat, and they are not syllable blocks.

### Type 3: rebus and numeric convention

| Form | Community | Mechanism |
|---|---|---|
| `555` | Thai | the digit 5 is read *ha*, so the sequence spells *hahaha* |
| `2333` | Chinese | conventional rather than phonetic; commonly reported to originate in a forum emoticon index **[outside]** |
| `mdr` | French | acronym, *mort de rire* |
| `lol` | English, now global | acronym, borrowed everywhere |
| `wkwk` | Indonesian | conventionalised imitation |

Thai `555` is a phonetic rebus, and therefore the same mechanism as the SMS
digit substitution analysed in [chapter 5](05-transliteration.md#52-arabizi-the-motivation-of-the-sign):
the digit is read aloud and its name is reused as a syllable. Chinese `2333` is
not phonetic at all; it is an index into a shared cultural artefact, which
makes it a pure convention with no motivation recoverable from the string.

The typology matters for a practical reason beyond elegance. **The three types
decay differently.** Type 1 forms are tied to an orthography and are stable as
long as that orthography is. Type 3 acronyms are the most borrowable, and
`lol` has already been borrowed by everyone. Type 2 is the most robust of all,
because it depends on a writing-system convention that cannot travel without
the writing system.

## 6.3 The borrowing exclusion, again

The project's rule mirrors the one derived independently for transliteration
markers.

**[reported]** Of 43 forms recorded, 22 mark a language. Forms used everywhere,
`haha`, `lol`, `xd`, mark nothing, because a wrong answer here is handed to a
translation engine.

This is the second appearance in this corpus of the principle that **global
adoption destroys diagnosticity**, arrived at on a different problem
([chapter 5](05-transliteration.md#54-romanised-russian-greek-and-japanese-the-unambiguity-rule)),
with a different remedy, by the same reasoning. Two independent derivations of
the same rule is the closest thing a single-project corpus offers to
replication, and it is worth recording as such.

The asymmetry between the two remedies is instructive. The transliteration
table uses a mechanical proxy, a five-letter floor. The laughter lexicon uses
per-form editorial judgement backed by attestation notes. The difference is
forced by the data: laughter forms are short by nature, so a length floor would
delete the entire class. Where a mechanical rule is unavailable, the fallback
is provenance, which is what the lexicon's per-entry source notes provide.

## 6.4 The absence of prior art, verified

**[reported]** The notebooks record that nothing reusable existed to import,
and that this was checked rather than assumed. Three sources were considered:

- academic work on social-media normalisation, which treats laughter as a
  category but publishes no inventory;
- popular write-ups, which are prose rather than data;
- one machine-readable list on a public repository, which carries no licence at
  all and therefore cannot be used.

This is a small result but a real one. A cross-linguistic, attested,
machine-readable inventory of written laughter with per-form language marking
did not exist in reusable form at the time of the search, and the project built
one at 43 entries across nine writing systems.

The licence detail is not pedantry. An unlicensed list is legally unusable in a
distributed artefact regardless of how public it is, which is a constraint that
shapes what a shipping product can build on and is routinely ignored.

## 6.5 The measurement

**[reported]** On ten mixed messages of the shape "jajaja que bueno eso":

| | Before | After |
|---|---|---|
| Messages with a usable source language | 3 of 10 | 10 of 10 |

And, more significant than the coverage gain: **two of the three that had a
source language before were wrong.** The identifier had called that Spanish
line Portuguese, and a Portuguese line French.

That detail changes the interpretation of the whole result. The improvement is
not 3 to 10 on a scale of coverage. It is 1 correct to 10 correct, with the
previous state actively supplying wrong source languages to the engine on two
lines out of three that it answered at all. A coverage metric alone would have
reported a threefold gain; correctness reveals a tenfold one.

**[reported]** Cost: 3555 bytes on every page, 1.55 percent of the injected
script, inside the weight gate's 2 percent margin.

## 6.6 Laughter as a confident answer

The laughter lexicon feeds the *confident* path, the one whose value is sent to
the engine as the source language, unlike arabizi and romanisation which are
deliberately withheld from it ([chapter 5](05-transliteration.md)).

The asymmetry is principled and worth stating explicitly, because it is the
architectural expression of the linguistic analysis:

- A romanised Russian line **is Russian but is not in Cyrillic**. Telling the
  engine `sl=ru` asks it to parse a script that is not there.
- A line containing `jajaja` **is Spanish and is in Latin script**. Telling the
  engine `sl=es` asks it to parse exactly what is present.

The distinguishing question is not "how confident are we in the language" but
"does the declared language's expected script match the bytes on the page". A
system that collapses those two questions into one confidence score cannot
express this distinction, and would either lose the laughter gain or commit the
romanisation error.

## 6.7 What this chapter licenses

1. Laughter is the highest-value low-cost signal on chat text, because it is
   frequent, closed, community-marked and invisible to statistical models.
2. Its written forms conventionalise through at least three distinct mechanisms,
   which differ in robustness; sub-syllabic notation is the most robust and
   acronyms the least.
3. Globally borrowed forms must be excluded, by mechanical rule where the class
   permits one and by attested provenance where it does not.
4. Coverage gains on a detection metric can understate correctness gains by a
   factor of three when the prior state was confidently wrong.
5. The decision to feed a detected language to a translation engine depends on
   script agreement, not on confidence, and the two must be modelled separately.

---

*Sources: project work queue, "Done, kept for the record"; `src/shared/laughter.ts`
as described there. The typology in 6.2 is this study's analysis **[new]**; the
form inventory and all measurements are **[reported]**.*
