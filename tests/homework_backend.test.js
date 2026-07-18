/* Homework engine — backend guard.
 *
 * Drives the REAL Starter_Kit/HUB_Sync_Apps_Script.gs against mocked Apps Script services.
 *
 * Why this file exists: per-student homework isolation is enforced by the backend, NOT by the app
 * (the hub is a public static site — hiding another student's homework in the UI would be
 * decoration). If this suite ever fails, homework privacy is broken. It also pins the Homework tab
 * header, because a column-map drift has already silently blanked a dashboard once and looks
 * identical to "no data".
 *
 * Run:  node tests/homework_backend.test.js
 */
const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, '..', 'Starter_Kit', 'HUB_Sync_Apps_Script.gs');
const src = fs.readFileSync(SRC, 'utf8');

// ---- Apps Script mocks ----
const sheets = {};
function makeSheet() {
  const rows = [];
  return {
    appendRow: r => rows.push(r.slice()),
    getDataRange: () => ({ getValues: () => rows.map(r => r.slice()) }),
    getRange: (r, c) => ({ setValue: v => { rows[r - 1][c - 1] = v; } }),
    getLastRow: () => rows.length,
    _rows: rows
  };
}
const mockSS = {
  getName: () => 'Test Sheet', getId: () => 'sheet-id',
  getSheetByName: n => sheets[n] || null,
  insertSheet: n => (sheets[n] = makeSheet())
};
global.SpreadsheetApp = { openById: () => mockSS, getActiveSpreadsheet: () => mockSS };
global.ContentService = {
  createTextOutput: t => ({ _t: t, setMimeType() { return this; } }),
  MimeType: { JAVASCRIPT: 'js' }
};
global.LockService = { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) };
global.Logger = { log() {} };

// NOTE: capture names are underscore-prefixed on purpose — the eval'd script declares doPost/doGet/
// setup/HW_HEADER at top level, and a same-named const here would collide.
eval(src + '\nglobal.__doPost=doPost; global.__doGet=doGet; global.__setup=setup;' +
           'global.__HW_HEADER=HW_HEADER; global.__setKey=function(k){TEACHER_KEY=k;};');
const _doPost = global.__doPost, _doGet = global.__doGet, _setup = global.__setup;
const _HWH = global.__HW_HEADER;

const post = o => _doPost({ postData: { contents: JSON.stringify(o) } })._t;
const pull = p => {
  const raw = _doGet({ parameter: Object.assign({ op: 'pull', cb: 'cb' }, p) })._t;
  return JSON.parse(raw.slice(raw.indexOf('(') + 1, raw.lastIndexOf(')')));
};

let pass = 0, fail = 0;
const t = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log((ok ? 'PASS ' : 'FAIL ') + label + (ok ? '' : `  (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`));
  ok ? pass++ : fail++;
};

const HUB = 'grade8';
_setup();
t('setup creates Homework tab with the exact header', sheets['Homework']._rows[0], _HWH);

// two students claim PINs (first claim is open by design — zero-setup sign-up)
post({ op: 'put', hub: HUB, kind: 'pin', name: 'A', sub: '', payload: { v: '1111' }, ts: 1 });
post({ op: 'put', hub: HUB, kind: 'pin', name: 'B', sub: '', payload: { v: '2222' }, ts: 1 });

// ---- writes ----
t('student writes own hwstate -> ok', post({ op:'put', hub:HUB, kind:'hwstate', name:'A', sub:'math', pin:'1111', payload:{done:1}, ts:2 }), 'ok');
t('student CANNOT write hwplan (teacher-only)', post({ op:'put', hub:HUB, kind:'hwplan', name:'A', sub:'math', pin:'1111', payload:{sets:[]}, ts:2 }), 'err: auth');
t('anonymous CANNOT write hwstate', post({ op:'put', hub:HUB, kind:'hwstate', name:'A', sub:'math', payload:{done:9}, ts:3 }), 'err: auth');
t('student CANNOT write ANOTHER student hwstate', post({ op:'put', hub:HUB, kind:'hwstate', name:'B', sub:'math', pin:'1111', payload:{done:9}, ts:3 }), 'err: auth');

global.__setKey('TKEY');
t('teacher publishes hwplan for A -> ok', post({ op:'put', hub:HUB, kind:'hwplan', name:'A', sub:'math', key:'TKEY', payload:{sets:[{id:'s1'}]}, ts:4 }), 'ok');
t('teacher publishes hwplan for B -> ok', post({ op:'put', hub:HUB, kind:'hwplan', name:'B', sub:'sci',  key:'TKEY', payload:{sets:[{id:'s9'}]}, ts:4 }), 'ok');

// ---- homework history ----
// Two kinds of row land here, and every row in this tab is homework by definition — that is what
// makes homework distinguishable from ordinary module practice, which the Log tab cannot do.
t('student records a homework ATTEMPT -> ok',
  post({ op:'hw', hub:HUB, name:'A', pin:'1111', subject:'math', set:'s1', item:'2-5', outcome:'correct' }), 'ok');
t('student records a SET COMPLETION -> ok',
  post({ op:'hw', hub:HUB, name:'A', pin:'1111', subject:'math', set:'s1', item:'(set complete)', outcome:'4 / 5' }), 'ok');
t('anonymous homework row rejected',
  post({ op:'hw', hub:HUB, name:'A', subject:'math', set:'s1', item:'2-5', outcome:'correct' }), 'err: auth');

const rows = sheets['Homework']._rows;
t('attempt row lands in header order (student/subject/set/item/outcome)',
  [rows[1][2], rows[1][3], rows[1][4], rows[1][5], rows[1][6]], ['A', 'math', 's1', '2-5', 'correct']);
t('completion row is distinguishable from an attempt',
  [rows[2][5], rows[2][6]], ['(set complete)', '4 / 5']);
t('exactly two homework rows written (the anonymous one was refused)', rows.length, 3);

// ---- the isolation property ----
const asA = pull({ hub: HUB, name: 'A', pin: '1111' });
t('student A pull sees own hwplan',     Object.keys(asA.hwplan), ['A']);
t('student A pull CANNOT see B hwplan', asA.hwplan.B === undefined, true);
t('student A pull sees own hwstate',    Object.keys(asA.hwstate), ['A']);

const asB = pull({ hub: HUB, name: 'B', pin: '2222' });
t('student B pull sees only own hwplan', Object.keys(asB.hwplan), ['B']);

const asTeacher = pull({ hub: HUB, key: 'TKEY' });
t('teacher pull sees BOTH students', Object.keys(asTeacher.hwplan).sort(), ['A', 'B']);

t('anonymous pull returns no homework', Object.keys(pull({ hub: HUB }).hwplan), []);
t('wrong PIN returns nothing',          Object.keys(pull({ hub: HUB, name: 'A', pin: '9999' }).hwplan), []);
t('different hub sees no grade8 homework', Object.keys(pull({ hub: 'grade7', key: 'TKEY' }).hwplan), []);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
