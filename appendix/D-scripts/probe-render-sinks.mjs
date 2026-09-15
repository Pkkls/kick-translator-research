#!/usr/bin/env node
/**
 * Probe: how much of the rendering surface is guarded.
 *
 * Answers two questions about a browser extension's content script, in the
 * form the thesis argues for: a guard is a FRACTION of the surfaces that need
 * it, never a presence.
 *
 *   1. Markup sinks. Does any chat-derived or provider-derived text reach a
 *      sink that interprets markup?
 *   2. Direction handling. Of the surfaces that render untrusted text, how
 *      many carry a direction attribute?
 *
 * Usage:
 *   node probe-render-sinks.mjs <path-to-extension-repo>
 *
 * Exit code is 0 when it measured something, 2 when it measured nothing.
 * A probe that saw nothing must fail, not pass: a clean run over zero files
 * looks exactly like a clean run over a clean codebase.
 *
 * Reads sources. It does not observe a running build, so it reports call
 * sites, not what a reader sees. See thesis ch. 14 on that limitation.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = process.argv[2];
if (!root) {
  console.error('usage: node probe-render-sinks.mjs <path-to-extension-repo>');
  process.exit(2);
}
const SRC = join(root, 'src', 'content');

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(name) && !/\.test\./.test(name)) acc.push(p);
  }
  return acc;
}

const files = walk(SRC);
if (files.length === 0) {
  console.error('FAIL: no source files found under ' + SRC);
  process.exit(2);
}

// --- 1. markup sinks -------------------------------------------------------

const MARKUP_SINKS = [
  ['innerHTML', /\binnerHTML\s*=/],
  ['outerHTML', /\bouterHTML\s*=/],
  ['insertAdjacentHTML', /insertAdjacentHTML\s*\(/],
  ['createContextualFragment', /createContextualFragment\s*\(/],
  ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML/],
  ['document.write', /document\.write\s*\(/],
  ['eval', /\beval\s*\(|new Function\s*\(/],
];

const markupHits = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [name, re] of MARKUP_SINKS) {
      if (re.test(line)) {
        markupHits.push({ file: relative(root, file).split(sep).join('/'), line: i + 1, sink: name, text: line.trim() });
      }
    }
  });
}

console.log('## markup sinks');
console.log('files scanned: ' + files.length);
if (markupHits.length === 0) {
  console.log('none');
} else {
  for (const h of markupHits) console.log('  ' + h.file + ':' + h.line + '  ' + h.sink + '  ' + h.text.slice(0, 90));
  console.log('\nEach hit needs manual classification: a sink fed only by');
  console.log('author-controlled constants is not an injection path.');
}

// --- 2. direction handling -------------------------------------------------

// Text-node writes are the surfaces that render text. Whether a given one
// carries untrusted text is a judgement, so the probe reports all of them
// with their nearest direction attribute and leaves the classification
// visible rather than hiding it in a heuristic.
const textWrites = [];
const dirSets = [];
for (const file of files) {
  const rel = relative(root, file).split(sep).join('/');
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/\.(textContent|innerText)\s*=/.test(line)) textWrites.push({ file: rel, line: i + 1, text: line.trim() });
    if (/\.dir\s*=|setAttribute\(\s*['"]dir['"]/.test(line)) dirSets.push({ file: rel, line: i + 1, text: line.trim() });
  });
}

console.log('\n## text-node writes');
console.log('total: ' + textWrites.length);
for (const w of textWrites) console.log('  ' + w.file + ':' + w.line + '  ' + w.text.slice(0, 90));

console.log('\n## direction attribute set');
console.log('total: ' + dirSets.length);
for (const d of dirSets) console.log('  ' + d.file + ':' + d.line + '  ' + d.text.slice(0, 90));

// --- 3. direction-control awareness ---------------------------------------

const BIDI_CHARS = /\\u202[A-E]|\\u206[6-9]|\\u200[B-F]|\\uFEFF/;
const bidiAware = files.filter((f) => BIDI_CHARS.test(readFileSync(f, 'utf8')));
console.log('\n## files referencing a direction-control or zero-width character');
console.log(bidiAware.length === 0 ? 'none' : bidiAware.map((f) => relative(root, f)).join('\n'));

// --- verdict ---------------------------------------------------------------

console.log('\n## fraction');
console.log('direction attribute set at ' + dirSets.length + ' of ' + textWrites.length + ' text-node writes.');
console.log('Classify which writes carry untrusted text before reading that as a rate:');
console.log('a status string the extension authors itself needs no guard.');

// The assertion that makes a silent no-op impossible.
if (textWrites.length === 0) {
  console.error('\nFAIL: zero text-node writes found. The probe measured nothing.');
  process.exit(2);
}
