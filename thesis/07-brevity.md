# 07. The brevity floor

> A character-count threshold is a script-biased measure. Two characters of
> Japanese can be a complete utterance; two characters of French are nothing.
> The project set its floor at two and paid a known price in CJK, which is the
> correct way to lose an argument with a writing system.

---

## 7.1 The constraint

Chat lines are short. Statistical language identification degrades toward its
prior as input shrinks, and below some length it is returning noise with a
confident face. Every system of this kind therefore needs a floor: a length
below which it declines to answer.

Choosing the floor is a trade between two losses that are not comparable:

- **Too low**, and the identifier answers on evidence it does not have. Those
  answers feed the engine and the same-language skip, so they are not merely
  uninformative, they are actively harmful.
- **Too high**, and short messages that *do* carry identifiable language are
  refused, and refused silently.

## 7.2 What happens at one character

**[reported]** At a one-character floor, the homoglyph problem opens:
"Amazing play" written with a Cyrillic А becomes Russian. "so good" with a
Cyrillic о likewise.

The mechanism is script-mixing inside a token. Cyrillic А (U+0410) and Latin A
(U+0041) are visually identical and lexically unrelated. A single such
character in an otherwise Latin line is enough to swing a script-majority test
that operates on a small denominator.

The notebooks note that the homoglyph is *"du quotidien dans un chat"*, an
everyday occurrence, and this is right for at least three independent reasons:

- **Keyboard state.** A bilingual reader typing on a switched layout produces
  them by accident, most often on the first character of a line.
- **Copy-paste.** Text moved from elsewhere carries whatever it carried.
- **Deliberate evasion.** Homoglyph substitution is a standard technique for
  getting past text filters, and chat has filters.

The third is worth flagging because it means the input is not merely noisy but
occasionally **adversarial**, which is the subject of a separate axis in the
audit specification and is treated in
[chapter 11](11-privacy-surface.md#113-hostile-input).

## 7.3 What two characters costs

**[reported]** At two characters, the homoglyph door is closed. The price is
the single-character CJK message: 草, は, 네 stay silent.

This is where the character count shows itself to be the wrong unit. Those
three examples are not fragments:

- 草 is a complete, current Japanese internet utterance meaning laughter. The
  chain of conventionalisation usually given for it (*warai* → *w* → a row of
  *w* resembling grass → the character for grass) is **[outside]** and not
  verified here; what matters for the argument is only that the single
  character is a complete utterance, which the corpus's own bench treats it as.
- は is a grammatical particle, and a plausible complete turn in context.
- 네 is a complete affirmative reply in Korean.

**Information per character is not constant across writing systems.** A Han
character encodes a morpheme; a Latin letter encodes a phoneme; a Hangul
syllable block encodes a syllable. A floor measured in characters therefore
imposes a threshold that is several times stricter for logographic scripts than
for alphabetic ones, measured in linguistic content.

The project's disposition is the right one given the constraint: it chose the
floor, measured the loss, and **wrote a witness for each side into the test
file** **[reported]**. Both the homoglyph case and the CJK case are asserted,
so neither can be silently traded away by a later change.

A script-relative floor is the obvious improvement and is not free: it requires
knowing the script before applying the floor, which inverts an ordering the
pipeline currently relies on, and the interaction with the emoji-denominator
fix of [chapter 4](04-script-vs-language.md#44-the-emoji-that-erased-a-writing-system)
would need its own measurement. It is recorded as an open question in
[15](15-future.md) rather than as an oversight.

## 7.4 Below the floor: the short-expression table

Refusing to identify a short line does not mean refusing to translate it. The
project ships a table of common short expressions with their answers, which
sidesteps both identification and the engine.

The motivation is a failure worth examining closely. **[reported]** "bonjour"
aimed at Japanese came back as the French syllables written in katakana, rather
than as the Japanese word.

The engine transliterated instead of translating. **[outside]** The explanation
offered here is that with almost no context, a decoder's most probable
continuation for an unfamiliar or ambiguous token can be a character-level
transcription rather than a lexical substitution, so the model is not
malfunctioning but producing the likeliest output under a conditioning context
that contains nearly nothing.

That account is plausible and this study did not verify it. What the corpus
establishes is only the observation: a short greeting came back transliterated.
The mechanism is borrowed reasoning about how such systems behave, and the
remedy the project chose does not depend on the mechanism being right.

The failure is invisible to every mechanical check the system has. A
transliterated output is non-empty, is in the target script, is the right
rough length, and differs from the input. Only a reader of the target language
can see that it is not a translation.

**[reported]** Ninety common expressions ship with an answer, which makes them
both correct and free: no request, no latency, no quota.

**One repair that looked free and pointed the wrong way** deserves recording,
because the trap is general **[reported]**. Seven of eight cases in that table
return nothing useful, and they appeared separable by a property that costs
nothing to read: the engine already returns the source language it detected, so
a katakana answer to an *English* entry is usually correct, since English is
written in katakana in ordinary Japanese, while a katakana answer to a French
or Spanish entry is a spelling-out.

Measured on the twelve words concerned, the engine answers `en` for *bonjour*,
*merci*, *gracias*, *ciao* and *lindo* — **precisely because it failed to
identify them**. The rule would have killed five repairs of six and kept none of
the six witnesses: the exact inverse of what it promised.

The general form is worth naming, because the signal really is free and really
is available:

> A failing component's own output is not evidence about the cases where it
> fails. Its answer on those inputs is a symptom of the failure, so any rule
> keyed on that answer is anti-correlated with the thing it is trying to catch.

This also produces an architectural observation. The table is a **cache
populated by knowledge rather than by traffic**. Conventional caches exploit
temporal locality in what users happen to send; this one exploits the fact that
the head of the distribution in any greeting-heavy medium is short, stable,
and knowable in advance. For a chat product the head is very heavy, so a small
hand-built table plausibly outperforms a much larger traffic-driven cache on
the metric that matters, which is requests avoided per byte shipped.

## 7.5 The reach of the short-word table

**[reported]** The short-word table was given a thirty-character reach, and the
notebooks record that it was "built from greetings, and a chat message is not a
greeting", which is the kind of self-correction that makes this corpus usable.

The underlying tension is real: a table built on one register (formulaic
openings) is being applied to another (running conversation). The
generalisation risk is the same one as lexical borrowing in
[chapters 5](05-transliteration.md) and [6](06-laughter.md): an item's
diagnosticity is a property of the register it was collected in, and does not
automatically survive transport to another.

## 7.6 What this chapter licenses

1. A brevity floor is necessary, and it is a decision about which of two
   incomparable losses to accept, not a parameter to tune.
2. Character count is a script-biased unit. A floor stated in characters is
   several times stricter for logographic scripts, measured in content.
3. Both sides of the trade need a witness in the test suite, or the floor will
   drift with the next change.
4. Short input elicited transliteration rather than translation from the engine
   in use, once, in the corpus. The general claim that neural engines behave
   this way on short input is **[outside]** and unverified here. What holds
   without it: no mechanical check distinguishes a transliterated output from a
   translated one, so the failure is invisible to everything but a reader of
   the target language.
5. A knowledge-built table of head expressions is a cache with better economics
   than a traffic-built one in a medium whose head is heavy.

---

*Sources: daily journal of 2026-08-31, "Le plancher de deux, mesure et garde";
work queue entries on the short-word table; changelog for the shipped
expressions. The analysis of information per character, of neural
transliteration behaviour, and of the 草 conventionalisation chain is this
study's **[new]**.*
