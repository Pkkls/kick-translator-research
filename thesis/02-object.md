# 02. Live chat as a linguistic object

> Live-stream chat is not short text. It is a distinct communicative situation
> that produces a distinct kind of writing, and nearly every property that
> makes it distinct is a property that breaks a language identifier.

---

## 2.1 The situation

Live-stream chat differs from every other written medium that natural language
processing usually targets, along dimensions that matter:

**Synchrony.** The chat accompanies a broadcast in real time. Messages comment
on something both writer and reader are watching now, and stop making sense
minutes later. Context is enormous and entirely external to the text.

**Massive parallelism without turn-taking.** Conversation analysis is built on
turn-taking: one speaker, then another, with the floor as a scarce resource. In
a busy chat there is no floor. Hundreds of participants write simultaneously,
addressing no one in particular, and adjacency in the rendered list carries no
guarantee of relatedness. Two consecutive lines are usually unrelated.

**Ephemerality.** A line scrolls away in seconds. This shapes what gets
written, favouring what can be produced and read quickly, and it sets the
latency budget analysed in [chapter 10](10-latency-weight.md).

**Phatic dominance.** A large share of traffic does not transmit propositional
content. It signals presence, alignment and reaction: laughter, agreement,
an emote, a repeated character. In Jakobson's terms the phatic and emotive
functions dominate over the referential one.

**Public and unaddressed.** Unlike messaging, chat is written for an audience
of strangers with no shared private context, which makes it more formulaic and
more reliant on community-wide conventions than private short text.

## 2.2 What the situation produces

Each property above has a direct orthographic consequence, and together they
describe the input this system must handle.

| Situational property | Written consequence | Consequence for identification |
|---|---|---|
| Speed and ephemerality | Extreme brevity; abbreviation; no punctuation | Below the evidence floor of any statistical model ([ch. 7](07-brevity.md)) |
| Phatic dominance | Laughter, interjections, emotes as complete turns | Much traffic is not sentences at all ([ch. 6](06-laughter.md), [ch. 8](08-noise.md)) |
| Community conventions | Emote codes, in-group forms, platform-specific tokens | Non-linguistic strings in linguistic position ([ch. 8](08-noise.md)) |
| International audience, local keyboards | Transliteration and romanisation | Language present, script absent ([ch. 5](05-transliteration.md)) |
| Mixed-language audiences | Code-switching within and across lines | Multiple languages per unit of analysis |
| Expressive intent, no prosody available | Letter repetition, capitals, repeated punctuation | Orthographic deviation that filters mistake for noise ([ch. 8](08-noise.md)) |

## 2.3 Written orality

The register is best described by the distinction between the **medium** of an
utterance and its **conception**. Chat is graphic in medium and oral in
conception: it is written down, and it is organised like speech, produced under
time pressure, with high context dependence, low planning, and features that
written language usually excludes.

This framing explains several things at once that would otherwise look like
separate problems:

- **Lengthening** (`siiiiiii`) transcribes duration, which in speech carries
  emphasis. It is prosody written down, not a typo ([ch. 8](08-noise.md#expressive-lengthening-and-why-it-broke-the-first-version)).
- **Laughter** is a non-verbal vocalisation that speech carries directly and
  writing must encode by convention, which is why its written form varies by
  community and identifies one ([ch. 6](06-laughter.md)).
- **The absence of punctuation** is not carelessness. Punctuation encodes
  structure that speech carries prosodically, and a medium organised orally has
  less use for it.

An identifier trained on edited prose encounters, in chat, a systematically
different object. It is not degraded prose. It is a different variety, with its
own regularities, and its deviations are structured rather than random.

## 2.4 The emote as a lexical unit

Streaming platforms give communities named images that render inline. In use
they behave like lexical items: they occupy argument positions, they carry
conventional meaning within a community, they inflect through repetition, and
they can constitute a complete turn.

For a translation system they present a genuine dilemma, and the corpus shows
both horns:

- Translated, they become nonsense, since the code is an arbitrary name.
- Deleted, the message can lose its content entirely, since for many lines the
  emote *is* the message.
- Detected by orthographic convention, the heuristic over-generates into real
  language ([ch. 8](08-noise.md#a-mixed-case-rule-against-brand-names)).

The only robust solution is a platform-supplied inventory, which reduces a
linguistic problem to a data problem. Where no inventory is available the
system is guessing, and the corpus shows precisely what guessing costs.

## 2.5 The corpus problem, stated at the outset

Everything above describes the input. The decisive methodological limitation of
this study, and of the project it examines, is that **the input distribution
was never observed**.

**[reported]** The project's work queue records this as its own outstanding
request: every corpus used for its benches is hand-written, and four separate
decisions are blocked on the absence of a real chat capture, each currently
taken by refusing to move. A collector script exists and has not been run
against live traffic.

The consequence is that this corpus supports strong claims about **mechanisms**
and weak claims about **frequencies**. It can establish that a homoglyph makes
a one-character floor unsafe, that a keyboard-row criterion separates smash
from Czech, that grouping by target inherits the wrong source. It cannot
establish how often any of these occurs in real traffic, which is exactly what
would be needed to rank them or to justify weight spent on them.

[Chapter 14](14-limits.md) develops this and states which conclusions in this
study fail if the frequency assumptions are wrong.

## 2.6 What this chapter licenses

1. Live chat is a variety with its own regularities, not degraded prose, and
   its deviations are structured.
2. Its situational properties map directly onto the failure modes of
   statistical identification, which makes those failures predictable rather
   than incidental.
3. Phatic traffic is a large share of the input, which makes non-sentence
   objects central rather than marginal.
4. Emote codes occupy lexical positions while being non-linguistic, and no
   orthographic heuristic separates them reliably from language.
5. Mechanism claims in this study are well supported; frequency claims are not
   supported at all.
