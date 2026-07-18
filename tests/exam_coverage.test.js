/* Exam-coverage guard.
 *
 * Every skill a module teaches must carry at least one exam-grade item (data-exam="1").
 *
 * Why: without one, a student can complete a skill's whole climb — Learn, Guided, Practice, Apply —
 * and finish with no evidence of exam readiness, while the dashboard happily shows the strand as
 * done. That gap is invisible from question counts alone; it only shows up when you ask which
 * skills have an exam item and which do not.
 *
 * Constructed-response items are deliberately NOT counted. They cannot be machine-scored into the
 * exam-readiness figure, so tagging one data-exam="1" would inflate a number it can never satisfy.
 * A skill whose only exam-shaped work is a CR still needs a machine-scored item.
 *
 * Run:  node tests/exam_coverage.test.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const MODULES = fs.readdirSync(DIR)
  .filter(f => /\.html$/.test(f) && !/_Math_Hub\.html$/.test(f))
  .filter(f => /const G7_SKILLS=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));

if (!MODULES.length) { console.log('FAIL no modules found'); process.exit(1); }

let fail = 0;
for (const f of MODULES) {
  const h = fs.readFileSync(path.join(DIR, f), 'utf8');
  const skills = {};
  const sm = h.match(/const G7_SKILLS=\{[\s\S]*?\};/);
  if (!sm) { console.log('FAIL ' + f + ': no G7_SKILLS'); fail++; continue; }
  for (const m of sm[0].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) skills[m[1]] = m[2];

  const agg = {};
  // NOTE: cards appear as class="qcard" AND class="qcard interactive" — match both, or this guard
  // silently parses nothing and reports a pass. A pass on zero skills is a parse failure, not a
  // clean bill, so it is treated as FAIL below.
  for (const p of h.split(/<div class="qcard[\s"]/).slice(1)) {
    const qid = (p.match(/data-qid="([^"]+)"/) || [])[1];
    const sk = skills[qid];
    if (!sk) continue;
    agg[sk] = agg[sk] || { n: 0, exam: 0 };
    agg[sk].n++;
    if (/data-exam="1"/.test(p.slice(0, 200))) agg[sk].exam++;
  }

  const bare = Object.keys(agg).filter(k => agg[k].exam === 0);
  const thin = Object.keys(agg).filter(k => agg[k].n < 2);
  if (!Object.keys(agg).length) { console.log('FAIL ' + f + ': parsed 0 skills — the card markup did not match, so this is a parse failure, not a pass'); fail++; }
  else if (bare.length) { console.log('FAIL ' + f + ' — skills with no exam item: ' + bare.join(', ')); fail++; }
  else console.log('PASS ' + f.replace('.html', '') + ' — all ' + Object.keys(agg).length + ' skills have an exam item');
  if (thin.length) console.log('     note: only one question on ' + thin.join(', '));
}

console.log(fail === 0 ? '\nPASS exam coverage complete' : '\nFAIL ' + fail + ' module(s) with an uncovered skill');
process.exit(fail ? 1 : 0);
