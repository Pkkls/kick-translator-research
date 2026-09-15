# Appendix C. Replication protocol

Every measurement tagged **[replicated]** or **[new]** in
[chapter 13](../thesis/13-results.md) was produced by one of the procedures
below. They are given so the numbers can be re-derived rather than believed.

The measurements tagged **[reported]** cannot be replicated from this
repository: they were taken on hardware and at commits this study has no
access to. Where a reported number could be approximated, the approximation is
listed as a separate item rather than presented as the same measurement.

---

## Prerequisites

A clone of the system under study, and a Node runtime. Nothing here needs the
ignored harness directory, which is why these are the measurements a stranger
can actually take:

```bash
git clone https://github.com/Pkkls/kick-chat-translator
cd kick-chat-translator
npm ci
```

Record the commit you measured at. A number without a commit is a number about
nothing:

```bash
git rev-parse --short HEAD
```

---

## C.1 Rendering surfaces and direction handling

Produces the figures in
[13.7](../thesis/13-results.md#137-observable-surface) and the corrected
measurement in [11.3](../thesis/11-privacy-surface.md#replication-bidirectional-text-new).

```bash
node appendix/D-scripts/probe-render-sinks.mjs /path/to/kick-chat-translator
```

Reports markup sinks, every text-node write, every direction-attribute
assignment, and whether any source references a direction-control character.
Exits non-zero if it found no text writes at all, so a silent no-op cannot pass
as a clean result.

**The classification step is manual and is the point.** The script reports call
sites; deciding which of them carry untrusted text requires tracing callers.
This study's first attempt skipped that step and published a wrong fraction;
see [appendix B](B-prompt-construction.md#what-pass-9-produced-and-what-pass-30-took-back).

To trace a surface's callers:

```bash
grep -rn "showError(" src/ --include="*.ts" | grep -v "export function"
```

## C.2 Page-observable signals

Produces the detectability table in
[11.2](../thesis/11-privacy-surface.md#replication-new).

Count the prefixed class names in the injected stylesheet:

```bash
grep -o "\.kt-[a-zA-Z0-9_-]*" src/content/inject.css | sort -u | wc -l
```

Find identifiers and attributes placed on nodes reachable from the shared
document root:

```bash
grep -rn "setAttribute(\|\.id = \|dataset\." src/content --include="*.ts"
```

Each hit needs classification: a signal the product requires, such as a class
name used for styling, is not the same as a convenience that happens to be
queryable.

## C.3 Gate coverage and orphans

Produces the figures in
[13.5](../thesis/13-results.md#135-verification-state) and the two-number rule
in [12.7](../thesis/12-verification.md#127-orphans-and-the-count-that-indicts-too-much).

Requires the harness directory, which a fresh clone does not have. On a machine
that has it:

```bash
ls scratchpad/harness/*.mjs | wc -l
grep -c "^  \['" scratchpad/harness/run-gates.mjs
```

For the orphan list, use the verifier rather than a pipeline:

```bash
node appendix/D-scripts/verify-handover-claims.mjs /path/to/kick-chat-translator
```

Its 3.3 claims count by the file each runner entry launches, inside the gate
array with comments stripped, and set aside runners and modules a gate imports.
The pipeline that used to stand here compared gate names with file names and
gave 35 where the answer is 29 orphans: a module counts as a harness, and a
harness that runs under another gate name counts as an orphan. It also breaks
silently in an environment that rewrites `ls` for display, where it once
returned 91 lines for 56 files.

**Do not report that count alone.** Read each entry and separate the documented
exclusions, which are live probes, image shooters and the runner itself, from
genuine orphans. Report both numbers.

## C.4 Interface localisation coverage

Produces the figures in
[13.6](../thesis/13-results.md#136-release-and-repository-state).

An existing script in the repository already computes per-locale coverage
against the declared key set, and running it is preferable to writing a second
instrument, for the reason given in
[12.8](../thesis/12-verification.md#128-the-derived-specification):

```bash
node scripts/i18n-check.mjs
```

For the store-facing locales, which are a separate and much smaller set:

```bash
for d in public/_locales/*/; do printf "%s " "$d"; node -e "console.log(Object.keys(require('./$d/messages.json')).length)"; done
```

## C.5 Release integrity

Produces the figures in
[13.6](../thesis/13-results.md#136-release-and-repository-state) and supports
the corrected bar in
[10](../thesis/10-latency-weight.md).

Version agreement across the places a version can disagree:

```bash
node -p "require('./package.json').version"
git tag --sort=-v:refname | head -1
gh release view --json tagName,assets
```

The published assets carry a content digest. That digest is what a rebuild
should be compared against, rather than a second local build; the reasoning is
in [appendix A](A-audit-prompt.md) under release integrity.

## C.6 Repository hygiene

```bash
git count-objects -vH
git branch -r | wc -l
git branch -r --merged master
```

The second number minus the first is not the finding. The finding is branches
that are merged and still present, which the third command lists.

## C.7 Detection tests

Produces the replication in
[13.5](../thesis/13-results.md#135-verification-state):

```bash
npx vitest run src/content/langDetect.test.ts src/content/langDetect.dix.test.ts src/shared/transliterationGuard.test.ts --reporter=basic
```

Green tests are not an observation of the running product
([ch. 3](../thesis/03-method.md)). This replication establishes that the
detection logic behaves as its authors asserted, and nothing about what a
reader sees.

## C.8 The specification audit

Produces the pass-16 result in [appendix B](B-prompt-construction.md):

```bash
node appendix/D-scripts/audit-spec.mjs appendix/A-audit-prompt.md
```

Checks the specification against the conditions it was built under: no
perishable facts about the repository, every axis carrying four fields, every
bar countable, every witness an action rather than a conditional, no
self-filling ceilings, line width, and the absence of banned constructions.

Its limits are the finding of
[appendix B](B-prompt-construction.md): every condition passed on a document
containing three requirements that could not be met.
**A mechanical audit of a specification cannot test the specification.**
