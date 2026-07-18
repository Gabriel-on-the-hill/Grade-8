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
  grab(/function hwItemDone\(item,topics\)\{[\s\S]*?\n  \}/, 'hwItemDone'),
  grab(/function hwSetProgress\(set,topics\)\{[\s\S]*?\n  \}/, 'hwSetProgress'),
  grab(/function hwLinks\(set\)\{[\s\S]*?\n  \}/, 'hwLinks')
].join('\n');

eval(src + '\nglobal.__today=hwToday;global.__status=hwSetStatus;global.__done=hwItemDone;' +
           'global.__prog=hwSetProgress;global.__links=hwLinks;');
const today = global.__today, status = global.__status, itemDone = global.__done,
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

// ---- module completion reading ----
const topics = {
  'expressions-equations': { tree: { '2-3': { steps: { '0': true } }, '2-4': { steps: { '0': false } }, '2-9': {} } }
};
t('recorded step -> done',        itemDone({ ref: 'module', topic: 'expressions-equations', qid: '2-3' }, topics), true);
t('all-false steps -> not done',  itemDone({ ref: 'module', topic: 'expressions-equations', qid: '2-4' }, topics), false);
t('empty tree entry -> not done', itemDone({ ref: 'module', topic: 'expressions-equations', qid: '2-9' }, topics), false);
t('unknown qid -> not done',      itemDone({ ref: 'module', topic: 'expressions-equations', qid: 'zz' }, topics), false);
t('unknown topic -> not done',    itemDone({ ref: 'module', topic: 'nope', qid: '2-3' }, topics), false);
t('bank item -> not counted yet', itemDone({ ref: 'bank', id: 'x' }, topics), false);

// ---- set progress ----
t('progress counts module items only',
  progress({ items: [
    { ref: 'module', topic: 'expressions-equations', qid: '2-3' },
    { ref: 'module', topic: 'expressions-equations', qid: '2-4' },
    { ref: 'bank', id: 'b1' }
  ] }, topics), { done: 1, total: 2 });
t('empty set -> 0/0', progress({ items: [] }, topics), { done: 0, total: 0 });

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
