/* Plot-input format guard — the 6th item format.
 *
 * Ported from Grade 7 on 2026-07-21 (TODO.md P5). Grade 8 already carried the format: it arrived in
 * `478816d` with the keyboard layer, and the geometry is identical to Grade 7's (line x0=26, x1=334,
 * y=52 over -10..10; grid L=44, R=344, T=16, B=260 over x 0..6, y 0..20), so the assertions port
 * unchanged. Only the template path differs — Grade 8 keeps it in Starter_Kit/.
 *
 * WHY THIS GUARD MATTERS MORE HERE THAN IN GRADE 7. In Grade 7 the plot is in daily use, so a
 * regression shows up in a module. In Grade 8 **no module uses it yet** — it is a shipped, working,
 * entirely unexercised response format. Nothing else in the suite would notice if it rotted, and the
 * first unit to need it is the next one to be built (8.AT.D.11 "sketch a graph from a narrative",
 * whose textbook source items are literally "Sketch a graph" on an empty grid — TEXTBOOK_SOURCES.md).
 *
 * The plot is a UI painted on top of a hidden .ans-input, deliberately: clicking writes into that
 * input and the ordinary engine does the rest (checkInput's tolerance/text match, setStepDisabled's
 * locking, restoreProgress's re-fill, g7revReset's clearing). PROJECT_STANDARD §7.2 forbids
 * hand-rolling the answer handlers, and this does not — so what needs proving is that the pointer
 * layer honours the invariants the engine already enforces:
 *
 *   1. a click places a point and writes a value in the expected format
 *   2. a click on a LOCKED step writes nothing (no keyboard/mouse bypass of the lock ladder)
 *   3. a wrong placement is marked wrong and does not advance progress
 *   4. the correct placement grades and advances, through the normal .check-btn path
 *   5. snapping is exact — a click between ticks lands ON a tick, never between
 *   6. it is operable by keyboard, not pointer-only
 *
 * Part B sweeps any MODULE that adopts the format and holds it to the same structure, so the first
 * unit to use the plot cannot quietly diverge from the template. It iterates zero files today and
 * says so rather than passing silently.
 *
 * Run:  node tests/plot_format.test.js
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const DIR = path.join(__dirname, '..');
const FILE = 'Starter_Kit/Module_Template.html';

let fail = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fail++; };

function boot(file) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' + file, pretendToBeVisual: true });
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('no load event')), 5000);
    dom.window.addEventListener('load', () => { clearTimeout(t); setTimeout(() => res(dom.window), 0); });
  });
}

// jsdom gives every element a zero-size rect, so a real click cannot be simulated by coordinates.
// Drive the engine's own placement path instead: the engine falls back to viewBox units when the
// measured width is 0, so clientX/clientY map straight onto viewBox coordinates here.
function place(w, box, clientX, clientY) {
  const hit = box.querySelector('.hit');
  hit.dispatchEvent(new w.MouseEvent('click', { bubbles: true, clientX, clientY }));
}

(async () => {
  let w;
  try { w = await boot(FILE); } catch (e) { console.log('FAIL ' + FILE + ' — ' + e.message); process.exit(1); }
  const d = w.document;
  console.log(FILE);

  const card = d.querySelector('.qcard[data-qid="d10"]');
  ok(!!card, 'the plot demo card d10 exists');
  if (!card) { console.log('\nFAIL the 6th format is gone from the template'); process.exit(1); }

  const steps = card.querySelectorAll('.step');
  const line = steps[0], grid = steps[1];
  const lineBox = line.querySelector('.plotbox'), gridBox = grid.querySelector('.plotbox');
  ok(!!lineBox && !!gridBox, 'both a number-line and a grid plot render');
  ok(!!lineBox.querySelector('svg') && !!gridBox.querySelector('svg'), 'both painted an svg');

  const lineInp = lineBox.querySelector('.ans-input');
  ok(lineInp && lineInp.type === 'hidden', 'the value lives in a hidden .ans-input (engine does the checking)');

  // --- 2. a locked step must not accept a placement --------------------------------------------
  ok(grid.classList.contains('locked'), 'step 2 starts locked');
  const gridInp = gridBox.querySelector('.ans-input');
  ok(gridInp.disabled === true, 'the locked step disabled its hidden input');
  place(w, gridBox, 100, 100);
  ok(gridInp.value === '', 'clicking a LOCKED plot writes nothing — the lock ladder holds');

  // --- 1 + 5. placement and snapping ------------------------------------------------------------
  // number line spans -10..10 across x 26..334; x=180 is the midpoint => 0
  place(w, lineBox, 180, 52);
  ok(lineInp.value === '0', 'a click at the midpoint places exactly 0 (got "' + lineInp.value + '")');
  place(w, lineBox, 187, 52);
  ok(Number.isInteger(parseFloat(lineInp.value)), 'a click between ticks snaps to a tick, never between (got "' + lineInp.value + '")');

  const g = w.__modPlot;
  ok(!!g && typeof g.draw === 'function', 'the engine exposes __modPlot for tests');
  const done = () => Number(d.getElementById('op-done').textContent);

  // --- 3. wrong placement grades wrong and does not advance -------------------------------------
  const before = done();
  place(w, lineBox, 180, 52);                    // 0, but the key is -3
  line.querySelector('.check-btn').click();
  ok(done() === before, 'a wrong placement does not advance progress');

  // --- 4. correct placement grades through the ordinary check path ------------------------------
  const x = 26 + (7 / 20) * 308;                 // -3 sits here
  place(w, lineBox, x, 52);
  ok(lineInp.value === '-3', 'clicking at -3 writes "-3" (got "' + lineInp.value + '")');
  line.querySelector('.check-btn').click();
  ok(done() > before, 'the correct placement advances progress via the normal .check-btn path');
  ok(!grid.classList.contains('locked'), 'completing step 1 unlocked step 2');

  // --- grid writes an "x,y" pair ----------------------------------------------------------------
  // grid: x 0..6 across 44..344, y 0..20 across 260..16 ; (3,12) => x=194, y=113.6
  place(w, gridBox, 44 + (3 / 6) * 300, 260 - (12 / 20) * 244);
  ok(gridInp.value === '3,12', 'a grid click writes "x,y" (got "' + gridInp.value + '")');
  grid.querySelector('.check-btn').click();
  ok(done() > before + 1, 'the grid placement grades and advances too');

  // --- 6. keyboard operation --------------------------------------------------------------------
  // Pointer-only would lock keyboard and screen-reader users out of every plot item; §8 already
  // requires keyboard-accessible controls, and a11y.test.js guards the affordances once they appear.
  const press = (box, key) => box.querySelector('svg')
    .dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true }));
  const lineSvg = () => lineBox.querySelector('svg');

  ok(lineSvg().getAttribute('tabindex') === '0', 'the number line is focusable');
  ok(lineSvg().getAttribute('role') === 'slider', 'it announces itself as a slider');
  ok(lineSvg().getAttribute('aria-valuemin') === '-10' && lineSvg().getAttribute('aria-valuemax') === '10',
     'it exposes its range to assistive tech');

  lineInp.value = ''; g.draw(lineBox);
  press(lineBox, 'ArrowRight');
  ok(lineInp.value !== '', 'first arrow press on an empty plot places a point — no pointer needed');
  const startV = parseFloat(lineInp.value);
  press(lineBox, 'ArrowLeft');
  ok(parseFloat(lineInp.value) === startV - 1, 'ArrowLeft steps down by one');
  press(lineBox, 'Home');
  ok(parseFloat(lineInp.value) === -10, 'Home jumps to the minimum');
  ok(lineSvg().getAttribute('aria-valuenow') === '-10', 'aria-valuenow follows the value');

  const gridSvg = gridBox.querySelector('svg');
  ok(gridSvg.getAttribute('tabindex') === '0', 'the grid is focusable too');
  ok(/x from .* y from /.test(gridSvg.getAttribute('aria-label') || ''),
     'the grid names both of its ranges in its aria-label');

  const gi2 = gridBox.querySelector('.ans-input');
  gi2.disabled = true; gi2.value = ''; g.draw(gridBox);
  press(gridBox, 'ArrowUp');
  ok(gi2.value === '', 'a LOCKED plot ignores the keyboard exactly as it ignores clicks');
  gi2.disabled = false;

  // --- Part B: any MODULE that adopts the plot is held to the same structure --------------------
  // Grade-8 addition. No module uses the format yet, so this sweep is empty — but it must say so,
  // because "0 files checked" and "all files passed" print identically otherwise.
  console.log('\nModules using the plot format');
  const modules = fs.readdirSync(DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .filter(f => fs.readFileSync(path.join(DIR, f), 'utf8').includes('class="plotbox"'));

  if (!modules.length) {
    console.log('  none yet — the format is shipped but unexercised (TODO.md P5).');
    console.log('  This sweep arms itself automatically when the first module adopts it.');
  }
  for (const f of modules) {
    let mw;
    try { mw = await boot(f); } catch (e) { ok(false, f + ' — ' + e.message); continue; }
    ok(!!mw.__modPlot, f + ': exposes __modPlot (did not hand-roll its own plot)');
    for (const box of mw.document.querySelectorAll('.plotbox')) {
      const id = f + ' ' + (box.closest('.qcard') || {}).dataset?.qid;
      const svg = box.querySelector('svg');
      const inp = box.querySelector('.ans-input');
      ok(!!svg, id + ': painted an svg');
      ok(inp && inp.type === 'hidden', id + ': grades through a hidden .ans-input, not a bespoke handler');
      ok(svg && svg.getAttribute('tabindex') === '0', id + ': keyboard-focusable');
      const role = svg && svg.getAttribute('role');
      ok(role === 'slider' || role === 'application', id + ': carries a plot role (got "' + role + '")');
    }
  }

  console.log('\n' + (fail ? 'FAIL ' + fail + ' assertion(s)'
    : 'PASS  plot input places, snaps, respects locks, is keyboard-operable, and grades through the engine'));
  process.exit(fail ? 1 : 0);
})();
