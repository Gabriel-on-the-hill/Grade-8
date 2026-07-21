/* Module smoke test — "a page that parses can still be dead on arrival" (PROJECT_STANDARD §7.4).
 *
 * Ported from Grade 7 on 2026-07-21 (TODO.md P5), with a Grade-8 Part B below.
 *
 * node --check proves a script is syntactically valid. It does not prove the module boots, binds its
 * elements, counts its steps, or grades an answer. A null-binding crash in one module leaves a page
 * that looks fine in a diff and is inert in a browser — this hub has shipped exactly that once
 * already (v1.3, the PIN-modal null binding that blanked the whole app).
 *
 * This walks EVERY module in the folder — including ones added after this file was written — boots
 * it in jsdom, and drives one real answer through the engine.
 *
 * Run:  node tests/module_smoke.test.js
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const DIR = path.join(__dirname, '..');
const MODULES = fs.readdirSync(DIR)
  .filter(f => /\.html$/.test(f) && !/_Math_Hub\.html$/.test(f) && !/^index\.html$/.test(f))
  .filter(f => /G7_TOPIC_ID=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));

if (!MODULES.length) { console.log('FAIL no modules found'); process.exit(1); }

let fail = 0;
const dec = raw => raw.startsWith('k1:') ? Buffer.from(raw.slice(3), 'base64').toString('utf8') : raw;

// The engine paints the progress counters from updateProgress(), which runs on load — not during
// JSDOM's synchronous script pass. Wait for the load event or the assertions read a pre-boot 0.
function boot(file) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' + file, pretendToBeVisual: true });
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('did not fire load within 5s')), 5000);
    dom.window.addEventListener('load', () => { clearTimeout(t); setTimeout(() => resolve(dom.window), 0); });
  });
}

async function check(file) {
  const out = [];
  const ok = (cond, msg) => { out.push((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };
  let w;
  try { w = await boot(file); } catch (e) { console.log('FAIL ' + file + ' — ' + e.message); fail++; return out; }
  const d = w.document;

  const cards = d.querySelectorAll('.qcard');
  ok(cards.length > 0, cards.length + ' question cards rendered');

  const total = d.getElementById('op-total');
  ok(!!total, 'progress elements bound (no null-binding crash)');
  ok(total && Number(total.textContent) > 0, 'total steps computed = ' + (total ? total.textContent : 'n/a'));

  // every locked step must actually be disabled — no keyboard bypass (§8 assessment integrity)
  const lockedInputs = [...d.querySelectorAll('.step.locked .ans-input, .step.locked .mc-option')];
  ok(lockedInputs.length === 0 || lockedInputs.every(el => el.disabled === true),
     lockedInputs.length + ' locked controls, all disabled');

  // Drive one real answer end to end. Pick a step with exactly ONE input: a multi-blank step
  // (correctly) does not complete until every blank is right, which would make this assert nothing.
  let step = null, target = null;
  for (const c of cards) {
    const s = c.querySelector('.step:not(.locked)');
    if (!s) continue;
    if (s.querySelectorAll('.ans-input').length !== 1) continue;
    if (!s.querySelector('.check-btn') || !s.querySelector('.feedback')) continue;
    step = s; target = c; break;
  }
  if (!step) { ok(false, 'found a single-blank gradable step to drive'); return out; }

  const inp = step.querySelector('.ans-input');
  const btn = step.querySelector('.check-btn');
  const fb = step.querySelector('.feedback');
  const qid = target.getAttribute('data-qid');
  const done = () => Number(d.getElementById('op-done').textContent);

  const before = done();
  inp.value = '__nonsense__999';
  btn.click();
  ok(fb.textContent.trim().length > 0 || fb.className !== '', qid + ': a wrong answer produces feedback');
  ok(done() === before, qid + ': a wrong answer does not advance progress');

  const key = dec(inp.getAttribute('data-answer') || '');
  inp.value = key;
  btn.click();
  ok(done() > before, qid + ': the correct answer ("' + key + '") advances progress');

  return out;
}

/* Part B — Grade-8 addition: the hub's wiring must match what is on disk.
 *
 * §4: "A topic's id IS the storage key its module writes (G7_TOPIC_ID)." So a topic whose hub id and
 * module G7_TOPIC_ID disagree writes progress the dashboard never reads — the student works, the
 * teacher sees nothing, and every page involved looks correct on its own. Nothing else checks this.
 * A tile marked available whose file is missing is the same class of silent loss, one click earlier.
 */
function hubWiring() {
  const out = [];
  const ok = (cond, msg) => { out.push((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) fail++; };
  const hubFile = fs.readdirSync(DIR).find(f => /_Math_Hub\.html$/.test(f));
  if (!hubFile) { ok(false, 'found the hub'); return out; }
  const hub = fs.readFileSync(path.join(DIR, hubFile), 'utf8');

  // Topics are object literals in the SUBJECTS array; pull id/file/status off each available one.
  const topics = [...hub.matchAll(/\{id:'([^']+)',title:'[^']*',desc:'[^']*',(?:file:'([^']+)',)?status:'([^']+)'/g)]
    .map(m => ({ id: m[1], file: m[2], status: m[3] }));
  ok(topics.length > 0, topics.length + ' topics parsed from the hub');

  let checked = 0;
  for (const t of topics) {
    if (t.status !== 'available') continue;
    checked++;
    const p = path.join(DIR, t.file || '');
    if (!t.file) { ok(false, t.id + ': marked available with no file'); continue; }
    if (!fs.existsSync(p)) { ok(false, t.id + ': marked available but ' + t.file + ' is not on disk'); continue; }
    const src = fs.readFileSync(p, 'utf8');
    const m = src.match(/const G7_TOPIC_ID='([^']+)'/);
    ok(!!m && m[1] === t.id,
       t.id + ' -> ' + t.file + ": module writes G7_TOPIC_ID='" + (m ? m[1] : 'none') + "'" +
       (m && m[1] === t.id ? '' : ' — MISMATCH: its progress would never reach the dashboard'));
  }
  ok(checked > 0, checked + ' available topic(s) checked');

  // A module on disk that no hub tile links is unreachable for a student, however good it is.
  const linked = new Set(topics.filter(t => t.file).map(t => t.file));
  for (const f of MODULES) ok(linked.has(f), f + ': reachable from a hub tile');
  return out;
}

(async () => {
  for (const f of MODULES) {
    const before = fail;
    const lines = await check(f);
    console.log((fail === before ? 'PASS ' : 'FAIL ') + f);
    lines.forEach(l => console.log(l));
  }
  console.log('\nHub wiring');
  hubWiring().forEach(l => console.log(l));

  console.log('\nbooted ' + MODULES.length + ' module(s)');
  if (fail) { console.log('FAIL ' + fail + ' smoke assertion(s)'); process.exit(1); }
  console.log('PASS  every module boots, binds, locks, grades — and the hub links it under its own topic id');
})();
