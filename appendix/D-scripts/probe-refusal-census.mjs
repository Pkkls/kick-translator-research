/**
 * Census: every deliberate refusal in the detection path, and what happens to it.
 *
 * [4.109](../E-method-log.md) found one. `cyrilliqueQuelleLangue` answers
 * `undefined` for Mongolian on purpose, `detectLanguage` reads that as absence
 * of information, and franc overwrites it. The obvious next question is whether
 * that was one bug or one instance, and the answer needs a census rather than
 * another example, because an example found by hand is found where someone
 * looked.
 *
 * So the enumeration is done on the **TypeScript AST**, using the compiler the
 * clone already depends on. Every `return undefined` in the detection path is
 * located, with the condition guarding it, and split three ways:
 *
 * - **the fall-through** — the last statement of the function. Nothing was
 *   established; this is *I found nothing*.
 * - **nothing yet** — guarded, but the guard tests that there is nothing to work
 *   with: an empty string, a one-character message, franc itself answering
 *   `und`. Also *I found nothing*, reached earlier.
 * - **a refusal** — guarded by a test on a positive property of the content.
 *   Something **was** established and the function is declining to name it.
 *
 * Eleven returns, five refusals. The distinction matters because all three leave
 * the same value behind and no caller can see which it has.
 *
 * **The finding is not that refusals are erased.** One of them wants to be: the
 * pure-Han branch returns `undefined` with the comment *defer to franc so
 * Chinese isn't mislabelled as Japanese*, and franc is the intended answer. Ten
 * lines away the Mongolian branch returns the same value with a comment saying
 * franc-min does not carry Mongolian at all. **Same value, opposite intentions,
 * in one function**, and nothing in the type or the value separates them.
 *
 * What decides a refusal's fate is measured here rather than argued: it is
 * whether `francToIso2` can map whatever franc says about that text. A refusal
 * survives when franc's answer is unmappable and is erased when franc is wrong
 * in a direction the product can name. That is not a mechanism, it is the
 * intersection of two libraries' vocabularies.
 *
 * What it cannot see, asked in the pass that wrote it:
 *
 * - Refusals expressed as something other than `return undefined` — a thrown
 *   error, a sentinel object, an empty string. The census is of one shape and
 *   says so.
 * - Whether a guarded return is *meant* as a refusal. The AST says a test
 *   succeeded; whether the author meant to establish a fact is read from the
 *   comment beside it, by hand, in 4.110. This script reports the guard text so
 *   that reading can be checked rather than trusted.
 * - Two of the five refusals. The short-word and romanised vote conflicts need
 *   an input where two markers disagree, which this bench does not construct;
 *   they are listed by the census and left unmeasured rather than counted clean.
 *
 *   node appendix/D-scripts/probe-refusal-census.mjs /path/to/kick-chat-translator
 */
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync, readdirSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.argv[2];
if (!root) {
  console.error('usage: probe-refusal-census.mjs <path-to-extension-repo>');
  process.exit(2);
}
for (const p of ['node_modules/typescript/lib/typescript.js', 'node_modules/esbuild/lib/main.js']) {
  if (!existsSync(join(root, p))) {
    console.error('cannot measure: no ' + p + ' under ' + root);
    process.exit(2);
  }
}

// ── the census, from the compiler's own tree ────────────────────────────────
const ts = createRequire(join(root, 'package.json'))('typescript');
const BACKSLASH = String.fromCharCode(92);
const norm = (p) => resolve(p).split(BACKSLASH).join('/').toLowerCase();
const walk = (d, a = []) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, a);
    else if (/\.tsx?$/.test(p) && !/\.test\.tsx?$/.test(p)) a.push(p);
  }
  return a;
};
const files = walk(join(root, 'src'));
// The detection path, named rather than globbed: this is a claim about which
// files decide a language, and a reader can disagree with the list.
const PATH_FILES = [
  'src/content/langDetect.ts', 'src/shared/romanised.ts',
  'src/shared/laughter.ts', 'src/shared/arabizi.ts',
].map((f) => norm(join(root, f)));
const prog = ts.createProgram(files, {
  noEmit: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler, strict: true, jsx: ts.JsxEmit.ReactJSX,
});
const checker = prog.getTypeChecker();
const isUndefReturn = (n) => ts.isReturnStatement(n) &&
  (!n.expression || (ts.isIdentifier(n.expression) && n.expression.text === 'undefined'));

const census = [];
for (const sf of prog.getSourceFiles()) {
  if (!PATH_FILES.includes(norm(sf.fileName))) continue;
  const visit = (n) => {
    if ((ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.name && n.body) {
      const sig = checker.getSignatureFromDeclaration(n);
      const ret = sig ? checker.typeToString(checker.getReturnTypeOfSignature(sig)) : '';
      if (/\bundefined\b/.test(ret)) {
        const body = n.body;
        const last = body.statements[body.statements.length - 1];
        const scan = (x) => {
          if (isUndefReturn(x)) {
            let guard = null, p = x.parent;
            while (p && p !== body) {
              if (ts.isIfStatement(p)) { guard = p.expression.getText(sf); break; }
              p = p.parent;
            }
            census.push({
              fn: n.name.getText(sf), file: norm(sf.fileName).split('/').slice(-2).join('/'),
              line: sf.getLineAndCharacterOfPosition(x.getStart()).line + 1,
              guard, terminal: x === last,
            });
          }
          if (!ts.isFunctionDeclaration(x) && !ts.isFunctionExpression(x) && !ts.isArrowFunction(x)) {
            ts.forEachChild(x, scan);
          }
        };
        ts.forEachChild(body, scan);
      }
    }
    ts.forEachChild(n, visit);
  };
  ts.forEachChild(sf, visit);
}
// A guarded return is not automatically a refusal. Several of these guards test
// that there is **nothing to work with**: an empty string, a one-character CJK
// message, franc itself answering `und`. That is not a decision about the text,
// it is the absence of one. A refusal tests a **positive property of the
// content**. The split is by that rule, and every guard is printed beside its
// verdict so the reading can be checked rather than trusted. The first version
// of this line called all nine of them refusals and was wrong by four.
const NOTHING_YET = [
  /^!\w+$/,                       // !t — the input is empty
  /length\s*===?\s*0/,            // trimmed.length === 0
  /total\s*<|length\s*</,         // total < 2 — too few characters to count
  /===\s*'und'/,                  // franc answered nothing
];
const kind = (c) => {
  if (!c.guard || c.terminal) return 'no answer';
  return NOTHING_YET.some((re) => re.test(c.guard.trim())) ? 'nothing yet' : 'refusal';
};
const refusals = census.filter((c) => kind(c) === 'refusal');
const nothingYet = census.filter((c) => kind(c) === 'nothing yet');

console.log(census.length + ' returns of undefined in the detection path: ' +
  refusals.length + ' test a property of the text, ' + nothingYet.length +
  ' test that there is none,\n' + (census.length - refusals.length - nothingYet.length) +
  ' are the fall-through at the end\n');
console.log('  where                                  kind          the condition that was true');
for (const c of census) {
  console.log('  ' + (c.file + ':' + c.line).padEnd(38) + kind(c).padEnd(14) +
    (c.guard ? c.guard.slice(0, 58) : ''));
}

// ── what happens to each, driven ───────────────────────────────────────────
const esbuild = await import(pathToFileURL(join(root, 'node_modules/esbuild/lib/main.js')).href);
const tmp = mkdtempSync(join(tmpdir(), 'kt-census-'));
const bundle = async (n, c) => {
  const o = join(tmp, n + '.mjs');
  await esbuild.build({
    stdin: { contents: c, resolveDir: root, sourcefile: n + '.ts', loader: 'ts' },
    bundle: true, format: 'esm', platform: 'neutral', outfile: o, logLevel: 'silent',
  });
  return import(pathToFileURL(o).href);
};
const { detectLanguage, confidentLanguage } =
  await bundle('d', "export { detectLanguage, confidentLanguage } from './src/content/langDetect';\n");
const { francToIso2 } = await bundle('l', "export { francToIso2 } from './src/shared/languages';\n");
const { franc } = await bundle('f', "export { franc } from 'franc-min';\n");

// Three benches, one per constructible refusal, written for this pass and
// printed in full at the end.
const BENCH = {
  'Urdu, the letters test': {
    want: 'the refusal to stand, so it is not announced as Arabic',
    lines: ['آپ کیسے ہیں سب لوگ', 'یہ بہت مزے کی بات تھی', 'میں سمجھتا ہوں کہ وہ ٹھیک ہے',
      'آج ہم نیا کھیل کھیلیں گے', 'مجھے یقین نہیں آ رہا', 'سٹریم کا شکریہ بہت اچھا تھا',
      'کوئی جانتا ہے کب شروع ہوگا', 'مجھے لگتا ہے یہ خرابی ہے', 'چلو دوبارہ کوشش کرتے ہیں',
      'وہ ہمیشہ ایسا ہی کرتا ہے'],
    stand: true,
  },
  'pure Han, the ambiguity test': {
    want: 'franc to answer, which the comment beside it asks for',
    lines: ['大家好今天过得怎么样', '这真的太好笑了', '我觉得他说得对', '今天我们玩新游戏',
      '真不敢相信会这样', '谢谢直播非常精彩', '有人知道什么时候开始吗', '我觉得这是个错误',
      '我们再试一次吧', '他总是这样做'],
    stand: false,
  },
  'Mongolian, the letters and particles test': {
    want: 'the refusal to stand; franc-min does not carry Mongolian at all',
    lines: ['өнөөдөр шинэ тоглоом тоглоно', 'өнөө орой чөлөөтэй юу', 'та нар юу хийж байна',
      'өчигдөр орой унтсангүй', 'сайн байна уу бүгдээрээ', 'би түүнийг зөв гэж бодож байна',
      'ийм болсонд итгэхгүй байна', 'хэзээ эхлэхийг хэн нэгэн мэдэх үү', 'дахин оролдоод үзье',
      'тэр үргэлж ингэдэг'],
    stand: true,
  },
};

console.log('\nWhat each refusal is worth once detectLanguage has it:\n');
const results = {};
for (const [name, b] of Object.entries(BENCH)) {
  const refused = b.lines.filter((l) => confidentLanguage(l) === undefined);
  const stood = refused.filter((l) => detectLanguage(l) === undefined);
  const codes = [...new Set(refused.map((l) => franc(l, { minLength: 3 })))];
  results[name] = { refused: refused.length, stood: stood.length, codes };
  console.log('  ' + name);
  console.log('      wants ' + b.want);
  console.log('      the lookup refuses           ' + refused.length + ' of ' + b.lines.length);
  const held = stood.length === refused.length;
  console.log('      the refusal survives         ' + stood.length + ' of ' + refused.length +
    '   ' + (held === b.stand ? 'as it wants' : 'NOT what it wants'));
  console.log('      franc says                   ' + codes.join(' ') +
    '  →  ' + codes.map((c) => francToIso2(c) ?? 'unmappable').join(' '));
}

console.log('\nThe mechanism, so the rates above are not mistaken for one:');
console.log('  a refusal survives exactly when francToIso2 cannot map what franc said.');
for (const c of ['urd', 'skr', 'khk', 'mon', 'cmn', 'rus', 'bul', 'ara', 'pes']) {
  console.log('      francToIso2(' + c + ') = ' + (francToIso2(c) ?? 'undefined'));
}

console.log('\nThe benches, so the populations can be disagreed with:');
for (const [name, b] of Object.entries(BENCH)) {
  console.log('  ' + name);
  for (const l of b.lines) console.log('      ' + l);
}
rmSync(tmp, { recursive: true, force: true });

// A probe that measured nothing must fail.
if (refusals.length < 3) {
  console.log('\nECHEC: the census found ' + refusals.length + ' guarded returns in the detection');
  console.log('path. The shape has moved and this measurement is stale, not clean.');
  process.exit(2);
}
if (results['pure Han, the ambiguity test'].stood !== 0) {
  console.log('\nECHEC: the Han branch no longer defers to franc, so the control that proves');
  console.log('this instrument can see a surviving fall-through is gone.');
  process.exit(2);
}

// The exit code asserts the finding.
const urdu = results['Urdu, the letters test'];
const mongol = results['Mongolian, the letters and particles test'];
if (urdu.stood !== urdu.refused) {
  console.log('\nECHEC: an Urdu refusal was overwritten, which 4.110 recorded as not happening');
  console.log('today only because francToIso2 cannot map urd. That accident has ended.');
  process.exit(1);
}
if (mongol.stood === mongol.refused) {
  console.log('\nECHEC: every Mongolian refusal survived, so 4.109 is fixed or franc changed');
  console.log('its answers, and this study is stale either way.');
  process.exit(1);
}
console.log('\nThree refusals, one value, three fates. Han wants the fall-through and gets it.');
console.log('Urdu wants to stand and stands, but only because francToIso2 cannot map what');
console.log('franc says about Urdu. Mongolian wants to stand and does not, because franc is');
console.log('wrong about it in a direction the product can name. Nothing in the value, the');
console.log('type, or the call separates the three: only the vocabulary of another library.');
process.exit(0);
