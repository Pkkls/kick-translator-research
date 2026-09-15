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

**[reported]** The token `ez` appeared in a suffix list, and deleted every
Turkish negative aorist.

This is the sharpest instance of the general hazard in the corpus. Turkish is
agglutinative: grammatical information is carried by productive suffixes
appended to stems. The negative aorist is formed with a suffix whose surface
form includes `-mez` / `-maz` under vowel harmony. An ASCII substring rule
written against an English gaming interjection therefore intersects a
**productive grammatical morpheme** of an unrelated language.

The damage profile is the worst available: it is systematic rather than
occasional, it applies to an entire inflectional category, it is silent, and it
inverts meaning, since what is deleted is precisely the negation.

The generalisation, which this study proposes as the strongest practical claim
of the chapter:

> Any substring rule written in one language will eventually intersect a
> morpheme in another. In a product that processes forty-two languages, the
> question is never whether a stripping heuristic over-generates but which
> language it over-generates into, and that question must be asked before the
> rule ships, not after a user reports it.

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
5. Inputs that broke a rule belong in the test file permanently.
6. A claim about a pipeline's composed behaviour must be measured at the
   composition; both components can be correct while the belief about their
   combination is false.

---

*Sources: project work queue, "Done, kept for the record"; `HANDOFF.md`
sections 6 and 8. All measurements **[reported]**. The linguistic analysis of
syllabic sonorants, agglutinative over-generation and expressive lengthening is
this study's **[new]**.*
