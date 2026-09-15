# 08. Non-linguistic noise

> The best feature for separating keyboard smash from real words is not
> linguistic. It is the physical layout of the keyboard. The obvious linguistic
> criterion was measured, found to delete real Czech words, and thrown away.

---

## 8.1 The category

A chat line is not guaranteed to be language. A substantial share of traffic is
made of objects that occupy the same slot as a message without being one:
keyboard smash, emote codes, handles, hostnames, pure punctuation, expressive
letter repetition, and single symbols.

Every one of them costs something if mishandled, and the costs run in both
directions:

- **Treated as language**, noise is sent to a translation engine. That is a
  paid request, a latency budget spent, and a nonsense line rendered under a
  message. Worse, the identifier will sometimes return a language for it,
  which then flows into filters and badges.
- **Treated as noise, wrongly**, real language is deleted before translation.
  This is the more dangerous direction, because it is silent: the reader never
  learns that a word was removed from the message they are reading.

The corpus contains clear instances of both, which is what makes it useful.

## 8.2 Keyboard smash: an ergonomic criterion beats a linguistic one

### The prior claim, and its correction

**[reported]** An earlier note in the project asserted that eleven of fifteen
keyboard smashes were already being dropped by an existing English-language
rule. Measured directly against the detection function: **zero of eleven** were
dropped. All eleven reached the engine, and three came back carrying a
language:

| Smash | Language returned |
|---|---|
| `asdasdasd` | Portuguese |
| `zxcvbnm` | Spanish |
| `hjkhjkhjk` | Dutch |

The diagnosis of the wrong prior claim is precise and worth preserving: it
conflated the statistical identifier returning `und` with the detection wrapper
returning `'en'`. At the identifier's three-character floor, it returns codes
that map to nothing, so the wrapper returns undefined, and nothing downstream
drops the message. Two components were each behaving as documented, and the
belief about their composition was false.

This is a general hazard in layered detection pipelines: **the failure mode of
a composition is not the union of the failure modes of its parts**, and a claim
about the composition has to be measured at the composition.

### The criterion that was rejected

The obvious linguistic criterion for keyboard smash is absence of vowels. It
was implemented, measured, and discarded.

**[reported]** It catches every smash. It also catches `krk`, `prst`, `smrt`
and `vlk`, which are real Czech words.

The linguistic reason is worth spelling out, because it explains why this is a
principled failure rather than bad luck. Czech, along with several other Slavic
languages, permits **syllabic sonorants**: /r/ and /l/ can occupy the syllable
nucleus that a vowel occupies in most languages. `vlk` (wolf), `krk` (neck),
`prst` (finger) and `smrt` (death) are perfectly ordinary monosyllables whose
nucleus is a consonant. The canonical Czech demonstration of the phenomenon,
*strč prst skrz krk*, is a fully grammatical sentence containing no vowel
letter at all.

A vowel-absence rule therefore does not have an unfortunate false-positive
rate on Czech. It systematically deletes an entire licit syllable type of the
language. The distinction matters for how such a rule should be evaluated: the
false positives are not a tail, they are a structural class, and no threshold
tuning reaches them.

### The criterion that shipped

**[reported]** The rule kept is the share of adjacent letter pairs that live on
the same row of the keyboard. Measured against 15 smashes and 33 real words
chosen as the worst case, Slavic consonant clusters included:

| Threshold | False positives |
|---|---|
| 0.6 | 2 |
| 0.65 and above | 0 |
| **0.7 with a six-letter floor** | **0, and what shipped** |

Result: 15 of 15 smashes caught, 0 false positives.

The epistemological point is the one to carry away. Keyboard smash is not a
linguistic object at all. It is a **motor artefact**: the product of a hand
dragging across a physical device. Its defining property is not the absence of
linguistic structure but the presence of a different structure entirely, the
topology of the input device. Modelling it as degenerate language fails.
Modelling it as what it is, a trace of hardware, succeeds cleanly.

The generalisation:

> When a class of noise is produced by a mechanism, model the mechanism. A
> criterion drawn from the generating process will usually beat a criterion
> drawn from the absence of the properties of the class it is being separated
> from.

This also predicts the rule's limits, which is the mark of a real model rather
than a fitted one. It is layout-specific: it assumes the rows of a QWERTY-family
keyboard. A smash on a different layout, or on a phone keyboard with different
adjacency, has a different signature. Nothing in the corpus measures that, and
it is recorded here as an open question in [15](15-future.md).

### Expressive lengthening, and why it broke the first version

**[reported]** `siiiiiiii` and `NOOOOOO` carried the smash signature and were
dropped as noise. A held letter necessarily lives on one row, so a repeated
character produces an adjacency score of 1.

These strings are not noise. Expressive lengthening is a transcription of
prosody: the held vowel writes duration, which in speech marks emphasis or
affect. In chat it is a productive, meaning-bearing device, and deleting it
removes exactly the affective content that makes chat what it is.

The separation kept is the number of distinct letters, with a repeat rule
alongside it. That measure is a type-token ratio in miniature: smash has many
distinct letters in a short span, lengthening has very few. The two phenomena
are opposite in lexical diversity while identical in row adjacency, which is
why the second dimension is necessary and why neither dimension alone suffices.

These cases now stand as witnesses in the test file, which is the correct
disposition: **the input that broke a rule is the most valuable test that rule
will ever have.**

## 8.3 Over-generation on the emote path

The reverse failure, real language deleted as noise, appears twice in the
corpus, and both are instructive because each comes from a heuristic that is
reasonable on its face.

### A mixed-case rule against brand names

**[reported]** The inline emote-name stripper removes any mixed-case word.
Emote codes on streaming platforms are conventionally CamelCase, so the rule
has a real basis. But the same convention is used by commercial names, and the
notebooks record `iPhone`, `McDonald` and `PlayStation` being removed before
translation.

The rule over-generates because CamelCase is not a property of emote codes. It
is a property of a broader orthographic convention that emote codes share with
trademarks, programming identifiers, and a long tail of internet naming. A
feature shared with a superset cannot separate a subset.

### A suffix rule against Turkish morphology

**[reported]** The token `ez` appeared in a suffix list, and deleted Turkish
negative aorists ending in `-mez`: `etmez`, `istemez`, `gitmez`, `gerekmez`,
`gondermez`.

This is the sharpest instance of the general hazard the corpus names, and
[8.3b](#83b-the-damage-measured-and-the-language-the-corpus-did-not-name)
shows it is not the sharpest instance there is. Turkish is
agglutinative: grammatical information is carried by productive suffixes
appended to stems. The negative aorist is formed with a suffix whose surface
form is `-mez` or `-maz` under vowel harmony **[outside]**. An ASCII substring
rule written against an English gaming interjection therefore intersects a
**productive grammatical morpheme** of an unrelated language.

**A correction to this section as first published.** It said the rule deleted
*every* Turkish negative aorist, and that it inverted meaning because what it
deleted was precisely the negation. Both were wrong, and the paragraph above
already held the fact that refutes the first: a rule ending in `ez` cannot
match `-maz`. Run through the product's own pre-repair module **[new]**,
`yapmaz`, `olmaz`, `anlamaz` and `kalmaz` pass untouched, and `gitmez`,
`gelmez` and `istemez` vanish whole, so the negation is not isolated: the verb
goes with it. The rule's `\w` and `\b` are ASCII, so a non-ASCII letter ends a
match, and that produces the only case where meaning does invert: `içmez`
leaves `iç` and `geçmez` leaves `geç`, bare stems that read as imperatives
**[outside]**, while `görmez` leaves `gö`, which reads as nothing.

The damage profile is still severe: it is systematic rather than occasional, it
covers the half of an inflectional category that vowel harmony assigns to front
vowels, it is silent, and it removes the verb rather than the negation, except
where a diacritic leaves a stem behind that means the opposite.

The generalisation, which this study proposes as the strongest practical claim
of the chapter:

> Any substring rule written in one language will eventually intersect a
> morpheme in another. In a product that processes forty-two languages, the
> question is never whether a stripping heuristic over-generates but which
> language it over-generates into, and that question must be asked before the
> rule ships, not after a user reports it.

## 8.3b The damage measured, and the language the corpus did not name

The two rules above are recorded in the notebooks as findings. A later pass
measured them, which is a different act, and this study then re-measured them
twice. The first instrument disagreed with the project and was wrong; the
second agreed with the project, and the reason the first one was wrong is the
part worth keeping.

### The third rule, which is not a substring rule at all

**[reported]** The stripper carried a rule the chapter above does not mention:
any all-lowercase word of thirteen characters or more was deleted. It has no
suffix list and no case pattern. Its only criterion is length. **[new]** It
entered the code on 2026-05-31 and left it on 2026-08-30, and thirteen tagged
releases carry it, from 2.1.0 to 2.9.2 (`git tag --contains 1451833
--no-contains 7c64018`).

That matters for the generalisation. A substring rule fails by colliding with a
morpheme of another language, which is the claim 8.3 makes. A length rule needs
no second language to fail: it encodes an implicit belief about how long a word
gets, and it fires wherever that belief is wrong.

### What it destroys, measured twice

The instrument is
[`probe-emote-stripper.mjs`](../appendix/D-scripts/probe-emote-stripper.mjs). It
takes the product's own module out of git at the repair commit and at its
parent, feeds each non-empty line of `store-listing.md` to it whole, as a chat
message would arrive, and diffs the words going in against the words coming
out. It attributes each loss to a rule using expressions extracted from the
module's source, and refuses to report unless applying those expressions in
order reproduces the module's output on every line.

| at the revision the project measured | project **[reported]** | this study **[replicated]** |
|---|---|---|
| word tokens | 11583 | 12061 |
| distinct words destroyed, before | 30 | 29 |
| distinct words destroyed, after | 13 | 13 |
| attributed to the mixed-case rule | 13 | 13 |
| attributed to the length rule | 8 | 8, the same eight |
| attributed to the suffix rule | 9 | 8, all from `ez` |

The project's figures hold. The token gap is tokenisation. The one-word gap on
the suffix rule was not traced.

**The first instrument, and why it disagreed.** It tokenised a cleaned copy of
the listing, tested each word against retyped expressions, and reported 37
destroyed before and 8 after, with the length rule at 16, the suffix rule at 13
and the mixed-case rule at 8. From that it concluded that the two readings
ranked the rules in opposite orders. That conclusion was drafted and never
published, and it was wrong for a reason no amount of care over the
expressions would have caught:

- **The file was a different revision.** The listing was edited three times
  after the project measured it, and the first instrument read the latest one.
  The 54 non-empty lines present now and absent then come from three commits:
  the release notes for the repair itself, in eleven languages, which describe
  the defect and quote words it destroyed; six lines on permissions; and the
  notes for the following release, on touch targets. Measured separately
  **[new]**, those lines contribute 8 words to the length rule, 8 to the suffix
  rule and none to the mixed-case rule, and every word by which the latest
  revision exceeds the earlier one on those two rules comes from them.
- **The mixed-case count was low for a reason that was not recovered.** At the
  latest revision the module destroys 13 words by that rule, as at the earlier
  one. The first instrument found 8. It was not kept, so the missing five
  cannot be traced to a step.

A population that contains text written about the result being measured is not
a population, and nothing about the file's name said so. The earlier draft also
stated that the gap between its token count and the project's was
"tokenisation, not a different file". It was a different file.

### What the length rule deletes in its author's own language

At the revision the project measured, the length rule destroyed eight words
**[replicated]**:

> completamente, almacenamiento, armazenamento, **certifications,
> communications, conditionally, creditworthiness, justifications**

Five of the eight are English. The rule was written by an English-speaking
author, against English-language emote codes, and it deletes ordinary English
derivational morphology. Nothing about it required a second language to break.
What it actually encodes is a prior on word length that is wrong for
polysyllabic derivation in every language it was applied to.

The 54 lines written after the repair are a separate population of real prose,
reported beside the first rather than merged into it. They add eight more
**[new]**: `accesibilidad`, `acessibilidade`, `reaproveitando`,
`accessibilite`, `accessibility`, `erisilebilirlik`, `kurmadiginizi`,
`yuksekliginde`. The Turkish three are there only because those lines are
written without diacritics: the rule's character class is ASCII, so
`erişilebilirlik` breaks at `ş` into pieces shorter than thirteen and survives.
How often chat is typed without diacritics is a frequency this study cannot
measure ([chapter 14](14-limits.md)).

> A rule whose criterion is a surface statistic, length, case shape, character
> class, is a claim about a distribution. It does not need to leave the
> author's own language to be false, and it will be most false in whichever
> language sits furthest from the distribution the author never wrote down.

### The language the corpus did not name

The notebooks attribute the `ez` damage to Turkish **[reported]**, and name
Spanish `vez` and Czech `bez` and `kez` alongside it.

The product ships a second body of real prose in each of its interface
languages: its own interface strings. Population declared: for each locale,
the values of the shared catalogue, the content-script catalogue and the
manifest messages at the current revision, with English taken from the
catalogue's keys, which are the English source strings. Run through the
pre-repair module **[new]**:

| locale | distinct words | destroyed, all rules | destroyed by `ez` |
|---|---|---|---|
| fr | 493 | 24 | **13** |
| tr | 560 | 14 | 2 |
| pt | 478 | 12 | 1 |
| es | 470 | 11 | 0 |

The other six locales, `ar`, `en`, `ja`, `ko`, `ru` and `zh`, lose nothing to
`ez`. The first instrument reported the same 13 and 2 over a population it did
not declare, and 0 for Portuguese. The Portuguese word is `talvez`, "perhaps",
the counterpart of the Spanish `vez` the notebooks name.

The thirteen French words are not a scatter:

> augmentez, cliquez, enregistrez, laissez, lisez, ouvrez, rechargez,
> regardez, relisez, restaurez, sélectionnez, tapez, utilisez

The first instrument listed twelve and counted thirteen. The missing one is
`sélectionnez`, which the ASCII word boundary cuts after `é`, so the rule
deletes `lectionnez` and leaves `sé`.

Every one is a second-person plural form. **[outside]** In French, `-ez` ends
the second-person plural of nearly every verb across the present, the
imperfect, the future, the conditional and the subjunctive, with `êtes`,
`faites` and `dites` the common exceptions. Turkish `-mez` marks one polarity
of one tense, for half the vowels.

What that licenses, and what it does not. In interface text the French loss is
six and a half times the Turkish by distinct words. Interface text is written
in imperatives addressed to *vous*, which is the register that maximises `-ez`,
and chat is written in neither, so the ratio says nothing about users. Two
ordinary French words outside that register, `avez` and `assez`, are destroyed
in the listing's newer prose **[new]**, which shows the damage does not need
the imperative; it does not show how often it happened. The defensible claim is
narrower than the one first drafted: **the rule intersected a person-and-number
ending of an entire verb system, in one of the ten shipped locales, and the
notebooks named a smaller category in another.**

That was available to anyone who ran the rule over text in the languages the
product claims to support.

### How it was found, which is the part that transfers

**[reported]** Not by a gate, and not by a user report. Fabricated screenshots
were staged on a mock page, twelve messages in and ten translations out. The
product's own reason on the two untranslated lines said the translation came
back identical to the original, which is exactly what the mock returns for a
sentence it does not hold.

The available move was to accept that: the mock is incomplete, the gap is in
the harness, move on. Instead the mock was instrumented to say *which* sentences
it could not find, and they were not the sentences that had been typed. Two
words had been deleted before anything left the page.

> When a stub reports that it cannot handle an input, read the input. The
> stub's own incompleteness is the most comfortable available explanation and
> it is the one that ends the investigation.

The regression suite around this is the second transferable part. Eight new
tests, seven of which fail against the old rules; the ten parser tests that
already existed passed either way **[reported]**.

Why they passed is not what this section first said. The draft blamed the shape
of the assertions, as though the suite checked what the parser kept and never
what it threw away. Read at the parent of the repair commit **[new]**, the
assertions are exact equalities on the output, `realText` equal to
`'vamos agora'`, which fail the moment a word goes missing. What the suite
lacked was an input the rules could damage: its sentences are `hello world`,
`vamos agora`, `hi there`, `check now`, with no word ending in `ez`, none of
thirteen letters and none in mixed case. **An exact assertion over inputs in one
register tests nothing outside that register**, and a stripping rule is a claim
about every register the product will meet.

> A filter must be scored on both of its outputs. Coverage alone is half a
> measurement, and it is the half that never goes down.

By that score the length rule was indefensible on its own numbers: it destroyed
eight ordinary words in the corpus the project measured, five of them English
**[replicated]**, and caught a single emote name that another rule already
caught **[reported]**; the emote sample was not re-run here. It bought nothing,
and thirteen tagged releases carried it **[new]**.

## 8.4 Two opposite strategies for one problem

**[reported]** The handoff records that incoming mentions are deleted from the
translated line, while the outgoing path masks them and restores them after
translation.

Both are defensible in isolation. Together they mean the system holds two
opposite theories of what a mention is: on one path an artefact to remove, on
the other a token to preserve through a transformation. Nothing forces the
reconciliation, because each path was built to satisfy its own tests.

This is the same shape as the generality failure in
[chapter 4](04-script-vs-language.md#45-the-finding-about-findings): a problem
solved correctly in one place and solved differently in another, with no
mechanism that notices the divergence. The audit rule derived from it in
[chapter 12](12-verification.md) applies here verbatim, and applying it would
have surfaced this pair, because the question it asks is *how many of the
surfaces that need this guard have it, and do they agree*.

## 8.5 What this chapter licenses

1. Noise classes produced by a mechanism should be modelled on the mechanism.
   The keyboard beat phonotactics by a wide margin and produced a rule with
   legible limits.
2. Criteria defined by absence, such as vowel absence, systematically delete
   licit structures of languages the author did not consider. Syllabic sonorants
   are a structural class, not a tail.
3. Expressive lengthening is meaning-bearing prosody and must not be filtered as
   noise; it is separable from smash by lexical diversity.
4. Every substring-stripping heuristic is a claim about all forty-two languages
   and must be evaluated as one.
5. A heuristic whose criterion is a surface statistic rather than a substring,
   word length above all, is a claim about a distribution, and it can be false
   in the author's own language without ever leaving it.
6. A filter is scored on both of its outputs, what it catches and what it
   destroys, over text in every language the product claims to support. A rule
   that destroys eight ordinary words to catch one emote name another rule
   already caught is refuted by its own numbers.
7. An exact assertion over inputs in one register tests nothing outside it. The
   parser suite that let a grammatical ending be deleted asserted equality, and
   would have failed on the first French imperative it was given; it was never
   given one.
8. A corpus used to measure a change must be taken at the revision the change
   was measured against. A file that later absorbs text about the result is a
   different population under the same name.
9. Inputs that broke a rule belong in the test file permanently.
10. A claim about a pipeline's composed behaviour must be measured at the
    composition; both components can be correct while the belief about their
    combination is false.

---

*Sources: project work queue, "Done, kept for the record"; `HANDOFF.md`
sections 6 and 8; journal of 2026-08-30, pass twenty-five; commit `7c64018`
and its parent. Measurements in 8.3 and 8.3b are **[replicated]** or **[new]**
where tagged, by
[`probe-emote-stripper.mjs`](../appendix/D-scripts/probe-emote-stripper.mjs);
all others **[reported]**. The linguistic analysis of
syllabic sonorants, agglutinative over-generation and expressive lengthening is
this study's **[new]**.*
