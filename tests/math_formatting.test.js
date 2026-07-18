/* Math formatting guard.
 *
 * House rule: expressions are written with spaces around binary operators, so they are easy on the
 * eye and on the mind. "a×d = b×c" is harder to parse than "a × d = b × c", and in a superscript
 * "a^m+n" actively hides the grouping.
 *
 * It deliberately does NOT flag unary signs — "+24", "−7" and "×2" ("undo the ×2") are correct as
 * written, because there is no left-hand operand to separate from.
 *
 * Run:  node tests/math_formatting.test.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const FILES = fs.readdirSync(DIR).filter(f => /\.html$/.test(f));

// entities -> plain text, so the check sees what the student sees
const decode = s => s
  .replace(/<sup>(.*?)<\/sup>/g, '^$1')
  .replace(/<[^>]+>/g, '')
  .replace(/&times;/g, '×').replace(/&divide;/g, '÷').replace(/&minus;/g, '−')
  .replace(/&plusmn;/g, '±').replace(/&hellip;/g, '…').replace(/&middot;/g, '·')
  .replace(/&radic;/g, '√').replace(/&nbsp;/g, ' ').replace(/&frac12;/g, '½')
  .replace(/&le;/g, '≤').replace(/&ge;/g, '≥').replace(/&ne;/g, '≠')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// A binary operator needs air on both sides. Unary signs have no left operand, so they are exempt.
const cramped = t => /\S[×÷=]\S/.test(t) || /[A-Za-z0-9)][+][A-Za-z0-9(]/.test(t);

let violations = 0, scanned = 0, filesWithMath = 0;
for (const f of FILES) {
  const h = fs.readFileSync(path.join(DIR, f), 'utf8');
  const spans = [...h.matchAll(/<span class="math">([\s\S]*?)<\/span>/g)].map(m => decode(m[1]).trim());
  if (!spans.length) continue;
  filesWithMath++;
  scanned += spans.length;
  const bad = [...new Set(spans.filter(cramped))];
  if (bad.length) {
    violations += bad.length;
    console.log('FAIL ' + f);
    bad.forEach(t => console.log('       cramped: ' + t));
  }
}

console.log((violations ? '\n' : '') + 'scanned ' + scanned + ' math spans across ' + filesWithMath + ' file(s)');
console.log(violations === 0 ? 'PASS  all expressions are spaced' : 'FAIL  ' + violations + ' cramped expression(s)');
process.exit(violations ? 1 : 0);
