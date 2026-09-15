# Resume here

Where this work stands, what is verified, and exactly what to open next. Written
so that a session with no memory of this one can continue without re-deriving
anything.

---

## State

Everything in this repository is pushed. Working tree clean. That sentence was
false once, and the uncommitted draft behind it is
[entry 4.29](appendix/E-method-log.md), so check it rather than read it. The
first command must print nothing, and the last two are the scripts that must
stay green:

```bash
git status --short
node appendix/D-scripts/check-links.mjs .
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
node appendix/D-scripts/audit-spec.mjs appendix/A-audit-prompt.md
```

Last known: **37/37 checkable claims, 12/12 spec conditions, no broken internal
link**. The link line used to be a sentence, "all internal links resolve", and
nine of them did not. Counts that no script reads, such as the number of
entries in the method log, are deliberately not restated here (4.30).

## What is done

- **15 thesis chapters**, `thesis/`
- **The handover** for the developing account, `HANDOVER.md`
- **A 22-axis audit specification**, `appendix/A-audit-prompt.md`
- **The method log**, `appendix/E-method-log.md`, every recorded mistake
- **Five runnable scripts**, `appendix/D-scripts/`

## The reading that is still unfinished, and it is the productive one

The last eight passes all came from reading the project's journals **by
position**, not by topic search. Every one of them produced either a correction
to something published here or a rule worth keeping. That is where to continue.

### Journal of 2026-08-30 (1101 lines, 28 numbered passes)

Read so far: passes 3, 6, 12, 14, 15, 16, 20, 22 to 28 and "Left behind",
the gate-suite section at L63, and the probe typology at L202. Each one
produced either a correction to something published here or a rule now in
TRANSMISSION.md. Passes 25 to 28 produced both: they corrected chapter 8.3 and
most of an uncommitted draft built on them (4.29).

**Still unopened**, with the ones most likely to pay first:

| Line | Section |
|---|---|
| L356 | Eighth pass: a fifth analytics file, and two things I had asserted wrongly |
| L386 | Ninth pass: the kit's own gate accused working code |
| L418 | Pass ten: the bar panel gets the same treatment |
| L486 | Pass eleven: the gates stop depending on a browser this machine happens to have |
| L569 | Pass thirteen: the thing the product is for |
| L719 | Pass seventeen: the number the listing sells |
| L751 | Pass eighteen: the language a reader picks |
| L779 | Pass nineteen: somebody else's DOM |
| L830 | Pass twenty-one: the version nobody would hear about |

### Journal of 2026-08-31 (61 sections)

Read so far: the sections on the startup race, the false probes, the Bulgarian
work, the day boundary, the weight field, the short-expression table, the
silent-drop residue, and the Latin-only bench.

**Still unopened**, most promising first: L143 "the detector that won everything
except the one thing", L237 "the trimming experiment, run at last", L263 "what
a source allowlist costs without saying so", L207 "a change that shipped on one
bench and was reverted on the next", L1205 onward, the whole live-debugging
sequence.

### How to read them

Open by line number and read forward. **Do not search by topic**: a theme query
returns statements ranked by relevance, and in a chronological corpus the most
relevant passage is often the one that was later superseded. That mistake is
[entry 4.22](appendix/E-method-log.md) in the method log, and it cost this study
a section asserting a question was open when a later pass had closed it.

## Candidates with one instrument, waiting for a second

Not findings. Each is recorded so it is not rediscovered, and so it is not
promoted to the handover before something differently shaped has run.

- **The width gate may not see a hidden button** **[read]**. `bar-widths.mjs`
  skips every target whose rounded size is 0 by 0, not only the on-device chip
  its comment names, and `bar-live.mjs` asserts the gear and the pause button
  by `querySelector` presence. Read together, a gear hidden by a stylesheet
  would pass both. The witness: in a copy of a Chrome build, never the working
  `dist/` (the journal's pass twenty-seven is why), hide `.kt-float-opts` and
  run both gates. If this reading is right, both stay green.
- **Which store data exists, open until L356 is read.** Pass six declined
  "store analytics" as a basis for optimisation because they hold no install or
  usage figure. Axis A18 of the specification says the store dashboards are
  the only place the ratio of views to installs exists. Those may be two
  different datasets or one of the two statements is wrong; pass eight is
  titled "a fifth analytics file" and should say which.

## What is measured and what is not

Nine published measurements went through the replication bar: **five changed,
four held, one was published without its parameter**. The full table is in
[appendix E](appendix/E-method-log.md) under "the replication rate, complete".

**Never measured here, and each needs something this account did not have:**

- Anything observed in a browser. Every source-derived claim is about call
  sites, not about what renders.
- Any frequency in real chat traffic.
- The on-device engine's availability across real installs.
- Store dashboard figures.

## Open items handed to the developing account

In [HANDOVER.md](HANDOVER.md) section 8, ordered by value over cost. The two
cheapest with real value:

1. The frame tells every new session that a fresh clone has no harnesses. It
   has 56. Ten minutes, and it removes a false belief injected at the top of
   every pass.
2. `scripts/i18n-check.mjs` reports 150 missing keys per locale on files that
   are complete. Twenty minutes, and it repairs an instrument rather than a
   product.

## The rule this work kept re-learning

Written here because it is the one thing worth carrying into any continuation:

> A diagnosis propagates when something runs, not when it is written down.

This study wrote that sentence, published it, and then committed the same
diagnosis locally three more times. The corpus under study did the same over
six instances and three months. Neither account was careless. **Build the check
rather than the rule.**
