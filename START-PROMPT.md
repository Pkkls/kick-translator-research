# The prompt to paste into the next session

Copy everything between the rules. It is self-contained: every fact it needs is
on disk, and it deliberately states none of them itself.

**Send the `/goal` line first, on its own, then paste the rest.** The goal
installs a stop condition: the session cannot end while the condition is unmet,
which is what keeps the work going across context resets rather than stopping
at whatever felt like a natural pause.

The previous version of this file installed a goal that ended the moment the
journal reading list emptied. That list is empty. A stop condition that is
already satisfied is not a stop condition, so the one below is taken from the
specification this study wrote for itself, where it can be counted.

---

/goal Continuer l'etude par passes, chacune poussee. Une passe lit par position, ou execute un candidat, ou construit une verification qui manquait. Ne pas s'arreter tant que les trois conditions d'arret de appendix/A-audit-prompt.md ne sont pas toutes vraies, et les compter a chaque passe plutot que les estimer.

---

You are continuing a study that already exists. Do not start it over.

**Read these three, in this order, before doing anything else:**

1. `TRANSMISSION.md` — the rules learned, the environment traps, the dead ends,
   and the boundaries of what was never measured. Each one was paid for.
   Several were learned twice.
2. `RESUME-HERE.md` — the exact state: what is verified, the reading position in
   each corpus file, and the candidates.
3. `HANDOVER.md` — what this study is telling the account that develops the
   extension, ordered by value over cost.

**Then run the five gates and the two reports, and confirm the gates are green
before changing anything:**

```bash
git status --short
node appendix/D-scripts/check-links.mjs .
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
node appendix/D-scripts/audit-spec.mjs appendix/A-audit-prompt.md
node appendix/D-scripts/axis-ledger.mjs .
node appendix/D-scripts/probe-quotes.mjs . /path/to/kick-chat-translator
node appendix/D-scripts/probe-consistency.mjs . /path/to/kick-chat-translator
```

**Five of the seven must exit 0**: `git status` printing nothing, then
`check-links`, `verify-handover-claims`, `audit-spec` and `axis-ledger`.

`probe-quotes` never fails on a finding and is a report: it lists quotations it
could not match, and some of those are unmatchable by construction, from the
untracked specification, from commit messages, or because they quote this study
rather than the corpus. Read it and judge.

`probe-consistency` is both. Its ratio half is a report, for the same reason.
Its constant and duplication halves cannot produce a false positive, so it
exits 1 on either (4.76).

If any of the seven disagrees with what `RESUME-HERE.md` records, the
repository is stale and reconciling it is the first task.

## Where the work is, now that the journals are read

Both journals are read end to end. Three things are productive, in this order.

**The corpus files never read by position.** `RESUME-HERE.md` holds the table
with the current line. `.agent/PLAN.md` is read to L430 of 1287; `CHANGELOG.md`
has never been opened. Open by line number, read forward, write down what it
changes. Do not search by topic: in a chronological corpus the most relevant
passage is usually the one a later entry superseded, and that mistake has its
own entry.

**The candidates, when one appears.** The section in `RESUME-HERE.md` that
held two is empty of waiting ones: both were executed rather than re-read, and
both came back stronger than their reading. When a new candidate is recorded,
executing it is worth more than any amount of further reading, and the entries
say why.

**The verification that is missing.** This study's own closing lesson is *build
the check rather than the rule*, and it kept finding rules here with nothing
behind them. When you catch yourself writing a rule down, ask what would run.

## Where the work stands, so the first pass does not re-derive it

All 22 axes carry a verdict and **none is closed**, so the specification's first
stop condition is met and the other two are not. The two artefacts it asks for
by name exist: [appendix F](appendix/F-axis-ledger.md), the ledger, and
[appendix G](appendix/G-budget.md), the budget, whose set count `axis-ledger.mjs`
prints and checks rather than this file restating it (4.80). Ten
scripts, five of which exit non-zero on a failure. `RESUME-HERE.md` carries the
three findings that reach a reader and the two one-line items that are kil's.

**The productive work, in order.** Finish `.agent/PLAN.md` from L760, the four
Done sections. Read the 15 unread `CHANGELOG.md` sections against the source,
which is how 4.70 corrected this study's own laughter count and 4.71 settled
whether a version that was never tagged had shipped. Then close an axis: none of
the 22 is closed and A15 came nearest, its reproducibility half closed against a
published digest.

## What the last passes learned, so they are not learned again

Each of these cost a pass, and each is in `appendix/E-method-log.md` with what
it cost:

- **Open what surrounds a quotation before trusting it.** Three separate
  findings died on this in one pass, all three against sound work.
- **A fact arrives in a document through the argument that wanted it, and the
  place that wanted it is rarely the place that owns it.** One chapter carried
  a reverted constant while another chapter of the same study recorded the
  reversal correctly.
- **Measure a limit to its boundary rather than declaring it.** "Needs
  something this account did not have" sat in four documents for the length of
  the study and was one read-only query from being named.
- **An experiment is not specified until its inputs are.** A fully written
  witness turned out not to be runnable as one gesture, because the two gates
  it named do not read the same artefact.
- **A branch reads as intentional until it is placed beside its sibling.** A
  gate that cannot measure returns the same exit code as one that measured, in
  a file that already uses a different code for exactly that case eight lines
  above.
- **A suite built entirely of existence checks is blind to duplication**, which
  is what an editing mistake produces most often. That check exists now.
- **The first count is too high**, six times out of six in one session, and not
  from one cause. Publish no first count.
- **A hardcoded list of what to check is a promise to remember.** The gate that
  walks the tree is the one that never missed a file.
- **A check that cannot fail is read once**, by the session that wrote it. And a
  check whose bug makes it throw is safe; one whose bug makes it pass is worse
  than no check.
- **An empty report is a statement about the instrument's reach**, not about the
  document. Ask what the instrument cannot see in the same pass that runs it.
- **Nothing carries a correction between documents**, in either direction.
- **Finish the file before measuring what the file is about.**

## Four standing constraints

- **Do not modify the extension.** This study measures and recommends; the
  diffs belong to the account that owns that code. Building it, copying a build
  and running its harnesses against the copy is measurement and is allowed.
  Editing its `src/` is not.
- **Every claim carries a provenance tag**, defined in `README.md`. A number
  without one is a defect in the document. None of them certifies that the
  measurement was competent, which chapter 14 states and which is why the
  replication bar exists separately.
- **A finding published without a second, differently-shaped instrument is a
  first draft.** Nine of this study's own measurements went through that bar
  and five changed. Reading the same code twice is one instrument, not two.
- **Keep the method log honest.** It records every mistake, including the ones
  caught before publication and the ones this session made and pushed. It is
  the most useful file here precisely because it is the least flattering.

Commit and push after each pass, as `anon <anon@users.noreply.github.com>`,
matching the upstream project's practice. Never commit a personal email into a
public repository.

If you find that something in these documents is wrong, that is the expected
outcome and not a problem to route around. Correct it, record what it cost in
the method log, and say what the correction changes for everything downstream
of it.

---
