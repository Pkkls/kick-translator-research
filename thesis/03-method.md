# 03. Method

> A marker list scored 20 of 20 on the bench that produced it, and 4 of 12 on
> lines written afterwards. The project caught this itself and re-measured. It
> is the single most important number in the corpus, because it fixes the
> interpretation of every other number in it.

---

## 3.1 The corpus as a laboratory notebook

This study is unusual in its source material. Most software leaves behind code
and a commit history, from which the reasoning has to be reconstructed by
inference. This project left behind the reasoning itself: a work queue where
every closed item states what was measured and what the number was, two long
daily journals that record failed attempts alongside successful ones, and a
changelog whose entries carry their measurement.

The methodological commitments that produced those notebooks are stated in the
project's own standing instructions, and they are worth reproducing as the
object of study rather than merely as background, because several of them are
non-obvious and were, by the notebooks' own account, paid for in wasted work.

## 3.2 The five rules

### Measure before explaining

A defect is described by a number. The project's formulation: *"the menu is
cramped" is not a finding; "six rows of forty, 1200px of list in a 281px panel"
is.*

The force of this rule is not rhetorical precision. It is that an adjective
cannot be falsified, so a fix described against an adjective can never be shown
to have worked. Every measurement in this corpus exists because the rule made
the alternative unavailable.

### Every correction leaves a witness

Break it, see red, restore it, see green. The project's formulation: *a fix you
never saw fail is a fix you cannot show works.*

This is mutation testing, applied by hand, at the granularity of the individual
fix rather than the test suite. It answers a question that coverage cannot: not
*is this line executed by a test* but *does any assertion actually depend on
this line being correct*.

The corpus contains the payoff. When a probe was added for the fallback chain,
truncating the chain to a single engine left all unit tests green and turned
that one probe red **[reported]**. The witness is the only thing that
distinguishes a probe that guards the behaviour from a probe that merely runs
alongside it.

### Verify the failure is in the product before correcting it

The notebooks call this the most common way to waste a pass, and list real
instances where a probe accused working code:

- a panel reported off-screen that overshot by 0.2 pixels of subpixel rounding;
- a keyboard assertion demanding that focus land on a list row, when landing on
  the favourites strip above it was correct;
- a search for a string inside a DEFLATE-compressed archive, which finds
  nothing in any archive;
- a transition duration of `0s` flagged on an element toggled with `hidden`,
  where a transition could never play;
- `git remote -v | head -2` reported as "there is no origin", when origin was
  the third line.

The common structure is that in every case **the probe was wrong in a way that
looked exactly like the product being wrong.** A pipeline of probes is itself a
system under test, and the corpus suggests its defect rate is not obviously
lower than the product's.

**The project counted them.** A journal section titled "the probes that were
wrong, four more" opens with "twelfth and following", so at least fifteen false
probe findings are recorded there **[reported]**. Its first line is the
conclusion this study reached independently and several months later:

> All of them caught by a witness, none by a re-reading.

The four it then describes are worth the space, because each is a different
mechanism:

- **A form body.** Three assertions of a provider test went red against correct
  code: `URLSearchParams` encodes a space as `+`, so searching the raw string
  for a phrase finds nothing. Re-read through the parser instead.
- **A probe reading its own keys.** A weight probe took every string in a block,
  including the keys, which are the patterns being executed and therefore
  legitimately in the bundle. Five leaks reported, five times the product was
  right.
- **A witness that broke nothing.** A constant key, folded by the bundler, gate
  green, nothing proven.
- **A probe that had read one bench of two.** The two bench files have different
  shapes, tuples against lists, so it saw 63 lines where there are 187. **It
  refused to continue rather than report zero false positives over an amputated
  control.**

That last one is the rule *a probe that measured nothing must fail* doing real
work, and the notebooks say it is the first time it genuinely paid. It is also
the exact failure this study committed twice without the same protection: two
of its own probes reported numbers over populations they had only partly read
(see [appendix E](../appendix/E-method-log.md)). **The project built the guard;
this study wrote the rule down and did not build it.**

### A probe that saw nothing must fail, not pass

The project's example is exact: a pass over an English chat translated to
English reports zero translations and zero errors, which is indistinguishable
from success.

This is the deepest of the five rules, because the failure it prevents is
invisible by construction. A green suite that measured nothing produces the
same output as a green suite that measured everything. The remedy is that every
probe carries an assertion that fails when its own denominator is zero.

### On the second failure of the same method, change layer

Not a third attempt with different parameters. The project's formulation: *if
scrolling twice did not move an element out of frame, stop scrolling and change
what you are scrolling.*

This is a stopping rule for local search, and its value is in bounding the cost
of a wrong frame. Repeating a method with adjusted parameters is cheap per
attempt and unbounded in total; changing layer is expensive per attempt and
terminates.

## 3.3 The bench that measured itself

The most important methodological result in the corpus is a self-caught
failure, and the project's own phrasing of it is exact enough to quote in
translation:

> A first list of markers, extended until it covered the bench that had served
> to write it, gave 20 out of 20. The same rule on twelve Bulgarian lines
> written AFTER it: 4 out of 12. The first number measured only the fitting.

**[reported]** 20/20 on the development bench, 4/12 held out.

### What the number means

This is textbook overfitting, arrived at without any statistical machinery and
in a setting where nobody would normally look for it. There is no model here,
no training procedure, no parameters in the usual sense. There is a human
writing a list of marker letters and particles, checking it against example
sentences, and extending it until the examples pass.

That process is a fitting procedure. The marker list is a model. The bench is a
training set. And the standard consequence follows exactly: **performance
measured on the data that shaped the rule is not an estimate of performance, it
is a measure of how thoroughly the fitting was carried out.**

The 5x gap between fitted and held-out performance is large, and it is large
for a reason specific to the domain. Marker-based identification has very few
effective degrees of freedom, so each added marker is a substantial fraction of
the model. Adding markers until a twenty-line bench passes will consume most of
that capacity on the specific lines present.

### Why it matters for every other number in this study

The corpus contains many accuracy figures, some of them very high. This result
requires them to be read in two classes:

- **Figures measured on lines written after the rule** are estimates of
  performance. The Mongolian result (17 of 20 with letters plus particles, zero
  false positives against 28 neighbouring-language lines) is presented this way,
  as is the re-measured Bulgarian figure.
- **Figures measured on the bench that produced the rule** are measures of
  fitting, and cannot be used to predict behaviour on new chat.

The project adopted the discipline explicitly after this finding. This study
adopts it as a reading rule, and where the corpus does not make the provenance
of a bench clear, [13. Results](13-results.md) says so rather than assuming the
favourable case.

### A second instance, sharper, and caught before shipping

The corpus contains the same result once more, on Latin-script Bulgarian, and
the numbers are starker **[reported]**. Markers built from grammatical
paradigms took **10 of the 20 lines written alongside them and zero of the 4
written the day before, by the previous pass, before the list existed.**

Zero of four. The first instance, 20 of 20 against 4 of 12, could be read as a
rule that generalised poorly. This one did not generalise at all: every line it
caught was a line that had shaped it.

The diagnosis in the notebooks is linguistic rather than statistical, and it is
the better explanation: *a paradigm gives the words of a textbook; a chat writes
"mnogo dobre igra" and "az sam tuk", which carry none of them.* Interrogatives,
future particles and demonstratives are what a grammar book foregrounds and
what running conversation uses least.

**The repair generalises where the markers did not.** The words a chat actually
writes are the ambiguous ones, each a real word of some other language:
`dobre` Polish, `az` Hungarian, `sam` an English name, `mnogo` and `smeshno`
romanised Russian. One decides nothing; two in the same line decide. Measured:
**zero false positives across 187 lines in 19 languages the lists had never
seen**, and 3 of 4 held-out lines against 0 for the strong markers alone.

Two things follow. A conjunction of weak ambiguous signals beat a disjunction of
strong unambiguous ones, on exactly the register that matters. And the project
caught this one **before shipping** rather than after, which is what adopting
the held-out discipline buys.

### The generalisation

> Any rule extended until its examples pass has been fitted to those examples,
> including rules written by hand with no statistics anywhere in sight. The
> only figure that estimates behaviour is the one taken on inputs that did not
> exist when the rule was written.

The practical form is cheap: write the bench, write the rule, then write more
bench, and report the second number.

## 3.4 The false prior, and measuring at the composition

A second methodological result appears in the keyboard-smash work
([chapter 8](08-noise.md#the-prior-claim-and-its-correction)). A previous note
claimed eleven of fifteen smashes were already being filtered. Direct
measurement found **zero of eleven** **[reported]**.

The belief was not careless. It followed from two true statements about two
components, composed incorrectly. Both components behaved as documented; the
inference about their combination did not hold.

This yields a rule that this study found necessary in its own work:

> A claim about a pipeline is a claim about a composition, and must be measured
> at the composition. Correct components do not compose into a correct belief.

## 3.5 Provenance discipline in this study

Applying the corpus's own standards to a secondary study of it requires stating
what this study did and did not witness. Three tags are used throughout, and
the [README](../README.md#how-to-read-the-numbers) defines them:

- **[reported]** taken from the notebooks; not witnessed here.
- **[replicated]** re-run for this study; command given.
- **[new]** measured or analysed here for the first time; method given.

The distinction is not ceremonial. A reported number was taken on hardware this
study has no access to, at a commit that has since moved, by an account whose
working conditions are not fully recoverable. Treating it as equivalent to a
figure produced here would be exactly the kind of composition error section 3.4
describes.

## 3.6 Method applied to method: what execution falsified

This study built an audit specification from the corpus
([appendix A](../appendix/A-audit-prompt.md)) and then ran it. The construction
took sixteen refinement passes and produced a document that passed every
mechanical check written for it. The first pass that executed an axis against
real code falsified three of its own bars within a single session
**[new]**:

| Bar | Defect | Correction |
|---|---|---|
| Detectability | Demanded something unachievable: no extension that renders visible content can be undetectable by the page | Measures the *cost* of detection; fails on dedicated signals that reduce it to one call |
| Reproducibility | Demanded the more expensive of two available checks, two local rebuilds compared byte for byte | Compares against the digest the forge already publishes, which proves more |
| Counter honesty | Demanded something no gate could enforce against free-form string keys | Moved to a naming convention a gate can check |

Three bars, written carefully, by a process that checked them mechanically, all
three wrong in ways that only execution exposed. The finding is not about those
three bars. It is that **a specification is a hypothesis about a system, and
reviewing a hypothesis is not testing it.** Sixteen passes of review found
formatting defects, missing axes and vague language, and found none of these
three.

[Appendix B](../appendix/B-prompt-construction.md) records all the passes,
including the ones that changed nothing.

---

*Sources: the project's standing instructions; work queue; daily journal of
2026-08-31. Section 3.6 is this study's own work.*
