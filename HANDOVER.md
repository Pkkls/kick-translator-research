# Handover to the account that builds this

Paste this whole file. It is written to be read once, acted on, and thrown
away; nothing in it needs to survive in your repository.

Everything it asserts stands on its own, so it is usable with no other file
open. The links in section 10 point into the repository this came from, and
they are an offer rather than a dependency: if you do not have that repository
to hand, the file still works, you simply cannot follow them.

---

## 0. Who is writing, and why that changes how to read it

A second account read your notebooks. Not the code first: the work queue, the
two daily journals, the changelog, the standing frame. Then the sources, then
what could be re-run.

That position has one advantage and one disability, and both matter for what
follows.

**The advantage is distance in time.** You wrote those entries across three
months, each one to be acted on that day. Read in one sitting, they contain
patterns no single entry contains, because the instances are months apart and
on unrelated subjects. Section 2 is three of those, and they are the reason
this file exists. They are not new information: every fact in them is already
in your own writing. What is new is that they are next to each other.

**The disability is that almost nothing here was witnessed.** Your numbers were
taken on your machine at commits that have moved. This account re-ran what a
clone can run and read sources for the rest. Nothing was observed in a browser.
Every claim below is tagged so you can tell which is which:

- **[yours]** from your notebooks. Repeated back, not verified.
- **[re-run]** executed here against a clone. The command is given.
- **[read]** derived from reading sources. Not observed running.
- **[mine]** analysis, not measurement. Argue with it.

A claim with no tag is a defect in this file.

**Do not take the ordering on trust either.** It is by expected damage, and
damage here is a judgement about how many readers meet a thing, multiplied by
how little they can tell it happened. The second factor is defensible from your
own architecture. The first is a guess, and it stays a guess until section 5
gets unblocked.

---

## 1. Check these four before reading further

Four minutes. If any of them contradicts what follows, stop reading and trust
your machine over this file.

Or run the whole thing at once. Every measurable claim below is re-derived by
one script, which prints expected against actual and lists what it cannot
check rather than skipping it:

```bash
node appendix/D-scripts/verify-handover-claims.mjs /path/to/this/repo
```

It reports 59 of 59 holding at the commit this was last checked against, and 4
claims as unverifiable from a clone. If it reports anything else, this file is
stale. The script checks that sentence too: it compares the two numbers above
with its own totals, because the sentence still said seventeen after the script
had grown to thirty-two.

The four checks by hand, one command per line:

```bash
node .agent/state.mjs --texte
npx vitest run src/content/langDetect.test.ts src/shared/transliterationGuard.test.ts --reporter=basic
grep -rn "\.dir\s*=\|setAttribute(\s*['\"]dir" src/content --include="*.ts"
grep -rn "setAttribute(\|\.id = \|dataset\." src/content --include="*.ts" | wc -l
```

The third and fourth commands are the evidence for sections 3.1 and 3.2. They
are the ones most likely to be stale, because they are the ones this account
touched last.

---

## 2. Three things your notebooks say that no entry in them says

### 2.1 You have diagnosed the same defect three times, in full generality,
and applied it locally each time

The instances, in your own words and in your order:

1. **Persian answered as Arabic.** Twelve of twelve, as a confident source.
   Diagnosis: a writing system is not a language. Fix: the Arabic script.
2. **Mongolian, Ukrainian and Bulgarian answered as Russian.** Twenty of
   twenty, eight of eight, eight of eight. Your journal says it outright:
   *"C'est exactement le defaut arabe/persan corrige plus haut dans la
   journee, sur une autre ecriture."* Fix: the Cyrillic script.
3. **The emoji that diluted a script.** Your own note on the earlier jamo fix
   already carried the general statement: *"those letters counted toward the
   total while feeding no script."* That sentence is the emoji defect, written
   correctly, before the emoji defect was found.

All **[yours]**.

Three correct general diagnoses. Three local applications. The third one had
its general form sitting in a comment in the code for weeks.

There is a fourth instance, outside language detection entirely, which is why
this is worth raising as a pattern rather than as a detection problem. Your
manifest comment gives the reason web-accessible resources were removed:
*"Ce qui restait listé donnait a n'importe quel script d'une page kick.com une
URL stable a interroger pour confirmer que l'extension est installee."* The
diagnosis is general: the page must not be able to query for us. Applied to one
vector. **[read]** Four others are still there, and section 3.2 lists them.

A note on the two quotations in this section and the one above. Both are
verbatim from your files, in the language you wrote them in, checked against
the source rather than retyped from memory. An earlier draft of this file
rendered the manifest one in English, which would have read as a quotation and
been a paraphrase. That is the failure mode section 8 puts fourth, and it was
caught by looking rather than by rereading.

**What this costs and what closes it.** Nothing in an ordinary workflow forces
a diagnosis and its remedy to be reconciled, because the diagnosis lives in
prose and the remedy lives in a diff. The cheapest discipline that catches it:

> When you fix something, write down the population the diagnosis covers, then
> count what fraction of that population the fix reaches. A guard is a
> fraction, never a presence. One occurrence reads as "handled" to a search and
> as "handled in one place of several" to a count.

That rule found the fourth instance, and it found a fifth in your handoff: your
incoming path deletes mentions, your outgoing path masks and restores them.
Two opposite theories of the same object, each satisfying its own tests
**[yours]**.

And a sixth, this one in running code rather than in your notes: the worker
lifecycle hazard was diagnosed and fixed for the metrics module, which merges
rather than overwrites, and for the content script, which survives a cold
worker. The usage-statistics tracker is the third consumer of that same
lifecycle and got neither treatment. Section 3.5c.

Six instances, on six unrelated subjects, over three months. At that count it
stops being a series of oversights and becomes a property of the workflow: the
diagnosis is written in prose, the remedy is written in a diff, and nothing
holds the two together afterwards.

**Before you read that as criticism, here is the control.** This account
produced three instances of one diagnosis of its own inside a single session,
while writing the section you are reading: counting a structure by matching
text near it, done three times after writing down the rule against it and
publishing that rule. Same shape, faster, by someone actively hunting for the
pattern in your work.

So the recommendation is not "be more careful", which demonstrably does not
work even under ideal conditions. It is that a diagnosis propagates only when
something runs. Yours already has the machinery: `state.mjs` generates rather
than asserts, and your gates fail rather than remind. The class of defect in
this section is the class that has no gate, and the cheap move is to give each
one a check rather than a sentence.

**You have already applied that cure, which sharpens what is missing.** Your
sixth pass on 2026-08-30 found the same mute gesture in three live harnesses,
two of them beside a comment describing the trap, and diagnosed it in one line:
the gesture was copied instead of shared. It moved into one module, and the
sweep that found the dead selectors became a gate **[yours]**. Both are there:
`kick-actions.mjs` is imported by all three harnesses, and by a fourth, the
offline translation gate written that evening, which reused the module rather
than copy the gesture again; `audit-selecteurs` is an entry in the runner
**[re-run]**. Seven hours later your twenty-sixth
pass found the same mechanism in a different pair of files: the fixture
screenshot harness had drifted to a scale factor its sibling's comment warned
against **[yours]**. That one was repaired with a check that reads the
dimensions out of the PNG, now present in both **[re-run]**.

**[mine]** So the remedy is known and practised, one instance at a time. What
the pattern lacks is the step between the diagnosis and the diff: when a
diagnosis names a mechanism, *copied instead of shared*, enumerate the other
copies before closing the one in front of you.

### 2.2 You have made the same reasoning error three times, and measurement
caught it every time

1. **The arabizi grid** scored 0 of 5 for returning no language. Measured
   properly, an absent language costs nothing on the engine path; the harm was
   in the filters, where an allowlist user lost the messages they had asked
   for.
2. **The keyboard-smash prior** said eleven of fifteen were already dropped.
   Measured directly: zero of eleven.
3. **Malay and Hebrew** were framed as two broken languages. The probe
   corrected it: an unidentified language goes out with `sl=auto`, so those
   messages were translated all along. What the fix buys is a correct source
   and a correct badge.

All **[yours]**.

The shared structure: each assumed that a component's failure implied a
user-visible failure, without tracing the component's output to an outcome. In
a pipeline with defaults and fallbacks, that inference does not hold, in either
direction. It over-states harm as often as it under-states it.

The discipline: **establish severity at the output, never at the failing
component.** Your probes already do this when you write them. The error appears
in the interval between noticing something and writing the probe, which is
exactly where a prior gets published.

### 2.3 The same linguistic rule, derived twice, stated in neither place

The transliteration marker table excludes `kawaii`, `sugoi`, `senpai`, `baka`,
`desu`, `sensei`, `malaka`, because English internet slang has adopted them. A
test enforces a five-letter floor to keep that door shut **[yours]**.

The laughter lexicon excludes `haha`, `lol`, `xd`, because they are used
everywhere **[yours]**.

Same rule: **global adoption destroys diagnosticity.** Whether you saw the
connection at the time is not something this account can know; what is
checkable is that neither entry references the other, and that the rule is
written nowhere as a rule. Two independent derivations on different problems is
the closest thing a single project gets to replication, and naming it once has
a consequence neither instance draws:

**It is a decay function, and nothing in the system measures it.** The
five-letter floor is a proxy for "not yet borrowed", and it is a good one today
because borrowing favours short, salient, phonologically simple items. It will
fail for the next six-letter word that goes global. No alarm exists for a
marker becoming ambiguous, and the cheapest version of one is a dated
re-attestation note per entry, which your laughter table already has the field
for.

---

## 3. What this account measured that you have not

### 3.1 Direction handling, and the correction that matters more than the
finding

**[read]** Start with the correction, because it is the useful part.

The first probe here looked for a direction attribute near each write of
untrusted text and reported **one guarded surface of three**. That number was
wrong. A second probe, looking for the attribute on the element rather than
near the write, found `composeUi.ts` setting `dir='auto'` at construction on
line 69, 111 lines above the write on line 180 that fills it: **two of
three**. Tracing the third surface, `showError`, to its callers in
`pipeline.ts` showed it receives either an internal ASCII error code or a
localised interface string, never chat text or provider text: **the population
is two, and both are guarded.**

Three levels of rigour, three answers, on a question that looked binary. The
coarse probe was the alarming one, and that ordering is not chance: a probe
finds a guard missing wherever it fails to look properly, so its errors are
biased toward accusation. Your frame already warns about this and this account
walked into it anyway.

Two things survive the correction, and they are smaller and real:

**No source file neutralises or isolates direction-control characters inside
rendered text, anywhere.** `dir="auto"` gets you `unicode-bidi: isolate` from
the user-agent stylesheet, so a line cannot reorder its siblings. It does not
stop an override inside the text from reordering the rest of that element's own
content. For a product whose purpose is rendering text faithfully, the outgoing
preview is the sharp case: it is the surface on which the reader decides what
to send. **[mine]** What a reader actually sees needs a browser; this account
read sources.

**`showError` renders localised interface strings with no direction
attribute**, and your interface ships an Arabic locale. That is interface i18n,
not hostile input, and it is a one-line fix.

**Markup is closed.** Every sink for chat or provider text is a text node. The
single `innerHTML` in the content sources takes an internal icon table into an
SVG element **[read]**.

### 3.2 The detectability door, on its cheap side

**[read]** Page-queryable signals that confirm the extension is installed:

| Signal | Where | Cost to a page script |
|---|---|---|
| `kt-inject-style` | a `<style>` element on the document element | one `getElementById` |
| `data-kt-scheme` | an attribute on the document element | one attribute read |
| `kt-hide-original` | a class toggled on the document element | one `classList.contains` |
| `kt-compose-bar` | an element id on `document.body` | one `getElementById` |
| `kt-floating-bar` | an element id | one `getElementById` |
| `kt-float-lang-menu` | an element id | one `getElementById` |
| `kt-lang-chip` | an element id on `document.body` | one `getElementById` |
| `kt-lang-menu` | an element id on `document.body` | one `getElementById` |
| `kt-lang-list` | an element id | one `getElementById` |
| `data-kt-id` | an attribute written onto the host's own chat rows | one attribute selector |
| 98 class names sharing a fixed prefix | injected stylesheet | one class selector |

Every one is a string literal in the source. None is generated at runtime, so
none varies between installs or sessions: a page script can hard-code any of
them **[re-run]**. One further id, `kt-metrics-dump`, exists only in the
instrumented build and your release check keeps it out.

The vector you removed required a network fetch. These require one synchronous
call.

**Credit where this section was unfair.** An earlier draft implied you had
closed one vector and left the rest unexamined. You did more than close it:
the journal's pass twelve establishes that the content script fetches nothing
at runtime, zero `getURL`, zero dynamic import, all 22 stylesheet `url()`
inline as `data:` SVG, then removes six reachable resources, then **builds a
gate**, `extension-load`, which asserts the manifest exposes nothing, with two
witnesses: pointing `content_scripts` at a missing file, and re-exposing one
chunk.

So the manifest half of this question has a mechanism and is guarded. The
eleven signals above are the other half: they are DOM identifiers, and nothing
asserts anything about them. That is the honest shape of the finding, and it is
smaller than the earlier draft implied.

**Your own note raises the stakes above privacy, and it is the reason to care.**
Pass twelve says detectability is worth more here than in most extensions,
*since this site already walls off what it detects*. That reframes it: an
identifier a page can query is not primarily a privacy matter for the reader,
it is a **product-survival** matter for you. A stable name is what a
countermeasure keys on, and it costs one line for them to write and a release
cycle for you to answer.

That argues for treating the eleven as the manifest was treated: enumerate,
remove what is not required, and put a gate behind the result so the count
cannot creep back.

**A correction this section owes you.** It first listed four signals, from a
probe that read three files. Reading all nineteen content-script files gives
the eleven above. The published number was low by a factor of two and a half,
and the error ran toward under-stating rather than toward accusation, which is
the opposite direction from every other probe error in this document. See
section 6.

**[mine]** The bar you were holding, which this file's companion specification
held too until it was executed, is unachievable: an extension that renders
visible content is always findable by a page script willing to read the screen.
The achievable bar is about cost:

> Finding the extension should cost a page script a read of rendered content,
> never a query by name. Every remaining shortcut is either required by the
> product, with the requirement written next to it, or gone.

Under that bar the four this section first listed divide cleanly. Class names
are required. The processed marker is arguably required, though a `WeakSet` or
a non-enumerable property would serve. The fixed stylesheet id and the document
attribute are conveniences with queryable names. The seven found later, six ids
on elements the extension renders itself and a class toggled on the document
element, have not been sorted against the bar here; that is the same judgement
applied seven more times, and it is yours to make.

### 3.3 Smaller, verified, low damage

**Interface localisation: this account published a false accusation here, and
the retraction is the useful part.**

The claim was that each language file carries 34 of 155 declared keys, with the
rest falling back to English. **That is wrong. Every locale file carries all
155, and the coverage is complete [re-run].** The probe counted only unquoted
keys at one indentation level; 121 of your 155 keys are quoted, because they
are whole English sentences with spaces in them, and it missed every one.

Nothing was wrong with your localisation. An outside reader accused finished
work of being 22 percent done, for two hours, in a public repository.

**What the replication found instead is a real defect, and it is yours.**
`scripts/i18n-check.mjs` reports **5 keys and 150 missing per locale**, and
lists as missing keys that are plainly present in the files: `'options &
preferences'`, `saved`, `ready`, `Providers`. Run it and read the output:

```bash
node scripts/i18n-check.mjs
```

It reports near-total absence on files that are complete. Whatever its parser
does, it is not reading the locale objects. That matters more than a coverage
number, because this is the instrument anyone would trust to answer the
question, and it answers it wrongly in the alarming direction. It is the thing
that would tell you a locale had regressed, and it cannot.

**[read]** The distinction worth keeping: an instrument nobody runs is a known
hazard, recorded in section 4. An instrument that runs and lies is worse,
because its output is evidence. This one produced 150 false missing-key reports
in a single run.

**[re-run]** Nine remote branches, seven already merged into master.

**[re-run]** Version agreement across package, tag and published archives is
consistent. Your release assets carry a per-asset content digest, which is a
better reproducibility check than two local rebuilds compared to each other:
it also proves the artefact people download is the one the tag describes.

**[re-run]** 56 `.mjs` files in the harness directory and 40 runner entries.
Counted by the file each entry launches, 22 files run and 34 do not. Of the 34,
two are runners and three are modules a gate imports, `playwright`, `a11y` and
`kick-actions`, which leaves **29 orphans**. **Do not read that as a finding
either.** Most are your documented exclusions, live probes and shooters. The
number that would be a finding is *orphans with no written reason*, and
producing it means reading each exclusion; this account tried to classify them
by content and could not, because your offline gates serve kick.com URLs from
fixtures, so a URL does not say which world a harness runs in.

**A correction, and it lands on your generator too.** This file said 35. Its
recipe compared gate names with file names, which counts a module as a harness
and misses a gate whose name is not its file: `store-shots-fixture.mjs` runs on
every pass as `captures-readme`. `state.mjs` makes the same comparison and
writes 32 orphans into `ETAT.json`, three of which are `a11y`, `kick-actions`
and `store-shots-fixture`. Its exclusion list names three infrastructure files
by hand and dates from 08:39 on 2026-08-30; `kick-actions` arrived at 15:46 and
`a11y` at 16:22 the same day, and neither was added **[re-run]**. The three
counts reconcile to the same 29, item by item **[re-run]**. Ten minutes: compare
the scripts each entry launches, and derive helper modules from imports rather
than from a list.

### 3.4 Two questions this account opened and closed with nothing

Negative results, reported because a closed question is worth as much as a
finding and because you would otherwise spend an afternoon reaching the same
place.

**Silent failure paths: nothing to report.** The hypothesis was that a
`catch` that swallows an error on the message path loses a reader's message
with no trace, which is this product's worst damage class. Measured **[read]**:
42 `catch` blocks in the sources, 24 producing a log, a metric, a UI change or
a propagated error. Of the 18 remaining, 2 are on the message path, and both
turned out to be deliberate: one captures the error into a variable the caller
reads, the other returns an empty string as a documented degradation. Nearly
every one of the other 16 carries a comment saying why the silence is correct,
in your own words: *invalid selector, ignore*; *storage unavailable, non-fatal*;
*invalid regex char in user input, skip silently*. The question is closed.

**Declared traffic matches the code: nothing to report.** **[read]** The built
manifest declares **8** host permissions, and every one is named in
`PRIVACY.md`. Every `https` host reachable from the sources is either one of
them or a link rendered in the options page: the repository, the privacy
document, the issue tracker, the provider's developer page. No undeclared
network destination. The question is closed.

An earlier version of this paragraph said ten. That number came from a regular
expression over the manifest source, which also matched the two entries of the
content script's `matches` block. The correct way to count a manifest is to
read the built `manifest.json`, which is structured data, rather than to
pattern-match the TypeScript that generates it. Same mistake as the gate count
in section 6, two hours apart.

**Marked debt: none.** **[re-run]** Zero `TODO`, `FIXME`, `HACK` or `XXX`
across 89 source files. Your deferrals live in `PLAN.md` with their
measurements rather than as comments that rot. That is unusual enough to be
worth saying out loud, and it is why the handover has no debt section.

### 3.5 One number worth having before the capture arrives

**[re-run]** 18 of your 42 languages are named in `langDetect.ts`. An earlier
version of this section concluded that the other 24 rest entirely on the
statistical identifier. **That conclusion was wrong: the figure is 17.** Seven
more are marked elsewhere in the detection chain, in the laughter lexicon, the
romanisation table and the filters, which a count over one file could not see.
Counting across the chain gives 25 of 42 with a marker somewhere.

The seventeen with no marker anywhere:

```
pt-br  nl  pl  cs  sk  ro  vi  fi  hu  ca  sl  et  lt  lv  bn  ta  tl
```

**[mine]** That list is a map rather than a defect, and it is sharper than the
wrong one was. Every failure in section 2.1 was a language sharing a script
with a larger neighbour and needing an explicit marker to separate from it.
Read the list with that in mind and it sorts itself: `pt-br` against `pt`,
`cs` against `sk`, `lt` against `lv`, `ca` against `es`, and a block of
Latin-script European languages against each other. Those are the shapes that
produced Persian, Mongolian and Bulgarian, and they are where the next one is.

It is also the cheapest way to prioritise the capture in section 5: the capture
says which of the seventeen actually appear in your chat, and a list becomes a
queue.

**Your own listing export already orders part of it**, and this file had not
used it. Your eighth pass on 2026-08-30 counts views by localised store page:
English 227, Turkish 30, Arabic 18, Czech 14, Russian 6, Japanese 5, Chinese 3,
Korean 2 **[yours]**. Czech is on the list of seventeen and drew the fourth most
views before it had any listing text. Polish is on the list too, and was the
largest gap your earlier pass inferred from countries; it drew none.

**[mine]** How much that ranks the list is limited, and the limit is specific.
A listing view says which interface language a prospective reader browses in,
not which language the chat they read is written in, and only the second one
reaches the detector. It is still the only population figure in the corpus, it
cost nothing, and it points at `cs` against `sk`, which is one of the shapes
this section already names.

### 3.5b Two axes measured from a build, both clean

**[re-run]** Cloned, installed and built both targets from scratch.

| | |
|---|---|
| Injected script, raw | **233 601 bytes** |
| Injected script, gzipped | 100 982 at `-1`, **90 425 at the default**, 90 198 at `-9` |
| `content.js` from the Chromium build and the Firefox build | **byte-identical**, same sha256, with `dist` deleted between them |
| Same hash from a second clone, built an hour apart | **yes**, so the build reproduces across clones |
| Divergence between the two builds | confined to the manifest: background as service worker against scripts array, plus the gecko block |
| Built manifest host permissions | 8, matching the source exactly |
| Web-accessible resources | none |

The identical content script is the result worth keeping. It means anything
verified about the injected code on one engine holds on the other, so the
cross-browser axis reduces to the manifest and to the runtime APIs, which is a
much smaller surface than it looks from outside.

Two notes on those numbers, both of which this account got wrong first.

**The gzipped figure was first published as a single number.** It is not one:
it moves 12 percent between compression levels, and the level was not stated.
Compare against your own gate's periphery and its own level, not against a
number whose parameter is missing. The raw size is the parameter-free one.

**Your weight gate fails in one direction.** `audit_poids.py` exits 1 when the
injected script grows past its two percent margin and never when it shrinks
**[re-run]**. Your twelfth pass records a first reading of a 12 percent drop
that went unnoticed for that reason **[yours]**. That reading was a character
count and there was no drop, but a real one of that size, a module the bundler
quietly left out, would pass the same way. **[mine]** A lower bound costs one
comparison, and a sudden loss of bytes is as much a signal as a gain.

The same file's header says how to buy the margin back: swap the identifier for
a lighter one, thirty kilobytes, *si l'experience de justesse tourne en sa
faveur. Elle n'a pas encore tourne* **[re-run]**. Its result was committed
eleven minutes after that comment: the stake measured at 93703 bytes rather
than thirty kilobytes, and the swap refused **[yours]**. The comment is the frame's
problem in section 3.6 on a smaller file: a state written as a fact, true for
eleven minutes, telling the next reader that a refuted route is still open.

**The build measurements above never recorded the toolchain.** Neither the
Node version nor the package manager's was written down when the hashes were
taken, and the machine this account uses runs Node 22 today **[re-run]**, where
your `.nvmrc` pins 20 and CI builds on 20 **[re-run]**. Your fourth pass on
2026-08-30 found exactly that drift in your own releases: the 2.9.x packages
went out built on 22, nothing objected because `engines` allows both, and your
packer now prints the running version beside every hash **[yours]**. Your
release entry for 2.10.0 records the packer's warning and draws the conclusion:
every archive built on that machine, the published ones included, is not
bit-for-bit reproducible with CI **[yours]**. So
"reproducible across clones" above is reproducible on one machine's Node, and
it says nothing about a build on the pinned version. Same class as the gzip
figure, a number without its parameter, and it went unnoticed for the same
reason: the figure held, so nobody asked what it held under.

**The identical hash was first taken without deleting `dist` between builds**,
which leaves open that the second build reused output rather than rebuilding.
Re-run with the directory removed, it holds. It also holds across two separate
clones built an hour apart, which is a stronger statement than the one
originally made: the build is reproducible, not merely consistent within a
working tree.

### 3.5d The day boundary is UTC, which is a decision you may not have taken

**[read]** `stats.ts` keys the day with `new Date().toISOString().slice(0, 10)`.
That is UTC. The popup shows the day's request counts and a seven-day trend, so
"today" resets at 09:00 for a reader in Tokyo and at 16:00 for one in Los
Angeles.

It is stated here as a fact rather than a defect, because UTC is a defensible
choice: it has no daylight-saving discontinuity and no ambiguity about which
zone a shared counter belongs to. The reason it is worth raising at all is that
`toISOString` is also the shortest path to a `YYYY-MM-DD` key, so the choice
and the convenience are indistinguishable from the outside, and only you know
which one it was.

Two things follow whichever way you decide. If UTC is intended, the popup
should not call it "today" without qualification. If local was intended, the
rollover in `load()` and `rollover()` both compare against the same UTC key
and would need to change together.

One thing is genuinely good here and was clearly deliberate: `load()` handles
the day changing while the worker was dead, archiving the outgoing day before
resetting, with a comment saying so. That is the hard half of a day boundary
and it is done.

### 3.5c The worker's startup race, on its third consumer

**Before anything else: this is not the startup race you already eliminated.**
Your journal has a section called "La course au demarrage, hypothese eliminee",
which measured six arrivals on real channel pages in Brave, used `data-kt-id`
as the witness, and found the observer attached first time on 3 of 3 pages that
had a chat. That is the content script attaching to a route, and it is closed.

The one below is a different object: the **service worker's** initialisation
against its own message listener, and the consumer is the usage-statistics
tracker. Nothing in that measurement touches it. If this section reads as
something you already settled, that is this account's fault for the collision
of names, not a reason to discard it.

**[read]** Read rather than observed, and the window is narrow. Stated anyway,
because it is the sixth instance of the pattern in section 2.1 and the first
one this account found in running code rather than in your notebooks.

`background/index.ts` line 183 starts initialisation without awaiting it, and
line 186 registers the message listener synchronously on the next statement.
So on a worker wake the listener is live while `init()` is still inside its two
storage reads. A `translate` or `stats.local` arriving in that window reaches
`recordRequest`, which increments a `state` still holding `empty()`, and arms
a 1500 ms flush.

Two outcomes, and only the second loses anything:

- `stats.load()` resolves first, replaces `state` with what was stored, and the
  increment taken in the window is lost. One or two counts. Nobody notices and
  nobody should.
- The flush fires first and `persist()` writes `empty()` plus that increment
  over the stored day. **The day's counters go back to near zero.**

The window is two storage reads against 1500 ms, so the second outcome should
be rare. It is also invisible: a counter that regressed looks exactly like a
quiet day, which puts it at the top of your own silence scale.

**Why it is worth more than its severity.** You have already solved this
problem twice. `shared/metrics.ts` merges into stored state instead of
overwriting, with a comment explaining that summaries cannot be folded. Your
item 109 made the content script survive a cold worker. `stats.ts` is the third
consumer of the same lifecycle and did not get the same treatment: it
overwrites, and its load is not awaited before the listener goes live.

The remedy is the one your metrics module already implements. Either merge on
write the way metrics does, or hold a readiness promise the listener awaits
before touching state. The second is smaller and also fixes the settings read
on the same line.

**What would settle it**, and this account could not: wake the worker
artificially between two messages and read the stored counters. Your gates run
a browser; this reading does not.

### 3.6 Your frame tells every new session something false

This is the most actionable item in this file and the cheapest to fix.

**[re-run]** Cloned your public repository, at the commit your frame ships at,
into an empty directory:

| | |
|---|---|
| `npm ci` | succeeds |
| `npm run typecheck` | no errors |
| `npm run lint` | no issues |
| `npm run test` | **1034 passed, 0 failed** |
| Harness files present | **56** |
| Audit scripts present | **8** |

Your frame's gates section says the opposite: that the directory is gitignored,
that *"a fresh clone has no gates, no harnesses and no audits at all"*, and that
the reader should go and read the first open item in `PLAN.md`, *"which is
this problem"*. Your `.gitignore` lines 26 to 29 are the exceptions that track
those files. Your plan records the decision as done. The frame was not updated.

**What it costs.** Every session that reads the frame starts believing it has
no gates, and the frame explicitly tells it to go read a resolved item as if it
were open. That is a wrong belief injected at the top of every pass, in the one
file designed to be the only thing a session is given.

**Why it is worth more than the ten minutes it takes to fix.** That file opens
by saying it contains no fact about the repository, because every such claim
rots, and gives a list of four claims from an old handoff that were all wrong.
It then carries a fact about the repository, and that fact has rotted. The rule
is right and stating it was not enough to enforce it. The mechanism that would
have caught it is the one you already built: `state.mjs` generates what is
true, so *"the harness directory is tracked, N files"* belongs in `ETAT.json`
and the frame should point at it rather than assert it.

**The rest of that axis is a clean pass, and it deserves saying.** The gates
need a browser driver, which is deliberately not a dependency because CI never
runs them. Run one without it and the runner **exits non-zero**, names the
cause and offers three ways to supply it **[re-run]**. The failure this axis
exists to catch, a newcomer seeing a green that is empty, does not happen here.
The suite refuses rather than pretending, which is rarer than it sounds.

**One thing that pass did not check, and your eleventh pass is why it matters.**
That pass moved the offline gates from the system Chrome to the bundled
Chromium, and gave reproducibility rather than speed as the reason: the gates
assert pixels, two browsers are two version streams, and *the bundled one is
pinned by `package.json` and is the same everywhere* **[yours]**. No tracked
file pins it. Playwright has never appeared in `package.json` or in the
lockfile in the repository's history, and the resolver's own message says it is
not a dependency: it loads whichever `node_modules/playwright` an environment
variable, a local kit path or a local install supplies **[re-run]**. Nothing
records which version a run used, not the runner, not the resolver, not
`ETAT.json` **[re-run]**. Your second pass that same morning had decided it on
purpose, and written why: CI never runs these gates, so a devDependency would
pull browser binaries into both installs for nothing **[yours]**. The sentence
in the eleventh pass contradicts a decision nine passes older, which is why it
reads as a slip rather than a design, and why the missing record matters more
than the missing pin.

**The replay rule, from the day after your weather sentence.** A pooled run
failed one gate on an aborted navigation, passed replayed alone, and the entry
concluded parallelism and set the rule that a red under pooling is replayed
alone before it is believed **[yours]**. Pooling is the runner's default, and
nothing keeps a replayed red **[re-run]**. **[mine]** Keep the red anyway: one
line appended per replayed failure, with its error. The explanation may be
right, and a second identical line is then the difference between weather and a
race that only shows under load.

**[mine]** So the pin, if there is one, lives in whatever folder supplies
Playwright on your machine. A clone that takes the third route the resolver
offers, `npm i -D playwright`, gets the version npm resolves that day, and its
pixel assertions are measured on a browser nobody wrote down. The cheap half is
to write the browser version into `ETAT.json` and print it at the top of each
run, so a pixel that moved can be told apart from a browser that did.

**Two smaller things from the same run, both in the README.** It states 1032
unit tests; the clone runs **1034**. It states 39 offline gates; the runner
holds **40** **[re-run]**. Neither is important on its own. What they have in
common is that they are facts in a reader-facing document with nothing
watching them, which is the same class of defect as 3.6 and has the same cheap
remedy: a gate that reads the numbers out of the thing rather than out of a
sentence.

### 3.7 The pause in your released build is still a global switch

**[yours]** Reported on your own build: pausing translation on one stream
turned it off on the next. Your newer journal diagnosed it as the bar's pause
writing `settings.enabled`, global and synced, confirmed it in Brave on master,
and wrote the fix: a per-channel pause read through one derived view. The fix
sits on `feat/nav-monde-isole`, kept off master deliberately, because one case
of four fails: returning to a channel that is still paused reactivates it, and
the cause was not located.

**[re-run]** Both halves are where the journal left them. In `v2.10.0` and on
master the handler is `onToggle: (enabled) => void patchSettings({ enabled })`,
and settings are written to `chrome.storage.sync`. A pause on one stream is a
pause on every stream, in every tab, on every browser the reader syncs.
`pausedChannels` exists only on the branch, which is unmerged. And no store
reader has 2.10.0: your newer journal read the stores at 2.9.2 on Chrome and
2.7.0 on Firefox **[yours]**, and both tags carry the same handler **[re-run]**.
Every version any reader can have writes the global switch.

**[mine]** Holding a fix that fails one case of four is a defensible call, and
it is yours to make. What this file can add is the comparison: the branch's
failing case is a paused channel that comes back on when revisited; the
shipped behaviour is every channel going off, which is the report. Section 8
recommends against work on your branches, and was written about the seven that
are merged. This is one of the two that are not.

**The gate that let the other half of that report through.** The navigation
mode of `translate-offline` stayed green while route re-attachment was dead,
because it asserts one effect of a channel switch, that the next message is
translated, and the observer's own safety net kept that one alive **[yours]**.
On master it still asserts only that **[re-run]**. The harness that asserts all
four effects, `nav-monde.mjs`, is in no runner, on master or on the branch
**[re-run]**. Your journal says it plainly: a gate that asserts one effect among
four stays green while the other three break, and its name says the opposite.

---

## 4. Six rules, each with the measurement that produced it

Offered as rules because each one cost something to learn. Reject any of them
that does not survive contact with your machine.

**A ceiling written after the measurement is green by construction.** A first
version of the companion specification ended seven bars on "under a stated
ceiling", which the agent fills in after measuring. Budgets belong in a tracked
file, written before, with raising one requiring a sentence in the journal and
lowering one requiring nothing.

**A guard is a fraction of the surfaces that need it.** Section 2.1. It found
the detectability vectors and the direction gap.

**Severity is established at the output.** Section 2.2.

**A count over a population with documented exceptions reports two numbers.**
The adjusted count is the finding; the raw count sits beside it so nobody has
to trust your filter. A single number that mixes them is an argument, not a
measurement. Section 3.3 is this account failing the rule and then writing it.

**Look for the instrument before building one.** This account reimplemented
`i18n-check.mjs` before finding it. The corollary is sharper than the rule:
**an instrument that exists and is in no runner is worse than one that does not
exist**, because its presence reads as coverage. Your own `bar-panel-live`
history is the proof, and it is why `ETAT.json` listing uncovered harnesses is
load-bearing rather than tidy.

**A specification you have reviewed is not a specification you have tested.**
Sixteen review passes over the companion specification found missing sections,
vague words and weak witnesses, and passed every mechanical condition written
for it. The first pass that executed one axis against your code falsified three
of its requirements inside an hour: one unachievable by any system, one
demanding the more expensive of two checks, one unenforceable against the
implementation it targeted. Review and execution find disjoint classes of
defect. Execute early, on any single axis, before spending more passes reading.

---

## 5. The bottleneck is you, and it is worth putting a number on

Your work queue carries the request already: one real chat capture, a few
thousand lines from two or three channels of different languages, the collector
pastes into a console. Four decisions end on the same sentence, that the damage
is measured and the frequency is not **[yours]**.

**Two of the four are no longer the capture's, by your own later entries.** The
allowlist question was closed in detection, because what one reader loses is
exactly what the other would pay for, and your entry says reopening it *needs a
case detection cannot reach* **[yours]**. The trimming question turned into an
accuracy trade that changes sign with the target set, and a target is a reader
setting; your collector exports a channel and message text and nothing about
the reader **[re-run]**. That leaves the short-text losses and the code-switch
share. The waiting item still says four. **[mine]** The capture stays the most
valuable thing here, because every priority in this file rests on a frequency,
but its case is two decisions and every ordering, not four decisions.

This account's contribution is to say how far the consequence reaches.
**[mine]** Every mechanism in your notebooks is well established and every
priority in them is unsupported, including the priorities in this file. You can
demonstrate that a homoglyph defeats a one-character floor, that a keyboard-row
criterion separates smash from Czech syllabic sonorants, that a batch inherits
the wrong source. You cannot say which of those matters most, and neither can
anyone reading you.

That is not a small gap, and it has a specific shape worth naming: your benches
are hand-written, so they are **distributionally** wrong (well-formed sentences
where real chat has fragments and pastes), **selectionally** wrong (written by
someone who knew which phenomenon they targeted), and **adversarially** thin
(they contain what their author thought of). A capture fixes all three at once.

**Your listing already publishes one of these frequencies.** The Chrome text
says hover mode *fetches nothing until you point at a message, which cuts usage
by roughly 10x*, and the Firefox text says "ten times" **[read]**. Your seventeenth pass measured the first half
properly, zero engine calls before the hover and one after, with a witness that
only that gate catches **[yours]**. The second half is a claim about how many
lines a reader points at on a fast chat. **[mine]** No capture measures that,
because it is reader behaviour rather than chat content, and your product
deliberately ships no telemetry that could. Stating the mechanism without the
ratio, or the ratio with the share of hovered lines it assumes, costs one
sentence in eleven languages.

Second, smaller, and answerable without users: the on-device engine is absent
on one Chrome build and present on another of the same version on your own
machine **[yours]**. Until that is understood, the fastest path serves an
unknown fraction, the user-visible latency distribution is bimodal with unknown
weights, and no single latency figure describes the product. A matrix over
fresh profiles with flags varied would settle it in an afternoon.

---

## 6. Calibration: how often this account's probes were wrong

Before the boundary, the error rate, because it is the number that says what
credit to give the rest.

Five probes were written against your code in this session. **Three of them
accused working code on their first run**, and all three were caught by a
second, better probe rather than by rereading:

| Probe | First answer | After a better probe | What was wrong |
|---|---|---|---|
| Direction handling | 1 guarded surface of 3 | 2 of 3, then 2 of 2 | Looked for the attribute near the write instead of on the element, then failed to trace what the third surface receives |
| Silent failure paths | 31 silent `catch` of 42 | 18, then 2, then none | The signal pattern did not match `log.debug(`, so every logged catch counted as silent |
| Selector fallbacks | 2 lists, neither with a fallback | withdrawn | Parsed the file with a regex that split the arrays wrongly; the chains are there |

**And you were counting these before this account was.** Your journal's "Les
sondes qui se sont trompees, quatre de plus" opens at "Douzieme et suivantes"
and states the conclusion outright: *toutes rattrapees par un temoin, aucune
par une relecture*. Nothing in this section is a discovery; it is the same phenomenon
measured from outside, by someone who had the advantage of your notes and
reproduced the failures anyway.

One difference is worth your attention, because it favours you. Your Bulgarian
probe, having read one bench file of two, **refused to continue rather than
report zero false positives over an amputated control.** Two probes here did
the opposite, and published. You had built the guard; this account had written
the rule down. That is the entire distance between the two records.

Since then the same bar has been applied to nine published measurements, and
the series is complete: **five changed, four held, one was published without
its parameter.** The detectability enumeration and the localisation count,
listed above as having held on their first run, were both among the five that
later changed: the first under-counted by a factor of two and a half, the
second was an accusation against complete work and was retracted.

Three of the five were over-statements and two were under-statements, so there
is no single direction to correct for. What decides it is whether the probe was
looking for a guard or enumerating instances.

**The pattern in the three failures is one-directional and worth more than the
failures.** Every one of them erred toward accusation. That is structural
rather than unlucky: a probe reports a guard missing wherever it fails to look
properly, so its errors show up as findings and never as clean bills of health.
A probe that is wrong is almost always wrong in the alarming direction.

Two consequences for reading this file, and for any audit you run:

- **An unreplicated finding from a fresh probe should be discounted, not
  acted on.** The cost of the second probe is minutes; the cost of fixing
  working code is a diff, a review and a false belief that survives.
- **A negative result from a probe is worth more than a positive one**, because
  the bias runs the other way. Section 3.4 closing the silent-failure question
  is the most reliable thing this account produced.

Your own frame says this already, in the list of probes that accused working
code: subpixel rounding, a DEFLATE-compressed archive, `head -2` on a
three-line output. This account had that list in context throughout and walked
into the same hole three times in one session. The rule is not hard to state
and is apparently very hard to hold.

## 7. What this account could not see

Stated so the boundary is visible rather than implied.

- **Nothing in a browser.** Every `[read]` claim is about call sites, not about
  what renders.
- **Nothing about real traffic**, which is section 5.
- **Nothing about translation quality**, which is the first question a user
  would ask and is out of scope for everything here.
- **Nothing you never noticed.** A self-reported corpus cannot show its own
  blind spots, and this account inherited them by reading it.
- **Nothing abandoned.** Investigations that stopped without a write-up leave
  no trace, so your queue over-represents work that reached a conclusion.

---

## 8. What this account would do first

Ordered by value over cost, with the cost stated. Nothing here needs a
decision from anyone else.

**Ten minutes, and it stops a wrong belief at the top of every pass.** Delete
the claim in your frame's gates section that a fresh clone has no harnesses,
and replace it with a pointer to the generated state file. Add the tracked
harness count to `state.mjs` so the claim cannot rot again. Section 3.6.

**The most visible defect in this file, and its remaining cost is one unlocated
cause.** The pause in your released build turns translation off on every
stream and every synced browser. The per-channel fix exists, on a branch, and
fails when a reader returns to a channel still paused. Section 3.7. While
there, the navigation gate needs the other three assertions, which already
exist in a harness no runner launches.

**One line, ten minutes.** Give `showError` a direction attribute. Your
interface ships an Arabic locale and that surface renders localised strings
with the page's base direction. Section 3.1. The witness is a localised
right-to-left string rendered into it, which is a test you can write in the
same ten minutes.

**One afternoon, and it unblocks a bimodal unknown.** The on-device engine
present on one Chrome build and absent on another of the same version, on your
own machine. A matrix over fresh profiles with flags varied. Until it is
understood, no single latency number describes your product, because the fast
path serves an unknown fraction. Section 5.

**One evening, and it is the highest-value thing on this list.** The chat
capture. Two of your own decisions still end on its absence, section 5 says
which, and so does every priority in this file. It needs a person on a real page, which is why it has not
happened, and no amount of engineering substitutes for it. Section 5.

**Two hours for the first four, and it closes a question rather than opening
one.** Decide the page-queryable signals in section 3.2: each is required with
the requirement written next to it, or it goes. The count and the sorting live
in that section and are not repeated here, because an earlier version of this
paragraph repeated them and kept the old count after the section was corrected.
You already made this call once for a more expensive vector; this is the same
call on the cheap side of the same door.

**Half a day, whenever the capture arrives.** The languages with no marker
anywhere in the detection chain, listed in section 3.5. A language with no
marker, sharing a script with a larger neighbour, is the exact shape that
produced Persian, Mongolian and Bulgarian. The capture says which of them
actually appear, and that turns a list into a queue.

**Twenty minutes, and it repairs an instrument rather than a product.** Fix
`i18n-check.mjs`, which reports 150 missing keys per locale on files that are
complete. Section 3.3. It is the only instrument in this project found to give
a wrong answer, and a wrong answer from a checker is worse than no checker.

**Not now, and this is a recommendation against work.** The seven remote
branches already merged into master. Real, cheap, and it costs a reader
nothing. Listed in section 3.3 so it is not rediscovered, not so it is done. The
two that are not merged are not covered by this recommendation, and one of
them is section 3.7.

## 9. One habit from your own journal, for the blocked items

Several items in this file are marked as needing you. Your own pass twenty-three
is the reason to check that framing before accepting it.

An item had sat in the queue as blocked since the queue was written. Read again,
only half of it was: reaching the real picker needs your browser, because the
site serves an auth modal to an automated context. **Whether the dodge itself
works was never blocked at all, it had simply never been separated from the part
that was.** Measured offline against a synthetic overlay meeting the size gate,
it moves the preview from 625-663 to 403-441, clear of the overlay's top at 447,
and disabling the lookup leaves 621 of 621 unit tests green while turning that
gate red.

The queue entry became one question with one answer, instead of reading as
though the whole feature were unverified.

**A blocked item is usually a blocked part attached to an unblocked one**, and
the aggregate reads as wholly blocked. That is the same failure as reporting a
population without separating its documented exceptions. Split before deferring.

## 10. How to refute this file

The fastest disproofs, in order of how much they would cost this file if they
landed:

1. **Run the two `grep` commands in section 1.** If direction attributes or
   page-queryable identifiers are not where section 3 says, the measured half
   of this file is stale and the rest is prose.
2. **Name a fourth instance of the pattern in 2.1 that is not a pattern.** If
   the instances are unrelated, the strongest claim here is a coincidence
   dressed as a finding.
3. **Take the chat capture and find that the frequencies invert the ordering.**
   That would not make anything here wrong; it would make the ordering wrong,
   which is most of what a handover is for.
4. **Point at a number tagged `[yours]` that this file repeated back
   incorrectly.** Every one of them was transcribed rather than witnessed, and
   transcription is where a secondary reading fails most quietly.

If none of the four lands, the file is probably worth the hour it takes to act
on section 3.1's one-line fix and section 5's afternoon.

---

## 11. Where the rest of it is

This file is the short version. Four documents sit behind it, and the order
below is by how likely each is to be useful to you rather than by how much
work went into it.

**[appendix E, the method log](appendix/E-method-log.md)** is the one to read
next if you intend to run a pass like this yourself. It carries the commands
that extracted your notebooks without reading them whole, every mistake this
account made with what each cost, what was efficient against what was
waste, and what the harness refused. The section on writing a probe as a
publishable script is the practice that caught two of the three probe errors,
and it is not obvious.

**[appendix A, the audit specification](appendix/A-audit-prompt.md)** is
twenty-two axes, each with what breaks, what to measure, the number that closes
it and what to break to prove the number can go red. It is written against your
repository and refers to your files. Three of its requirements were wrong until
they were executed, which is recorded in
**[appendix B](appendix/B-prompt-construction.md)** along with all thirty
construction passes, including the ones that changed nothing.

**[The thesis](thesis/)** is fifteen chapters on what makes this problem hard,
built from your notebooks. The chapters most likely to tell you something you
did not already know about your own work are
[04 on writing systems](thesis/04-script-vs-language.md),
[05 on the motivation of transliteration signs](thesis/05-transliteration.md),
[06 on written laughter](thesis/06-laughter.md) and
[08 on why a keyboard topology beats phonotactics](thesis/08-noise.md). The
ones that mostly repeat what you already wrote are 09 to 13, and they are there
for completeness.

**[appendix C](appendix/C-replication.md)** is how to re-derive every number,
including the ones this file states, without trusting any of it.
