# 15. Open questions

Ordered by value per unit of effort, which in this corpus means: how many
currently-blocked decisions does the answer unblock.

---

## 15.1 One real chat capture

**Unblocks four decisions**, listed in
[chapter 14](14-limits.md#141-the-binding-limitation-no-observed-input-distribution),
and converts every mechanism finding in this study into a prioritised one.

A few thousand lines from two or three channels of different languages. The
collector exists. Nothing else in this list comes close in value, and the
reason it has not happened is that it needs a person on a real page rather than
a machine.

The measurements it would produce, in the order they matter:

1. **Share of lines below each brevity floor**, by script. This is what turns
   [chapter 7](07-brevity.md)'s trade from a reasoned choice into a priced one,
   and it is the number that would say whether a script-relative floor is worth
   the ordering change it requires.
2. **Code-switching rate**, within a line and across adjacent lines. Currently
   an unmeasured assumption behind several conflict rules.
3. **Laughter frequency by form**, which would validate or refute the
   [chapter 6](06-laughter.md) lexicon's weighting and reveal forms it lacks.
4. **Emote share of tokens**, which prices the entire stripping problem in
   [chapter 8](08-noise.md).
5. **Transliteration frequency**, which is the number the shlyokavitsa decision
   is explicitly waiting on.

## 15.2 On-device engine availability across real installs

**[reported]** The API is absent on one browser build and present on another of
the same version on the same machine, cause unknown.

This is the only quantity that converts the measured 70x mechanism advantage
into a statement about users
([ch. 10](10-latency-weight.md#104-the-gate-on-availability)). Without it the
user-visible latency distribution is bimodal with unknown weights, and no
single latency figure describes the product.

Two sub-questions, both answerable without real users:

- **Why the same version differs.** Flag, profile, hardware gating or policy.
  A matrix over fresh profiles with flags varied would settle it cheaply.
- **Model residency over time.** The on-device path serves only downloaded
  pairs, and downloading needs a user gesture. So the fast path's availability
  is a function of what the reader has been prompted to download, which is a
  product decision rather than a platform one.

## 15.3 A valid engine comparison

The reported 22 ms against 1618 ms compares different language-pair populations
([ch. 10](10-latency-weight.md#103-why-the-comparison-is-not-valid-as-stated-new)).

The fix is cheap: restrict the cloud series to the same pair as the local
series, or force the local series to cover more pairs by downloading them
first. Either yields a comparison of engines rather than of engines confounded
with pairs. Report n beside every percentile, and do not report a p95 on eight
samples.

## 15.4 Held-out benches, applied uniformly

The project adopted the held-out discipline partway through, after the 20-of-20
against 4-of-12 finding
([ch. 3](03-method.md#33-the-bench-that-measured-itself)). Rules written before
that point have accuracy figures that may be fitting measurements.

The work is mechanical and the payoff is that every number in
[chapter 13](13-results.md) becomes interpretable without a provenance caveat:
for each marker rule, write a fresh bench after the rule and report the second
number.

## 15.5 Keyboard-smash rule beyond QWERTY

The row-adjacency criterion assumes a layout
([ch. 8](08-noise.md#the-criterion-that-shipped)). An international audience
types on AZERTY, QWERTZ, Turkish F, Dvorak, and mobile keyboards with different
adjacency and autocorrect.

Two questions: does the rule's false-positive rate change on text typed on
other layouts, and does a smash produced on another layout still score above
the threshold. The second is the one that matters, because a missed smash costs
a provider call and a nonsense line.

## 15.6 A script-relative brevity floor

Stated as an open question rather than an oversight in
[chapter 7](07-brevity.md#73-what-two-characters-costs). It requires knowing
the script before applying the floor, inverting an ordering the pipeline relies
on, and it interacts with the emoji-denominator fix. Worth measuring only after
15.1 says how much CJK traffic is below the current floor.

## 15.7 Direction handling across all surfaces

**[new]** Both surfaces that render untrusted text are isolated from their
siblings, and **no neutralisation of direction-control characters inside the
text exists anywhere**
([ch. 11](11-privacy-surface.md#replication-bidirectional-text-new)).

The open part is not the fix, which is small. It is the measurement this study
could not take: what a reader actually sees when a chat line carrying an
unterminated override is rendered into the outgoing-message preview, which is
the surface where they decide what to send. That requires a browser and the
built artefact; this study read sources.

A second, smaller item falls out of the same correction: the error surface
renders localised interface strings without a direction attribute, and the
interface is localised into right-to-left languages. That is interface i18n,
and it is cheap to close.

## 15.8 Orphan probes with no written reason

**[replicated]** 35 harness files no runner launches, an unknown subset of them
deliberately excluded.

The useful number requires reading each exclusion
([ch. 12](12-verification.md#127-orphans-and-the-count-that-indicts-too-much)).
Low value per unit of effort, but it is a prerequisite for any claim about the
project's real coverage.

## 15.9 Questions this study cannot ask

Stated so that the boundary is visible:

- **What defects neither the project nor this study noticed.** Unknowable from
  a self-reported corpus ([ch. 14](14-limits.md#the-corpus-is-self-reported)).
- **Whether the linguistic findings transfer to other platforms.** The
  script-and-borrowing findings should transfer; the emote and DOM findings are
  platform-specific by construction.
- **Whether the translations are any good.** Out of scope, and it is the
  question a reader of the product would ask first.
