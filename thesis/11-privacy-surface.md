# 11. Privacy and observable surface

> Perfect concealment is not available to an extension that renders visible
> content. The quantity that is actually under the author's control is the
> **cost** of detection, and this corpus contains a door closed carefully on
> one side and left open on the other.

---

## 11.1 What leaves the machine

The system's threat surface is defined by a small, enumerable set of outbound
destinations, declared in the manifest: the host site, a release-metadata
endpoint for update checks, and the translation providers. On-device
translation adds none.

Two decisions in the corpus are worth preserving.

### The key moved from synced storage to local storage

**[reported]** The provider API key was moved from `storage.sync` to
`storage.local`.

The distinction is not cosmetic. Synced storage replicates through the browser
vendor's own infrastructure to the user's other devices. A credential placed
there leaves the machine as a matter of course, and is stored by a third party
that has nothing to do with the translation provider or with the extension. Local
storage stays on the device.

The general rule this instance supports: **a user-supplied credential belongs
in the narrowest storage scope that satisfies the feature.** Cross-device
convenience is a feature request, and it is not free; it converts a local
secret into a replicated one.

### The declared data collection matches the mechanism

The Firefox manifest declares collection of website content, and the
justification states the mechanism precisely: chat message text is transmitted
to the user-selected translation provider, nothing else, with no analytics and
no accounts, and on-device mode transmits nothing.

That declaration is verifiable against the traffic, which is what makes it
worth something. The audit axis derived from it asks for the comparison to be
made mechanically: capture every request across every provider, then compare
field by field against the privacy text and the declared permissions.

### Deliberate validation warnings

**[reported]** Three store-validation warnings are recorded as deliberate, with
reasons, and the corpus explicitly instructs against "fixing" them:

- Two concern a minimum-version declaration. Raising the minimum would silence
  the warnings and drop every user below it; the declaration exists for the
  reviewer, and the permission remains visible to those users regardless.
- One reports an unsafe HTML assignment inside a vendored framework's own
  diffing code, on a branch that is unreachable in this application because the
  source contains no such usage.

This is a small but real contribution to the practice of shipping: **a warning
whose correct disposition is "leave it" needs its reasoning written next to it,
or the next contributor will silence it and pay the cost.** An accepted warning
without a recorded justification is indistinguishable from an ignored one.

## 11.2 Detectability, and the door closed on one side

The manifest carries a comment explaining that web-accessible resources were
removed because what remained *"gave any script on a kick.com page a stable URL
to query to confirm the extension is installed"*.

The reasoning is exactly right. The measurement that accompanied it is
incomplete, and this study measured the rest.

### Replication [new]

Method: enumerate every stable, page-observable signal the content script
creates on nodes reachable from the shared document, by reading the injected
stylesheet and the DOM-writing call sites in the content script sources.

Findings, against the repository as it stood during this study:

Method, second pass: the population is every stable signal the content script
leaves on a node reachable from the shared document, so the scope is all
nineteen content-script files rather than the three the first probe read.

| Signal | Location | Queryable by a page script as |
|---|---|---|
| `kt-inject-style` | a `<style>` on the document element | `getElementById` |
| `data-kt-scheme` | attribute on the document element | an attribute read on `<html>` |
| `kt-hide-original` | class toggled on the document element | `classList.contains` |
| `kt-compose-bar`, `kt-floating-bar`, `kt-float-lang-menu` | element ids on the body | `getElementById` |
| `kt-lang-chip`, `kt-lang-menu`, `kt-lang-list` | element ids on the body | `getElementById` |
| `data-kt-id` | attribute on the host's own chat rows | an attribute selector |
| 98 distinct class names sharing a fixed prefix | injected stylesheet | a class selector |

All are string literals; none is generated at runtime, so a page script can
hard-code any of them. The first pass of this measurement reported four, from a
probe whose scope was three files.

The removed vector required a network fetch. The remaining vectors require a
single synchronous DOM call.

**The project went further than the removal, and this study first reported it
as though it had not.** The corpus records that the content script fetches
nothing at runtime, zero `getURL`, zero dynamic import, all 22 stylesheet
`url()` inline as `data:` SVG; that six resources reachable from any page were
removed; and that a **gate** was built to hold the line **[reported]**. It loads
the real extension against a local fixture served at the host's own URL, asserts
the manifest exposes nothing, and carries two witnesses: pointing the content
script at a missing file, and re-exposing one chunk.

So the manifest half of this question is instrumented and guarded. The eleven
signals above are the other half, they are DOM identifiers, and nothing asserts
anything about them. **The door was closed, and gated, on one side; the other
side was never framed as part of the same question.**

**The corpus also states the stake better than this study had.** Its note is
that detectability matters more here than in most extensions *because the host
site already walls off what it detects*. That moves the axis out of privacy and
into product survival: a stable queryable name is what a countermeasure keys
on, costing the site one line and the extension a release cycle. The reader's
privacy is the secondary consideration.

### The correct formulation of the bar [new]

An extension that renders visible content into a page cannot be undetectable:
a determined page script can always find it by reading what changed on screen.
Any specification demanding otherwise is unsatisfiable, and this study's first
draft of the audit axis demanded exactly that before execution falsified it
(see [chapter 3](03-method.md#36-method-applied-to-method-what-execution-falsified)).

The defensible bar is a cost bar:

> Finding the extension should cost a page script a read of rendered content.
> No signal should reduce it to a query by name. Every remaining shortcut is
> either required by the product, with the requirement written down next to it,
> or removed.

Under that bar the four signals this section first listed divide cleanly. Class
names are required: styling needs selectors. The processed marker is arguably
required: the observer needs idempotence, though a non-enumerable property or a
WeakSet would serve. The fixed stylesheet id and the document-element attribute
are conveniences, and both are replaceable by mechanisms that leave no queryable
name. The seven added when all nineteen files were read, six ids on the
extension's own elements and a class on the document element, were not sorted
against the bar **[new]**: this paragraph was written for four and kept saying
four after the list above became eleven.

### Why it recurs

This is structurally the same failure as
[chapter 4's](04-script-vs-language.md#45-the-finding-about-findings) writing-system
defect: a general diagnosis, *the page must not be able to query for us*, applied
to one vector and recorded as settled. The remedy is the same rule:

> A guard is measured as a fraction of the surfaces that need it, never as a
> presence. One occurrence reads as "handled" to a search and as "handled in
> one place of several" to a count.

## 11.3 Hostile input

The chat is written by strangers, so the input is occasionally adversarial
rather than merely noisy. [Chapter 7](07-brevity.md#72-what-happens-at-one-character)
already showed homoglyph substitution arriving through this door.

### Replication: markup [new]

Method: enumerate every call site that writes chat-derived or provider-derived
text into the DOM across the content script sources, and classify by whether
the sink interprets markup.

Result: every such write uses a text-node sink. The single `innerHTML`
occurrence in the content sources assigns markup that the project authors
itself, from an internal icon table, to an SVG element, and takes no external
input. No markup injection path from chat text or provider responses was found.

### Replication: bidirectional text [new]

Direction-changing characters are a different matter, and they are the case
where the guard is a fraction.

This study's first measurement here was wrong, and the correction is kept
because it is an instance of the hazard
[chapter 3](03-method.md#verify-the-failure-is-in-the-product-before-correcting-it)
names as the most common way to waste a pass.

The first probe looked for a direction attribute near each text write and
reported one guarded surface of three. A second probe, which enumerated
attribute assignments per element rather than per write, found that the
outgoing-preview element receives `dir="auto"` at construction, twenty lines
above the write that fills it. The corrected count:

| Surface | Direction handling |
|---|---|
| The translated line appended under a message | `dir="auto"` set at construction |
| The preview of the reader's own outgoing message | `dir="auto"` set at construction |
| The error text rendered on a line | none |

Tracing what the third surface actually receives narrows the finding further.
Its callers pass either an internal ASCII error code, or an interface string
from the extension's own localisation. So it carries no chat text and no
provider text: it is not an untrusted-input surface at all.

What remains is smaller and belongs to a different axis. The extension's
interface is localised into languages written right to left, so that surface
can render a right-to-left interface string with the page's base direction,
which mis-places its punctuation. That is an internationalisation defect
([ch. 8](08-noise.md) covers the linguistic side; the audit specification files
it under interface i18n), not a hostile-input one.

The hostile-input question has a separate answer, and it is unchanged by the
correction: **no source file in the content script references a direction-control
or zero-width character at all.**

Two observations on the consequences, stated carefully because the mechanism is
easy to overstate.

First, `dir="auto"` does more than choose a base direction. The HTML user-agent
stylesheet gives elements carrying it `unicode-bidi: isolate`, so each of the
two guarded surfaces is insulated from its siblings: an unterminated override
inside one cannot reorder text outside it. That protection is real, it was not
visible to the first probe, and it covers both surfaces that carry untrusted
text.

Second, isolation does not make the content correct **within** the element. An
override character inside the text still reorders the remainder of that
element's own content. For a translation product this is the failure that
matters: the product's entire purpose is to render text faithfully, and a chat
line can make the rendering disagree with its source. The outgoing preview is
the sharper case, because it is the surface on which the reader decides what to
send.

So the corrected position is: **containment is handled, content integrity is
not.** No neutralisation or isolation of direction-control characters inside
the text exists anywhere in the sources, and nothing in this corpus measures
what a reader sees when one arrives. That measurement needs a browser and the
built artefact; this study read sources. It is [15.7](15-future.md#157-direction-handling-across-all-surfaces).

The methodological residue is worth more than the defect. A probe that looked
for a guard *near a write* reported a rate of one in three. A probe that looked
for the guard *on the element* reported two in three, and tracing the remaining
surface to its callers removed it from the population entirely. Three different
answers from three levels of rigour, on a question that looked binary.

## 11.4 What this chapter licenses

1. A user-supplied credential belongs in the narrowest storage scope that
   satisfies the feature; synced storage is a replication decision, not a
   storage location.
2. A privacy declaration is worth what its verifiability is worth; the check is
   a traffic capture compared field by field, not a reading of the text.
3. An accepted warning needs its reasoning recorded beside it, or it is
   indistinguishable from an ignored one.
4. Undetectability is unachievable; the controllable quantity is the cost of
   detection, and dedicated queryable names are what collapse it.
5. Direction handling, like every guard, is a fraction of the surfaces that
   need it. Text-node sinks close the markup question and say nothing about the
   direction question.

---

*Sources: manifest configuration and its comments; `HANDOFF.md` section 6; work
queue. Measurements marked **[new]** were taken for this study against the
repository during the session; the probes are in
[appendix D](../appendix/D-scripts/).*
