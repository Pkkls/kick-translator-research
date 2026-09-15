# 05. Transliteration and romanisation

> Two substitution systems use the same inventory, the Arabic numerals, inside
> otherwise alphabetic words. One chooses its digits for their **shape**, the
> other for their **sound**. They are separable precisely because their
> motivation differs, and the separation is measurable to zero false positives.
> That is the most linguistically satisfying result in this corpus.

---

## 5.1 The problem: language survives, script does not

A reader who speaks Russian, Greek, Japanese, Arabic or Bulgarian, typing on a
keyboard that offers only Latin letters, writes their own language in someone
else's alphabet. The language is intact. The script, which is what the fast
identification path depends on (see [04](04-script-vs-language.md)), is gone.

What the identifier sees is a Latin-script string. What it does with it is
report a Latin-script language, because that is what its model contains. The
project measured this before writing any remediation, which is the right order
and the reason the numbers mean anything.

**[reported]** Four romanised Russian sentences, and the languages returned:

| Input | Returned |
|---|---|
| `privet kak dela segodnya` | Indonesian |
| `spasibo bolshoe za stream` | Czech |
| `pozhaluysta pomogite mne` | Italian |
| `khorosho ochen khorosho` | Swedish |

The Greek and Japanese sentences returned nothing at all. The tally across the
five tested cases was 0 of 5 correct, and the notebooks record it that way.

Two distinct failure profiles appear here, and conflating them would obscure
what happens next. Romanised Russian produces **confident wrong answers**
spread across unrelated languages. Romanised Greek and Japanese produce
**silence**. The first is worse in this system, because a language, however
wrong, flows into the filters, the badge and the same-language skip; silence at
least fails safe.

Why does romanised Russian in particular attract wrong answers rather than
silence? A trigram model is a model of letter sequences, not of words. Romanised
Russian, with its dense consonant clusters, its `zh`, `kh`, `ts` and `shch`
digraphs and its vowel-final inflections, produces trigram profiles that fall
inside the space occupied by several real Latin-script languages. Indonesian,
Czech, Italian and Swedish are not a random draw; they are languages whose
orthographies happen to license similar sequences. The model is doing exactly
what it was built to do, on input outside its domain.

## 5.2 Arabizi: the motivation of the sign

Arabizi, sometimes called Arabic chat alphabet, writes Arabic in Latin letters
and replaces the consonants that Latin lacks with digits. The choice of digit
is not arbitrary and not phonetic. It is **graphic**: the digit is picked
because its shape resembles the Arabic letter.

| Digit | Arabic letter | Basis |
|---|---|---|
| 3 | ع | the digit mirrors the letter's form |
| 5 | خ | shape resemblance |
| 7 | ح | shape resemblance |
| 9 | ق | shape resemblance |

Latin-script SMS writing also puts digits inside words, and has done since
long before chat. But its digits are chosen for how they **sound**: 8 for
*eight* inside *l8r*, 4 for *four* inside *4get*, 2 for *to* or *two*, 1 for
*one*. This is a rebus: the digit stands for its own spoken name, which is then
read as a syllable of the word.

The two systems therefore share a surface phenomenon, digits inside alphabetic
words, while having **opposite semiotic motivations**. Arabizi's substitution is
iconic in the Peircean sense: the sign resembles its object. SMS substitution
is phonetic rebus: the sign is read aloud and its sound is reused.

This is not a decorative observation. It predicts exactly where the two
inventories will collide, and therefore how to separate them. The digits chosen
for shape and the digits chosen for sound overlap only where a digit happens to
satisfy both criteria. **[reported]** The overlap is 2, 6 and 8. Restricting the
arabizi signal to the digit class `[3579]` keeps every shape-motivated digit and
discards the entire collision set.

**[reported]** Measured on 12 arabizi sentences and 29 traps, the traps
deliberately chosen to include esports team names and handles where digits
appear inside alphanumeric tokens for no linguistic reason at all: `c9`, `g2`,
`d4`, `k9`, `s1mple`. With the wide digit set, 3 false positives. With `[3579]`,
12 of 12 detected and none.

Two further details deserve emphasis.

**No proportion threshold is needed.** One arabizi word is enough. This follows
from the motivation argument: a shape-motivated digit inside a Latin word is
close to diagnostic on its own, because no competing system produces it. A
signal whose false-positive rate is near zero does not need to be aggregated
over a line to become safe, and aggregating it would only cost recall on short
lines, which is where recall is scarcest.

**The answer is deliberately withheld from the confident path.** Declaring
`sl=ar` on Latin-script text would instruct the translation engine to read
Arabic script where there is none. The notebooks record this as untested and
therefore not done. Arabizi feeds ordinary detection, which feeds the filters
and the source badge; the engine continues to auto-detect. This is a precise
architectural distinction: **knowing what language a line is in and telling the
engine what to parse are different claims**, and the second requires the script
to match.

## 5.3 The damage that the evaluation grid could not see

The project's first evaluation scored arabizi 0 of 5 for returning no language,
and the notebooks then record the correction: measured properly, an absent
language costs nothing on the engine path, because the `sl` parameter sent is
`auto` for an undetected arabizi line and for a correctly detected Spanish line
alike. The confident-language function withholds everything the statistical
identifier guesses, so a missing guess and a withheld guess are indistinguishable
downstream.

The real damage lives somewhere the grid was not looking. **[reported]** With a
source allowlist configured, an arabizi message came out as `lang_unknown`, so
a reader who restricts incoming sources to Arabic lost exactly the messages they
had asked to receive.

This is a methodological result, and it generalises past this system:

> A metric can be sensitive to a variable that changes no user-visible outcome,
> while being blind to a variable that changes an important one. The grid
> measured *detection*, and detection was not the quantity that mattered on
> this path. What mattered was whether a filter downstream of detection
> received a usable value.

The corrective discipline is to trace each measured quantity to the decision it
feeds, and to measure at the decision rather than at the mechanism. The audit
specification derived from this corpus makes the point a standing rule: a skip
must carry a reason code, and the reason codes are what get counted.

## 5.4 Romanised Russian, Greek and Japanese: the unambiguity rule

Where arabizi has a formal signal, romanised Russian and Greek have only
vocabulary. The project's approach is a marker table, and the rule that governs
admission to it is the interesting part.

**[reported]** 32 markers. An entry earns a language only if it is unambiguous
against common English *and* against the other entries in the table. The
notebooks name the words deliberately excluded and the reason:

- `kawaii`, `sugoi`, `senpai`, `baka`, `desu`, `sensei` are excluded because
  English internet slang has adopted them. A reader can write any of them
  without knowing a word of Japanese.
- Greek `malaka` is excluded for the same reason.
- `net`, `poka`, `davai` are excluded as too short or too common elsewhere.

A test asserts that every marker is at least five letters, which keeps the
short-and-common door shut mechanically rather than by editorial vigilance.

**[reported]** Measured: 20 transliterated sentences marked, 0 false positives
on 20 traps. Cost 617 bytes, 0.26 percent of the injected script.

The exclusions are the substance here, and they describe a real phenomenon:
**lexical borrowing destroys a marker's diagnosticity**. A word that begins as
evidence of a language stops being evidence the moment a global internet
subculture adopts it. The five-letter floor is a crude proxy for "not yet
borrowed", and it works because borrowing favours short, phonologically simple,
culturally salient items. It will fail for the next six-letter word that goes
global, which is a known and stated limit rather than an oversight.

The same withholding applies as for arabizi: declaring `sl=ru` on Latin-script
text would ask the engine to read Cyrillic where there is none.

## 5.5 Shlyokavitsa: the case that was closed, and the measurement that closed it

**This section said the case stayed open. It did not.** An earlier entry in the
notebooks defers it; a later one solves it, and this study read the first and
missed the second **[new]**. The correction is worth more than the original
section, because the solution contains the sharpest overfitting measurement in
the whole corpus.

Bulgarian written in Latin letters, which Bulgarian chat writes routinely, was
first recorded as diagnosed and deferred, on the reasoning that it would need a
third marker table and the frequency data to justify its weight did not exist.

**[reported]** The identifier scatters: `run` (Romanian) on "mnogo dobre igra",
`pol` (Polish) on "mnogo smeshno", `ind` (Indonesian) on "az sam tuk", `swe`
(Swedish) on "ai stiga be". Nine lines of twelve end silent.

The scatter explains a user report that Bulgarian was being labelled Romanian,
and it is worth noting that the same user-visible symptom had **two independent
causes**: this one, in Latin script, and the Cyrillic-Bulgarian-read-as-Russian
case of [chapter 4](04-script-vs-language.md). A single symptom with two
unrelated causes is a recurring hazard in this domain, because the reader
reports what they see and what they see is one wrong flag.

The disposition at that point was explicit: the `sl` stays empty in every case,
so the engine is not misled; the damage is the badge and the same-language skip.

### What the later pass found

**The framing was wrong, and correcting it made the work small.** The
romanisation file defines itself as "the languages written in Latin letters
that are not written that way", which *is* shlyokavitsa. It needed a fourth
language in an existing table, not a third table.

Then the measurement that decided the form, and it is the best instance of
overfitting in this corpus **[reported]**:

> Markers built by grammatical paradigm, the interrogatives, the future
> particle, the demonstratives, the roots where Bulgarian diverges from
> Russian, take **10 of the 20 lines written at the same time as them and ZERO
> of the 4 written the day before**, by the previous pass, before the list
> existed.

Zero of four. A paradigm gives the words of a textbook; a chat writes *mnogo
dobre igra* and *az sam tuk*, which carry none of them. The notebooks name it
as the same defect as the short-word table built from greetings, caught before
shipping this time rather than after.

**The repair is a conjunction rule, and its false-positive measurement is the
part to keep.** The words a chat actually writes are the ambiguous ones:
`dobre` is Polish, `az` Hungarian, `sam` an English given name, `mnogo` and
`smeshno` romanised Russian. One decides nothing. **Two in the same line
decide: zero false positives across the 187 lines of both benches in the
repository, in 19 languages that these lists had never looked at**, and 3 of
the 4 held-out lines against 0 for the strong markers alone.

End to end, three of four previously mislabelled lines become correct and none
becomes wrong.

### The five-letter floor, respected rather than waived

The floor rejected nine of the strong Bulgarian markers, `shte`, `kade`,
`koga`, `tova`, `tozi`, `tazi`, `tezi`, `kude`, `sme`. They were demoted to
the second tier rather than granted an exemption **[reported]**.

What that cost, measured: held-out recall does not move, 3 of 4 before and
after. What falls is recall on the author's own lines, 16 to 14 of 20, **and
that number only ever measured the fitting.**

This is the discipline of [chapter 3](03-method.md#33-the-bench-that-measured-itself)
applied prospectively rather than in hindsight: a rule was refused an exemption,
the refusal was priced, and the price turned out to be paid entirely in the
metric that does not predict anything.

See [14. Limits](14-limits.md) on the absence of a real chat capture, which
remains the binding constraint behind other decisions.

## 5.6 What this chapter licenses

1. **Transliteration detection is feasible without a model**, at a cost of
   hundreds of bytes, where the system has a formal signal (arabizi) or a
   curated closed-class lexicon (romanised Russian, Greek, Japanese).
2. **Formal signals beat lexical ones** on every axis that matters here:
   smaller, more robust to borrowing, effective on one token, and not dependent
   on a frequency list that ages.
3. **Detection and engine instruction must be separated.** A romanised line has
   a language but not that language's script, so the identity may inform the
   interface and the filters while the engine is left to auto-detect.
4. **Borrowing is the decay function on lexical markers.** Any marker table
   needs an admission rule that anticipates it, and a length floor is a usable
   if imperfect proxy.
5. **Measure at the decision, not at the mechanism.** The arabizi grid scored
   the wrong quantity and reported harm where there was none while missing the
   harm that existed.

---

*Sources: project work queue, "Done, kept for the record"; daily journal of
2026-08-31. All measurements in this chapter are **[reported]** unless marked
otherwise.*
