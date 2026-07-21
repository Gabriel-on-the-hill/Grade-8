/* Accessibility guard.
 *
 * The engine had NO standing a11y check until 21 Jul 2026, and the cost of that was already paid
 * once: the click-to-plot format shipped keyboard-only-inaccessible and locked six items — one a real
 * MCAP capstone — away from keyboard and screen-reader users (trap #9). It was caught because someone
 * thought to ask, which is not a control.
 *
 * What this guards, and why each one is mechanical rather than a matter of taste:
 *
 *   A. every <svg> is either NAMED or explicitly decorative. An unnamed graphic is announced as an
 *      anonymous "graphic" and its content is simply lost.
 *   B. no EXAM card may carry an unnamed <svg>. This is HANDOFF D8 made checkable: if an exam item's
 *      stimulus is an unnamed graphic, the item is answerable only by eye. Decorative-marking an
 *      exam figure does not dodge this — see the aria-hidden rule below.
 *   C. every modal announces itself as a dialog and takes a name from its own heading.
 *   D. the plot control keeps the keyboard affordances added on 20 Jul — focusable, a role, a value,
 *      and an arrow-key handler. This is a regression guard for the exact defect that motivated it.
 *
 * What it deliberately does NOT try to check: whether an accessible name gives away its own item's
 * answer. That is a judgement call (r3-7's labels stated "slope one half" when the item asks which
 * graph has k = 1/2 — a leak; 2-4's labels state the plotted dots, which is the GIVEN, not the
 * answer — correct). Both were fixed by hand on 21 Jul. A future reader should re-read labels on any
 * new figure-bearing exam item rather than trust this file to catch it.
 *
 * Run:  node tests/a11y.test.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const FILES = fs.readdirSync(DIR).filter(f => /\.html$/.test(f) && !/^index\.html$/.test(f));
let fail = 0, svgSeen = 0, examCards = 0, modals = 0;

for (const f of FILES) {
  const h = fs.readFileSync(path.join(DIR, f), 'utf8');
  const bad = [];

  // ---- A. every svg is named or explicitly decorative -----------------------------------------
  // Skip svg markup built inside JS string concatenation: it is assembled at runtime and its
  // attributes are checked by plot_format.test.js instead (matching it here reads '+var+' as text).
  for (const m of h.matchAll(/<svg\b([^>]*)>/g)) {
    const attrs = m[1];
    if (/['"]\s*\+|\+\s*['"]/.test(attrs)) continue;      // runtime-built, not literal markup
    svgSeen++;
    const named = /aria-label\s*=|aria-labelledby\s*=/.test(attrs);
    const hidden = /aria-hidden\s*=\s*"true"/.test(attrs);
    if (!named && !hidden) {
      bad.push('an <svg> is neither named (aria-label) nor marked decorative (aria-hidden="true"): '
        + attrs.trim().slice(0, 70));
    }
  }

  // ---- B. no exam card may hide its stimulus behind an unnamed or decorative svg ---------------
  for (const p of h.split(/<div class="qcard[\s"]/).slice(1)) {
    const qid = (p.match(/data-qid="([^"]+)"/) || [])[1];
    if (!qid || /\+String/.test(qid)) continue;
    const head = p.slice(0, 400);
    if (!/data-exam="1"/.test(head)) continue;
    const body = p.split(/<\/section>/)[0];
    examCards++;
    for (const m of body.matchAll(/<svg\b([^>]*)>/g)) {
      const attrs = m[1];
      if (/['"]\s*\+|\+\s*['"]/.test(attrs)) continue;
      if (/aria-hidden\s*=\s*"true"/.test(attrs)) {
        bad.push(qid + ': an exam figure is marked decorative. If it carries information the student '
          + 'needs, name it; if it truly carries none, it does not belong on an exam card (D8).');
      } else if (!/aria-label\s*=|aria-labelledby\s*=/.test(attrs)) {
        bad.push(qid + ': exam card has an unnamed <svg> — the item is answerable only by eye (D8)');
      }
    }
  }

  // ---- C. modals are dialogs, and are named -----------------------------------------------------
  for (const m of h.matchAll(/<div class="modal"([^>]*)>/g)) {
    modals++;
    const a = m[1];
    if (!/role\s*=\s*"dialog"/.test(a)) bad.push('a .modal has no role="dialog"');
    else if (!/aria-modal\s*=\s*"true"/.test(a)) bad.push('a .modal has no aria-modal="true"');
    else if (!/aria-labelledby\s*=|aria-label\s*=/.test(a)) bad.push('a .modal has no accessible name');
  }

  // ---- D. the plot control keeps its keyboard affordances (trap #9 regression) -----------------
  if (/plotbox/.test(h)) {
    for (const [needle, why] of [
      ['tabindex', 'the plot is not focusable'],
      ['role="slider"', 'the plot has no slider role'],
      ['aria-valuenow', 'the plot reports no current value'],
      ['ArrowLeft', 'the plot has no arrow-key handler'],
    ]) {
      if (!h.includes(needle)) bad.push('plot format: ' + why + ' (missing ' + needle + ')');
    }
  }

  if (bad.length) { console.log('FAIL ' + f); bad.forEach(b => console.log('     ' + b)); fail += bad.length; }
  else console.log('PASS ' + f);
}

// Vacuous-pass protection (trap #7): if the scan matched nothing, the guard is broken, not green.
if (!svgSeen) { console.log('FAIL parsed 0 <svg> elements — the markup changed; fix this guard'); fail++; }
if (!examCards) { console.log('FAIL parsed 0 exam cards — the markup changed; fix this guard'); fail++; }
if (!modals) { console.log('FAIL parsed 0 modals — the markup changed; fix this guard'); fail++; }

console.log('\n' + svgSeen + ' svg, ' + examCards + ' exam card(s), ' + modals + ' modal(s) checked');
if (fail) { console.log('FAIL ' + fail + ' accessibility violation(s)'); process.exit(1); }
console.log('PASS  figures are named, exam stimuli are not eye-only, dialogs announce themselves');
