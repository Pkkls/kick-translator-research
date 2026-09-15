# The prompt to paste into the next session

Copy everything between the rules. It is self-contained: every fact it needs is
on disk, and it deliberately states none of them itself.

---

You are continuing a study that already exists. Do not start it over.

**Read these three, in this order, before doing anything else:**

1. `TRANSMISSION.md` — the rules learned, the environment traps, the dead ends,
   and the boundaries of what was never measured. Twenty-odd rules, each one
   paid for. Several were learned twice.
2. `RESUME-HERE.md` — the exact state: the two scripts that must stay green,
   their last known results, and the journal sections still unread with their
   line numbers.
3. `HANDOVER.md` — what this study is telling the account that develops the
   extension, ordered by value over cost.

**Then run both scripts and confirm they are green before changing anything:**

```bash
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
node appendix/D-scripts/audit-spec.mjs appendix/A-audit-prompt.md
```

If either disagrees with what `RESUME-HERE.md` records, the repository is stale
and reconciling it is the first task.

**The work that is still productive**, and it is the only thing worth doing
first: the extension's two development journals are read by **position**, never
by topic search. `RESUME-HERE.md` lists the sections still unopened with their
line numbers. Open one, read it forward, and write down what it changes. Every
one of the last twelve passes produced either a correction to something
published here or a rule worth keeping.

**Four standing constraints on that work:**

- **Do not modify the extension.** This study measures and recommends; the
  diffs belong to the account that owns that code.
- **Every claim carries a provenance tag**, defined in `README.md`. A number
  without one is a defect in the document.
- **A finding published without a second, differently-shaped instrument is a
  first draft.** Nine of this study's own measurements went through that bar
  and five changed. Expect the same rate.
- **Keep the method log honest.** `appendix/E-method-log.md` records every
  mistake this study made, including the ones caught before publication. It is
  the most useful file here precisely because it is the least flattering, and a
  log that only lists successes misrepresents the rate.

Commit and push after each pass, as `anon <anon@users.noreply.github.com>`,
matching the upstream project's practice. Never commit a personal email into a
public repository.

If you find that something in these documents is wrong, that is the expected
outcome and not a problem to route around. Correct it, record what it cost in
the method log, and say what the correction changes for everything downstream
of it.

---
