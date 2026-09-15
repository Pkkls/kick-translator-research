# 13. Results

All measurements, consolidated. Tags follow the
[convention](../README.md#how-to-read-the-numbers): **[reported]** from the
project notebooks, **[replicated]** re-run for this study, **[new]** taken here
for the first time.

Read every accuracy figure against
[chapter 3's](03-method.md#33-the-bench-that-measured-itself) finding: a number
taken on the bench that produced the rule measures the fitting, not the
performance.

---

## 13.1 The identifier duel

The project's most complete experiment, and the one this study considers
exemplary in design. The question: can a lighter language identifier replace
the current one, buying back a large share of the injected script?

**[reported]** The weight at stake: 81121 bytes against 174824, minified and
bundled. **93703 bytes, forty percent of the injected script.**

### The decisive metric was fixed in advance

Not aggregate accuracy. The metric was *non-English messages classified as
English*, because such a message is dropped in silence by the same-language
skip and the reader never learns it existed. The metric was chosen because it
maps to the failure that costs a reader a message.

### The first verdict was wrong, and the corpus says so

**[reported]** A first duel on 30 messages had the challenger winning
everything, including the decisive number: incumbent 1 of 30, challenger 0.

Four more messages were then added, taken from the tests the swap had broken.
The decisive number reversed:

| | Incumbent | Challenger |
|---|---|---|
| Non-English called English (decisive, lower is better) | **1 of 34** | **5** |
| Aggregate accuracy | 11 | 18 |
| Silences | 9 | 4 |
| Coverage, one phrase per language over 42 | 26 | 25 |
| Bundled size, bytes | 174824 | 81121 |

The challenger calls `guten abend`, `tebrikler` and `velmi dobre` English.

The project's own comment on the reversal is the methodological point: *the
first corpus was too small to contain the cases that decide, which is the whole
reason that number was chosen in advance.* Fixing the metric beforehand is what
made the reversal legible instead of negotiable.

### No threshold rescues it

**[reported]** The challenger returns a confidence score where the incumbent
returns none, so the obvious repair is to stay silent below a bar. Measured, it
makes things worse:

- Below the bar an ASCII fallback calls the message English, so a stricter bar
  anglicises **more**: 20 of 34 at a 0.15 threshold.
- Applying the bar only to the English verdict takes 5 down to 4 and costs
  English recognition, 9 of 10 down to 5 of 10.
- The result is flat from 0.2 to 0.8, meaning the challenger is confidently
  wrong on those cases rather than hesitant.

That flatness is the finding. A confidence score is only useful if it is
correlated with correctness; here it is not, on exactly the cases that matter.

### The verdict

**[reported]** The 40 percent saving is real and unavailable: *it costs four
readers their message for every one it saves.* The incumbent keeps the job, and
the corpus records that the first published verdict was wrong.

What makes this exemplary: the decisive metric preceded the experiment, the
metric mapped to user harm rather than to aggregate accuracy, a threshold
rescue was attempted rather than assumed impossible, the option that won the
aggregate lost the decision, and the initial published result was corrected in
public.

## 13.2 Language identification

| Measurement | Before | After | Tag |
|---|---|---|---|
| Persian lines declared Arabic, confidently | 12 of 12 | separated | [reported] |
| Mongolian lines declared Russian | 20 of 20 | see below | [reported] |
| Mongolian by exclusive letters alone | | 8 of 20 | [reported] |
| Mongolian by letters plus particles | | 17 of 20 | [reported] |
| Mongolian rule, false positives against 12 ru + 8 uk + 8 bg | | 0 | [reported] |
| Ukrainian lines declared Russian | 8 of 8 | 6 of 8 take their own code | [reported] |
| Bulgarian in Cyrillic | 8 of 8, and 12 of 12, declared Russian | stated limit, unresolved | [reported] |
| **Bulgarian markers, fitted bench** | | **20 of 20** | [reported] |
| **Bulgarian markers, held-out bench** | | **4 of 12** | [reported] |
| Script check with emoji, "да" + 2 emoji | no majority, falls through | holds to 6 emoji | [reported] |
| Malay, Hebrew identified | never | identified | [reported] |

## 13.3 Transliteration and noise

| Measurement | Result | Cost (bytes) | Tag |
|---|---|---|---|
| Romanised Russian, Greek, Japanese | 0 of 5 → 5 of 5 | 617 | [reported] |
| Romanisation markers, false positives on 20 traps | 0 of 20 | | [reported] |
| Arabizi with wide digit set | 3 false positives | | [reported] |
| Arabizi restricted to `[3579]` | 12 of 12, 0 false positives on 29 traps | 227 | [reported] |
| Shlyokavitsa (Latin Bulgarian) | 9 of 12 silent, scattered verdicts, unresolved | | [reported] |
| Keyboard smash, before | 0 of 11 dropped | | [reported] |
| Keyboard smash, after | 15 of 15, 0 false positives | 424 | [reported] |
| Smash threshold 0.6 vs 0.65 vs 0.7 | 2 FP / 0 FP / 0 FP shipped | | [reported] |
| Laughter forms recorded, of which language-marking | 43, of which 22 | 3791 | [reported] |
| Usable source language on mixed messages | 3 of 10 → 10 of 10 | | [reported] |
| of which previously **wrong** | 2 of the 3 | | [reported] |

## 13.4 Latency, weight, cache

| Measurement | Result | Tag |
|---|---|---|
| On-device path, n=8 | 6 / **22** / 210 ms (min / p50 / p95) | [reported] |
| Cloud path, n=200 | 353 / **1618** / 2134 ms | [reported] |
| On-device models present, measured session | only `en>fr` of four pairs | [reported] |
| On-device API presence | absent on one Chrome 151, present on another, same machine | [reported] |
| In-tab cache hit rate, 29-minute session | 6.7 % | [reported] |
| Persistent cache hit rate, same session | 1.0 % (8 hits in 821 lookups) | [reported] |
| Validation library removed from content script | 81.3 → 69.0 KB gzipped | [reported] |
| Prose shipped in a data field | 1754 bytes, 0.85 % of injected script, 42 of 45 entries | [reported] |
| Injected script at end of last recorded pass | +0.15 % against previous release | [reported] |

## 13.5 Verification state

| Measurement | Result | Tag |
|---|---|---|
| Offline gates, headless | 39 of 39 green | [reported] |
| Unit tests | 1034 | [reported] |
| Continuous integration | green on two consecutive runs, after 48 red | [reported] |
| Fallback chain truncated to one engine | all unit tests green, one probe red | [reported] |
| Detection test files re-run for this study | 81 tests green, 723 ms | [replicated] |
| Harness files on disk | 56 | [replicated] |
| Entries in the gate runner | 40 | [replicated] |
| Harness files no runner launches, raw count | 35 | [replicated] |
| of which deliberately hand-launched | not separated by this study; see below | |

The last row is the measurement this study got wrong on its first attempt, and
the correction is recorded in
[appendix B](../appendix/B-prompt-construction.md): a raw orphan count
indicts a project that documented its exclusions. The number that would be a
finding is *orphans with no written reason*, and producing it requires reading
each exclusion. The raw count is given here because it is what was measured;
the useful count is an open item.

## 13.6 Release and repository state

| Measurement | Result | Tag |
|---|---|---|
| Version agreement: package, tag, published archives | consistent | [replicated] |
| Published release assets carry a content digest | yes, per asset | [replicated] |
| Repository pack size | 11.84 MiB | [replicated] |
| Remote branches | 9, of which 7 already merged into the main branch | [replicated] |
| Store-facing locales, key completeness | 10 of 10 complete | [replicated] |
| Internal interface locale coverage | 34 keys of 155 declared, per language | [replicated] |
| Tagged releases in the study period | 16, over three months | [replicated] |

## 13.6b What a fresh clone can actually run

Cloned from the public repository, at the commit the study measured against.

| Step | Result | Tag |
|---|---|---|
| `npm ci` | succeeds | [replicated] |
| Type check | no errors | [replicated] |
| Lint | no issues | [replicated] |
| Unit tests | **1034 passed, 0 failed** | [replicated] |
| Harness files present in the clone | **56** | [replicated] |
| Audit scripts present | **8** | [replicated] |
| Gate runner without a browser driver | **exits non-zero**, names the cause, offers three fixes | [replicated] |
| The frame's claim that a clone has none of these | **false at the same commit** | [replicated] |
| Unit-test count stated in the README | 1032, against 1034 actual | [replicated] |

## 13.7 Observable surface

| Measurement | Result | Tag |
|---|---|---|
| Markup sinks for chat or provider text | all text-node; no markup path found | [new] |
| Sole `innerHTML` in content sources | internal icon table into an SVG element, no external input | [new] |
| Surfaces rendering untrusted text, with direction handling | **2 of 2** (the third surface carries no untrusted text; see [11.3](11-privacy-surface.md#replication-bidirectional-text)) | [new] |
| First measurement of the same quantity, by a coarser probe | 1 of 3, withdrawn | [new] |
| Neutralisation of direction-control characters inside rendered text | none, on any surface | [new] |
| Source files referencing a direction-control character | 0 | [new] |
| Page-queryable signals confirming installation | 4 classes (fixed element id, document attribute, 98 prefixed class names, per-row marker) | [new] |

## 13.8 The three bars execution falsified

From this study's own audit specification, after sixteen review passes that
found none of them
([ch. 3](03-method.md#36-method-applied-to-method-what-execution-falsified)):

| Bar | Defect class | Tag |
|---|---|---|
| Undetectability | Unsatisfiable by any extension that renders | [new] |
| Byte-identical local rebuilds | More expensive and weaker than the available check | [new] |
| Declared counter denominators | Unenforceable against free-form keys | [new] |
