# Resume here

Where this work stands, what is verified, and exactly what to open next. Written
so that a session with no memory of this one can continue without re-deriving
anything.

---

## State

Everything in this repository is pushed. Working tree clean. **That sentence is
weaker than it reads**: `node_modules/` is gitignored, so a clean tree said
nothing while the clone under study had no dependency tree at all for two
passes (4.61). Check the clone builds, not only that git is quiet. That sentence was
false once, and the uncommitted draft behind it is
[entry 4.29](appendix/E-method-log.md), so check it rather than read it. The
first command must print nothing, and the four after it are the gates that must
stay green:

```bash
git status --short
node appendix/D-scripts/check-links.mjs .
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
node appendix/D-scripts/audit-spec.mjs appendix/A-audit-prompt.md
node appendix/D-scripts/axis-ledger.mjs .
```

Last known: **63/63 checkable claims, 12/12 spec conditions, no broken internal
link**, and the axis ledger naming exactly the 22 axes the specification
defines. The link line used to be a sentence, "all internal links resolve", and
nine of them did not. Counts that no script reads, such as the number of
entries in the method log, are deliberately not restated here (4.30).

The specification's own first stop condition is countable now rather than an
impression: **all 22 axes carry a verdict, so the first stop condition is met** (4.64).47 named, and none is
closed outright, though A15's reproducibility half is: both published archives
rebuild byte-identical from the tag (4.52).
[Appendix F](appendix/F-axis-ledger.md) is the row-per-axis index that
makes it readable (4.51), and `axis-ledger.mjs` prints the count and fails if
the ledger and the specification stop agreeing about which axes exist.

Two reports to read rather than to keep green, because they list false
positives beside real ones (4.42, 4.46):

```bash
node appendix/D-scripts/probe-quotes.mjs . /path/to/kick-chat-translator
node appendix/D-scripts/probe-consistency.mjs . /path/to/kick-chat-translator
```

The second one's constant half is not a report but a check, and it is the
narrowest thing in this repository: it compares every value the study writes as
`NAME = n` against the clone. Today that is one value. Its worth is that it
fails the moment a second one drifts, which is what 4.45 did undetected.

## What is done

- **15 thesis chapters**, `thesis/`
- **The handover** for the developing account, `HANDOVER.md`
- **A 22-axis audit specification**, `appendix/A-audit-prompt.md`
- **The method log**, `appendix/E-method-log.md`, every recorded mistake
- **Nine runnable scripts**, `appendix/D-scripts/`

## The reading, by position

Every listed section of both journals is now read. Each pass of the session
that finished the list produced a correction to something published here, a
rule, or both, including the handover's most visible item (3.7), which sat in
the last stretch of the newer journal. What remains unread is named under each
journal below as never listed; the rule in 4.36 says to open the section after
anything quoted before trusting the quotation, and that is the cheapest place
to continue.

### Journal of 2026-08-30 (1101 lines, 28 numbered passes)

Read so far: passes 3, 6 to 28 and "Left behind", the gate-suite section at
L63, and the probe typology at L202. Each one produced either a correction to
something published here or a rule now in TRANSMISSION.md. Passes 25 to 28
produced both: they corrected chapter 8.3 and most of an uncommitted draft
built on them (4.29).

**Still unopened: none of the listed sections.** The last one added, L329, was
added by the rule in 4.36 because pass six is quoted in the handover; reading
it led back to pass twelve and a unit this study had supplied (4.31).

Every section of this journal is now read. The never-listed ones, L3 to L45,
L103 to L166 and L219 to L297, were read after the list closed. They are the opening of the journal and the first passes;
entry 4.27 drew on at least one of them without saying which.

### Journal of 2026-08-31 (61 sections)

Read so far: the sections on the startup race, the false probes, the Bulgarian
work, the day boundary, the weight field, the short-expression table, the
silent-drop residue, and the Latin-only bench.

Also read in this session: L143, the identifier duel; L207, the reverted
length bound; L237, the trimming
experiment; L263, the allowlist; L394, the redone weight experiment, read beside
L237 because it corrects it; and L526, the allowlist measured from both sides,
read beside L263 for the same reason.

**Still unopened: none of the listed sections.** L1205 to the end, the
live-debugging sequence, is read; it produced handover section 3.7 (4.40).

Every section of this journal is now read as well. The never-listed ones were
read after the list closed, in order, with what each changed recorded in the
commits from `ac1efdc` onward.
The earlier sessions' reading list names topics rather than line numbers for
some of these, so part of that range may have been read without being
recorded.

The four sections added by the rule in 4.36, each the one after a section
already quoted, are read: L518, L589, L928, L962. L962 carried the replay rule
now in chapter 12.4b.

### The rest of the corpus, never read by position

Both journals are read end to end. The corpus has four more files this study
has only ever searched or quoted by topic, which is the failure 4.22 names.
Next, in the order most likely to correct something published here:

| File | Lines | Why first |
|---|---|---|
| `.agent/PLAN.md` | 1287 | **L1 to L620 read**, and the whole file counted; L620 onward unread. Stopping short of L486 cost 4.65 |
| `CHANGELOG.md` | 900 | what each version told readers it changed |

The queue is counted rather than described: **114 entries under seven
headings, 7 open, 6 blocked on kil, 101 done**, and the section titled `## Open`
holds 40 of them, only 7 of which carry `- [ ]`. The three defects that shape
suggested are in [4.44](appendix/E-method-log.md); two were wrong. The one that
held is the stop condition in `appendix/A-audit-prompt.md`, which asks that the
queue hold nothing but items blocked on kil, and which seven entries now say is
not met.

### How to read them

Open by line number and read forward. **Do not search by topic**: a theme query
returns statements ranked by relevance, and in a chronological corpus the most
relevant passage is often the one that was later superseded. That mistake is
[entry 4.22](appendix/E-method-log.md) in the method log, and it cost this study
a section asserting a question was open when a later pass had closed it.

Before publishing anything from a section, open the section after it. A
correction lands in the next entry at the earliest, and
[4.36](appendix/E-method-log.md) is what skipping that cost.

## The two artefacts the specification asked for

The specification asks for two files by name, under a heading about the first
pass, and says neither will exist the first time it is read. **One is built
now**: [appendix F](appendix/F-axis-ledger.md), the axis ledger, with the verdict
per axis and the instrument each one needs. **The other is built now too**: [appendix G](appendix/G-budget.md), in its first
honest state, two of seven axes carrying a number and five naming the
measurement that would set them (4.58). Before this pass there was no budget
file, and **7 of the 22 bars**, A3, A5, A6, A11, A13, A18 and A21,
state their threshold as a ceiling, a floor, a count or a rate in it. Those
seven cannot be read until it exists, and it is a page of numbers (4.57).

## Candidates with one instrument, and the one that got its second

Recorded so they are not rediscovered, and so nothing reaches the handover
before something differently shaped has run. The first entry is no longer a
candidate: the differently shaped thing ran. The second is still waiting.

- **The width gate does not see a hidden button. Run, not read** (4.48). This
  was the candidate above this line and it is a finding now, for the half of it
  that could be executed. The witness as written could not: it said to hide
  `.kt-float-opts` in a copy of a build and run both gates, and the two gates do
  not read the same artefact. `bar-widths.mjs` loads a built extension through
  `KT_EXT`; `bar-live.mjs` bundles `src/` with esbuild when it starts and has no
  build hook at all, so a stylesheet edited in a copied build is invisible to it.
  What was executed, on a copy and never on `dist/`: baseline green, with
  `kt-float-lang` at 41 by 24, `kt-float-power` at 26 by 24, `kt-float-opts` at
  25 by 24 and the on-device chip already at 0 by 0. Then the same build with
  the controls hidden by their own stylesheet: **green at all ten widths, exit
  0**, both controls reporting 0 by 0, indistinguishable from the chip the skip
  was written for. Stronger than the prediction in two ways. The rule is a
  grouped selector, `.kt-float-power,.kt-float-opts`, so one `display:none`
  removes the gear **and** the pause button together; and the 24 pixel minimum
  the gate exists to enforce is a declaration in that same rule, one property
  away from the change that voids it. The corpus named this trap in its tenth
  pass for another gate, *it measures the targets it finds, it does not count
  them*, and repaired it there with a row count. `bar-widths` still asserts no
  count of its targets.
  **The `bar-live.mjs` half is still one instrument**, now for a stated reason
  rather than for want of trying: reaching it means editing `src/`, which is the
  working tree the witness forbids touching.
- **The weight gate passes without measuring on an instrumented build. Run,
  not read** (4.49). Demonstrated with one command against two builds: on the
  release build it reports `228.1 Ko, ecart +0.4 Ko, +0.16 %` and exits 0, and
  on the instrumented build it prints *poids non compare* and **also exits 0**.
  A caller reading the exit code cannot tell a measurement inside the margin
  from no measurement at all. The file already owns the distinction it needs:
  eight lines earlier, a missing `dist/` exits **2**, and an unmeasurable build
  is the same class of impossibility.
  **The question left unread is answered, and the answer is narrow.** The
  runner cannot reach it. There are 40 gates, `audit-poids` is the 38th, and
  none of the three harnesses that run `build:metrics`, `metrics-offline.mjs`,
  `latency.mjs` and `run-live.mjs`, is in the gate list at all; the default path
  builds a release and `check-strip` verifies no marker survives it. Those three
  are run by hand, which is the path that is open: read the counters with
  `metrics-offline.mjs`, then run the gates with `--no-build`, and the weight
  gate is green without looking.
  **What was not concealed.** The instrumented build measured 231.4 Ko, +1.62
  percent against the reference and inside the 2 percent margin, so this run
  hid nothing. What is demonstrated is the mechanism, not a caught regression.

## What is measured and what is not

Nine published measurements went through the replication bar: **five changed,
four held, one was published without its parameter**. The full table is in
[appendix E](appendix/E-method-log.md) under "the replication rate, complete".

That rate is left as it was, deliberately. The session that finished the
reading list re-checked many more published statements, entries 4.29 to 4.40,
and most of them were transcriptions or restatements rather than measurements:
a count restated in nine places, a certainty raised in copying, a unit
supplied, a quotation translated. Merging them into the nine would mix two
populations into one rate. Of the measurements among them, the orphan count
changed from 35 to 29, the identifier stake from thirty kilobytes to 93703
bytes, and the internal links from "all resolve" to nine broken; the project's
stripper figures, the one-declaration box model and the 22 axes held.

**Never measured here, and each needs something this account did not have:**

- Anything observed in a browser. Every source-derived claim is about call
  sites, not about what renders. **What was missing is now named rather than
  assumed** (4.47): the corpus's queue contradicts itself on the blocker, one
  paragraph reading the registry and concluding the key is present so the
  problem is a click in the extension's own interface, the next restating that
  the unblock is a native-messaging key copied from Chrome. Measured on the
  machine, both are part right. Brave carries
  `com.anthropic.claude_code_browser_extension` and not
  `com.anthropic.claude_browser_extension`, which is the host the tool that
  returns empty actually speaks to. One value, named. Writing it is a change to
  system settings and was left to kil.
- Any frequency in multilingual chat traffic. One single-channel Spanish
  capture's summary figures exist in the corpus's handoff of 2026-08-16
  (thesis 14.1); nothing about which languages appear.
- The on-device engine's availability across real installs.
- Store analytics, which need an account. **Not the same as absent**: the
  corpus holds one reading, an install ratio and listing views by language
  (the older journal's eighth pass, now cited in HANDOVER.md 3.5). They
  measure the listing, not the product in use. Published versions and user
  counts are on the public store pages and need no account at all.

## Open items handed to the developing account

In [HANDOVER.md](HANDOVER.md) section 8, ordered by value over cost. The
three to read first:

1. The frame tells every new session that a fresh clone has no harnesses. It
   has 56. Ten minutes, and it removes a false belief injected at the top of
   every pass.
2. The pause in the released build is a global, synced off switch, and the
   per-channel fix sits on an unmerged branch with one failing case (3.7).
3. `scripts/i18n-check.mjs` reports 150 missing keys per locale on files that
   are complete. Twenty minutes, and it repairs an instrument rather than a
   product.

## The rule this work kept re-learning

Written here because it is the one thing worth carrying into any continuation:

> A diagnosis propagates when something runs, not when it is written down.

This study wrote that sentence, published it, and then committed the same
diagnosis locally three more times. The corpus under study did the same over
six instances and three months. Neither account was careless. **Build the check
rather than the rule.**
