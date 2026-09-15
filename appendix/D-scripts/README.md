# Appendix D. Scripts

The probes as they were actually run, not cleaned-up versions of them.

| Script | What it measures | Used in |
|---|---|---|
| `probe-render-sinks.mjs` | Markup sinks, text-node writes, direction-attribute assignments, and whether any source handles direction-control characters | [11.3](../../thesis/11-privacy-surface.md#replication-bidirectional-text-new), [13.7](../../thesis/13-results.md#137-observable-surface) |
| `audit-spec.mjs` | The audit specification against the conditions it was written under | [appendix B](../B-prompt-construction.md), pass 16 |
| `verify-handover-claims.mjs` | Every measurable claim in the handover, expected against actual, with the unverifiable ones listed rather than skipped | [HANDOVER.md](../../HANDOVER.md) |
| `probe-emote-stripper.mjs` | What the inline emote-name stripper destroyed before and after its repair, by rule, per corpus and per revision, using the product's own module out of git | [8.3b](../../thesis/08-noise.md#83b-the-damage-measured-and-the-language-the-corpus-did-not-name), [appendix E 4.29](../E-method-log.md#429-a-draft-nobody-committed-and-what-replication-left-of-it) |

| `check-links.mjs` | Every relative link in every Markdown file here, anchor included, against GitHub's slug rule | [RESUME-HERE.md](../../RESUME-HERE.md), [appendix E 4.29](../E-method-log.md#429-a-draft-nobody-committed-and-what-replication-left-of-it) |

| `probe-quotes.mjs` | Whether the corpus's words, where this study quotes them, are verbatim in the extension's tracked files, or labelled as translated. A report, not a gate: its attribution test lists known false positives | [appendix E 4.42](../E-method-log.md#442-quotations-that-were-not-the-corpuss-words-found-by-something-that-runs) |

| `probe-consistency.mjs` | Whether this study states one quantity twice with two values. Ratios are a report, keyed on wording and therefore weak; constants written as `NAME = n` are checked against the clone and are the half that catches drift | [appendix E 4.46](../E-method-log.md#446-the-rule-about-stale-numbers-had-nothing-behind-it) |

| `probe-orphan-assets.mjs` | Which tracked images nothing produces and nothing references. Enumerates instead of following references, which is what every other check here does, and is why it refuted the finding it was written for on its first run | [appendix E 4.53](../E-method-log.md#453-a-probe-built-for-one-finding-refuted-the-finding-before-it-was-published) |

| `axis-ledger.mjs` | Whether [appendix F](../F-axis-ledger.md) still names exactly the axes the specification defines, and how many of them carry a verdict, which is the first of the three stop conditions | [appendix F](../F-axis-ledger.md), [appendix E 4.51](../E-method-log.md#451-a-stop-condition-with-a-term-nobody-could-evaluate) |

| `stop-conditions.mjs` | All three of the specification's stop conditions, counted in one command: the axis verdicts through `axis-ledger.mjs`, the clone's queue by its own `[ ]` `[k]` `[x]` markers, and whether the last two commits here declared no measurement. A gate on the third only, which is the one about this account's conduct | [appendix E 4.81](../E-method-log.md#481-the-goal-said-to-count-the-three-stop-conditions-and-two-of-them-had-no-instrument) |

| `version-agreement.mjs` | Whether the extension's version is one answer across the package, the derived manifest, the built manifest, the newest tag, the tag reachable from HEAD and, with `--with-network`, the published release and its assets. The gate A15's bar asks for and nothing in the clone provides | [appendix E 4.83](../E-method-log.md#483-the-clause-a15-could-not-close-was-an-afternoons-instrument) |

| `compose-calls.mjs` | Engine calls per typed character on the outgoing path, counted by walking a message's prefixes through the clone's own `decideComposeAction`. Sets A3's budget row without a browser, and prints which prefixes of a link or an emote run reach a provider. `--rate` drives the debounce, the gate chain and the product's own `RateLimiter` together over a simulated minute of typing, which is where the per-minute ceiling of 30 shows up | [appendix E 4.90](../E-method-log.md#490-the-half-typed-link-goes-to-the-provider-and-the-debounce-is-the-only-thing-stopping-it) |

| `probe-link-guards.mjs` | Which URL shapes the product's two link guards recognise, outgoing `maskProtected` and the incoming `URL_RE`, against the privacy text's claim that links are stripped. Exits 1 if the defect is ever fixed, so this study learns it is stale | [appendix E 4.91](../E-method-log.md#491-both-link-guards-require-a-scheme-and-the-privacy-text-does-not) |

| `scripts-index.mjs` | Whether this README still names exactly the scripts in this directory, and whether the two counts it states agree with the directory. Walks the tree rather than reading a list, because the list is the thing that drifts | [appendix E 4.93](../E-method-log.md#493-the-table-of-what-is-here-was-kept-by-hand-four-times) |

| `row-cost.mjs` | Main-thread cost per arriving chat row, driving the product's own `inject()` in a real browser with the DOM capped the way a virtualised list keeps it. Sets A6's second budget row; `--witness` plants the synchronous loop A6 names | [appendix E 4.94](../E-method-log.md#494-the-first-number-this-probe-produced-was-a-property-of-the-probe) |

| `cold-start.mjs` | Time from navigation to the first visible translation, on a profile that has never run the extension, with a second message on the same page as the control. Sets A18's budget row | [appendix E 4.95](../E-method-log.md#495-the-cold-start-number-and-the-control-that-replicated-another-harness) |

| `worker-eviction.mjs` | Added latency of the first message after the MV3 service worker is killed, with the kill verified as a 1-0-1 transition in the CDP target list. Runs A5's witness and sets its budget row | [appendix E 4.96](../E-method-log.md#496-the-witness-nobody-had-run-and-the-identifier-that-proved-nothing) |

| `probe-contrast.mjs` | Every contrast ratio the product states beside the pair it states it for, recomputed by the WCAG formula, with the ones whose ground is a sentence away counted rather than guessed at. Exits 1 when the known mismatch is fixed or a new one appears | [appendix E 4.98](../E-method-log.md#498-two-figures-in-one-comment-measured-against-two-grounds-it-does-not-name) |

| `probe-key-storage.mjs` | Whether the DeepL key stays out of synced storage, by recording every value it takes there rather than sampling the end state. Drives the real extension through its own service worker | [appendix E 4.99](../E-method-log.md#499-the-key-is-taken-out-of-synced-storage-by-a-guard-written-for-another-problem) |

| `probe-detection.mjs` | What a script on the host page can query by name to find the extension, enumerated from the page's own main world as A11's witness requires, with a witness identifier added from the page and re-surveyed | [appendix E 4.103](../E-method-log.md#4103-the-detection-surface-measured-in-the-world-the-axis-says-to-measure-it-in) |

| `probe-startup-race.mjs` | Whether a chat message arriving between the container existing and the content script attaching is ever lost. Schedules messages from the page's own world with nothing in the markup, and records when the extension first marks the page so the run can say whether the window was exercised at all | [appendix E 4.104](../E-method-log.md#4104-the-startup-window-exists-eight-messages-were-put-in-it-and-none-was-lost) |

| `probe-untranslated.mjs` | Sentences the reader is shown that never reach the chat catalogue, scanned the opposite way round from the product's own coverage test, which matches call sites and therefore cannot see a string that is not one | [appendix E 4.105](../E-method-log.md#4105-one-sentence-of-sixteen-never-reaches-the-catalogue-and-the-guard-cannot-see-it) |

| `probe-archive.mjs` | A11's archive clauses read from an unpacked published archive rather than from a build: instrumentation and source-map markers, web-accessible resources, and whether any licence text ships | [appendix E 4.106](../E-method-log.md#4106-the-archive-read-as-an-archive-and-a-check-withdrawn-for-being-mostly-wrong) |

| `probe-long-session.mjs` | Whether the heap grows without bound over a long session, read through CDP after a forced collection, run twice: once as the product and once with the page retaining every message so a flat line has a control behind it. Reports each half's slope, because caps filling and a leak look the same at first | [appendix E 4.107](../E-method-log.md#4107-a-sensitive-control-was-not-enough-the-discriminator-was-the-slopes-decay) |

| `probe-shortcut-warrant.mjs` | Whether each detection shortcut is required and written down, per name and under both readings of *required*. Resolves the constant before counting, because five of the six ids are spelled once and used through it, and decides *forced* from the file boundary rather than from a classifier | [appendix E 4.108](../E-method-log.md#4108-six-of-eight-detection-shortcuts-need-no-fixed-name-at-all) |

| `probe-refusal-overwritten.mjs` | The corpus's Cyrillic and Arabic-script separations re-taken on a bench written for this study and printed in full, and what `detectLanguage` does with the Mongolian guard's deliberate refusal. Drives the product's own filters with the values it returns, so the consequence is measured rather than argued | [appendix E 4.109](../E-method-log.md#4109-the-refusal-does-not-survive-its-own-caller-and-a1s-bar-named-this) |

| `probe-refusal-census.mjs` | Every `return undefined` in the detection path, enumerated from the TypeScript AST and split into a refusal, a *nothing yet*, and the fall-through, then all five driven to see whether each survives `detectLanguage`, with a unanimous control beside the two vote conflicts. Reports what `francToIso2` does with franc's answer, which is what actually decides | [appendix E 4.110](../E-method-log.md#4110-one-value-three-intentions-and-the-vocabulary-of-another-library-decides), [4.111](../E-method-log.md#4111-all-five-refusals-measured-and-three-leak-at-the-same-rate) |

| `probe-arabizi-traps.mjs` | The corpus's *zero false positives* for the arabizi detector, attacked with ordinary English gaming chat, which is the register this product runs in. Runs the pipeline's own order so reachability is checked rather than assumed, and carries a positive control of real arabizi because the feature repaired a measured harm | [appendix E 4.112](../E-method-log.md#4112-the-arabizi-detector-calls-ten-of-sixteen-english-gaming-lines-arabic) |

| `probe-smash-traps.mjs` | The corpus's *zero false positives* for the keyboard-smash filter, attacked with the product's own shipped interface text in nine locales. Carries both mash shapes as its control, walks along a row and hands mashing one out of order, because a fix that passed only the walks looked perfect and was not | [appendix E 4.113](../E-method-log.md#4113-the-looseness-that-catches-a-mash-is-the-looseness-that-eats-porque) |

**Twenty-nine scripts.** That count is here because two documents stated it from
memory and disagreed with each other on the same day, one saying nine and one
ten while there were nine (4.81). Everything else cites this table.

All twenty-nine take a path argument and print to standard output; `probe-quotes.mjs`,
`probe-consistency.mjs`, `stop-conditions.mjs` and `probe-shortcut-warrant.mjs` take two, this repository and
the extension's, and `version-agreement.mjs`, `compose-calls.mjs` and `probe-link-guards.mjs`
take only the extension's. Only
`probe-emote-stripper.mjs` writes anything: a temporary copy of the modules it
imports, under the system temp directory, removed before it exits. It needs
Node 22.18 or later.

## Two things they are built to demonstrate

**A probe that measured nothing must fail.** `probe-render-sinks.mjs` exits
non-zero when it finds no text writes at all, because a clean run over zero
files is indistinguishable from a clean run over clean code. This is the rule
from [chapter 3](../../thesis/03-method.md#a-probe-that-saw-nothing-must-fail-not-pass),
and it is the cheapest of them to implement.

**A mechanical audit cannot test a specification.** `audit-spec.mjs` reports
every condition green on a document that contained three requirements no system
could meet. It says so in its own output, because a tool whose limits are
printed beside its result is harder to misread than one whose limits live in a
document nobody opens.

## The classification step is not automated, deliberately

`probe-render-sinks.mjs` reports call sites and refuses to guess which of them
carry untrusted text. That judgement needs the callers traced, and automating
it would hide the step where this study first went wrong: an earlier version
inferred the answer and published a fraction that three levels of scrutiny
later reduced to nothing. See
[appendix B](../B-prompt-construction.md#what-pass-9-produced-and-what-pass-30-took-back).
