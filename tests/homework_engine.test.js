/* Homework engine — hub logic guard.
 *
 * Drives the REAL pure functions out of Grade_8_Math_Hub.html:
 *   hwSetStatus   — release / catch-up rules
 *   hwItemDone    — reads module-recorded completion (one source of truth)
 *   hwSetProgress — how much of a set is done
 *   hwLinks       — groups module items so one trip opens several questions
 *
 * The rule these protect: a released set NEVER re-locks. The students this engine exists for are
 * the ones catching up, and a lockout is precisely the friction that loses them.
 *
 * Run:  node tests/homework_engine.test.js
 */
const fs = require('fs');
const path = require('path');
// Auto-detect this repo's hub, so the same suite guards Grade 7, Grade 8 and any future hub.
const DIR = path.join(__dirname, '..');
const HUB = fs.readdirSync(DIR).find(f => /_Math_Hub\.html$/.test(f));
if (!HUB) { console.log('FAIL no *_Math_Hub.html found'); process.exit(1); }
const html = fs.readFileSync(path.join(DIR, HUB), 'utf8');
console.log('hub: ' + HUB);

function grab(re, label) {
  const m = html.match(re);
  if (!m) { console.log('FAIL could not extract ' + label); process.exit(1); }
  return m[0];
}
const src = [
  grab(/function hwToday\(\)\{[^\n]*/, 'hwToday'),
  grab(/function hwSetStatus\(set,state,today\)\{[\s\S]*?\n  \}/, 'hwSetStatus'),
  grab(/function hwSetProgress\(set,doneMap\)\{[\s\S]*?\n  \}/, 'hwSetProgress'),
  grab(/function hwLinks\(set\)\{[\s\S]*?\n  \}/, 'hwLinks')
].join('\n');

eval(src + '\nglobal.__today=hwToday;global.__status=hwSetStatus;' +
           'global.__prog=hwSetProgress;global.__links=hwLinks;');
const today = global.__today, status = global.__status,
      progress = global.__prog, links = global.__links;

let pass = 0, fail = 0;
const t = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? 'PASS ' : 'FAIL ') + label + (ok ? '' : `  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`));
  ok ? pass++ : fail++;
};

// ---- date helper ----
t('hwToday is zero-padded ISO', /^\d{4}-\d{2}-\d{2}$/.test(today()), true);

// ---- release / catch-up ----
const TODAY = '2026-07-20';
t('no releaseOn -> open',            status({ id: 's' }, {}, TODAY), 'open');
t('releaseOn today -> open',         status({ id: 's', releaseOn: '2026-07-20' }, {}, TODAY), 'open');
t('releaseOn in the past -> open',   status({ id: 's', releaseOn: '2026-07-01' }, {}, TODAY), 'open');
t('releaseOn in the future -> locked', status({ id: 's', releaseOn: '2026-07-21' }, {}, TODAY), 'locked');
t('a MISSED past set stays open (no catch-up lockout)',
  status({ id: 's', releaseOn: '2026-06-01' }, {}, TODAY), 'open');
t('completed -> done',               status({ id: 's' }, { s: { completedTs: 1 } }, TODAY), 'done');
t('completed beats a future release', status({ id: 's', releaseOn: '2099-01-01' }, { s: { completedTs: 1 } }, TODAY), 'done');

// ---- set progress, from HOMEWORK markers only ----
// The load-bearing rule: progress counts work done AS HOMEWORK. It must never be inferred from the
// module's topic tree, or a question answered weeks ago in ordinary practice would count — and a set
// whose items had all been practised before would auto-complete and post a score for homework the
// student never did.
const set5 = { items: [
  { ref: 'module', topic: 'expressions-equations', qid: '2-2' },
  { ref: 'module', topic: 'expressions-equations', qid: '2-5' },
  { ref: 'module', topic: 'number-system',         qid: '2-5' },   // same qid, different module
  { ref: 'bank', id: 'b1' }
] };

t('nothing done yet -> 0 of 3', progress(set5, {}), { done: 0, total: 3 });
t('one homework marker -> 1 of 3',
  progress(set5, { 'expressions-equations|2-2': { ts: 1 } }), { done: 1, total: 3 });
t('markers are keyed topic|qid, so the same qid in two modules is NOT double-counted',
  progress(set5, { 'expressions-equations|2-5': { ts: 1 } }), { done: 1, total: 3 });
t('both same-qid items counted only when each is marked',
  progress(set5, { 'expressions-equations|2-5': { ts: 1 }, 'number-system|2-5': { ts: 1 } }), { done: 2, total: 3 });
t('a bare qid key does NOT count (must be topic-qualified)',
  progress(set5, { '2-2': { ts: 1 } }), { done: 0, total: 3 });
t('bank items are excluded from the denominator', progress(set5, {}).total, 3);
t('empty set -> 0/0', progress({ items: [] }, {}), { done: 0, total: 0 });

// ---- link grouping ----
const g = s => links(s).filter(x => x.kind === 'module').map(x => x.topic + ':' + x.qids.join(','));
t('same topic collapses into one link',
  g({ items: [ { ref:'module', topic:'A', qid:'1' }, { ref:'module', topic:'A', qid:'2' } ] }),
  ['A:1,2']);
t('different topic starts a new link',
  g({ items: [ { ref:'module', topic:'A', qid:'1' }, { ref:'module', topic:'B', qid:'9' } ] }),
  ['A:1', 'B:9']);
t('a non-module item breaks the run',
  g({ items: [ { ref:'module', topic:'A', qid:'1' }, { ref:'bank', id:'b' }, { ref:'module', topic:'A', qid:'2' } ] }),
  ['A:1', 'A:2']);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
