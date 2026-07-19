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
/* Storage namespace under test. Must match the hub's STORE_PREFIX and the modules' G7_STORE;
   asserted below so a hub/module/suite disagreement fails here rather than silently. */
const P='g8.';
function load(file,seed,rnd,qs){   // qs: query string, e.g. '?review=roots' (MR-1 phase-3)
  const dom=new JSDOM(src(file),{runScripts:'dangerously',url:'https://x.test/'+file+(qs||''),
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
// ===== HUB: cold boot, no gate, no roster list, typed-name sign-in, case-insensitive =====
{ const w=load(HUB).window,d=w.document;
  ok(!d.getElementById('g8gate'),'hub: no access gate (removed)');
  ok(!d.getElementById('view-signin').classList.contains('hidden'),'hub: sign-in visible on cold boot');
  ok(d.querySelectorAll('.name-tile').length===0,'hub: NO roster list is ever shown');
  ok(!!d.getElementById('signin-name'),'hub: typed-name input present');
  ok(w.localStorage.getItem(P+'teacherPass')==='Gabe','hub: teacher passcode seeded');
  ok(JSON.parse(w.localStorage.getItem(P+'roster')).join(',')==='Divine,Ayodeji','hub: roster locked to Divine,Ayodeji');
  // an unknown name is rejected, and never opens the PIN modal
  d.getElementById('signin-name').value='Somebody';d.getElementById('signin-go').click();
  ok(/couldn.t find/i.test(d.getElementById('signin-err').textContent),'hub: unknown name rejected');
  ok(d.getElementById('pinModal').classList.contains('hidden'),'hub: no PIN modal for an unknown name');
  // a real name in ANY case resolves to the canonical spelling
  d.getElementById('signin-name').value='  DIVINE  ';d.getElementById('signin-go').click();
  ok(!d.getElementById('pinModal').classList.contains('hidden'),'hub: PIN modal opens for a real name (any case)');
  ok(d.getElementById('pin-title').textContent==='Divine','hub: typed name resolves to canonical spelling');
  ok(d.getElementById('pin-sub').textContent.includes('Create'),'hub: create-PIN mode first time');
  d.getElementById('pin1').value='1a';d.getElementById('pin2').value='1b';d.getElementById('pin-go').click();
  ok(d.getElementById('pin-err').textContent.includes('do not match'),'hub: genuinely different PINs rejected');
  // case-differing confirm is accepted (PINs are case-insensitive)
  d.getElementById('pin1').value='Ab';d.getElementById('pin2').value='aB';d.getElementById('pin-go').click();
  ok(!d.getElementById('view-app').classList.contains('hidden'),'hub: app opens after PIN set (case-insensitive confirm)');
  ok(JSON.parse(w.localStorage.getItem(P+'pins')).Divine==='Ab','hub: PIN persisted');
  ok(w.localStorage.getItem(P+'device')==='Divine','hub: device bound to Divine');
  ok(d.querySelectorAll('.subject-tab').length===2,'hub: two subject tabs');
}
// ===== HUB: bound device never lists students; wrong then case-insensitive PIN =====
{ const w=load(HUB,{[P+'device']:'Divine',[P+'pins']:JSON.stringify({Divine:'Ab'})}).window,d=w.document;
  ok(d.querySelectorAll('.name-tile').length===0,'hub: bound device shows no list');
  ok(d.getElementById('signin-host').textContent.includes('Divine'),'hub: bound device shows only its own student');
  ok(!d.getElementById('signin-host').textContent.includes('Ayodeji'),'hub: bound device never shows the other student');
  d.getElementById('signin-open').click();
  ok(d.getElementById('pin-sub').textContent.includes('Enter'),'hub: enter-PIN mode for returning student');
  d.getElementById('pin1').value='99';d.getElementById('pin-go').click();
  ok(d.getElementById('pin-err').textContent.includes('Incorrect'),'hub: wrong PIN rejected');
  d.getElementById('pin1').value='AB';d.getElementById('pin-go').click();   // stored 'Ab', typed 'AB'
  ok(!d.getElementById('view-app').classList.contains('hidden'),'hub: case-insensitive PIN entry signs in');
}
// ===== HUB: roster is authoritative — a stray name and its PIN are pruned on boot =====
{ const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine','Ayodeji','Intruder']),[P+'pins']:JSON.stringify({Divine:'1',Intruder:'9'})}).window;
  ok(JSON.parse(w.localStorage.getItem(P+'roster')).indexOf('Intruder')<0,'hub: stray roster name pruned');
  ok(!('Intruder' in JSON.parse(w.localStorage.getItem(P+'pins'))),'hub: stray PIN pruned');
}
// ===== HUB: one-time migration off the shared 'g7.' namespace (19 Jul 2026) =====
/* This runs once on every returning student's device and cannot be re-run, so it is asserted
   hard: it must carry OUR students' work across, leave Grade 7's store untouched, and drop the
   foreign records whose presence was the bug being fixed. */
{ const g7data={students:{
    Divine:{topics:{'number-system':{title:'NS',tree:{'1-1':{steps:{0:true}}},totalSteps:31,sectionTotals:{},lastPracticed:5,attempts:9,correct:7,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}},
    Kayode:{topics:{'g7-topic':{title:'A Grade 7 topic',tree:{},totalSteps:10,sectionTotals:{},lastPracticed:5,attempts:4,correct:4,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  const old={'g7.data':JSON.stringify(g7data),'g7.pins':JSON.stringify({Divine:'Ab',Kayode:'Zz'}),
    'g7.pints':JSON.stringify({Divine:11,Kayode:22}),'g7.current':'Divine','g7.device':'Divine',
    'g7.syncKey':'teacher-key','g7.seedv':'stale-seed-marker'};
  const w=load(HUB,old).window;
  const g8data=JSON.parse(w.localStorage.getItem(P+'data'));
  ok(!!g8data.students.Divine,'migrate: our own student’s progress comes across');
  ok(g8data.students.Divine.topics['number-system'].attempts===9,'migrate: the progress carried is the real record, not an empty one');
  ok(!g8data.students.Kayode,'migrate: a student who is not on this roster does NOT come across');
  ok(JSON.parse(w.localStorage.getItem('g7.data')).students.Kayode,'migrate: COPY not move — Grade 7’s store is left intact');
  ok(JSON.parse(w.localStorage.getItem(P+'pins')).Divine==='Ab','migrate: our student’s PIN comes across');
  ok(!('Kayode' in JSON.parse(w.localStorage.getItem(P+'pins'))),'migrate: a foreign PIN does not');
  ok(JSON.parse(w.localStorage.getItem(P+'pints')).Divine===11,'migrate: per-PIN sync timestamps come across');
  ok(w.localStorage.getItem(P+'current')==='Divine','migrate: a signed-in name that is ours is kept');
  ok(w.localStorage.getItem(P+'device')==='Divine','migrate: device binding that is ours is kept');
  ok(w.localStorage.getItem(P+'syncKey')==='teacher-key','migrate: device-level settings come across');
  ok(w.localStorage.getItem(P+'seedv')!=='stale-seed-marker','migrate: seed markers are NOT copied, so this deployment’s seeds re-apply cleanly');
  ok(w.localStorage.getItem(P+'migv')==='1','migrate: the device is marked migrated');
}
// ===== HUB: migration is one-shot and never clobbers newer data =====
{ const g7data={students:{Divine:{topics:{'number-system':{title:'NS',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:5,attempts:99,correct:99,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  // a device that already has g8 data must keep it — the old namespace must not overwrite newer work
  const g8data={students:{Divine:{topics:{'number-system':{title:'NS',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:9,attempts:3,correct:3,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  let w=load(HUB,{'g7.data':JSON.stringify(g7data),[P+'data']:JSON.stringify(g8data)}).window;
  ok(JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'].attempts===3,
     'migrate: never overwrites a key the new namespace already holds');
  // once migv is set, a later change under g7. must not be dragged in a second time
  w=load(HUB,{'g7.data':JSON.stringify(g7data),[P+'migv']:'1'}).window;
  ok(w.localStorage.getItem(P+'data')===null||!JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics,
     'migrate: an already-migrated device does not re-import from the old namespace');
}
// ===== HUB: teacher modal, gated settings, Escape, takeover =====
{ const w=load(HUB,{[P+'teacherPass']:'studentmade'}).window,d=w.document;
  ok(w.localStorage.getItem(P+'teacherPass')==='Gabe','hub: passcode takeover reclaims student-set passcode');
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
  const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),[P+'current']:'Divine',[P+'data']:JSON.stringify(data)}).window,d=w.document;
  ok(d.getElementById('stat-tiles').innerHTML.includes('>1<'),'hub: skills-to-review decays (1 real pattern, not 2)');
  ok(d.querySelector('.tcard .secbars'),'hub: student topic card shows per-section bars');
  ok(d.getElementById('hw-banner').textContent.includes('Finish section 5'),'hub: teacher assignment shown');
  d.getElementById('hw-done').click();
  ok(JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.assignments.math.doneTs>0,'hub: Mark done persists');
  ok(d.getElementById('hw-banner').textContent.includes('done'),'hub: done state visible to student');
  d.getElementById('tb-teacher').click();
  d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  ok(d.getElementById('dash').textContent.includes('The Number System'),'hub: dashboard shows topic');
  ok(d.getElementById('dash').textContent.includes('Student marked this done'),'hub: teacher sees done note');
  const rev=d.querySelector('.cr-rev');ok(!!rev,'hub: Mark reviewed button present');
  rev.click();
  ok(JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'].responses[0].reviewed>0,'hub: reviewed flag persists');
}
// ===== HUB: per-student subject visibility (STUDENT_SUBJECTS) =====
{ const boot=(who,extra)=>load(HUB,Object.assign({[P+'roster']:JSON.stringify(['Divine','Ayodeji']),
    [P+'pins']:JSON.stringify({Divine:'1',Ayodeji:'1'}),[P+'current']:who},extra||{})).window;

  // Gated student: one subject, no tab bar.
  { const w=boot('Ayodeji'),d=w.document,tabs=d.getElementById('subject-tabs');
    const labels=[...tabs.querySelectorAll('.subject-tab')].map(b=>b.textContent);
    ok(labels.length===1,'subjects: gated student sees exactly one subject tab');
    ok(/Mathematics/.test(labels[0]||''),'subjects: gated student sees Mathematics');
    ok(!/Science/.test(tabs.textContent),'subjects: gated student does not see Science');
    ok(tabs.style.display==='none','subjects: single-subject tab bar is hidden as noise');
  }
  // Ungated student is untouched.
  { const w=boot('Divine'),d=w.document,tabs=d.getElementById('subject-tabs');
    const labels=[...tabs.querySelectorAll('.subject-tab')].map(b=>b.textContent);
    ok(labels.length>1,'subjects: unlisted student still sees every subject');
    ok(/Science/.test(tabs.textContent),'subjects: unlisted student still sees Science');
    ok(tabs.style.display!=='none','subjects: multi-subject tab bar stays visible');
  }
  // g8.subject is DEVICE-level: another student's stored choice must not strand a gated student.
  { const w=boot('Ayodeji',{[P+'subject']:'sci'}),d=w.document;
    ok(!d.getElementById('view-app').classList.contains('hidden'),'subjects: gated student still reaches the app');
    /* Assert on the RESOLVED subject, not the tab bar: the tabs are filtered by visibleSubjects()
     * regardless, so a tab-only assertion passes even when curSubject() honours the foreign id and
     * renderApp() goes on to render the wrong subject's content under a correct-looking tab bar.
     * (Caught by mutation-testing — the tab-only version of this check passed vacuously.) */
    const sub=d.getElementById('greeting-sub').textContent;
    ok(/Mathematics/.test(sub),'subjects: stored foreign subject resolves back to an allowed subject');
    ok(!/Science/.test(sub),'subjects: foreign subject content is not rendered');
    ok(/The Number System/.test(d.getElementById('view-app').textContent),'subjects: allowed subject topics are the ones listed');
    ok(!/Matter/.test(d.getElementById('view-app').textContent),'subjects: hidden subject topics are not listed');
  }
  // The teacher dashboard is deliberately UNFILTERED.
  { const data={students:{Ayodeji:{topics:{'sci.matter':{title:'Matter',tree:{'1-1':{steps:{0:true}}},totalSteps:31,
      sectionTotals:{},lastPracticed:Date.now(),attempts:3,correct:2,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}}}}};
    const w=boot('Ayodeji',{[P+'data']:JSON.stringify(data)}),d=w.document;
    d.getElementById('tb-teacher').click();
    d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
    ok(/Science/.test(d.getElementById('dash').textContent),'subjects: teacher still sees a hidden subject in the dashboard');
    ok(/Matter/.test(d.getElementById('dash').textContent),'subjects: hidden-subject data is retained, not deleted');
  }
  // Publishing a plan for a subject the student cannot see must fail closed.
  { const V=load(HUB).window.__hubHw;
    const plan=(who,subject)=>[{student:who,subject:subject,sets:[{id:'s1',label:'L',
      items:[{ref:'module',topic:subject==='sci'?'sci.matter':'number-system',qid:'1-1'}]}]}];
    const bad=V.validate(plan('Ayodeji','sci'));
    ok(bad.errors.length===1&&/cannot see subject/.test(bad.errors[0]),'subjects: plan for a hidden subject is rejected');
    ok(bad.plans.length===0,'subjects: hidden-subject plan publishes nothing (fails closed)');
    ok(V.validate(plan('Ayodeji','math')).errors.length===0,'subjects: allowed-subject plan still validates');
    ok(V.validate(plan('Divine','sci')).errors.length===0,'subjects: ungated student can still be set Science homework');
  }
}
// ===== HUB: dashboard labels non-enrolment, and never hides a record =====
{ /* The dashboard renders EVERY student, so an assertion on the whole panel leaks across
   * students (Ayodeji's chip shows up while viewing Divine). Scope to one .student-block. */
  const block=(who,data,of)=>{const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine','Ayodeji']),
      [P+'pins']:JSON.stringify({Divine:'1',Ayodeji:'1'}),[P+'current']:who,
      [P+'data']:JSON.stringify(data||{students:{}})}).window,d=w.document;
    d.getElementById('tb-teacher').click();
    d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
    const b=[...d.getElementById('dash').querySelectorAll('.student-block')]
      .find(x=>{const o=x.querySelector('.open-as');return o&&o.getAttribute('data-n')===(of||who);});
    return b?b.textContent:'';};
  // Heading text only — the empty-state note also contains "hidden from <name>", so a whole-block
  // match cannot prove the heading chip exists. (Caught by mutation-testing.)
  const heads=(who,data,of)=>{const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine','Ayodeji']),
      [P+'pins']:JSON.stringify({Divine:'1',Ayodeji:'1'}),[P+'current']:who,
      [P+'data']:JSON.stringify(data||{students:{}})}).window,d=w.document;
    d.getElementById('tb-teacher').click();
    d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
    const b=[...d.getElementById('dash').querySelectorAll('.student-block')]
      .find(x=>{const o=x.querySelector('.open-as');return o&&o.getAttribute('data-n')===(of||who);});
    return b?[...b.querySelectorAll('.dash-subject')].map(x=>x.textContent).join(' | '):'';};
  const sci=q=>({'sci.matter':{title:'Matter & Its Interactions',tree:q?{'1-1':{steps:{0:true}}}:{},totalSteps:31,
    sectionTotals:{},lastPracticed:Date.now(),attempts:q?4:0,correct:q?3:0,struggles:[],skillStats:{},
    exam:{attempts:0,correct:0},responses:[]}});

  // Gated student, nothing in the hidden subject: labelled, not silently blank.
  { const b=block('Ayodeji',{students:{Ayodeji:{topics:{}}}});
    ok(/hidden from Ayodeji/.test(heads('Ayodeji',{students:{Ayodeji:{topics:{}}}})),
       'dash: non-enrolled subject is labelled on the heading itself');
    ok(/Not enrolled/.test(b),'dash: empty non-enrolled subject says why');
    ok(!/No activity yet in Science/.test(b),'dash: "no activity yet" no longer misdescribes non-enrolment');
    ok(/Science/.test(b),'dash: the subject is still listed, not removed');
  }
  // The whole point of not choosing option 3: a gated student WITH data still shows every row.
  { const b=block('Ayodeji',{students:{Ayodeji:{topics:sci(true)}}});
    ok(/Matter & Its Interactions/.test(b),'dash: hidden-subject records are still shown in full');
    ok(!/Not enrolled/.test(b),'dash: the not-enrolled note yields to real data');
    ok(/hidden from Ayodeji/.test(heads('Ayodeji',{students:{Ayodeji:{topics:sci(true)}}})),
       'dash: heading still flags that the student cannot see it');
  }
  // Enrolled student is completely unchanged.
  { const b=block('Divine',{students:{Divine:{topics:{}}}});
    ok(!/hidden from/.test(b),'dash: enrolled student gets no hidden-from chip');
    ok(!/Not enrolled/.test(b),'dash: enrolled student gets no not-enrolled note');
    ok(/No activity yet/.test(b),'dash: enrolled student keeps the plain empty state');
  }
  // A teacher viewing as one student still sees the other's true state.
  { const b=block('Divine',{students:{Ayodeji:{topics:sci(true)}}},'Ayodeji');
    ok(/Matter & Its Interactions/.test(b),'dash: another student’s hidden-subject data is visible to the teacher');
  }
}
// ===== HUB: homework ref:"task" — out-of-band items (snapshot-returned) =====
{ const mkPlan=items=>({students:{Ayodeji:{topics:{},hwplan:{math:{sets:[
      {id:'wk-t',label:'Set 1 — test',items:items}]}}}}});
  const MOD={ref:'module',topic:'number-system',qid:'4-1'};
  const TASK={ref:'task',text:'List 30 perfect squares and 30 perfect cubes.'};
  const boot=data=>load(HUB,{[P+'roster']:JSON.stringify(['Ayodeji']),[P+'pins']:JSON.stringify({Ayodeji:'1'}),
    [P+'current']:'Ayodeji',[P+'data']:JSON.stringify(data)}).window;

  // --- render ---
  { const d=boot(mkPlan([MOD,TASK])).document, hw=d.getElementById('hw-sets');
    ok(hw.textContent.includes('List 30 perfect squares'),'hw task: instruction text is rendered to the student');
    ok(hw.textContent.includes('send your tutor a snapshot'),'hw task: names its out-of-band return route');
    ok(!!hw.querySelector('.hw-task'),'hw task: rendered in its own .hw-task block');
    ok(hw.textContent.includes('0/1 done'),'hw task: excluded from the progress total (1 module item, not 2)');
    ok(!!hw.querySelector('a.btn[href*="?q=4-1"]'),'hw task: sibling module link still built');
    ok(!/undefined|\[object/.test(hw.textContent),'hw task: no undefined/object leakage in the card');
  }
  // A task must never block the set reaching done — the engine cannot mark it.
  { const data=mkPlan([MOD,TASK]);
    data.students.Ayodeji.hwstate={math:{items:{'wk-t':{'number-system|4-1':1}},sets:{}}};
    const w=boot(data),hw=w.document.getElementById('hw-sets');
    ok(hw.textContent.includes('done ✓'),'hw task: all module items done ⇒ set completes despite an open task');
    ok(JSON.parse(w.localStorage.getItem(P+'data')).students.Ayodeji.hwstate.math.sets['wk-t'].completedTs>0,
       'hw task: completion persists (task is not counted as outstanding)');
  }
  // A task-only set has no engine-markable items; it must not auto-complete at 0/0.
  { const hw=boot(mkPlan([TASK])).document.getElementById('hw-sets');
    ok(!hw.textContent.includes('done ✓'),'hw task: task-only set does not auto-complete');
    ok(hw.textContent.includes('List 30 perfect squares'),'hw task: task-only set still shows its instruction');
  }
  // Task text is escaped, not injected — plans are tutor-authored files but still untrusted input.
  { const hw=boot(mkPlan([MOD,{ref:'task',text:'<img src=x onerror=alert(1)>pwn'}])).document.getElementById('hw-sets');
    ok(!hw.querySelector('img'),'hw task: text is escaped, not parsed as HTML');
    ok(hw.textContent.includes('pwn'),'hw task: escaped text still displays');
  }
  // --- validation (fails closed: one bad item publishes nothing) ---
  { const V=load(HUB).window.__hubHw;
    ok(V&&typeof V.validate==='function','hw task: hub exposes __hubHw API');
    const mk=items=>[{student:'Ayodeji',subject:'math',sets:[{id:'s1',label:'L',items:items}]}];
    ok(V.validate(mk([TASK])).errors.length===0,'hw task: valid task item passes validation');
    ok(V.validate(mk([TASK])).plans.length===1,'hw task: valid task item publishes');
    const noText=V.validate(mk([{ref:'task'}]));
    ok(noText.errors.length===1&&/task item needs text/.test(noText.errors[0]),'hw task: task without text is rejected');
    ok(noText.plans.length===0,'hw task: a bad task item publishes nothing (fails closed)');
    ok(/ref must be "module", "bank" or "task"/.test(V.validate(mk([{ref:'nope'}])).errors[0]||''),
       'hw task: unknown ref still rejected, message lists all three kinds');
    ok(V.validate(mk([MOD])).errors.length===0,'hw task: module items unaffected by the new kind');
    ok(V.validate(mk([{ref:'bank'}])).errors.length===1,'hw task: bank items still require an id');
    // progress/links accounting
    ok(V.progress({items:[MOD,TASK]},{}).total===1,'hw task: hwSetProgress counts module items only');
    ok(V.links({items:[MOD,TASK]}).filter(g=>g.kind==='other').length===1,'hw task: hwLinks emits the task as a non-module group');
  }
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
  const store=lp=>({[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),[P+'current']:'Divine',[P+'data']:JSON.stringify(seed(lp))});
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
  const rec=w=>JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
  // fresh topic: a clean 3-item session earns rung 1, but only after >=3 first-attempts
  let w=load(NS,{[P+'current']:'Divine',[P+'data']:JSON.stringify(mk())}).window;
  w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===undefined,'review(engine): under 3 first-attempts does not commit a session');
  w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===1&&rec(w).reviewDay===today,'review(engine): a clean 3-item session sets streak 1 for today');
  w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===1,'review(engine): more clean items the same visit do not double-advance');
  // aged streak advances exactly one rung on a passing return
  w=load(NS,{[P+'current']:'Divine',[P+'data']:JSON.stringify(mk(2,today-1))}).window;
  w.__modReview.review(true,true);w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===3,'review(engine): a passing return advances the streak one rung (2->3)');
  // a bad return (<80% first-attempt) resets to 0
  w=load(NS,{[P+'current']:'Divine',[P+'data']:JSON.stringify(mk(3,today-1))}).window;
  w.__modReview.review(true,false);w.__modReview.review(true,false);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===0,'review(engine): a failing return resets the streak to 0');
  // day-guard: a second session the same day cannot advance again
  w=load(NS,{[P+'current']:'Divine',[P+'data']:JSON.stringify(mk(3,today))}).window;
  w.__modReview.review(true,true);w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).reviewStreak===3,'review(engine): a second session the same day does not advance the streak');
}
// ===== AN-4: acquisition vs retention buckets (engine) =====
{ const DAY=86400000, now=Date.now(), today=Math.floor(now/DAY);
  const fresh={students:{Divine:{topics:{'number-system':{title:'NS',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:now,attempts:0,correct:0,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  const aged={students:{Divine:{topics:{'number-system':{title:'NS',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:now-50*DAY,attempts:20,correct:19,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[],reviewStreak:4,reviewDay:today-50}},assignments:{}}}};
  const rec=w=>JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
  let w=load(NS,{[P+'current']:'Divine',[P+'data']:JSON.stringify(fresh)}).window;
  ok(w.__modReview.wasDue({lastPracticed:now,attempts:0})===false,'AN-4: an unstarted/just-practiced topic is not due (acquisition)');
  w.__modReview.review(true,true);w.__modReview.review(true,false);
  ok(rec(w).acqFirst===2&&rec(w).acqCorrect===1&&rec(w).retFirst===undefined,'AN-4: first-attempts on a not-due topic bucket as acquisition');
  w=load(NS,{[P+'current']:'Divine',[P+'data']:JSON.stringify(aged)}).window;
  ok(w.__modReview.wasDue({reviewStreak:4,lastPracticed:now-50*DAY,attempts:20})===true,'AN-4: an aged topic past its 42d rung is due (retention)');
  w.__modReview.review(true,true);w.__modReview.review(true,true);
  ok(rec(w).retFirst===2&&rec(w).retCorrect===2&&rec(w).acqFirst===undefined,'AN-4: first-attempts on a due topic bucket as retention');
}
// ===== AN-4: teacher dashboard shows acquisition vs retention =====
{ const data={students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:Date.now(),attempts:10,correct:8,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[],acqFirst:20,acqCorrect:17,retFirst:10,retCorrect:6}},assignments:{}}}};
  const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),[P+'current']:'Divine',[P+'data']:JSON.stringify(data)}).window,d=w.document;
  d.getElementById('tb-teacher').click();d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  const dash=d.getElementById('dash');
  ok(dash.textContent.includes('Retrieval'),'AN-4: dashboard shows the retrieval readout');
  ok(dash.textContent.includes('first-time')&&dash.textContent.includes('85%'),'AN-4: acquisition accuracy shown (17/20 = 85%)');
  ok(dash.textContent.includes('on review')&&dash.textContent.includes('60%'),'AN-4: retention accuracy shown (6/10 = 60%)');
  ok(!!dash.querySelector('.retain-line b.warn'),'AN-4: retention well below acquisition is flagged for the teacher');
}
// ===== AS-4: per-skill difficulty calibration on the teacher dashboard =====
{ const data={students:{Divine:{topics:{'number-system':{title:'The Number System',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:Date.now(),attempts:30,correct:23,struggles:[],skillStats:{easy1:{attempts:10,misses:0},hard1:{attempts:10,misses:5},sweet1:{attempts:10,misses:2},few:{attempts:2,misses:0}},exam:{attempts:0,correct:0},responses:[]}},assignments:{}}}};
  const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),[P+'current']:'Divine',[P+'data']:JSON.stringify(data)}).window,d=w.document;
  d.getElementById('tb-teacher').click();d.getElementById('tm-pass').value='gabe';d.getElementById('tm-go').click();
  const dash=d.getElementById('dash');
  ok(dash.querySelectorAll('.cal-chip').length===3,'AS-4: only skills with enough evidence (>=4 attempts) are calibrated');
  ok(dash.querySelector('.cal-chip.easy')&&dash.querySelector('.cal-chip.easy').textContent==='too easy','AS-4: >90% first-attempt flagged too easy (advance)');
  ok(dash.querySelector('.cal-chip.hard')&&dash.querySelector('.cal-chip.hard').textContent==='too hard','AS-4: <70% first-attempt flagged too hard (re-teach)');
  ok(dash.querySelector('.cal-chip.sweet')&&dash.querySelector('.cal-chip.sweet').textContent==='on target','AS-4: ~85% band flagged on target');
}
// ===== AS-4 (automatic): the lesson's own Learn->Stretch ladder supplies the difficulty level =====
{ const w=load(NS,{[P+'current']:'Divine'}).window,d=w.document;
  const rec=()=>JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'].levelStats||{};
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
  const w=load(HUB,{[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),[P+'current']:'Divine',[P+'data']:JSON.stringify(data)}).window,d=w.document;
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
  const nsdom=load(NS,{[P+'current']:'Divine'});const nd=nsdom.window.document;
  ok(nd.querySelectorAll('.qcard[data-exam] .hint-btn').length===0,'NS: no hints on exam capstones');
  const ed=load(EE,{[P+'current']:'Divine'}).window.document;
  ok(ed.querySelectorAll('.qcard[data-exam] .hint-btn').length===0,'EE: no hints on exam capstones');
  const hints=(src(NS)+src(EE)).split('hint-content">').slice(1).map(s=>s.split('</div>')[0]);
  ok(hints.every(x=>!/90x = 57|= 9\.86|81 = 9&sup2;|&radic;36 = 6.*are rational|Distribute both/.test(x)),'NS/EE: hints are strategy-only (no worked answers)');
}
// ===== MODULE: shuffle + noshuffle =====
{ const d0=new JSDOM(src(NS)).window.document; // no scripts: source order
  const before=[...d0.querySelector('[data-qid="1-2"] .mc-group').children].map(e=>e.textContent.trim());
  const w=load(NS,{[P+'current']:'Divine'},()=>0).window,d=w.document;
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
{ const dom=load(NS,{[P+'current']:'Divine'});const w=dom.window,d=w.document;
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
  let t=JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
  ok(t.exam.attempts===1&&t.exam.correct===0,'NS: exam counts first attempt as miss');
  await sleep(1700);
  ok(!rightOpt(g)[0].classList.contains('cooldown'),'NS: cooldown lifts');
  rightOpt(g)[0].click();
  ok(mcq.querySelector('.step').classList.contains('completed'),'NS: retry success completes step');
  t=JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
  ok(t.exam.attempts===1&&t.exam.correct===0,'NS: retry does not inflate exam stats');
  ok(mcq.querySelector('.mc-feedback').textContent.startsWith('✓'),'NS: explanation revealed after correct');
  // empty check no-op
  const before=t.attempts;
  d.querySelector('[data-qid="1-1"] .check-btn').click();
  t=JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
  ok(t.attempts===before,'NS: empty Check logs nothing');
  // fill-in exam first-attempt-only
  const q24=d.querySelector('[data-qid="7-1"]');
  q24.querySelector('.ans-input').value='0.5';q24.querySelector('.check-btn').click();
  q24.querySelector('.ans-input').value='0.625';q24.querySelector('.check-btn').click();
  t=JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
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
  const store=w.localStorage.getItem(P+'data');
  const w2=load(NS,{[P+'current']:'Divine',[P+'data']:store}).window,d2=w2.document;
  ok(d2.querySelector('[data-qid="7-1"] .step').classList.contains('completed'),'NS: restore after reload');
  ok(d2.querySelector('[data-qid="7-1"] .ans-input').value==='0.625','NS: restored value decoded');
  ok(d2.getElementById('sec-report').textContent.includes('Your section scores'),'NS: report card after reload');
}
// ===== MODULE: guest note =====
{ const d=load(NS).window.document;
  ok(!!d.getElementById('g7guestnote'),'NS: guest warning when not signed in');
}
// ===== EE: smoke + exam MC =====
{ const w=load(EE,{[P+'current']:'Ayodeji'}).window,d=w.document;
  const m=d.querySelector('[data-qid="1-5"]');
  rightOpt(m.querySelector('.mc-group'))[0].click();
  ok(m.querySelector('.step').classList.contains('completed'),'EE: exam MC correct completes');
  const t=JSON.parse(w.localStorage.getItem(P+'data')).students.Ayodeji.topics['expressions-equations'];
  ok(t.exam.attempts===1&&t.exam.correct===1,'EE: exam correct counted once');
  ok(d.getElementById('sec-report').querySelectorAll('.sec-row').length===7,'EE: section report card rows');
  const semantic=[...d.querySelector('[data-qid="5-1"] .mc-group').children].map(e=>e.textContent.trim());
  ok(semantic.join('|')==='One|None|Infinitely many','EE: solution-count options keep semantic order');
}
// ===== SYNC v1.5: hub merge rules =====
{ const data={students:{Divine:{topics:{'number-system':{title:'t',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:5,attempts:0,correct:0,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[{qid:'3-4',label:'Q11',text:'r',ts:77}]}},assignments:{math:{text:'old',ts:5}}}}};
  const w=load(HUB,{[P+'current']:'Divine',[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),[P+'data']:JSON.stringify(data),[P+'sheetURL']:'https://sheet.test/exec'}).window;
  ok(!!w.__hubSync,'sync: hub exposes sync API');
  const res=w.__hubSync.applyCloud({pins:{Divine:{v:'42',ts:9e15}},assign:{Divine:{math:{text:'cloud hw',ts:9e15}}},
    topics:{Divine:{'number-system':{title:'t',tree:{'1-1':{steps:{0:true}}},totalSteps:31,sectionTotals:{},lastPracticed:9e15,attempts:1,correct:1,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[{qid:'3-4',label:'Q11',text:'r',ts:77}]}}},
    reviews:{Divine:{'number-system':{'77':123}}}});
  ok(res.changed===true,'sync: cloud changes applied');
  const d2=JSON.parse(w.localStorage.getItem(P+'data'));
  ok(JSON.parse(w.localStorage.getItem(P+'pins')).Divine==='42','sync: newer cloud PIN wins (LWW)');
  ok(d2.students.Divine.assignments.math.text==='cloud hw','sync: newer cloud assignment wins (LWW)');
  ok(d2.students.Divine.topics['number-system'].lastPracticed===9e15,'sync: newer cloud topic replaces local');
  ok(d2.students.Divine.topics['number-system'].responses[0].reviewed===123,'sync: review overlay applied to responses');
  const res2=w.__hubSync.applyCloud({topics:{Divine:{'number-system':{lastPracticed:1}}},pins:{},assign:{},reviews:{}});
  ok(res2.pushTopics.some(p=>p.n==='Divine'&&p.tid==='number-system'),'sync: local-newer topic queued for push');
}
// ===== SYNC v1.5: teacher actions push =====
{ const w=load(HUB,{[P+'sheetURL']:'https://sheet.test/exec',[P+'current']:'Divine',[P+'roster']:JSON.stringify(['Divine']),[P+'pins']:JSON.stringify({Divine:'1'}),
    [P+'data']:JSON.stringify({students:{Divine:{topics:{'number-system':{title:'t',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:5,attempts:1,correct:1,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[{qid:'3-4',label:'Q',text:'r',ts:77}]}},assignments:{}}}})}).window,d=w.document;
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
{ const w=load(HUB,{[P+'sheetURL']:'https://sheet.test/exec'}).window,d=w.document;
  w.__spy=[];
  d.getElementById('signin-name').value='divine';d.getElementById('signin-go').click();d.getElementById('pin1').value='7';d.getElementById('pin2').value='7';d.getElementById('pin-go').click();
  ok(w.__spy.some(b=>b.kind==='pin'&&b.payload.v==='7'&&b.hub==='grade8'),'sync: PIN creation pushed');
  const wm=load(NS,{[P+'current']:'Divine',[P+'sheetURL']:'https://sheet.test/exec'}).window;
  ok(!!wm.__modSync,'sync: module exposes sync API');
  const changed=wm.__modSync.mergeCloudTopic({topics:{Divine:{'number-system':{title:'The Number System',tree:{'1-1':{steps:{0:true}}},totalSteps:31,sectionTotals:{'1':5},lastPracticed:9e15,attempts:1,correct:1,struggles:[],skillStats:{},exam:{attempts:0,correct:0},responses:[]}}},reviews:{}});
  ok(changed===true,'sync: module merges newer cloud topic');
  ok(JSON.parse(wm.localStorage.getItem(P+'data')).students.Divine.topics['number-system'].tree['1-1'].steps[0]===true,'sync: merge lands in local store');
  wm.__spy=[];
  const q=wm.document.querySelector('[data-qid="4-1"]');
  q.querySelector('.ans-input').value='9';q.querySelector('.check-btn').click();
  await sleep(1700);
  ok(wm.__spy.some(b=>b.kind==='topic'&&b.sub==='number-system'&&b.hub==='grade8'&&b.payload.tree),'sync: module work pushed to cloud (debounced)');
}
// ===== MODULE: Matter & Its Interactions (sci.matter, MS-PS1) =====
{ const MATTER='Matter_and_Its_Interactions.html';
  const w=load(MATTER,{[P+'current']:'Divine'}).window,d=w.document;
  ok(!d.getElementById('g8gate'),'matter: gate removed when g8.gate=ok');
  const mqids=[...d.querySelectorAll('.qcard[data-qid]')].map(c=>c.dataset.qid);
  ok(mqids.length===31&&new Set(mqids).size===31,'matter: 31 unique qcards render');
  ok(d.querySelector('[data-qid="7-1"]').dataset.exam==='1','matter: MISA item 7-1 is exam-graded');
  ok([...d.querySelectorAll('.qcard[data-exam="1"] .hint-content')].length===0,'matter: no hints behind exam capstones (hint integrity)');
  const mtopic=()=>JSON.parse(w.localStorage.getItem(P+'data')).students.Divine.topics['sci.matter'];
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
// ===== MR-1 phase-3: per-skill ladder + in-module retrieval mode (?review=<skill>) =====
// Inherited from Grade 7 (the parent engine). Confirmed here per AGENTS.md: "change both, check both."
{
  const DAY=86400000, now=Date.now();
  const R=load(HUB).window.__hubReview;
  ok(typeof R.skillStreak==='function'&&typeof R.dueSkills==='function','p3: hub inherits the per-skill ladder');
  ok(R.skillStreak({streak:3})===3,'p3: engine-written skill streak wins over the proxy');
  ok(R.skillStreak({attempts:8,misses:1})===3,'p3: legacy skill falls back to the inferred proxy');
  ok(R.skillDue({attempts:5,misses:0})===null,'p3: a skill with no timestamp is never due (legacy-safe)');
  ok(R.skillDue({attempts:5,misses:1,streak:2,last:now-8*DAY},now).dueNow===true,'p3: skill past its 7d rung is due');
  ok(R.skillDue({attempts:5,misses:1,streak:2,last:now-3*DAY},now).dueNow===false,'p3: skill inside its rung is not due');
  const topic={lastPracticed:now-40*DAY,attempts:20,correct:19,reviewStreak:1,skillStats:{
    roots:{attempts:6,misses:0,streak:0,last:now-30*DAY},
    irrational:{attempts:6,misses:0,streak:4,last:now-45*DAY},
    estimate:{attempts:6,misses:0,streak:2,last:now-1*DAY}}};
  const ds=R.dueSkills(topic,now);
  ok(ds.length===2&&ds[0].skill==='roots','p3: due skills are most-overdue first');
  ok(!ds.some(x=>x.skill==='estimate'),'p3: a skill inside its rung is not listed');
  const legacy={lastPracticed:now-60*DAY,attempts:20,correct:19,skillStats:{roots:{attempts:6,misses:0}}};
  ok(R.list({t:legacy},['t'],now)[0].skill==='','p3: legacy topic still lists, with no skill -> opens the full lesson');
  ok(R.list({t:topic},['t'],now)[0].skill==='roots','p3: due row carries its sharpest-faded skill');

  const ago=now-60*DAY;
  const S={[P+'current']:'Divine',[P+'data']:JSON.stringify({students:{Divine:{topics:{
    'number-system':{title:'T',tree:{'4-1':{steps:{0:true}},'1-1':{steps:{0:true}}},totalSteps:31,sectionTotals:{},
      lastPracticed:ago,attempts:20,correct:19,struggles:[],
      skillStats:{roots:{attempts:6,misses:0,last:ago},'rational-decimal':{attempts:8,misses:1,last:ago}},
      exam:{attempts:0,correct:0},responses:[]}}}}})};
  const norm=load('The_Number_System.html',S).window.document;
  const dom=load('The_Number_System.html',S,null,'?review=roots');
  const d=dom.window.document, panel=d.getElementById('g7-review-panel');
  ok(d.body.classList.contains('g7-review-mode'),'p3: ?review=<skill> enters review mode');
  ok(!!panel,'p3: review panel is rendered');
  const cards=[...panel.querySelectorAll('.qcard[data-qid]')];
  ok(cards.length>0&&cards.length<=4,'p3: review draws a short set (<=4) from the authored pool');
  ok(cards.every(c=>['4-1','4-2','4-3','4-4','7-3'].includes(c.dataset.qid)),'p3: review set is only the due skill');
  ok([...panel.querySelectorAll('.ans-input')].filter(i=>i.value.trim()!=='').length===0,
     'p3: review mode never pre-fills an answer');
  ok(panel.querySelectorAll('.step.completed').length===0,'p3: review items are cleared for a real attempt');
  ok(panel.querySelectorAll('.mc-option.correct').length===0,'p3: review mode never marks the correct MC option up front');
  ok(d.querySelectorAll('.qcard .step').length===norm.querySelectorAll('.qcard .step').length,
     'p3: cards are moved, never removed — step totals stay honest');
  ok(panel.querySelector('.rev-done a').getAttribute('href')==='Grade_8_Math_Hub.html','p3: review panel links back to the G8 hub');
  ok(!load('The_Number_System.html',S,null,'?review=nonsense').window.document.body.classList.contains('g7-review-mode'),
     'p3: an unknown skill falls back to the normal lesson');
  ok(!load('The_Number_System.html',S).window.document.body.classList.contains('g7-review-mode'),
     'p3: no ?review param leaves the lesson untouched');
  const rec=()=>JSON.parse(dom.window.localStorage.getItem(P+'data')).students.Divine.topics['number-system'];
  const t0=rec();
  dom.window.__modReview.review(true,true,'4-1');
  dom.window.__modReview.review(true,true,'4-2');
  const t1=rec();
  ok(t1.retFirst===2&&t1.retCorrect===2,'p3: a review attempt lands in the AN-4 retention bucket');
  ok(!t1.acqFirst,'p3: a review attempt is not counted as new acquisition');
  ok(Object.keys(t1.tree).length===Object.keys(t0.tree).length,'p3: review never rewinds the stored mastery tree');
  ok(t1.skillStats.roots.streak===3,'p3: two clean first attempts advance the skill one rung (proxy base 2 -> 3)');
  const dm=load('The_Number_System.html',S,null,'?review=roots');
  dm.window.__modReview.review(true,true,'4-1');dm.window.__modReview.review(true,false,'4-2');
  ok(JSON.parse(dm.window.localStorage.getItem(P+'data')).students.Divine.topics['number-system']
     .skillStats.roots.streak===0,'p3: a missed review resets the skill to the bottom rung');
  const today=Math.floor(now/DAY);
  const Sd={[P+'current']:'Divine',[P+'data']:JSON.stringify({students:{Divine:{topics:{
    'number-system':{title:'T',tree:{},totalSteps:31,sectionTotals:{},lastPracticed:ago,attempts:20,correct:19,
      struggles:[],skillStats:{roots:{attempts:6,misses:0,last:ago,streak:1,day:today}},
      exam:{attempts:0,correct:0},responses:[]}}}}})};
  const dd=load('The_Number_System.html',Sd,null,'?review=roots');
  dd.window.__modReview.review(true,true,'4-1');dd.window.__modReview.review(true,true,'4-2');
  ok(JSON.parse(dd.window.localStorage.getItem(P+'data')).students.Divine.topics['number-system']
     .skillStats.roots.streak===1,'p3: a skill climbs at most one rung per calendar day');
}
console.log('\n'+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
})();
