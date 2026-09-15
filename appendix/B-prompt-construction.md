# Appendix B. How the specification was built

Thirty-one passes over [appendix A](A-audit-prompt.md). Recorded here because
the distribution of what the passes found is itself a result: sixteen passes of
reading and rewriting produced a document that passed every mechanical check
written for it, and the first pass that executed an axis against real code
falsified three of its requirements.

Passes that changed nothing are listed, because omitting them would misrepresent
the yield.

---

## Regime 1: review passes (1 to 16)

| # | Pass | Found | Changed the document |
|---|---|---|---|
| 1 | Falsifiability of bars | Seven bars read "under a stated ceiling", a ceiling the agent writes *after* measuring, therefore green by construction | Yes: ceilings moved to a tracked file, written before the measurement, with a baseline rule for the first pass |
| 2 | Blind spots | Two whole classes uncovered: adversarial input, and platform hard limits (quota, rate, concurrency, clock) | Yes: two new axes |
| 3 | Reading cost | 36 KB with no index means the whole file is read every pass | Yes: index with a required-instrument tag per axis |
| 4 | Cheat surface | The document could be satisfied in prose with nothing executed | Yes: a ledger requiring command, exit code, commit, witness; five named cheats |
| 5 | Cold clone | Nothing said what to do when the probe instrument is absent | Yes: instrument tags carry the answer; blocked axes are named as blocked, never as passing |
| 6 | Priority | `damage = readers × silence` is not computable | Yes: two four-point scales, score 16 down to 1 |
| 7 | Conflict with the companion frame | The frame says an agent is handed a path, not a pasted frame; this document created a second thing to paste | Yes: pass-by-path stated explicitly |
| 8 | Destructive experiments | Half the axes require breaking something; nothing said where | Yes: a throwaway-branch section, breakage committed as a reproducible witness |
| 9 | **First execution** | Ran the adversarial-input axis against real sources | Yes: produced the guard-as-a-fraction rule (see below) |
| 10 | Redundancy | Measured: zero duplicated sentences | No |
| 11 | Vocabulary | Four load-bearing words undefined: constructed, closed, surface, red | Yes: definitions |
| 12 | Resumption | Already absorbed by the pass-4 ledger | No |
| 13 | Witness quality | 3 of 21 witnesses not actionable, including one that admitted having no witness at all | Yes: all 21 rewritten as actions |
| 14 | Portability | Measured: zero hard dependencies on tool, model or runner names | No |
| 15 | Bootstrap | Nothing said what to do on the very first pass, when neither ledger nor budget file exists | Yes: a four-step bootstrap, with its failure mode named |
| 16 | Full mechanical audit | every condition green, zero failures | No |

### What pass 9 produced, and what pass 30 took back

The first execution ran the adversarial-input axis against the product's
sources. It found the markup question closed, every sink being a text node,
and the direction question open: of three surfaces rendering untrusted text,
it reported one as guarded.

**That number was wrong, and a later pass caught it.** Writing the probe up as
a publishable script (pass 30) forced it to enumerate attribute assignments per
element rather than per write, and the guarded count went from one of three to
two of three; tracing the remaining surface to its callers showed it renders
internal error codes and localised interface strings, so it carries no
untrusted text at all and leaves the population at two of two.

The residue is real but smaller and belongs elsewhere: no source file
neutralises direction-control characters inside rendered text, on any surface,
and the error surface renders localised interface strings without a direction
attribute while the interface is localised into right-to-left languages.

Three levels of rigour produced three answers to a question that looked binary,
and the least rigorous one was the most alarming. That ordering is not a
coincidence: a coarse probe finds the guard missing wherever it fails to look
properly, so its errors are biased toward accusation. The corpus names this as
the most common way to waste a pass, and this study walked into it while
holding the rule that warns about it.

The generalisable output of pass 9 survives the correction, because the rule is
what found the real gap:

> A guard is measured as a fraction of the surfaces that need it, never as a
> presence. One occurrence in one file reads as "handled" to a search and as
> "handled in one place of several" to a count.

That rule then matched, independently, a pattern the studied corpus had already
produced three times on unrelated subjects
([thesis ch. 4](../thesis/04-script-vs-language.md#45-the-finding-about-findings)).

## Regime 2: execution passes (17 to 30)

| # | Axis executed | Measurement | Effect on the document |
|---|---|---|---|
| 17 | Supply chain and observable surface | Four page-queryable signals confirming installation, while the manifest documents removing one vector for exactly that reason | — |
| 18 | | | **Bar falsified.** "No page script can confirm the extension is present" is unsatisfiable by anything that renders. Rewritten as a *cost* bar |
| 19 | Interface i18n | Store-facing locales complete; internal coverage reported as 34 of 155, later found to be 155 of 155 and withdrawn | — |
| 20 | | An existing script already computed that number; this pass reimplemented it | **Added:** look for the instrument before building one, and its corollary, an instrument nothing launches is worse than one that does not exist |
| 21-24 | Release integrity, repository hygiene, instrumentation | Versions consistent; 11.84 MiB pack, 7 of 9 remote branches already merged; counters are free-form string keys | — |
| 25 | | The forge publishes a digest per release asset | **Bar falsified.** Two local rebuilds compared byte for byte is more expensive and proves less than comparing to the published digest |
| 26 | | | **Bar falsified.** "Every counter declares its denominator" is unenforceable against a free-form key map. Moved to a naming convention a gate can check |
| 27-28 | Gates, language detection | 56 harness files, 40 runner entries, 35 launched by nothing; 81 detection tests green in 723 ms | — |
| 29 | | The raw orphan count indicts a project that documented its exclusions | **Added:** a population with documented exceptions reports both the adjusted count and the raw count |
| 30 | Publishing the pass-9 probe as a runnable script | Running it falsified pass 9's own measurement: 1 of 3 guarded became 2 of 3, then 2 of 2 after tracing callers | **Added:** a guard is located on the element, not near the write; and a coarse probe's errors are biased toward accusation |
| 31 | Testing the specification against this session's own fourteen recorded mistakes | 19 of 21 axes watch the product, 2 watch the tooling, none watch the auditor; the session's own lessons were sitting in preamble prose | **Added A22, the auditor**: replication by a differently-shaped instrument, counts over structure, exit codes without pipes, quotations against source, verifiers not sharing their subject's technique, borrowed facts tagged |

---

## The yield, by regime

| | Review passes (1-16) | Execution passes (17-30) |
|---|---|---|
| Passes that changed the document | 11 of 16 | 7 of 14 |
| Unsatisfiable or uncheckable bars found | **0** | **3** |
| Own measurements falsified | 0 | **2** |
| New general rules produced | 5 | 5 |

Review found what review can find: missing sections, vague words, weak
witnesses, uncounted cases, formatting. It is not that the review passes were
careless; pass 16 verified every mechanical condition written for the document
and all of them held.

A footnote on that count, because it is the sort of thing this study spends a
chapter on elsewhere. The pass-16 audit was run from an ad-hoc script counting
fourteen conditions. The version published in
[appendix D](D-scripts/audit-spec.mjs) groups the per-axis checks together and
reports twelve. Same checks, different granularity, two different numbers for
one result. The number that carries meaning is the failure count, which was
zero in both; a total that depends on how the checks were bundled carries none.

Review found none of the three bars that could not be met. Each required
contact with a real system:

- **Undetectability** required knowing that the product renders into a shared
  DOM, so the page can always find it by looking.
- **Byte-identical rebuilds** required noticing that the forge already
  publishes a digest, which is a property of the hosting platform and appears
  nowhere in the repository.
- **Declared denominators** required reading the counter implementation and
  finding a free-form string map with no schema to attach a declaration to.

## The conclusion this supports

> A specification is a hypothesis about a system. Reviewing a hypothesis is not
> testing it. The defects that review finds and the defects that execution
> finds are disjoint classes, and only one of the two can be found by reading
> the document more carefully.

The corresponding practice: execute the specification against the real system
as early as possible, on any single axis, before investing further review
passes. Pass 9 was the cheapest pass in the sequence and produced the rule that
the rest of the document was reorganised around.

A second practice follows from pass 30, and it is the less comfortable one:
**write the probe up as something someone else could run.** Pass 9's
measurement was taken with an ad-hoc search and believed for twenty passes.
Making it a script with arguments, a usage line and a fail-on-empty assertion
was what exposed that it had been looking in the wrong place. Publication is a
verification step, not a packaging step.

---

*Passes 1 to 30 were carried out in one session by the account writing this
study, not by the account that developed the system. The measurements taken
during passes 9 and 17 to 29 are tagged **[new]** or **[replicated]** in
[thesis ch. 13](../thesis/13-results.md).*
