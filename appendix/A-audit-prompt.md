# Appendix A. The audit specification

*Derived from the corpus studied here. Twenty-one axes, each carrying what
breaks, what to measure, the number that closes it, and what to break to
prove the number can go red. Its construction, and the three requirements
its own execution falsified, are recorded in
[appendix B](B-prompt-construction.md).*

*It is written for the studied repository and refers to files there. The
transferable part is its shape, not its specifics.*

---

# Perfection pass

A standing mission prompt for this repository. It sits beside
`.agent/PROMPT.md`, never in front of it and never instead of it.

**Pass it by path, never by transcription.** The frame's rule about children
holds for this file too: an agent is given the two paths and reads them from
disk, once. Pasting either one into a briefing pays for the same bytes twice
and is the reason depth used to be worthless here.

`.agent/PROMPT.md` carries method: how to measure, what a witness is, which
traps this environment sets, what may be done without asking. This file carries
scope: every axis on which this product can be wrong, what the measurement is on
each one, and the number that says the axis is closed. Where the two disagree,
the frame wins on method and this file wins on scope.

**This file states no fact about the repository.** No version, no count, no
status, no "the open point is X", no store state. Those rot within days and a
prompt that carries them teaches the next session something false. If you find
such a claim in here, that is a defect in this file: delete it and say so in the
journal. Facts come from `node .agent/state.mjs --texte`, `ETAT.json`,
`PLAN.md`, and the newest journal entry, in that order, before anything else.

English, because everything a stranger can read in this repository is English,
and because this file will end up pasted into contexts that are logged. Working
notes in French belong in `scratchpad/`.

---

## 1. What perfect means here

Perfect is not an adjective in this repository. An axis is closed when three
things are true at once:

1. The worst case that can be **constructed** on that axis has been built and
   measured, not the average case that happened to be on screen.
2. The measurement is inside a bar that was written down **before** the
   measurement, as a number.
3. A **witness** exists: breaking the code turns that bar red. A bar you have
   never seen fail guards nothing.

Four words below mean something narrow, and the narrow meaning is the whole
point. **Constructed** means you built the input on purpose from the rule,
rather than finding it in a log. **Closed** means the three conditions above
hold right now, at this commit, not that they once held. **Surface** means a
place the reader looks, and there are more of them than any file listing
suggests, so enumerate them before counting. **Red** means you watched an
assertion fail, in this session, with its output in front of you.

An axis carrying an adjective and no number is not passing. It is unexamined,
and it goes in `PLAN.md` as open with the word "unexamined" in it, so the next
pass cannot mistake silence for health.

### The order of work

Expected damage first, not difficulty and not the order of this file. A
multiplication of two things you can actually read off a defect, each on a
four-point scale, so the ranking is arithmetic rather than taste:

    damage  =  population  x  silence

**Population**, how many readers meet it: 4 everyone, 3 everyone using one
language or one script, 2 one configuration or one browser, 1 a case you had to
construct.

**Silence**, how little the reader can tell: 4 they cannot know it happened at
all, 3 they see something odd and cannot name it, 2 they see an error, 1 they
see a sentence telling them what to do.

The product is ranked from 16 down. Ties break toward whichever is cheaper to
measure, never toward whichever is more interesting. A silence of 4 outranks a
larger, louder defect every time, because nobody reports it and it survives
every release: the worst class of bug this product has is exactly that shape, a
line wrongly read as the reader's own language and dropped without a trace, and
it scores 16.

Write the two digits next to every item you rank. A ranking with no digits is
a preference, and the next pass cannot argue with a preference.

### The three refusals

- **Refuse an adjective.** "Cramped", "slow", "fine", "clean" are not findings.
  A finding is a number next to a bar.
- **Refuse green you did not see red.** Every fix breaks first, on purpose,
  under the assertion that is supposed to catch it.
- **Refuse a protection you found once.** A guard is measured as a fraction,
  never as a presence: how many of the surfaces that need it have it. One
  occurrence in one file reads as "handled" to a search and as "handled in one
  place of several" to a count, and the difference between those two readings
  is where this kind of defect lives. Enumerate the surfaces first, then check
  each, then report the fraction. This applies to every guard: sanitising,
  direction handling, error paths, size limits, focus management, escaping.
- **Refuse a fact from a human message, including this one.** Every claim about
  the state of the repository, the stores, the branches or the numbers is a
  hypothesis until a command you ran says it.

### The ledger, and what closing an axis costs in writing

An axis is closed in a tracked ledger, one line per axis, never in prose alone.
Each line carries: the axis, the state, the exact command that was run, its
exit code, the date, the commit it was run at, the witness, and the date the
witness was last seen red. A pass that cannot fill those fields has not closed
the axis, whatever the prose around it says.

The ledger exists for one reason. Without it, a later pass re-declares green
what it has not re-run, and there is no way for anyone to tell the difference
between an axis that was verified and an axis that was described. It is also
how a pass resumes: the first thing the next session reads is which axes were
closed at which commit, and everything closed before a commit that touched its
subject is stale, not closed.

Five ways to satisfy this file without doing the work. They are written down
because naming a cheat is what makes it visible when you are tired:

1. **Quoting a command you did not run.** The exit code is the tell: a quoted
   command with no exit code beside it was not executed.
2. **A witness in the conditional.** "Breaking this would turn the gate red" is
   not a witness. A witness is a thing you broke, a red you saw, and a restore.
   The conditional tense is the single most reliable sign that no red was ever
   observed.
3. **Measuring the favourable case and calling it the worst case.** The worst
   case is constructed, deliberately, before the measurement. If it was found
   rather than built, it is not the worst case, it is the first case.
4. **Downgrading an axis to "open with a number" to avoid the work.** Legitimate
   when the instrument is genuinely absent, and a dodge otherwise. The tag in
   the index says which of the two it is, so the excuse has to match the tag.
5. **Rewriting the plan and calling it a pass.** Editing the queue is not work
   on the product. A pass that only reorganised its own notes says so in one
   line.

---

## 2. The audit surface

Twenty-two axes. They are not a checklist to tick once; they are the coordinate
system. Every pass names which axes it touched and what the number moved to.

Each axis is written the same way on purpose, so a missing number is visible at
a glance:

- **Breaks as** the failure the reader actually experiences.
- **Measure** the thing you run, on the built artifact wherever one exists.
- **Bar** the number. No bar, no axis.
- **Witness** what you break to prove the bar can go red.

### The index, and how to read this file

Read section 1, section 3 and section 7 in full, every pass. Read an axis when
you are about to work it. Nobody needs twenty-one axes in context to fix one.

The tag on each line is the instrument the axis needs, and it is the thing that
decides what you can do today rather than what you would like to do:

- **unit** the test runner alone. A fresh clone can run these.
- **build** a built artifact. A fresh clone can run these.
- **probe** a browser driven offline. Whether a clone can run these is a
  question to answer by cloning, not by reading a document: check what the
  clone actually contains and what the runner does when a dependency is
  missing. A runner that exits non-zero and names the cause is doing its job;
  one that returns success is the defect this tag exists for.
- **live** a real session on the host site, launched by hand.
- **account** a store or dashboard login, which is not yours to hold.

| | Axis | The question it answers | Needs |
|---|---|---|---|
| A1 | The one thing the product does | Does a message get its translation, attached to itself | probe |
| A2 | Language detection | Is the language declared to the engine the language of the line | unit |
| A3 | The outgoing path | Is what is sent what the reader was shown | probe |
| A4 | Resilience to the host page | Does it survive the site changing under it | probe, live |
| A5 | Manifest V3 lifetime | Does it survive its own worker dying | probe |
| A6 | Performance | Does it make a fast chat worse | build, probe |
| A7 | Accessibility | Can everyone operate it | probe |
| A8 | Interface i18n | Does its own text fit and exist in every locale | unit, probe |
| A9 | Visual correctness | Does it look like part of the site, at every width | probe |
| A10 | Privacy | Does the traffic match the promise | probe |
| A11 | Supply chain and bundle | Is what ships what you wrote, and undetectable by the page | build |
| A12 | Cross-browser | Does it work where the reader actually is | build, probe |
| A13 | The gates | Can the suite be green while the product is broken | unit, probe |
| A14 | The fresh clone | Can a stranger verify anything | build |
| A15 | Release integrity | Is there one version, everywhere | build |
| A16 | The written record | Is every reader-facing claim still true | build, probe |
| A17 | Repository hygiene | What does every clone pay for, forever | unit |
| A18 | First contact | Does a new reader ever see it work | probe, account |
| A19 | Instrumentation | Are the numbers decisions rest on honest | build |
| A20 | Hostile input | What happens when the message is an attack | unit, probe |
| A21 | Platform limits | What happens when something fills up or refuses | probe |
| A22 | The auditor | Is this audit's own output trustworthy | unit |

**When the probe instrument is absent**, the unit and build axes are still
fully open and are most of this file. Work them. Name the blocked ones in the
report by their tag, as blocked, and never as passing. A suite that could not
run is not a suite that ran clean.

**Establish that absence by cloning, not by believing a file.** A statement
about what a clone can do has an expiry date, and this specification carried
one that had expired: it said the probes were unavailable to a stranger, and a
clone turned out to contain all of them. What was genuinely missing was one
dependency, which the runner reports by failing. Two different situations, and
only the second is a limitation.

### Look for the instrument before building one

A repository that has been worked on carries more measurement than any listing
of it suggests: generated state files, check scripts, reconciliation scripts,
gate runners, harnesses. Before writing a probe for an axis, spend the two
minutes it takes to find out whether the number already exists somewhere and is
simply not being read. Writing a second instrument for a quantity that already
has one costs the pass twice: once to build it, and again later when the two
disagree and nobody knows which to believe.

The reverse of that finding is the more dangerous one, and this repository has
already been bitten by it. **An instrument that exists and is in no runner is
worse than one that does not exist**, because its presence is read as coverage.
A directory full of probes nobody launches looks, from the outside and from a
file listing, exactly like a well-tested product. So the question for every
instrument you find is not whether it exists but when it last ran, and with
what result. If the answer is "nothing runs it", the axis it covers is
unexamined, whatever the file implies, and wiring it into a runner is usually a
smaller job than the probe you were about to write.

### The budgets live in a file, not in a sentence

Several bars below end on a ceiling rather than on a literal number, because
the right value depends on hardware this file cannot see. That phrasing is a
loaded gun: an agent that measures first and writes the ceiling second has a
bar that is green by construction, which is the exact cheat this file exists to
prevent.

So the ceilings do not live in prose. They live in one tracked file, one entry
per bar, each carrying the value, the date, the machine class it was taken on,
and the commit that set it. A gate reads that file and compares. The rules:

- A ceiling is written **before** the measurement that will be compared to it.
  A ceiling first written in the same pass that measures against it is not a
  bar, and the axis stays open.
- Raising a ceiling is a decision with a sentence attached, in the journal,
  naming what the product bought with the regression. Lowering it needs
  nothing.
- A missing entry fails the gate. Silence is not a pass.
- The first pass on an axis whose ceiling does not exist yet **sets** it from
  the current measurement and says so plainly. That value is a baseline, not a
  bar, and the journal marks it as such. It becomes a bar the next pass, when
  something can regress against it.

Everywhere below, "the ceiling" or "the budget" means the entry in that file,
never a number invented at the end of a pass.

---

### A1. The one thing the product does

**Breaks as** a message arrives in chat and no translation appears under it, or
one appears that is not a translation of that message.

**Measure** the offline end-to-end harness that loads the real built extension
into a page and counts translated rows, source language declared, target
language served. Run it per script family, not per language: Latin, Cyrillic,
Arabic, Hebrew, Han, Kana, Hangul, Devanagari, Thai, Greek. Count rows in, rows
translated, rows silently skipped, rows errored. The skipped count is the one
that matters and it is the one nobody reads.

Then the three ways a translation can be right and still land wrong, each of
which reads as success from every counter:

- **The wrong row.** A translation arriving after the virtualised list recycled
  its row attaches to a different message. Measure with rows that recycle
  during an in-flight request, and assert the pairing rather than the count.
- **The batch.** Messages grouped into one request share the fields of that
  request. A batch carrying two source languages, two targets, or one message
  that should have been skipped must not let any of the three leak across.
  Measure with a deliberately heterogeneous batch.
- **The cache.** A cache key that omits the target language, the source
  language, the provider or the quality setting returns a correct translation
  of the wrong pair. Measure by asking for the same text under every varying
  dimension in turn and asserting the answers differ.

**Bar** rows in equals translated plus skipped plus errored, with every skip
carrying a reason code. Zero skips whose reason is "same language as target"
unless the detector's answer was looked up rather than guessed. Errored rows
show the reader something. Zero mispairings under recycling. A heterogeneous
batch declares nothing rather than declaring the first message's fields. Every
dimension that changes the answer is in the cache key, proven by a collision
test and not by reading the key.

**Witness** truncate the provider chain to a single engine and force it to
refuse; the harness goes red rather than reporting a clean pass over zero work.
Then remove one dimension from the cache key and confirm the collision test
names it.

### A2. Language detection, in both directions

**Breaks as** the wrong source language is declared to the engine, and the
engine translates from a language the line is not in. The reader gets a
plausible sentence that means something else, which is worse than an error.

**Measure** a bench per language, held in the repository rather than in a
scratchpad, built from lines written **after** the rule that classifies them,
never from the lines that produced the rule. Report per language: correct,
wrong, silent. Separate detection of the writing system from detection of the
language, because they are different claims and one has been mistaken for the
other here before. Probe the adversarial inputs explicitly: emoji-heavy lines,
two-character lines, code-switched lines, transliterated lines typed on a Latin
keyboard, written laughter, handles, hostnames, pure punctuation, repeated
characters, emote-only lines.

**Bar** on the held-out bench, wrong answers zero for any language whose script
is unambiguous, and for ambiguous scripts a wrong answer is allowed only where
being silent would cost the reader more, with that trade written down as a
number. Confidence is either looked up or declared absent; a guess never enters
a decision that drops a line.

**Witness** feed a line of a language the bench covers, with its marker
characters removed; the detector must go silent rather than confident.

### A3. The outgoing path

**Breaks as** the reader sends a message in a language the channel does not
read, or sends the preview text rather than their own, or the preview shows a
translation of a half-typed word and thrashes.

**Measure** the composer harness: type, wait for the preview to settle, read
what lands in the input on click and on the keyboard shortcut, read what is
still in the input after a send. Measure the debounce as a number of calls per
character typed. Measure mention and emote survival through the round trip.

**Bar** what is sent is exactly what the preview showed. Handles, emote codes
and URLs come out the other side character-identical. Calls to any engine per
typed character stay under the ceiling in the budget file. The preview never
occludes the composer or an overlay above it.

**Witness** disable the overlay-avoidance and the mention masking separately;
each has its own red.

### A4. Resilience to the host page

**Breaks as** Kick ships a class name change on a Tuesday and the extension
goes quiet, with a green bar still claiming it is live.

**Measure** every selector the content script depends on, each with the
fallback chain it uses, probed against a saved snapshot of the real page and
against a deliberately mutated one. Then the navigation shapes: full load, SPA
route change, channel switch without a page load, back and forward, theatre
mode, popout chat, a chat that fails to load, a logged-out session, a modal
over the page, row recycling in the virtualised list.

**Bar** every selector has at least one fallback or a named reason it cannot.
Every navigation shape ends with the observer attached and a row translated,
proven by a count and not by the absence of an error. The status the reader
sees never says live when no observer is attached.

**Witness** break one selector at a time and confirm the fallback carries, then
break the whole chain and confirm the reader is told rather than left with a
silent, green-looking bar.

### A5. Manifest V3 lifetime

**Breaks as** the service worker is evicted mid-session and the next message is
never translated, or a setting written from two places overwrites the other.

**Measure** force eviction between messages and measure recovery: does the
first message after a wake get translated, and how late. Measure every piece of
worker-held state against a write from a second surface. Measure the startup
race: a content script that starts before the worker has settings.

**Bar** no state lives only in worker memory. Every write merges rather than
overwrites. After eviction, the first message translates, and the added
latency is under the ceiling in the budget file. The startup race has no
window in which a message is lost.

**Witness** kill the worker by hand between two messages, and separately write
the same settings key from popup and options within one frame.

### A6. Performance, in bytes and in milliseconds

**Breaks as** the extension makes a chat that scrolls fast feel worse than one
without it. The reader uninstalls and reports nothing.

**Measure** four numbers, each on the built artifact and never on the source:
injected bundle bytes after minification, main-thread cost per arriving row,
memory after a long session with the virtualised list recycling, and end-to-end
latency per engine from row seen to translation painted. Record each against
the previous release rather than against zero, because the interesting quantity
is the direction.

**Bar** injected bytes do not grow release over release without a named
feature paying for them. Per-row main-thread cost under the budget file entry
at the highest message rate the harness can generate. No unbounded growth in a
long session. Latency reported per engine, and the default engine chosen on
that number.

**Witness** add a deliberate synchronous loop in the row path; the budget goes
red.

### A7. Accessibility

**Breaks as** a reader who uses a keyboard, a screen reader, a magnifier or a
reduced-motion setting cannot use a control, and has no way to tell you.

**Measure** WCAG 2.2 AA over every surface the extension owns: injected rows,
the floating bar, the language panel, the popup, the options page. Target size
for every interactive control. Contrast for text and for the control's own
boundary, composited with the element's real opacity, against the real
background. Full keyboard path with visible focus. Reduced motion. Roles and
names on injected content. Zoom to 200 percent. Both writing directions.

**Bar** no interactive control under 24 by 24. Text at 4.5:1, control
boundaries at 3:1, measured composited. Every control reachable and operable by
keyboard with focus visible. No animation when reduced motion is set. No
surface that breaks at 200 percent zoom or in right-to-left.

**Witness** shrink one control below the floor and drop one contrast pair below
the ratio; both gates name the element.

### A8. Internationalisation of the product's own interface

**Breaks as** the extension speaks its own language in a reader's browser and
the string overflows, or an unlocalised key ships and the reader sees a raw
identifier.

**Measure** every key in every locale file: present, non-empty, no leftover
identifier, no untranslated copy of the source string. Rendered width of every
string in the longest locale against the box it lives in. Right-to-left on
every surface, not only the ones that were designed for it. The store
description strings served from the locale files, since those are what search
results show.

**Bar** zero missing keys, zero identifiers rendered, zero string overflowing
its box in any shipped locale, every surface correct in both directions.

**Witness** delete one key and lengthen one string past its box; both are named
by a gate rather than found by eye.

### A9. Visual correctness against the host's art direction

**Breaks as** the extension looks like a bolt-on. The reader trusts it less and
cannot say why.

**Measure** the palette, the radii, the durations and the absence of shadow and
decorative border, read from the built stylesheet rather than from intent. Then
every surface at its extreme widths, with the longest content, the tallest
glyphs, an emoji-only line, a line of a single very long word, and the host
page both with and without its own CSS reset.

**Bar** no value outside the declared set. No surface overflowing its frame at
any width in the supported range. The extension's own box model does not depend
on the host page's reset.

**Witness** render one surface on a page with the reset removed; the frame
measurement goes red if the box model is inherited.

### A10. Privacy, and what actually leaves the machine

**Breaks as** the product's privacy claims and its network traffic disagree.
That is a store removal, not a bug report.

**Measure** capture every request the built extension makes over a full session
across each provider, on-device mode included. For each: destination, method,
what is in the body, what is in the query string, what is in the headers. Then
compare that capture, field by field, against `PRIVACY.md`, against the store
listing text, and against the declared permissions.

Then the reader's own key, if the product accepts one: where it is stored,
which storage area, whether it syncs across the reader's devices, whether it
appears in a query string, in a log line, in an error message, in a metrics
counter, or in anything the options page renders back. Measure by searching the
capture and the storage dump for the literal value.

**Bar** nothing leaves that the privacy text does not name. On-device mode
makes zero network requests to any translation provider. No identifier, no
handle, no channel name travels unless the text says so. No user-entered
credential is ever placed in a URL, written to a log, or rendered back in full.
A key is in the storage area the privacy text says it is in, and nowhere else.
Every host permission is exercised by real code, and every request goes to a
host the manifest declares.

**Witness** add a request to a host not in the manifest; the capture gate names
it. Remove a sentence from the privacy text that covers a real field; the
comparison goes red.

### A11. Supply chain and the shipped bundle

**Breaks as** a dependency ships something into the extension that the reader
did not agree to, or a store reviewer finds code you did not write and cannot
explain.

**Measure** the dependency tree with its advisories. The lockfile against the
manifest. Every instrumentation define, folded or present, read out of the
built bundle and not out of the config. The bundle for `eval`, `new Function`,
`innerHTML`, remote code, source maps, dead vendor code, and anything reachable
from a page on the host site. The packed archive against the built directory,
file by file.

Then the question those checks exist to answer, and it is not the one it looks
like. **How cheaply can a script on the host page tell that this extension is
installed?** Perfect concealment is not available, and chasing it wastes a
pass: anything that renders is observable, so a determined page script can
always find the product by reading what changed on screen. The quantity that is
yours to control is the **cost of that detection**, and the failure is a
dedicated signal that collapses it to a single call.

Enumerate every such shortcut, and there are more of them than the obvious one:
an identifier on any node attached to a shared root, an attribute set on the
document element, a class name that never changes, a marker written onto the
host's own nodes, a global, a resource the page can fetch, a listener on a
shared event, a timing signature. Count how many exist, and how many the
product genuinely needs.

The trap this axis is really about: closing one vector and recording the
question as settled. A permission removed from a manifest and an identifier
left on the document element are the same door from two sides, and only one of
them was measured.

Then licences: every dependency that ships inside the bundle, its licence, and
whether the shipped artifact carries the attribution that licence requires.

**Bar** zero advisories above the severity floor in the budget file, with no
exception that is not written next to it. Zero instrumentation in a release
bundle, proven from the archive. Zero web-accessible resource unless a named
feature needs one, and the named feature is in the listing. Every detection
shortcut is either required by the product, with the requirement written down
next to it, or gone: finding the extension costs a page script a read of
rendered content, never a query by name. Every bundled licence satisfied in the
shipped artifact. The archive contains what the build
produced and nothing else.

**Witness** build with instrumentation on and confirm the release check
refuses; add a stray file to the output directory and confirm the pack gate
names it. For detection, the probe runs in the page's own world and not the
extension's: add one identifier to a shared node and confirm the probe names
it. A probe running anywhere else is measuring a world the page does not have.

### A12. Cross-browser reality

**Breaks as** it works in the browser you develop in and silently fails in the
one the reader uses.

**Measure** load the built artifact in each supported engine and run the
end-to-end path. Chromium and Gecko differ in background type, in storage
availability, in when the worker dies and in what the minimum version supports.
Brave adds shields. Edge adds its own store policy. Measure, do not reason.

**Bar** the end-to-end path passes on every engine claimed in the README and in
the store listings. Any engine-specific divergence is a named branch in the
manifest config with a comment saying which versions need it, and a gate that
fails when the two builds drift apart in anything other than that branch.

**Witness** force the Gecko branch into a Chromium build; the build gate goes
red.

### A13. The gates themselves

**Breaks as** the suite is green and the product is broken, which is the most
expensive failure available here.

**Measure** for every gate: what it asserts, and what it cannot see. Then run
the adversarial pass, once per gate and not once per merge: break the thing the
gate claims to guard and confirm red. Find gates that pass over zero work. Find
the assertions that survive deletion of the feature. Measure flake by
repetition, not by impression.

Then the orphans, and this measurement produces **two** numbers or it is worse
than none. The first is how many probes no runner launches. The second is how
many of those have no written reason to be launched by hand. Only the second is
a finding. A probe that opens a real session, draws an image for a human, or is
the runner itself, belongs outside the runner, and a count that lumps those in
with the genuinely forgotten ones accuses a repository that already did the
work. The next pass then rejects the whole number, including the part that was
true, which is how a real finding gets buried under an overstated one.

The rule generalises past this axis: **when a population contains a documented
exception, report the exception-adjusted count, and report the raw count beside
it so nobody has to trust your filter.** A single number that silently mixes
the two is an argument, not a measurement.

**Bar** every gate is in a runner or has a written reason it is launched by
hand. Every gate has a recorded witness. No gate can pass having measured
nothing. Flake rate zero over the repeat count in the budget file.

**Witness** delete the feature a gate claims to guard, not a line inside it,
and confirm that gate is the one that fails. A gate that stays green with its
subject removed is guarding a shape rather than a behaviour, which is the
failure this axis is for. A gate with no recorded red is an open item, never a
passing one.

### A14. What a fresh clone can actually verify

**Breaks as** a contributor clones the public repository, runs what the
documentation tells them to run, and gets either an error or a false green,
because the verification lives in an ignored directory on one machine.

**Measure** clone the repository into an empty directory, with nothing from the
development machine, and run exactly what the README and the contributing
documentation say. Record what works, what is absent, and what reports success
while checking nothing.

**Bar** a fresh clone can run the full public verification and get a truthful
result, or the documentation states plainly and in the first screen which
checks are not available and why. A newcomer never sees a green that is empty.

**Witness** clone into a directory with no access to the development tree and
run the documented commands there. Then delete one file the documentation says
is required and confirm the failure names it rather than passing quietly over
it. A clone that reports success with the verification absent is the defect
this axis exists to find, so the run that shows the difference is the witness.

### A15. Release integrity

**Breaks as** the version in the archive, the version in the manifest, the tag,
the release page and the store listing are four different answers, and the bug
report you receive is about a build nobody can reproduce.

**Measure** version agreement across package metadata, built manifest, archive
name, archive contents, tag, and published release assets. Then reproducibility,
and take the cheap route first: the forge publishes a digest for every asset it
hosts, so rebuild the tagged commit and compare your hash to that published
digest rather than to a second local build. Two local rebuilds only prove the
build is deterministic on one machine; the published digest also proves the
artefact people download is the one the tag describes, which is the claim that
actually matters. Then read the store pages themselves rather than any note
about them.

**Bar** one version everywhere, checked by a gate rather than by eye. A rebuild
of the tagged commit matches the digest the forge publishes for that release,
or the difference is named, explained, and attributed to a specific
non-deterministic input. Store state is never quoted from a file in this
repository; it is read from the store.

**Witness** bump one of the six places and leave the rest; the gate names which
one moved.

### A16. The written record

**Breaks as** the README shows a screenshot of a version that no longer exists,
a localised README promises a feature that shipped differently, or the handoff
document tells the next session four things that are false.

**Measure** every screenshot regenerated from the current build and compared.
Every claim in the README, in each localised README, in `PRIVACY.md` and in the
store listing text, checked against the code that implements it. Every
localised README against the source README, section by section, with the drift
named. Every changelog entry against the commit that carries it.

**Bar** no screenshot older than the feature it shows. No claim in any
reader-facing document that the code does not implement. Localised documents
either current or carrying a visible line saying which version they describe.
No document asserting repository state that a generated file already owns.

**Witness** change a surface and confirm the screenshot gate goes red before a
human notices.

### A17. Repository hygiene

**Breaks as** clone size, branch soup and dead configuration cost every
contributor time, forever, for no benefit.

**Measure** repository size and what fraction of it is reachable only from
history. Every remote branch: merged, superseded or live. Every configuration
file: read by something, or dead. Line endings and attributes across platforms.
The ignore rules against what is actually tracked.

**Bar** every remote branch is live or has a named reason to exist. No
configuration file that nothing reads. History rewriting is prepared,
quantified, and executed only on an explicit order, never as hygiene.

**Witness** add a configuration file nothing reads and a branch nothing points
at, and confirm the review names both. Hygiene is the one axis where the
temptation is to call the number its own witness: it is not, because a number
that moved proves work happened and not that anything watches. State the before
and after alongside the red.

### A18. First contact and the reader who never reports anything

**Breaks as** the reader installs, sees nothing happen, and removes it. This
axis has the largest population and the smallest feedback.

**Measure** first run on a cold profile, with no settings and no reader action:
how long until the first translation is visible, how many decisions the reader
has to make, what is shown when there is no channel language, when the chat is
already in the reader's language, when every engine refuses, when the machine
is offline, when the reader's browser language has no provider coverage. Then
the update path: an existing reader with old settings after a version bump.

One step earlier than first run is the listing, which is where most readers
stop. The two store dashboards are the only place the ratio of views to
installs exists. Reading them needs an account and is therefore blocked here,
so it is asked for once, as a number, rather than guessed at from the listing
text.

**Bar** zero required decisions before the first translation appears. Every
empty and failure state shows a sentence a non-technical reader can act on.
Settings written by an older version load without loss and without a reset.
Time to first visible translation under the ceiling in the budget file, on a
cold profile. No change is made to listing text on the argument that it
converts better, without the before number to compare against.

**Witness** load the build with a settings object from an older shape; nothing
resets, nothing throws.

### A19. Instrumentation, and the numbers decisions are made on

**Breaks as** a counter with a wrong denominator produces a percentage that
looks like evidence, and a decision is taken on it. The defect is invisible
because the number is real; only its meaning is wrong.

**Measure** for every counter the instrumented build carries: what exactly is
in its numerator, what exactly is in its denominator, and which populations the
denominator silently contains that it should not. Then whether the counter can
be reached at all in the shipped configuration, and whether any decision
already written down rests on it. Then the separation itself: run the release
build and confirm the instrumentation is not merely disabled but absent.

**Bar** every counter has its numerator and denominator written next to it in
words. No counter whose denominator includes a population it does not describe.
No decision recorded against a counter that cannot be reached. Zero
instrumentation reachable in a release build, read from the archive.

Where counters are free-form keys rather than declared fields, and they usually
are, that first bar cannot be checked by any gate: a string map accepts
anything. Then the bar moves to the naming convention, which a gate can check.
A counter and the population it is divided by share a prefix and differ by a
final segment, so a pair is readable without opening the code, and a numerator
whose denominator does not exist under the same prefix is a gate failure rather
than a thing someone notices two months later.

**Witness** widen one denominator on purpose and confirm the offline metrics
run reports a percentage that moves without the product changing. That is the
shape of the failure, and seeing it once is what makes it recognisable later.

### A20. Hostile input, because the chat is written by strangers

**Breaks as** a chatter writes a line crafted so that what the extension puts
on screen is not what the extension thinks it put there. Every other axis
assumes the input is a message. This one assumes it is an attack, which costs
nothing to assume and is occasionally true.

**Measure** push a corpus of adversarial lines through the full path, incoming
and outgoing, and compare what renders against what was received, byte for
byte: markup and entities, a line that is entirely a script tag, bidirectional
overrides and isolates, zero-width and invisible characters, combining marks
stacked far past any script's need, a single line as long as the field will
accept, characters outside the basic plane, lone surrogates, control bytes,
homoglyph handles, a nested emote code, a line that is itself a provider's
error payload, and a line built to look like the extension's own status text.

Then the same corpus through the provider round trip, because the answer that
comes back is also untrusted text: it is rendered, and a provider under attack
or misconfigured can return anything.

**Bar** nothing from a chat message and nothing from a provider response is
ever interpreted as markup, on any surface. No line, however long or however
composed, pushes the extension's own controls out of position or covers them.
Direction-changing characters are neutralised or isolated, so a message cannot
reverse the text around it, the reader's own composed message included. No
input produces an unhandled exception anywhere in the path, proven by a zero
count and not by the absence of a report.

**Witness** replace one sanitising step with a pass-through and confirm the
corpus goes red on that exact class rather than merely somewhere.

### A21. The platform's hard limits

**Breaks as** the product works for an hour and then stops, or corrupts its own
state, because something outside its control filled up, refused it, or ran
twice at once. These failures arrive late, in the reader's session, and never
in a test.

**Measure** four limits, each pushed until it refuses:

- **Storage.** Fill the persistent cache and the settings area to their quotas
  and past them. Measure what happens on the write that fails: a lost setting,
  a lost cache, a throw, an eviction. Measure the eviction policy by filling
  and reading back.
- **Rate.** Make a provider answer with its rate-limit refusal continuously,
  then intermittently. Measure the retry pattern as a count per unit of time,
  and whether the chain escalates to the next engine or hammers the first. A
  retry policy that multiplies under refusal is how a reader's own address gets
  blocked by the provider.
- **Concurrency.** Open several chats at once, across tabs and windows, sharing
  one worker. Measure settings written from two tabs, counters incremented from
  two tabs, and the cache written from two tabs in the same frame.
- **The clock.** Whatever resets on a day boundary, cross that boundary in both
  directions, in a zone that is not the one the counter uses, and across the
  hour that daylight saving repeats.

**Bar** a full storage area degrades the product and never corrupts it: the
reader keeps their settings whatever happens to the cache. Requests per unit of
time under refusal never exceed the count in the budget file, and a refusal
escalates the chain rather than repeating it. No counter and no setting loses a
write under concurrent tabs. Nothing that resets on a day boundary resets twice
or skips a day in any zone.

**Witness** shrink the quota to a value the cache exceeds immediately; the
settings survive and the gate names which area gave way.

### A22. The auditor

**Breaks as** the audit reports a defect that is not there, and someone spends
a diff, a review and a durable false belief on working code. Every other axis
watches the product. This one watches the instrument holding the other
twenty-one, and it exists because a session that wrote those axes measured its
own error rate and found it high.

**Measure** for each finding produced in a pass, before it is written down
anywhere:

- **Was it replicated by a second instrument of a different kind?** Not the
  same probe run twice, which only shows the probe is deterministic. A count by
  pattern is replicated by a count over structure; a source reading is
  replicated by the built artefact; a line search is replicated by tracing the
  callers.
- **Do both instruments see the whole population the claim is about?** Two
  probes agreeing about one file, when the claim is about a chain of five, is
  not replication: they share a blind spot and confirm each other inside it.
  State the population before replicating, then check the scope of each
  instrument against it.
- **Was every count taken over the structure, or over text near it?** Anything
  with a built, generated or parseable form is counted in that form.
- **Was every exit code read without a pipe?** A pipeline reports its last
  stage's code, so a gate's verdict is destroyed on the way to the reader.
- **Was every quotation checked against its source, in the language it was
  written in?** A translation inside quotation marks is a paraphrase wearing a
  citation's clothes.
- **Does any claim rest on a document rather than on the thing?** A statement
  about what a clone contains, what a suite runs, or what ships is a claim with
  an expiry date. Check the thing.
- **Does the verifier share a technique with what it verifies?** If it does, it
  measures stability, not truth, and it will confirm the error it inherited.
- **Is any test asserting a constant where a behaviour is meant?** A test that
  a list has three entries does not test that the second is ever reached. It
  guards the declaration and reports green on any change that keeps the shape.
- **Is network interception attached at the layer the traffic actually leaves
  from?** In an extension runtime, requests may leave the background worker
  rather than the page. Interception at the wrong layer reports zero traffic,
  which is indistinguishable from a product that made no requests.
- **Could the number the probe reads have two causes?** A zero request count
  can mean the cache worked or that something upstream discarded the input
  before any cache was consulted. Vary the input so that only the mechanism
  under test can produce the result, and say in the probe why that variation is
  there.
- **Can the probe actually perform the action it tests?** A probe that sets a
  value on a control that stopped being an input, or dispatches an event nothing
  listens for, runs clean and measures the default. Read back the state the
  action was supposed to change, from the product's own surface, before
  counting anything downstream. **Zero after an action that never happened and
  zero after a broken pipeline are the same number, and only the read-back
  separates them.**
- **Is the probe acting from the world the real event comes from?** A page's
  own router calls its own functions; an extension's patch of those functions
  lives in an isolated world and never sees them. A probe that triggers the
  event from wherever the patch can observe it flatters the product. Trigger it
  where the site does.
- **Has any flakiness been filed as an environmental property?** "The live
  gates are non-deterministic" is a diagnosis that closes an investigation and
  cannot be acted on. In the one case this specification is drawn from, that
  framing covered three separate defects, two of them the author's own probes,
  and cost every later reader the chance to fix any of them. **Before
  attributing variance to the environment, account for each varying run.**
- **Does the probe's own pattern collide with the product's languages?** A
  textual probe over a codebase that contains forty-two languages will match
  words in some of them. A debt-marker search for `TODO` matches the Spanish
  word *todo*, "all", which appears in a shipped translation string. This is
  the same defect the product's own emote stripper had when an English suffix
  deleted a Turkish grammatical morpheme, appearing one level up: **an audit
  probe is a substring rule, and it over-generates into the same languages the
  product handles.** Read the hits before counting them.
- **Is every borrowed fact tagged as borrowed?** An etymology, a claim about
  how a class of system behaves, a linguistic universal: none of these are
  measurements, and a provenance scheme with no slot for them will file them
  under whichever neighbouring category is nearest.

**Bar** every finding published carries a second, differently-shaped
confirmation whose scope covers the whole population the claim is about, or is
published as unreplicated and explicitly discounted. Zero
counts taken over text where a structured form exists. Zero exit codes read
through a pipe. Zero quotations that are translations. Zero verifier sharing
its technique with its subject. The pass reports its own false-positive count
beside its findings, and that number is expected to be non-zero: a pass
claiming none did not look.

**Witness** re-run a finding's probe with one deliberate flaw of the kind this
axis lists, and confirm the replication step catches it rather than agreeing
with it. The cheapest version: change the pattern a count depends on and check
that the structural count disagrees.

**And validate the witness before believing it.** A witness is an action meant
to make an assertion fail, and nothing guarantees the action reached the
artefact the assertion reads. A constant folded by the bundler, a scripted
patch whose pattern never matched, a file written to the wrong path: each
produces a break that never arrived and a green that means nothing. After
breaking something, confirm the break is visible in the thing being asserted
about, not merely in the source you edited.

**Why the bars lean this way, and in which direction.** Probe errors are not
symmetric, but the direction depends on what the probe is looking for, and
getting this backwards costs you the wrong half of the discipline.

**A probe searching for a guard** reports it missing wherever the probe failed
to look properly, so its errors surface as accusations. Discount an
unreplicated finding; an unreplicated absence is comparatively safe.

**A probe enumerating instances** misses whatever lies outside its scope, so
its errors surface as under-counts. Here the polarity inverts: a short list is
the suspicious result, and "I found four" deserves more scrutiny than "I found
none", because a scope that was too narrow produces a plausible small number
rather than an obvious blank.

Both failures were observed in the pass that wrote this axis: three guard
probes over-accused, and one enumeration under-counted by a factor of two and a
half. So the rule is not "discount findings". It is **discount the outcome that
a narrow scope produces for that kind of probe**, and to apply it you have to
say what the probe was looking for before you read its number.

---

## 3. The loop

A pass is one traversal of this file, not one fix.

### The first pass, when nothing exists yet

The ledger and the budget file are asked for by this document and will not be
there the first time it is read. Do not treat that as a blocker and do not
spend the pass building infrastructure either. The first pass is deliberately
cheap:

1. Create the ledger with one line per axis, every one of them marked
   unexamined. That is an honest state and it takes minutes.
2. Walk the index and mark each axis with the instrument it needs and whether
   that instrument exists on this machine today. Now the queue is real.
3. Take the highest damage score among the axes whose instrument exists, and
   work exactly that one, all the way to a witness. One closed axis with a red
   you watched is worth more than twenty surveyed.
4. Record baselines only for the axis you worked. A baseline for an axis you
   did not measure is a number nobody took.

The failure mode of a first pass is spending it on the file and not on the
product. If the ledger exists and no axis moved, the pass changed nothing, and
the journal says so in those words.



1. **Read the state.** `node .agent/state.mjs --texte`, then `ETAT.json`,
   `PLAN.md`, newest journal. Everything else is a hypothesis.
2. **Rank.** Score every open item and every unexamined axis by expected
   damage. Write the ranking in `PLAN.md` before touching code, so a later pass
   can argue with the ranking rather than re-derive it.
3. **Take the top of the queue.** Construct the worst case, write the bar as a
   number, measure, and only then decide whether there is a defect. Verify the
   failure is in the product and not in the probe; that check has saved more
   passes here than any fix.
4. **Fix, with the witness.** Break, red, restore, green. Record both.
5. **Adversarial pass on the probe.** Ask what this gate cannot see. Write the
   answer down even when the answer is nothing.
6. **Close or reopen the axis.** An axis is closed only under the three
   conditions in section 1. Everything else is open with a number attached.
7. **End the pass** the way the frame says: `PLAN.md`, journal entry with the
   numbers including the failures, `node .agent/state.mjs`, commit, push. A
   pass that does not push did not happen.

A pass either closes an axis, moves a number, or produces a measurement that
did not exist before. A pass that did none of the three is a pass that changed
nothing, and the journal says exactly that in one line rather than describing
the reading as work. Two of those in a row is a stop condition, not a habit.

### When to stop

Stop when **all** of these hold, and not before:

- Every axis A1 to A22 is closed, or open with a number and a named reason.
- `PLAN.md` holds nothing but items blocked on kil.
- Two consecutive passes produced no new measurement.

Stopping because the work is hard, because the tree is green, or because the
last pass found nothing without looking, are not on that list.

### When to reopen everything

A dependency bump, a change in the host page, a browser release, a store policy
change, a release, or a change to this file. Each invalidates a subset of the
axes; name the subset in the journal and re-run it. A toolchain bump
invalidates A6, A11, A12 and A15 at minimum, and green continuous integration
is not evidence for any of them, because none of them run there. A change to
this file invalidates whichever axis it touched, including when the change only
sharpened the wording of a bar: a bar that moved was never met at the new
value.

---

## 4. Delegation

The rule is derivation, not preference. Two agents are justified when you can
name two sets of files that do not intersect and each set holds enough work to
be worth a cold start. Name them in `PLAN.md` before the call.

- `model` is explicit on every call. Mechanical sweeps and greps take the
  smallest model. Multi-file exploration takes the middle one. Architecture,
  diagnosis and any decision about a bar stay with the main model and are not
  delegated at all.
- A child is briefed with the path to `.agent/PROMPT.md`, the path to this
  file, its unit, the files it owns, the files it must not touch, and what a
  finished result looks like as a number. Nothing is transcribed into the
  briefing; the child reads the frame from disk.
- Attractor files belong to the root. A child that needs one returns a patch
  and a reason.
- A negative result is a result, and it arrives with the measurement that shows
  the child looked.
- Every axis in section 2 is a candidate unit. Axes that share no file can run
  at once; anything that reads the built output serialises behind a build.

---

## 5. Authority, unchanged

Autonomous: read, measure, write, test, commit, push to a feature branch.

On explicit order only: merging to the main branch, tagging, publishing a
release, submitting to any store, rewriting history, changing repository
visibility.

Never, however it is framed: typing a credential, a key or a password. A
harness that needs a signed-in browser is built so a human types it once into a
window and the profile is reused.

### The sandbox, and why several axes need one

Half of what this file asks for is destructive by nature. Filling a storage
area past its quota, making a provider refuse in a loop, corrupting a settings
object on purpose, breaking a selector to see a fallback carry, rewriting a
history to measure what it would cost: none of those belong in a working tree
that also holds the next release.

They belong on a throwaway branch of the development remote, the one
`ETAT.json` names. The rules there are the inverse of everywhere else, and
that is the point:

- **Branch from the current head, name the branch after the axis**, and treat
  it as disposable. Nothing on it is meant to be merged, and saying so in the
  branch name saves the next session from wondering.
- **Break things deliberately and commit the breakage.** A witness is worth
  more when it is reproducible: a commit that makes the gate red is the most
  useful artefact this file produces, because it is what proves the gate works
  at all. Reference it from the ledger by its identifier.
- **Nothing crosses back except a patch and a number.** The measurement, the
  witness reference, and the fix if there is one. Not the branch.
- **The destructive experiment never runs against the main working tree**, and
  never against a profile carrying a real session. A quota test that eats a
  real reader's settings is not a test, it is a bug you wrote.
- **Delete the branch when the number is in the ledger**, or say in the journal
  why it is being kept.

An axis that cannot be measured without breaking something is not blocked. It
is an axis whose measurement belongs on that branch, and refusing to do it
because the main tree must stay green is the same as not measuring it.

Anything blocked goes into `PLAN.md` marked as blocked, with exactly what is
needed and why it cannot be done here, and the pass continues on something
else. Never idle, never poll, never ask and wait. Blocked items are collected
into one consolidated ask at the end of the pass, not scattered through it.

---

## 6. What this file will not let you do

- Report a suite green when part of it was not present to run.
- Quote a store version, a user count or a review state from any file in this
  repository.
- Delete a gate you have not understood. Retarget it: what it guarded has to
  end up asserted somewhere before the old assertion goes.
- Fix a warning you have not read to the end. Some of the warnings this project
  carries are deliberate, and the reason is written down next to them.
- Add a feature. This file is about making what exists correct. A new idea goes
  into `PLAN.md` as an idea, with the measurement that would justify it.
- Bump a dependency and call green continuous integration a smoke test. The
  build passing is not the extension running.
- Use an em dash in anything a third party reads.

---

## 7. How this file is kept honest

Re-read this section at the end of every pass and fix what it catches.

- No fact about the repository appears above: no version, no count, no status,
  no store state, no branch name that is not structural.
- Every axis in section 2 carries a bar expressed as a number or a
  countable condition, and a witness.
- Every bar is falsifiable: you can describe the input that makes it red.
- No axis is closed on an adjective.
- Nothing here contradicts `.agent/PROMPT.md`; it extends it.
- No absolute path from a private machine, no personal data, no third party's
  name. This file is written as if a stranger will read it.

If a pass finds an axis that none of A1 to A22 covers, that is a defect in this
file and not in the pass. Add the axis, with its four lines, before doing the
work.
