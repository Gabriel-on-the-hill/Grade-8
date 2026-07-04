/* Grade 8 Hub — behavioral verification suite (PROJECT_STANDARD §7.4)
 * Run:  npm install jsdom   then   node tests/behavioral_test_suite.js <folder-with-html-files>
 * Covers: gate, seeded roster, sign-in → PIN → app, device binding, teacher modal
 * (dashboard + gated Settings), Escape-to-close, passcode takeover, homework decay +
 * mark-done, CR mark-reviewed, module wrong→retry→correct with cooldown, shuffle +
 * data-noshuffle, copy-block, exam first-attempt-only stats, fraction equivalence,
 * locked steps, persistence + section report card, hint integrity, and v1.5 cloud
 * sync (merge rules, teacher/student pushes, module merge + debounced push). Exit 0 = all pass.
 */
const {JSDOM}=require('jsdom');const fs=require('fs');const path=require('path');
const DIR=(process.argv[2]||'.').replace(/\/?$/,'/');
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:(fail++,console.log('  FAIL:',m));};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const src=f=>fs.readFileSync(path.join(DIR,f),'utf8');
function load(file,seed,rnd){
  const dom=new JSDOM(src(file),{runScripts:'dangerously',url:'https://x.test/'+file,
    beforeParse(w){const store=Object.assign({'g8.gate':'ok'},seed||{});
      w.localStorage.clear();Object.keys(store).forEach(k=>w.localStorage.setItem(k,store[k]));
      if(rnd)w.Math.random=rnd;
      w.fetch=(u,o)=>{if(w.__spy&&o&&o.body){try{w.__spy.push(JSON.parse(o.body));}catch(e){}}return Promise.resolve();};w.confirm=()=>true;w.scrollTo=()=>{};
      w.alert=()=>{throw new Error('alert() used');};w.prompt=()=>{throw new Error('prompt() used');};}});
  dom.window.dispatchEvent(new dom.window.Event('load'));return dom;
}
const HUB='Grade_8_Math_Hub.html',NS='The_Number_System.html',EE='Expressions_and_Equations.html';
const rightOpt=g=>[...g.querySelectorAll('.mc-option,.ms-option')].filter(o=>{try{return atob((o.dataset.k||'').slice(3)).endsWith('|1');}catch(e){return false;}});
const wrongOpt=g=>[...g.querySelectorAll('.mc-option,.ms-option')].filter(o=>{try{return atob((o.dataset.k||'').slice(3)).endsWith('|0');}catch(e){return false;}});

(async function(){
// ===== HUB: cold boot, seeds, PIN, binding =====
{ const w=load(HUB).window,d=w.document;
  ok(!d.getElementById('g8gate'),'hub: gate removed when g8.gate=ok');
  ok(!d.getElementById('view-signin').classList.contains('hidden'),'hub: sign-in visible on cold boot');
  const names=[...d.querySelectorAll('.name-tile .nm')].map(e=>e.textContent);
  ok(names.join(',')==='Divine,Ayodeji','hub: seeded roster (Divine, Ayodeji) with zero setup');
  ok(w.localStorage.getItem('g7.teacherPass')==='Gabe','hub: teacher passcode seeded');
  const tile=d.querySelector('.name-tile');
  ok(tile.getAttribute('tabindex')==='0'&&tile.getAttribute('role')==='button','hub: tiles keyboard-accessible');
  tile.click();
  ok(!d.getElementById('pinModal').classList.contains('hidden'),'hub: PIN modal opens');
  ok(d.getElementById('pin-sub').textContent.includes('Create'),'hub: create-PIN mode first time');
  d.getElementById('pin1').value='11';d.getElementById('pin2').value='12';d.getElementById('pin-go').click();
  ok(d.getElementById('pin-err').textContent.includes('do not match'),'hub: mismatched PINs rejected');
  d.getElementById('pin2').value='11';d.getElementById('pin-go').click();
  ok(!d.getElementById('view-app').classList.contains('hidden'),'hub: app opens after PIN set');
  ok(JSON.parse(w.localStorage.getItem('g7.pins')).Divine==='11','hub: PIN persisted');
  ok(w.localStorage.getItem('g7.device')==='Divine','hub: device bound to Divine');
  ok(d.querySelectorAll('.subject-tab').length===2,'hub: two subject tabs');
  d.getElementById('tb-switch').click();
  ok([...d.querySelectorAll('.name-tile .nm')].map(e=>e.textContent).join(',')==='Divine','hub: bound device shows only its student');
  const sa=d.getElementById('show-all-names');ok(!!sa,'hub: "Someone else?" link present');
  sa.click();
  ok(d.querySelectorAll('.name-tile').length===2,'hub: link reveals full roster');
}
// ===== HUB: wrong PIN =====
{ const w=load(HUB,{'g7.pins':JSON.stringify({Divine:'11'})}).window,d=w.document;
  d.querySelector('.name-tile').click();
  ok(d.getElementById('pin-sub').textContent.includes('Enter'),'hub: enter-PIN mode for returning student');
  d.getElementById('pin1').value='99';d.getElementById('pin-go').click();
  ok(d.getElementById('pin-err').textContent.includes('Incorrect'),'hub: wrong PIN rejected');
}
// ===== HUB: teacher modal, gated settings, Escape, takeover =====
{ const w=load(HUB,{'g7.teacherPass':'studentmade'}).window,d=w.document;
  ok(w.localStorage.getItem('g7.teacherPass')==='Gabe','hub: passcode takeover reclaims student-set passcode');
  d.getElementById('tb-settings').onclick?d.getElementById('tb-settings').click():null;
  ok(!d.getElementById('teacherModal').classList.contains('hidden'),'hub: Settings gear routes through teacher modal');
  ok(d.getElementById('settingsModal').classList.contains('hidden'),'hub: Settings NOT open before passcode');
  ok(d.getElementById('tm-sub').textContent.includes('Settings'),'hub: modal says it will open Settings');
  d.getElementById('tm-pass').value='studentmade';d.getElementById('tm-go').click();
  ok(d.getElementById('tm-err').textContent.includes('Incorrect'),'hub: old student passcode no longer works');
  d.getElementById('tm-pass').value='  GABE ';d.getElementById('tm-go').click();
  ok(!d.getElementById('settingsModal').classList.contains('hidden'),'hub: case-insensitive+trimmed passcode opens Settings');
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  ok(d.getElementById('settingsModal').classList.contains('hidden'),'hub: Escape closes Settings');
  d.getElementById('tb-teacher').click();
  ok(d.getElementById('tm-go').textContent==='Open dashboard','hub: Teacher button targets dashboard');
  d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  ok(!d.getElementById('view-teacher').classList.contains('hidden'),'hub: dashboard opens');
}
// ===== HUB: stats decay, homework done, CR review, tcard secbars =====
{ const data={students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{'1-1':{steps:{0:true}},'1-2':{steps:{0:true}}},totalSteps:31,sectionTotals:{'1':5,'2':6},lastPracticed:Date.now(),attempts:14,correct:10,struggles:[],
    skillStats:{roots:{attempts:8,misses:1},estimate:{attempts:6,misses:3}},exam:{attempts:2,correct:1},
    responses:[{qid:'3-4',label:'Q11',text:'my reasoning',ts:1}]}},assignments:{math:{text:'Finish section 5',ts:1}}}}};
  const w=load(HUB,{'g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),'g7.current':'Divine','g7.data':JSON.stringify(data)}).window,d=w.document;
  ok(d.getElementById('stat-tiles').innerHTML.includes('>1<'),'hub: skills-to-review decays (1 real pattern, not 2)');
  ok(d.querySelector('.tcard .secbars'),'hub: student topic card shows per-section bars');
  ok(d.getElementById('hw-banner').textContent.includes('Finish section 5'),'hub: teacher assignment shown');
  d.getElementById('hw-done').click();
  ok(JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.assignments.math.doneTs>0,'hub: Mark done persists');
  ok(d.getElementById('hw-banner').textContent.includes('done'),'hub: done state visible to student');
  d.getElementById('tb-teacher').click();
  d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  ok(d.getElementById('dash').textContent.includes('The Number System'),'hub: dashboard shows topic');
  ok(d.getElementById('dash').textContent.includes('Student marked this done'),'hub: teacher sees done note');
  const rev=d.querySelector('.cr-rev');ok(!!rev,'hub: Mark reviewed button present');
  rev.click();
  ok(JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'].responses[0].reviewed>0,'hub: reviewed flag persists');
}
// ===== MODULES: source integrity =====
{ for(const f of [NS,EE]){
    const h=src(f);
    ok(!/data-correct=/.test(h),f+': no plaintext correct flags');
    ok(!/data-answer="(?!k1:)/.test(h),f+': all answers encoded');
    ok(h.includes('user-select:none'),f+': copy-block CSS present');
  }
  const nsdom=load(NS,{'g7.current':'Divine'});const nd=nsdom.window.document;
  ok(nd.querySelectorAll('.qcard[data-exam] .hint-btn').length===0,'NS: no hints on exam capstones');
  const ed=load(EE,{'g7.current':'Divine'}).window.document;
  ok(ed.querySelectorAll('.qcard[data-exam] .hint-btn').length===0,'EE: no hints on exam capstones');
  const hints=(src(NS)+src(EE)).split('hint-content">').slice(1).map(s=>s.split('</div>')[0]);
  ok(hints.every(x=>!/90x = 57|= 9\.86|81 = 9&sup2;|&radic;36 = 6.*are rational|Distribute both/.test(x)),'NS/EE: hints are strategy-only (no worked answers)');
}
// ===== MODULE: shuffle + noshuffle =====
{ const d0=new JSDOM(src(NS)).window.document; // no scripts: source order
  const before=[...d0.querySelector('[data-qid="1-2"] .mc-group').children].map(e=>e.textContent.trim());
  const w=load(NS,{'g7.current':'Divine'},()=>0).window,d=w.document;
  const after=[...d.querySelector('[data-qid="1-2"] .mc-group').children].map(e=>e.textContent.trim());
  ok(before.join('|')!==after.join('|'),'NS: 4-option MC shuffles');
  const ex0=[...d0.querySelector('[data-qid="3-3"] .ms-group').children].map(e=>e.textContent.trim());
  const ex1=[...d.querySelector('[data-qid="3-3"] .ms-group').children].map(e=>e.textContent.trim());
  ok(ex0.join('|')===ex1.join('|'),'NS: exam capstone keeps real MCAP order (data-noshuffle)');
  const two0=[...d0.querySelector('[data-qid="6-1"] .mc-group').children].map(e=>e.textContent.trim());
  const two1=[...d.querySelector('[data-qid="6-1"] .mc-group').children].map(e=>e.textContent.trim());
  ok(two0.join('|')===two1.join('|'),'NS: 2-option group keeps semantic order');
}
// ===== MODULE: engine behaviors =====
{ const dom=load(NS,{'g7.current':'Divine'});const w=dom.window,d=w.document;
  ok(d.getElementById('g7name').textContent==='Divine','NS: student name shown');
  ok(!d.getElementById('g7guestnote'),'NS: no guest warning when signed in');
  const fb=d.querySelector('[data-qid="1-2"] .mc-feedback');
  ok(!fb.classList.contains('correct')&&!fb.classList.contains('wrong'),'NS: MC explanation CSS-hidden pre-answer');
  ok(d.querySelector('[data-qid="2-1"] .step.locked .ans-input').disabled,'NS: locked step inputs disabled');
  // copy-block behavior
  const lbl=d.querySelector('[data-qid="1-1"] .step-label');
  const ce=new w.Event('copy',{bubbles:true,cancelable:true});lbl.dispatchEvent(ce);
  ok(ce.defaultPrevented,'NS: copy suppressed on question cards');
  const ta=d.querySelector('.cr-area');const ce2=new w.Event('copy',{bubbles:true,cancelable:true});ta.dispatchEvent(ce2);
  ok(!ce2.defaultPrevented,'NS: copy allowed in typing areas');
  // MC wrong -> cooldown -> retry -> correct (exam item 7-2 for stats)
  const mcq=d.querySelector('[data-qid="7-2"]');const g=mcq.querySelector('.mc-group');
  wrongOpt(g)[0].click();
  ok(!g.classList.contains('answered'),'NS: wrong MC does not lock');
  ok(!rightOpt(g)[0].classList.contains('correct'),'NS: wrong MC does not reveal answer');
  ok(rightOpt(g)[0].classList.contains('cooldown'),'NS: cooldown after wrong guess');
  let t=JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'];
  ok(t.exam.attempts===1&&t.exam.correct===0,'NS: exam counts first attempt as miss');
  await sleep(1700);
  ok(!rightOpt(g)[0].classList.contains('cooldown'),'NS: cooldown lifts');
  rightOpt(g)[0].click();
  ok(mcq.querySelector('.step').classList.contains('completed'),'NS: retry success completes step');
  t=JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'];
  ok(t.exam.attempts===1&&t.exam.correct===0,'NS: retry does not inflate exam stats');
  ok(mcq.querySelector('.mc-feedback').textContent.startsWith('✓'),'NS: explanation revealed after correct');
  // empty check no-op
  const before=t.attempts;
  d.querySelector('[data-qid="1-1"] .check-btn').click();
  t=JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'];
  ok(t.attempts===before,'NS: empty Check logs nothing');
  // fill-in exam first-attempt-only
  const q24=d.querySelector('[data-qid="7-1"]');
  q24.querySelector('.ans-input').value='0.5';q24.querySelector('.check-btn').click();
  q24.querySelector('.ans-input').value='0.625';q24.querySelector('.check-btn').click();
  t=JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'];
  ok(t.exam.attempts===2&&t.exam.correct===0,'NS: fill-in exam first-attempt-only');
  ok(q24.querySelector('.step').classList.contains('completed'),'NS: fill-in completes after retry');
  // two-part unlock + fraction equivalence
  const q4=d.querySelector('[data-qid="2-1"]');const steps=q4.querySelectorAll('.step');
  q4.querySelector('.ans-input').value='2';steps[0].querySelector('.check-btn').click();
  ok(!steps[1].classList.contains('locked')&&!steps[1].querySelector('.ans-input').disabled,'NS: Part B unlocks + enabled');
  steps[1].querySelector('.ans-input').value='4/18';steps[1].querySelector('.check-btn').click();
  ok(steps[1].querySelector('.feedback').textContent.includes('simplify'),'NS: equivalent fraction accepted with nudge');
  // section report card renders
  const rc=d.getElementById('sec-report');
  ok(rc&&rc.textContent.includes('Your section scores'),'NS: section report card injected');
  ok(rc.querySelectorAll('.sec-row').length===7,'NS: one row per section');
  // persistence
  const store=w.localStorage.getItem('g7.data');
  const w2=load(NS,{'g7.current':'Divine','g7.data':store}).window,d2=w2.document;
  ok(d2.querySelector('[data-qid="7-1"] .step').classList.contains('completed'),'NS: restore after reload');
  ok(d2.querySelector('[data-qid="7-1"] .ans-input').value==='0.625','NS: restored value decoded');
  ok(d2.getElementById('sec-report').textContent.includes('Your section scores'),'NS: report card after reload');
}
// ===== MODULE: guest note =====
{ const d=load(NS).window.document;
  ok(!!d.getElementById('g7guestnote'),'NS: guest warning when not signed in');
}
// ===== EE: smoke + exam MC =====
{ const w=load(EE,{'g7.current':'Ayodeji'}).window,d=w.document;
  const m=d.querySelector('[data-qid="1-5"]');
  rightOpt(m.querySelector('.mc-group'))[0].click();
  ok(m.querySelector('.step').classList.contains('completed'),'EE: exam MC correct completes');
  const t=JSON.parse(w.localStorage.getItem('g7.data')).students.Ayodeji.topics['expressions-equations'];
  ok(t.exam.attempts===1&&t.exam.correct===1,'EE: exam correct counted once');
  ok(d.getElementById('sec-report').querySelectorAll('.sec-row').length===7,'EE: section report card rows');
  const semantic=[...d.querySelector('[data-qid="5-1"] .mc-group').children].map(e=>e.textContent.trim());
  ok(semantic.join('|')==='One|None|Infinitely many','EE: solution-count options keep semantic order');
}
// ===== SYNC v1.5: hub merge rules =====
{ const data={students:{Divine:{topics:{'number-system':{title:'t',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:5,attempts:0,correct:0,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[{qid:'3-4',label:'Q11',text:'r',ts:77}]}},assignments:{math:{text:'old',ts:5}}}}};
  const w=load(HUB,{'g7.current':'Divine','g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),'g7.data':JSON.stringify(data),'g7.sheetURL':'https://sheet.test/exec'}).window;
  ok(!!w.__hubSync,'sync: hub exposes sync API');
  const res=w.__hubSync.applyCloud({pins:{Divine:{v:'42',ts:9e15}},assign:{Divine:{math:{text:'cloud hw',ts:9e15}}},
    topics:{Divine:{'number-system':{title:'t',tree:{'1-1':{steps:{0:true}}},totalSteps:31,sectionTotals:{},lastPracticed:9e15,attempts:1,correct:1,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[{qid:'3-4',label:'Q11',text:'r',ts:77}]}}},
    reviews:{Divine:{'number-system':{'77':123}}}});
  ok(res.changed===true,'sync: cloud changes applied');
  const d2=JSON.parse(w.localStorage.getItem('g7.data'));
  ok(JSON.parse(w.localStorage.getItem('g7.pins')).Divine==='42','sync: newer cloud PIN wins (LWW)');
  ok(d2.students.Divine.assignments.math.text==='cloud hw','sync: newer cloud assignment wins (LWW)');
  ok(d2.students.Divine.topics['number-system'].lastPracticed===9e15,'sync: newer cloud topic replaces local');
  ok(d2.students.Divine.topics['number-system'].responses[0].reviewed===123,'sync: review overlay applied to responses');
  const res2=w.__hubSync.applyCloud({topics:{Divine:{'number-system':{lastPracticed:1}}},pins:{},assign:{},reviews:{}});
  ok(res2.pushTopics.some(p=>p.n==='Divine'&&p.tid==='number-system'),'sync: local-newer topic queued for push');
}
// ===== SYNC v1.5: teacher actions push =====
{ const w=load(HUB,{'g7.sheetURL':'https://sheet.test/exec','g7.current':'Divine','g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),
    'g7.data':JSON.stringify({students:{Divine:{topics:{'number-system':{title:'t',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:5,attempts:1,correct:1,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[{qid:'3-4',label:'Q',text:'r',ts:77}]}},assignments:{}}}})}).window,d=w.document;
  w.__spy=[];
  d.getElementById('tb-teacher').click();d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  const inp=d.querySelector('.assign-inp');inp.value='Do 5 problems';d.querySelector('.assign-save').click();
  ok(w.__spy.some(b=>b.op==='put'&&b.kind==='assign'&&b.hub==='grade8'&&b.payload.text==='Do 5 problems'),'sync: assignment pushed with hub namespace');
  d.querySelector('.cr-rev').click();
  ok(w.__spy.some(b=>b.kind==='review'&&b.sub==='number-system'&&b.payload['77']>0),'sync: review map pushed');
  d.getElementById('btn-roster').click();
  d.querySelector('.reset-pin').click();
  ok(w.__spy.some(b=>b.kind==='pin'&&b.payload.v===''),'sync: PIN reset pushed');
}
// ===== SYNC v1.5: student pushes + module merge =====
{ const w=load(HUB,{'g7.sheetURL':'https://sheet.test/exec'}).window,d=w.document;
  w.__spy=[];
  d.querySelector('.name-tile').click();d.getElementById('pin1').value='7';d.getElementById('pin2').value='7';d.getElementById('pin-go').click();
  ok(w.__spy.some(b=>b.kind==='pin'&&b.payload.v==='7'&&b.hub==='grade8'),'sync: PIN creation pushed');
  const wm=load(NS,{'g7.current':'Divine','g7.sheetURL':'https://sheet.test/exec'}).window;
  ok(!!wm.__modSync,'sync: module exposes sync API');
  const changed=wm.__modSync.mergeCloudTopic({topics:{Divine:{'number-system':{title:'The Number System',tree:{'1-1':{steps:{0:true}}},totalSteps:31,sectionTotals:{'1':5},lastPracticed:9e15,attempts:1,correct:1,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}}},reviews:{}});
  ok(changed===true,'sync: module merges newer cloud topic');
  ok(JSON.parse(wm.localStorage.getItem('g7.data')).students.Divine.topics['number-system'].tree['1-1'].steps[0]===true,'sync: merge lands in local store');
  wm.__spy=[];
  const q=wm.document.querySelector('[data-qid="4-1"]');
  q.querySelector('.ans-input').value='9';q.querySelector('.check-btn').click();
  await sleep(1700);
  ok(wm.__spy.some(b=>b.kind==='topic'&&b.sub==='number-system'&&b.hub==='grade8'&&b.payload.tree),'sync: module work pushed to cloud (debounced)');
}
console.log('\n'+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})();
