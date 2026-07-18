/* Homework engine — module deep-link guard.
 *
 * Drives the REAL g7hwSet() out of each live module. A homework set references exact questions as
 * {ref:'module', topic, qid}; the hub opens the module with ?q=<qid>[,<qid>...] and the module must
 * surface exactly those questions, in the order the SET names them (not page order).
 *
 * If this fails, module-referenced homework items silently open the wrong questions — or an empty
 * panel — which looks identical to "the student did nothing".
 *
 * Run:  node tests/homework_deeplink.test.js
 */
const fs = require('fs');
const path = require('path');

// Auto-detect every module in this repo that carries the deep-link, so the suite covers Grade 7,
// Grade 8 and any module added later without anyone remembering to edit this list.
const DIR = path.join(__dirname, '..');
const MODULES = fs.readdirSync(DIR)
  .filter(f => /\.html$/.test(f) && !/_Math_Hub\.html$/.test(f))
  .filter(f => /function g7hwSet\(/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));
if (!MODULES.length) { console.log('FAIL no module carries the homework deep-link'); process.exit(1); }

let pass = 0, fail = 0;
const t = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? '  PASS ' : '  FAIL ') + label + (ok ? '' : `  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`));
  ok ? pass++ : fail++;
};

MODULES.forEach(function (file) {
  console.log('\n== ' + file + ' ==');
  const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

  const fnSrc = (html.match(/function g7hwSet\(csv\)\{[\s\S]*?\n  \}/) || [])[0];
  if (!fnSrc) { console.log('  FAIL could not extract g7hwSet'); fail++; return; }
  if (!/window\.addEventListener\('load',function\(\)\{if\(!g7homeworkMode\(\)\)g7reviewMode\(\);\}\);/.test(html)) {
    console.log('  FAIL homework mode is not wired into the load handler'); fail++;
  } else { console.log('  PASS homework mode wired ahead of review mode'); pass++; }

  // fake page: four question cards
  const cards = ['1-1', '2-3', '2-4', '7-1'].map(q => ({ dataset: { qid: q } }));
  global.document = { querySelectorAll: () => cards };
  eval(fnSrc + '\nglobal.__hwSet = g7hwSet;');
  const hwSet = global.__hwSet;
  const ids = r => r.map(c => c.dataset.qid);

  t('single qid',                       ids(hwSet('2-3')),            ['2-3']);
  t('order follows the SET, not page',  ids(hwSet('2-4,2-3')),        ['2-4', '2-3']);
  t('whitespace tolerated',             ids(hwSet(' 2-3 , 2-4 ')),    ['2-3', '2-4']);
  t('duplicates collapse',              ids(hwSet('2-3,2-3')),        ['2-3']);
  t('unknown qid ignored, rest kept',   ids(hwSet('2-3,nope,7-1')),   ['2-3', '7-1']);
  t('all-unknown -> empty (falls back to normal lesson)', ids(hwSet('nope,zzz')), []);
  t('empty param -> empty',             ids(hwSet('')),               []);
  t('cross-module qid not invented',    ids(hwSet('9-9')),            []);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
