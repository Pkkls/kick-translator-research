# 04. A writing system is not a language

> The defect described in this chapter was diagnosed three times, on three
> different scripts, over three months, by the same project. The third
> diagnosis found that the second one's own source comment already contained
> the general statement of the problem. That is the finding: not the bug, but
> how a correct general diagnosis fails to generalise when it is written in one
> place and applied in one place.

---

## 4.1 The shortcut, and why it usually works

Every language identifier that runs on user-generated text needs a fast path.
Statistical identification on trigram profiles, which is what the system's
identifier does, needs a certain volume of text before its posterior is worth
anything, and a chat line rarely supplies it. So the pipeline does the cheap
thing first: it looks at the characters, decides which writing system dominates,
and returns the language associated with that writing system.

For a large share of traffic the shortcut is right, and it is right for a
reason that has nothing to do with linguistics. It is right because usage is
distributed unevenly. Most Arabic-script text on a Western streaming platform
is Arabic. Most Cyrillic text is Russian. The shortcut is not a linguistic
claim, it is a prior, and it is a prior about who is watching rather than about
how writing works.

**The silent-drop rate, measured.** This study asserted throughout that the
worst failure here is a line dropped without trace, and only late in the work
found the corpus's own number for it **[reported]**. Over 663 message-and-target
pairs needing a translation, **11 are skipped as "already in your language" for
a message that is not: 1.7 percent.** Eleven of the 51 test messages are lost at
at least one target, and **all eleven are at non-English targets**: French 4,
Portuguese 3, German 2, Spanish 1, Indonesian 1.

Two details make that number more useful than its size suggests. The skip is not
owned by the English rule that gets the attention: `ignoreEnglish` loses one
message in thirty-four, while the same-language check owns the rest and asks
only that the wrong answer *equal the reader's target*, which is a different and
larger door. And the loss is concentrated where the reader is least likely to be
served by the fallback, since an English-target reader is the best-covered case
in the system.

The failure mode follows directly. When the prior is wrong, the shortcut is not
merely unhelpful, it is **confidently** wrong, because it returns an answer that
the pipeline treats as looked-up rather than guessed. And in this system the
distinction between a looked-up language and a guessed one is load-bearing: a
confident source language is sent to the translation engine as the `sl`
parameter, and a confident match with the reader's own language causes the line
to be dropped in silence as "already in your language". A wrong confident answer
therefore does not produce a wrong flag. It produces a message the reader never
sees, or a message translated from a language it is not in.

## 4.2 The typological fact the shortcut ignores

The relation between scripts and languages is many-to-many, and has been for as
long as both have existed. The Arabic script writes Arabic, Persian, Urdu,
Pashto, Kurdish, Uyghur and more. The Cyrillic script writes Russian,
Ukrainian, Bulgarian, Serbian, Macedonian, Belarusian, Mongolian, Kazakh, and a
long tail of languages of the former Soviet space. The Latin script writes most
of Europe and much of everything else.

A script identifies a language only when the mapping happens to be near
one-to-one in the population being observed. Han script, for instance, gives
usable evidence because the set of languages written in it is small. Hangul
gives strong evidence. Devanagari gives weaker evidence than it appears to,
because it writes Hindi, Marathi, Nepali, Sanskrit and others.

The project's corpus contains the failure for two scripts, discovered
independently, months apart.

### The Arabic script: Persian answered as Arabic

**[reported]** Twelve Persian lines out of twelve were declared Arabic, and
declared it as a confident source language. The engine was then told to
translate from Arabic. Persian and Arabic share a script and a substantial
borrowed lexicon; a translation engine handed the wrong one of the two produces
output that is fluent and wrong, which is the worst available outcome because
nothing downstream can detect it.

The separation is available in the orthography. Persian writes four letters
Arabic does not use: پ, چ, ژ, گ. Their presence is decisive evidence for
Persian. Their absence is weak evidence for Arabic, because a short Persian
line can easily contain none of them.

### The Cyrillic script: three languages answered as Russian

**[reported]** The script pre-check returned `ru` for any majority-Cyrillic
line, as a confident answer. Measured: twenty Mongolian lines out of twenty
declared `ru` with `sl=ru`; eight Ukrainian out of eight; eight Bulgarian out
of eight.

The situation is worse here than on the Arabic side, and for a structural
reason the notebooks identify precisely: the statistical identifier cannot
recover the error, because its minified data set does not carry Mongolian at
all. Its Cyrillic inventory is Russian, Ukrainian, Bosnian, Serbian, Uzbek,
Azerbaijani, Komi, Belarusian, Bulgarian and Kazakh. A language absent from the
model cannot be returned by the model, no matter how much text it is given.
The shortcut is therefore the only mechanism that will ever see a Mongolian
line, and it was answering Russian.

## 4.3 Positive and privative distinctions

The three Cyrillic cases resolve differently, and the difference is
linguistically interesting rather than incidental.

**Mongolian separates positively.** Cyrillic Mongolian uses two vowel letters
Russian does not have, ө and ү, plus a small set of particles that appear in
almost every sentence. Coverage **[reported]**: the letters alone identify 8
lines of 20; the letters plus the particles identify 17 of 20; and the combined
rule produces zero false positives against twelve Russian lines, eight
Ukrainian and eight Bulgarian.

Two observations follow. First, orthographic evidence and grammatical evidence
are complementary rather than redundant: the letters catch lines that happen to
contain them, the particles catch lines that do not, and the union more than
doubles coverage. Second, the false-positive count is the number that licenses
the rule. A marker set that gains coverage by accepting neighbours has bought
nothing, because in this system a false positive is a message translated from
the wrong language.

**Ukrainian separates positively but partially.** It has its own letters, і, ї,
є, ґ, and takes its code on 6 lines of 8 **[reported]**. The two that escape
presumably contain none of the four, which is entirely possible in a short line.

**Bulgarian does not separate positively at all**, and this is the case worth
dwelling on. Bulgarian shares the Russian alphabet without a single exclusive
letter. What distinguishes it is an **absence**: Russian writes ы, э and ё;
Bulgarian writes none of the three. The project adds two positive signals on
top, the letter ъ used as an ordinary vowel rather than as a hard sign, and the
present-tense copula съм / си / сме / сте / са, which Russian does not have in
that form at all.

This is a privative opposition in the sense structural phonology gave the term:
the contrast is not between two marks but between the presence and the absence
of a mark. Privative evidence behaves differently from positive evidence in
exactly the way the theory predicts, and the practical consequences are worth
naming:

- **It requires length.** The absence of ы, э and ё is informative only if the
  line is long enough that their absence is unlikely by chance. A four-word
  Russian sentence containing none of the three is unremarkable. Positive
  evidence needs one occurrence; privative evidence needs a denominator.
- **It is asymmetric.** Presence of ы proves not-Bulgarian. Absence of ы does
  not prove Bulgarian; it fails to exclude it, together with every other
  Cyrillic language lacking the letter.
- **It degrades toward the prior.** With no positive signal and insufficient
  length, the honest answer is the prior, which is the very thing that caused
  the defect.

The project's resolution reflects this. **[reported]** Bulgarian in Cyrillic
remains answered as Russian, and the notebooks record it as a stated limit
rather than an oversight. That is the correct disposition of a case where the
available evidence is privative and the lines are short.

## 4.4 The emoji that erased a writing system

The script pre-check decided by strict majority over all non-ASCII characters.
An emoji is non-ASCII and feeds no writing system, so it inflated the
denominator while being unable to contribute to any numerator.

**[reported]** Measured on the languages for which this check is the only
mechanism: "да" plus two emoji falls to 2 of 4, no strict majority, so the
check returns nothing and the statistical identifier takes over. The Arabic
line "رائع" plus four emoji falls the same way, and the fallback answers Persian
on Arabic text. After the fix, which counts only script-bearing characters in
the denominator, the four bench languages hold through six emoji.

Three things make this more than a rounding bug.

First, **the input distribution guarantees it fires.** No live chat is
emoji-free. A guard whose failure requires an unusual input is a latent bug; a
guard whose failure requires a typical input is a live one. The measurement
that matters for such a defect is not whether it can happen but how often the
triggering condition occurs, and here it occurs constantly.

Second, **the failure is silent and inverted.** The check does not return a
wrong answer; it returns nothing, which hands control to a mechanism the
architecture had specifically placed second because it is less reliable on this
input. A guard that degrades to a worse mechanism under a common condition is
worse than no guard, because the architecture has stopped compensating for the
weaker path.

Third, and this is the general point, **the denominator was never specified.**
"Majority of non-ASCII characters" was a proxy for "majority of script-bearing
characters" that happened to coincide when the input was pure text. Emoji broke
the coincidence. A proportion is only as good as the population it is taken
over, and populations that were never written down drift silently as the input
distribution changes.

## 4.5 The finding about findings

The notebooks record something more valuable than any of the individual fixes.

**[reported]** The correction that gave bare Korean jamo their own counter, in
an earlier pass, carried in its own source comment the sentence "those letters
counted toward the total while feeding no script". That is the general
statement of the emoji defect, written down correctly, before the emoji defect
was found. It was applied to one class of character and left there.

The same shape repeats across the chapter. The Persian-under-Arabic diagnosis
was, in full generality, "a writing system is not a language". Applied to the
Arabic script, and left there. Cyrillic was rediscovered months later, from a
user report, and the notebooks say so explicitly: *"C'est exactement le defaut
arabe/persan corrige plus haut dans la journee, sur une autre ecriture."*

The operative lesson is not that the developers were careless. The notebooks
are unusually rigorous, and each fix was measured. The lesson is that **a
diagnosis and its remediation live at different levels of generality, and
nothing in an ordinary workflow forces them to be reconciled.** The diagnosis
was general. The patch was local. The comment recording the general form sat in
the code, correct and inert, until the same defect surfaced on another script.

This suggests a concrete discipline, which this study adopts as an audit rule
in [12. Verification](12-verification.md) and states here in its general form:

> When a fix is applied, ask what population the diagnosis covers, then measure
> what fraction of that population the fix reaches. A guard is a fraction, not
> a presence. One occurrence in one file reads as "handled" to a search and as
> "handled in one place of several" to a count, and the difference between
> those two readings is where this class of defect lives.

**This study reproduced the pattern while documenting it, which settles what
it is a property of [new].** The comfortable reading of the six instances above
is that a project moving quickly missed connections a more careful reader would
catch. This account was that reader, and produced three instances of a single
diagnosis of its own in one sitting: a gate array counted by line shape, a
manifest counted by text pattern, and a coherence check comparing numbers
without modelling their referents, all three being *count the structure, not
the text near it*, a rule this account had written out and published after the
first one.

Held in working memory, recently written down, and actively hunting for
violations of itself in someone else's work: the rule still failed to
propagate. **Writing a general diagnosis down is a weak mechanism for applying
it.** What propagates a diagnosis is a check that runs, which is the argument
for the audit specification in [appendix A](../appendix/A-audit-prompt.md)
being a set of executable bars rather than a set of principles. The full
account is in [appendix E](../appendix/E-method-log.md#414-the-same-diagnosis-applied-locally-three-times-by-this-account).

An independent application of that rule, conducted for this study on a
different guard entirely, produced the same shape on the first pass and then
produced something more useful on the second: the coarse probe reported one
guarded surface of three, a better probe reported two of three, and tracing the
third to its callers showed it carries no untrusted text at all **[new]**. The
guard-as-a-fraction rule found a real gap, and the fraction it first reported
was wrong in the direction that flatters the finding. See
[11.3](11-privacy-surface.md#replication-bidirectional-text-new) for the corrected
measurement and what survived it, and [appendix D](../appendix/D-scripts/) for
both probes.

## 4.6 What this chapter licenses

For the system studied:

1. The script pre-check should return a language only where the script-to-
   language mapping is near one-to-one in the observed population, and should
   return the script rather than a language everywhere else.
2. Where a script serves several languages, separation requires an explicit
   marker set, and the marker set is licensed by its false-positive count
   against its neighbours, not by its coverage.
3. Privative evidence, such as Bulgarian's, needs a length threshold before it
   may be used at all, and stating the limit is a better outcome than a rule
   that fires on short lines.
4. Any proportion computed over characters must specify its denominator in the
   code, because the input distribution will eventually contain characters the
   original author did not imagine.

For language identification generally, the corpus supports a narrower claim
that is nonetheless worth stating: **on short user-generated text, the dominant
error is not low accuracy but misplaced confidence.** Every defect in this
chapter produced an answer the pipeline was entitled to trust. The repair in
each case was not a better identifier; it was a better account of when the
identifier is allowed to be believed.

---

*Sources for this chapter: the project work queue and the daily journals of
2026-08-30 and 2026-08-31. Measurements tagged **[reported]** were taken by the
development account on its own bench and are not witnessed by this study; see
[Provenance](../README.md#provenance-stated-once-and-honestly).*
