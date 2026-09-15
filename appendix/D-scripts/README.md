# Appendix D. Scripts

The probes as they were actually run, not cleaned-up versions of them.

| Script | What it measures | Used in |
|---|---|---|
| `probe-render-sinks.mjs` | Markup sinks, text-node writes, direction-attribute assignments, and whether any source handles direction-control characters | [11.3](../../thesis/11-privacy-surface.md#replication-bidirectional-text), [13.7](../../thesis/13-results.md#137-observable-surface) |
| `audit-spec.mjs` | The audit specification against the conditions it was written under | [appendix B](../B-prompt-construction.md), pass 16 |

Both take a path argument and print to standard output. Neither writes
anything.

## Two things they are built to demonstrate

**A probe that measured nothing must fail.** `probe-render-sinks.mjs` exits
non-zero when it finds no text writes at all, because a clean run over zero
files is indistinguishable from a clean run over clean code. This is the rule
from [chapter 3](../../thesis/03-method.md#a-probe-that-saw-nothing-must-fail-not-pass),
and it is the cheapest of them to implement.

**A mechanical audit cannot test a specification.** `audit-spec.mjs` reports
every condition green on a document that contained three requirements no system
could meet. It says so in its own output, because a tool whose limits are
printed beside its result is harder to misread than one whose limits live in a
document nobody opens.

## The classification step is not automated, deliberately

`probe-render-sinks.mjs` reports call sites and refuses to guess which of them
carry untrusted text. That judgement needs the callers traced, and automating
it would hide the step where this study first went wrong: an earlier version
inferred the answer and published a fraction that three levels of scrutiny
later reduced to nothing. See
[appendix B](../B-prompt-construction.md#what-pass-9-produced-and-what-pass-30-took-back).
