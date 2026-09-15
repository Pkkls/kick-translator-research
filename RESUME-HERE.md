# Resume here

Where this work stands, what is verified, and exactly what to open next. Written
so that a session with no memory of this one can continue without re-deriving
anything.

---

## State

Everything in this repository is pushed. Working tree clean. Two scripts must
stay green and are the first thing to run:

```bash
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
node appendix/D-scripts/audit-spec.mjs appendix/A-audit-prompt.md
```

Last known: **32/32 checkable claims, 12/12 spec conditions**, all internal
links resolve, 28 entries in the method log.

## What is done

- **15 thesis chapters**, `thesis/`
- **The handover** for the developing account, `HANDOVER.md`
- **A 22-axis audit specification**, `appendix/A-audit-prompt.md`
- **The method log**, `appendix/E-method-log.md`, 28 recorded mistakes
- **Three runnable probes**, `appendix/D-scripts/`

## The reading that is still unfinished, and it is the productive one

The last eight passes all came from reading the project's journals **by
position**, not by topic search. Every one of them produced either a correction
to something published here or a rule worth keeping. That is where to continue.

### Journal of 2026-08-30 (1101 lines, 28 numbered passes)

Read so far: passes 12, 15, 16, the gate-suite section at L63, and the probe
typology at L202.

**Still unopened**, with the ones most likely to pay first:

| Line | Section |
|---|---|
| L298 | Sixth pass: three more mute probes, and a question the data cannot answer |
| L608 | Pass fourteen: the chain that keeps translation alive |
| L804 | Pass twenty: what keeps the free quota alive |
| L852 | Pass twenty-two: the half that talks back |
| L167 | Third pass: a harness nobody ran was reporting a real bug |
| L356 | Eighth pass: a fifth analytics file, and two things I had asserted wrongly |
| L386 | Ninth pass: the kit's own gate accused working code |
| L639-1098 | passes 17 to 28, all unread |

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
