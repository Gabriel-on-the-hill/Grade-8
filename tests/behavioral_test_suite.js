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
// ===== HUB: spaced review (MR-1) — due-for-review ladder =====
{ const DAY=86400000, now=Date.now();
  const R=load(HUB).window.__hubReview;
  ok(R&&typeof R.due==='function','review: hub exposes __hubReview API');
  ok(R.rungs.join(',')==='1,3,7,21,42','review: ladder rungs are 1/3/7/21/42 days');
  // streak inference from existing stats (phase-1 read-only)
  ok(R.streak({attempts:20,correct:19,skillStats:{}})===4,'review: high accuracy + evidence earns the top rung');
  ok(R.streak({attempts:20,correct:8,skillStats:{}})===0,'review: low accuracy stays on the bottom rung');
  ok(R.streak({attempts:1,correct:1,skillStats:{}})===0,'review: one lucky correct is not a streak (evidence cap)');
  ok(R.streak({attempts:20,correct:19,skillStats:{roots:{attempts:8,misses:4}}})===3,'review: a currently-shaky skill pulls the rung back one');
  // due computation
  ok(R.due({attempts:20,correct:19,skillStats:{},lastPracticed:now-50*DAY}).dueNow===true,'review: aged mastered topic is due (past its 42d rung)');
  ok(R.due({attempts:20,correct:19,skillStats:{},lastPracticed:now-5*DAY}).dueNow===false,'review: just-practiced mastered topic is not due');
  ok(R.due({attempts:0,correct:0,skillStats:{},lastPracticed:0})===null,'review: unstarted topic is never eligible');
  ok(R.due({attempts:3,correct:1,skillStats:{},lastPracticed:now-2*DAY}).dueNow===true,'review: a shaky topic returns fast (1d rung)');
  // list: only overdue, most-overdue first
  const topics={a:{attempts:20,correct:19,skillStats:{},lastPracticed:now-50*DAY},   // rung 42d, 8d overdue
                b:{attempts:6,correct:5,skillStats:{},lastPracticed:now-40*DAY},      // rung 7d, 33d overdue
                c:{attempts:10,correct:9,skillStats:{},lastPracticed:now}};           // just practiced
  const list=R.list(topics,['a','b','c'],now);
  ok(list.length===2,'review: only overdue topics are listed (just-practiced excluded)');
  ok(list[0].id==='b'&&list[1].id==='a','review: most-overdue first');
}
// ===== HUB: due-for-review renders (and stays empty when nothing is due) =====
{ const DAY=86400000, now=Date.now();
  const seed=lp=>({students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:lp,attempts:20,correct:19,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}});
  const store=lp=>({'g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),'g7.current':'Divine','g7.data':JSON.stringify(seed(lp))});
  const w=load(HUB,store(now-50*DAY)).window,d=w.document;
  const dr=d.getElementById('due-review');
  ok(dr&&dr.querySelectorAll('.review-item').length===1,'review: hub surfaces a due item for an aged mastered topic');
  ok(dr.textContent.includes('The Number System'),'review: due item names the topic');
  ok(dr.querySelector('.review-item').getAttribute('data-id')==='number-system','review: due item links into its module');
  const w2=load(HUB,store(now)).window;
  ok(w2.document.getElementById('due-review').innerHTML==='','review: nothing surfaced right after practice');
}
// ===== HUB: phase-2 stored streak wins over the inferred proxy =====
{ const DAY=86400000, now=Date.now();
  const R=load(HUB).window.__hubReview;
  ok(R.streak({reviewStreak:2,attempts:1,correct:1,skillStats:{}})===2,'review(p2): stored reviewStreak overrides the inferred proxy');
  ok(R.streak({reviewStreak:0,attempts:20,correct:19,skillStats:{}})===0,'review(p2): stored 0 wins even when accuracy is high');
  ok(R.due({reviewStreak:4,attempts:1,correct:1,skillStats:{},lastPracticed:now-50*DAY}).dueNow===true,'review(p2): stored top rung schedules 42d (due at 50d)');
  ok(R.due({reviewStreak:4,attempts:1,correct:1,skillStats:{},lastPracticed:now-10*DAY}).dueNow===false,'review(p2): stored top rung not due at 10d');
}
// ===== MODULE: phase-2 engine writes the streak per spaced session =====
{ const DAY=86400000, now=Date.now(), today=Math.floor(now/DAY);
  const mk=(rs,rd)=>{const t={title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:now,attempts:0,correct:0,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]};if(rs!==undefined)t.reviewStreak=rs;if(rd!==undefined)t.reviewDay=rd;return {students:{Divine:{topics:{'number-system':t},assignments:{}}}};};
  const rec=w=>JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'];
  // fresh topic: a clean 3-item session earns rung 1, but only after >=3 first-attempts
  let w=load(NS,{'g7.current':'Divine','g7.data':JSON.stringify(mk())}).window;
  w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===undefined,'review(engine): under 3 first-attempts does not commit a session');
  w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===1&&rec(w).reviewDay===today,'review(engine): a clean 3-item session sets streak 1 for today');
  w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===1,'review(engine): more clean items the same visit do not double-advance');
  // aged streak advances exactly one rung on a passing return
  w=load(NS,{'g7.current':'Divine','g7.data':JSON.stringify(mk(2,today-1))}).window;
  w.__modReview.review(true,true);w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===3,'review(engine): a passing return advances the streak one rung (2->3)');
  // a bad return (<80% first-attempt) resets to 0
  w=load(NS,{'g7.current':'Divine','g7.data':JSON.stringify(mk(3,today-1))}).window;
  w.__modReview.review(true,false);w.__modReview.review(true,false);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===0,'review(engine): a failing return resets the streak to 0');
  // day-guard: a second session the same day cannot advance again
  w=load(NS,{'g7.current':'Divine','g7.data':JSON.stringify(mk(3,today))}).window;
  w.__modReview.review(true,true);w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===3,'review(engine): a second session the same day does not advance the streak');
}
// ===== AN-4: acquisition vs retention buckets (engine) =====
{ const DAY=86400000, now=Date.now(), today=Math.floor(now/DAY);
  const fresh={students:{Divine:{topics:{'number-system':{title:'NS',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:now,attempts:0,correct:0,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  const aged={students:{Divine:{topics:{'number-system':{title:'NS',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:now-50*DAY,attempts:20,correct:19,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[],reviewStreak:4,reviewDay:today-50}},assignments:{}}}};
  const rec=w=>JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'];
  let w=load(NS,{'g7.current':'Divine','g7.data':JSON.stringify(fresh)}).window;
  ok(w.__modReview.wasDue({lastPracticed:now,attempts:0})===false,'AN-4: an unstarted/just-practiced topic is not due (acquisition)');
  w.__modReview.review(true,true);w.__modReview.review(true,false);
  ok(rec(w).acqFirst===2&&rec(w).acqCorrect===1&&rec(w).retFirst===undefined,'AN-4: first-attempts on a not-due topic bucket as acquisition');
  w=load(NS,{'g7.current':'Divine','g7.data':JSON.stringify(aged)}).window;
  ok(w.__modReview.wasDue({reviewStreak:4,lastPracticed:now-50*DAY,attempts:20})===true,'AN-4: an aged topic past its 42d rung is due (retention)');
  w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).retFirst===2&&rec(w).retCorrect===2&&rec(w).acqFirst===undefined,'AN-4: first-attempts on a due topic bucket as retention');
}
// ===== AN-4: teacher dashboard shows acquisition vs retention =====
{ const data={students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:Date.now(),attempts:10,correct:8,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[],acqFirst:20,acqCorrect:17,retFirst:10,retCorrect:6}},assignments:{}}}};
  const w=load(HUB,{'g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),'g7.current':'Divine','g7.data':JSON.stringify(data)}).window,d=w.document;
  d.getElementById('tb-teacher').click();d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  const dash=d.getElementById('dash');
  ok(dash.textContent.includes('Retrieval'),'AN-4: dashboard shows the retrieval readout');
  ok(dash.textContent.includes('first-time')&&dash.textContent.includes('85%'),'AN-4: acquisition accuracy shown (17/20 = 85%)');
  ok(dash.textContent.includes('on review')&&dash.textContent.includes('60%'),'AN-4: retention accuracy shown (6/10 = 60%)');
  ok(!!dash.querySelector('.retain-line b.warn'),'AN-4: retention well below acquisition is flagged for the teacher');
}
// ===== AS-4: per-skill difficulty calibration on the teacher dashboard =====
{ const data={students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:Date.now(),attempts:30,correct:23,struggles:[],skillStats:{easy1:{attempts:10,misses:0},hard1:{attempts:10,misses:5},sweet1:{attempts:10,misses:2},few:{attempts:2,misses:0}},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  const w=load(HUB,{'g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),'g7.current':'Divine','g7.data':JSON.stringify(data)}).window,d=w.document;
  d.getElementById('tb-teacher').click();d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  const dash=d.getElementById('dash');
  ok(dash.querySelectorAll('.cal-chip').length===3,'AS-4: only skills with enough evidence (>=4 attempts) are calibrated');
  ok(dash.querySelector('.cal-chip.easy')&&dash.querySelector('.cal-chip.easy').textContent==='too easy','AS-4: >90% first-attempt flagged too easy (advance)');
  ok(dash.querySelector('.cal-chip.hard')&&dash.querySelector('.cal-chip.hard').textContent==='too hard','AS-4: <70% first-attempt flagged too hard (re-teach)');
  ok(dash.querySelector('.cal-chip.sweet')&&dash.querySelector('.cal-chip.sweet').textContent==='on target','AS-4: ~85% band flagged on target');
}
// ===== AS-4 (automatic): the lesson's own Learn->Stretch ladder supplies the difficulty level =====
{ const w=load(NS,{'g7.current':'Divine'}).window,d=w.document;
  const rec=()=>JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['number-system'].levelStats||{};
  const q41=d.querySelector('[data-qid="4-1"]');            // Learn  -> level 1
  q41.querySelector('.ans-input').value='9';q41.querySelector('.check-btn').click();
  ok(rec()['1']&&rec()['1'].attempts===1&&rec()['1'].misses===0,'AS-4: a Learn item logs to level 1 (foundational)');
  const q42=d.querySelector('[data-qid="4-2"]');            // Practice -> level 2
  q42.querySelector('.ans-input').value='99';q42.querySelector('.check-btn').click();
  ok(rec()['2']&&rec()['2'].attempts===1&&rec()['2'].misses===1,'AS-4: a Practice item logs to level 2 (target)');
  const q71=d.querySelector('[data-qid="7-1"]');            // Exam capstone -> level 3
  q71.querySelector('.ans-input').value='0.1';q71.querySelector('.check-btn').click();
  ok(rec()['3']&&rec()['3'].attempts===1&&rec()['3'].misses===1,'AS-4: an Exam capstone logs to level 3 (the assessed bar)');
  ok(!rec()['4'],'AS-4: nothing lands in level 4 until a Stretch item is attempted');
}
// ===== AS-4: dashboard shows where strength failed; stretch stays out of pass/fail =====
{ const data={students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:Date.now(),attempts:53,correct:38,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[],levelStats:{1:{attempts:20,misses:1},2:{attempts:20,misses:6},3:{attempts:10,misses:6},4:{attempts:3,misses:2}}}},assignments:{}}}};
  const w=load(HUB,{'g7.roster':JSON.stringify(['Divine']),'g7.pins':JSON.stringify({Divine:'1'}),'g7.current':'Divine','g7.data':JSON.stringify(data)}).window,d=w.document;
  d.getElementById('tb-teacher').click();d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  const ll=d.querySelector('.level-line');
  ok(ll&&ll.textContent.includes('Foundational 95%'),'AS-4: foundational level reported');
  ok(ll.textContent.includes('Target 70%'),'AS-4: target level reported');
  ok(ll.textContent.includes('Exam 40%'),'AS-4: exam (assessed bar) reported');
  ok(d.querySelector('.lv.low')&&d.querySelector('.lv.low').textContent.includes('Exam'),'AS-4: the level where strength failed is flagged');
  ok(d.querySelector('.lv-focus')&&d.querySelector('.lv-focus').textContent==='Focus: Exam','AS-4: focus point = first curriculum level below the bar');
  ok(!!d.querySelector('.lv.beyond')&&ll.textContent.includes('Stretch (beyond)'),'AS-4: stretch reported separately as beyond the standard');
  ok(!d.querySelector('.lv.beyond.low'),'AS-4: a low stretch score is never flagged as failure');
}
// ===== SYNC: the connection test tells the truth (it used to claim success unconditionally) =====
{ const w=load(HUB).window;
  const pt=w.__hubSync.pingText;
  ok(typeof pt==='function','sync: hub exposes the ping status formatter');
  ok(/No response from that URL/.test(pt(null)),'sync: no response is reported as a failure, not "sent"');
  ok(/No response from that URL/.test(pt({ok:false,error:'boom'})),'sync: an error reply is reported as a failure');
  const good=pt({ok:true,sheet:'Study Hubs Cloud',id:'abc',log:42,sync:17});
  ok(/Connected/.test(good),'sync: a live backend reports Connected');
  ok(good.includes('Study Hubs Cloud'),'sync: the test names WHICH sheet it writes to');
  ok(good.includes('42')&&good.includes('17'),'sync: the test reports Log/SyncStore row counts');
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
// ===== MODULE: Matter & Its Interactions (sci.matter, MS-PS1) =====
{ const MATTER='Matter_and_Its_Interactions.html';
  const w=load(MATTER,{'g7.current':'Divine'}).window,d=w.document;
  ok(!d.getElementById('g8gate'),'matter: gate removed when g8.gate=ok');
  const mqids=[...d.querySelectorAll('.qcard[data-qid]')].map(c=>c.dataset.qid);
  ok(mqids.length===27&&new Set(mqids).size===27,'matter: 27 unique qcards render');
  ok(d.querySelector('[data-qid="7-1"]').dataset.exam==='1','matter: MISA item 7-1 is exam-graded');
  ok([...d.querySelectorAll('.qcard[data-exam="1"] .hint-content')].length===0,'matter: no hints behind exam capstones (hint integrity)');
  const mtopic=()=>JSON.parse(w.localStorage.getItem('g7.data')).students.Divine.topics['sci.matter'];
  // fill-in: wrong then correct (qid 1-2 answer = 5)
  const c12=d.querySelector('[data-qid="1-2"]'),i12=c12.querySelector('.ans-input');
  i12.value='4';c12.querySelector('.check-btn').click();
  ok(i12.classList.contains('wrong'),'matter: wrong fill-in is flagged');
  i12.value='5';c12.querySelector('.check-btn').click();
  ok(c12.querySelector('.step').classList.contains('completed'),'matter: correct fill-in completes the step');
  ok(!!mtopic()&&mtopic().title==='Matter & Its Interactions','matter: work writes under topic id sci.matter');
  // MC correct locks the group (qid 4-1)
  const g41=d.querySelector('[data-qid="4-1"] .mc-group');
  rightOpt(g41)[0].click();
  ok(g41.classList.contains('answered'),'matter: correct MC answer locks the group');
  // exam capstone keeps real MCAP order (7-1 correct = choice B, authored index 1)
  const g71=d.querySelector('[data-qid="7-1"] .mc-group');
  ok(g71.hasAttribute('data-noshuffle'),'matter: exam capstone 7-1 keeps real MCAP order (noshuffle)');
  ok([...g71.querySelectorAll('.mc-option')].indexOf(rightOpt(g71)[0])===1,'matter: 7-1 correct answer stays choice B');
  rightOpt(g71)[0].click();
  ok(mtopic().exam.attempts>=1&&mtopic().exam.correct>=1,'matter: exam-readiness counts a first-attempt exam item');
  // two-part 7-5: Part B locked until Part A answered
  const steps75=d.querySelectorAll('[data-qid="7-5"] .step');
  ok(steps75[1].classList.contains('locked'),'matter: two-part Part B starts locked');
  rightOpt(steps75[0].querySelector('.mc-group'))[0].click();
  ok(!steps75[1].classList.contains('locked'),'matter: correct Part A unlocks Part B');
  // constructed response saved for teacher (qid 5-4)
  const c54=d.querySelector('[data-qid="5-4"]');
  c54.querySelector('.cr-area').value='In an open cup the carbon dioxide gas escaped into the air.';
  c54.querySelector('.cr-save').click();
  ok(mtopic().responses.some(r=>r.qid==='5-4'),'matter: constructed response saved for teacher review');
}
console.log('\n'+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})();
