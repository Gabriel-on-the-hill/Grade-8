/* Module-integrity guard — the invariants PROJECT_STANDARD asserts but nothing checked.
 *
 * Four checks, each of which caught a real live defect on 20 Jul 2026:
 *
 *  1. HINT NEVER CONTAINS ITS OWN ANSWER (§2.4).
 *     Number_System_Connections card 8-4 shipped the hint "Deepest = most negative = -20.25
 *     -> Cyra." against the key `cyra`. A worked solution behind a Hint button is an answer key,
 *     and because hint use is not logged it silently invalidates mastery tracking. The v1.4.2 hint
 *     audit was a manual pass and this one survived it — hence a guard.
 *
 *  2. PHASE CHIP AGREES WITH data-exam (§5, §8).
 *     Cards 6-8, 8-4 and 8-5 carried the "Exam" chip with no data-exam="1". The student saw a
 *     capstone; exam-readiness ignored it; g7level() booked it as Level 3 anyway — so the teacher
 *     dashboard's "By level" and "exam-readiness" readouts disagreed about the same three cards.
 *
 *  3. NO HINTS ON EXAM CAPSTONES (§8, v1.4.2).
 *     All three of the above carried hints, which the ban exists to prevent. A chip/flag mismatch
 *     is how they escaped the previous audit.
 *
 *  4. EVERY TEACH CARD CARRIES A WORKED EXAMPLE (§5 anatomy; handbook CL-2, LD-1).
 *     Number_System_Connections shipped 6 teach cards and 0 worked examples — rules stated, then
 *     straight to practice, in the largest module in the hub.
 *
 * Run:  node tests/module_integrity.test.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const MODULES = fs.readdirSync(DIR)
  .filter(f => /\.html$/.test(f) && !/_Math_Hub\.html$/.test(f))
  .filter(f => /const G7_SKILLS=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));

if (!MODULES.length) { console.log('FAIL no modules found'); process.exit(1); }

const strip = s => s.replace(/<[^>]+>/g, ' ').replace(/&minus;/g, '-').replace(/&rarr;/g, '->')
                    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

// Decode an authored answer: "k1:<base64>" or a plain attribute value (pre-encode-pass authoring).
const dec = v => v && v.startsWith('k1:')
  ? Buffer.from(v.slice(3), 'base64').toString('utf8')
  : (v || '');

let fail = 0, cards = 0, hints = 0, tcards = 0;

for (const f of MODULES) {
  const h = fs.readFileSync(path.join(DIR, f), 'utf8');
  const bad = [];

  // --- 4. teach card => worked example ---------------------------------------------------------
  // Count per teach card rather than per file, so one section cannot cover for another.
  for (const tc of h.split(/<div class="tcard[\s">]/).slice(1)) {
    const block = tc.split(/<div class="qcard[\s"]/)[0];
    tcards++;
    if (!/class="worked/.test(block)) {
      const head = (block.match(/<h3>([^<]*)</) || [])[1] || '(untitled)';
      bad.push('teach card with no worked example: "' + strip(head) + '"');
    }
  }

  // --- per-card checks -------------------------------------------------------------------------
  for (const p of h.split(/<div class="qcard[\s"]/).slice(1)) {
    const qid = (p.match(/data-qid="([^"]+)"/) || [])[1];
    if (!qid || /\+String/.test(qid)) continue;      // skip the engine's template literal
    const body = p.split(/<\/section>/)[0];
    cards++;

    const head = body.slice(0, 400);
    const chipExam = /<span class="qtag exam"/.test(head);
    const flagExam = /data-exam="1"/.test(body.slice(0, 200));
    const cardHints = body.match(/<div class="hint-content">([\s\S]*?)<\/div>/g) || [];
    hints += cardHints.length;

    // 2. chip vs flag
    if (chipExam !== flagExam) {
      bad.push(qid + ': phase chip ' + (chipExam ? '"Exam" but no data-exam="1"'
                                                 : 'is not "Exam" but data-exam="1" is set'));
    }

    // 3. no hints on capstones
    if ((chipExam || flagExam) && cardHints.length) {
      bad.push(qid + ': exam capstone carries ' + cardHints.length + ' hint(s) — banned (§8)');
    }

    // 1. no hint may contain an answer key from its own step.
    //    Scoped per <div class="step">, and a key that already appears in the step's own question
    //    text is NOT a leak — the hint is quoting the problem ("-1/2 + 1/4: rewrite -1/2 in
    //    quarters") rather than revealing the answer. Without that carve-out this check is noise.
    for (const step of body.split(/<div class="step[\s">]/).slice(1)) {
      const stepHints = step.match(/<div class="hint-content">([\s\S]*?)<\/div>/g) || [];
      if (!stepHints.length) continue;
      const keys = [...step.matchAll(/data-answer="([^"]*)"/g)].map(m => dec(m[1]))
        .filter(k => k && k.length >= 2);               // 1-char keys are too noisy to match on
      const question = strip(step.replace(/<div class="hint-content">[\s\S]*?<\/div>/g, '')).toLowerCase();
      for (const raw of stepHints) {
        const text = strip(raw).toLowerCase();
        for (const k of keys) {
          const kk = k.toLowerCase().replace(/&minus;/g, '-');
          const esc = kk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Boundary rules, both of which a naive \b or negated-class gets wrong:
          //  - left:  not mid-number/word, so "3" does not match inside "-20.25" or "13"
          //  - right: a following digit, letter, ".<digit>" or "/<digit>" means we matched a
          //    fragment — but a sentence-ending "." or "," is a real match. ("…is -3." leaked
          //    past an earlier version of this guard for exactly that reason.)
          const re = new RegExp('(?<![0-9a-z./-])' + esc + '(?![0-9a-z]|\\.[0-9]|/[0-9])', 'i');
          if (re.test(text) && !re.test(question)) {
            bad.push(qid + ': hint contains its own answer "' + k + '" — ' + strip(raw).slice(0, 70));
          }
        }
      }
    }
  }

  if (bad.length) { fail += bad.length; console.log('FAIL ' + f); bad.forEach(b => console.log('     ' + b)); }
  else console.log('PASS ' + f);
}

if (!cards || !tcards) { console.log('FAIL parsed 0 cards or 0 teach cards — the markup changed; fix this guard'); process.exit(1); }
console.log('\nscanned ' + cards + ' cards, ' + tcards + ' teach cards, ' + hints + ' hints across ' + MODULES.length + ' module(s)');
if (fail) { console.log('FAIL ' + fail + ' integrity violation(s)'); process.exit(1); }
console.log('PASS  chip/flag agree, no capstone hints, no hint leaks its answer, every teach card is worked');
