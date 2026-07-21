/* Skill-label guard (added 2026-07-21).
 *
 * Every skill a module declares in G7_SKILLS must have a human label in TWO places:
 *   - the module's own G7_SKILL_LABELS, which names the skill on its struggle log, and
 *   - the hub subject that owns that topic, which names it on the dashboard and in "Skills to review".
 *
 * Why this exists: nothing failed when it was wrong. Expressions & Equations shipped on 2026-06-22
 * with SEVEN unlabelled skills and Functions added SIX more, and the app kept working — the hub just
 * degraded quietly. The two fallbacks are different and both are bad:
 *
 *   renderTeacher's skill line   -> (labels[k] || k)   prints the RAW SLUG, e.g. "func-build"
 *   the struggle list            -> (labels[k] || '')  prints NOTHING, so a recorded struggle
 *                                                      appears with no skill attached at all
 *
 * The second is the dangerous one: a struggle the engine captured correctly is shown to the teacher
 * with its concept blank, which reads as "no pattern here" — the opposite of what the data says. That
 * is the whole point of the struggle dashboard, so a missing label silently disables the feature it
 * was built for.
 *
 * It is checked behaviourally against the booted hub (via __hubSkills) rather than by parsing the
 * source, because what matters is the map the running page actually assembled from SUBJECTS.
 *
 * Run:  node tests/skill_labels.test.js
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const DIR = path.join(__dirname, '..');
const HUB = 'Grade_8_Math_Hub.html';

let fail = 0;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) fail++; };

const MODULES = fs.readdirSync(DIR)
  .filter(f => /\.html$/.test(f) && f !== HUB && f !== 'index.html')
  .filter(f => /G7_SKILLS\s*=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));

function boot(file) {
  const html = fs.readFileSync(path.join(DIR, file), 'utf8');
  const vc = new (require('jsdom').VirtualConsole)();   // the hub calls scrollTo; jsdom logs, we don't care
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' + file, virtualConsole: vc });
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('no load event')), 5000);
    dom.window.addEventListener('load', () => { clearTimeout(t); setTimeout(() => res(dom.window), 0); });
  });
}

// pull the two maps out of a module's source
function moduleMaps(src) {
  const grab = (name) => {
    const i = src.indexOf(name); if (i < 0) return null;
    let j = src.indexOf('{', i), d = 0;
    for (let n = j; n < src.length; n++) {
      if (src[n] === '{') d++;
      else if (src[n] === '}' && --d === 0) return src.slice(j, n + 1);
    }
    return null;
  };
  const skills = grab('G7_SKILLS');
  const labels = grab('G7_SKILL_LABELS');
  const used = skills ? [...new Set([...skills.matchAll(/'[^']+'\s*:\s*'([a-z][a-z0-9-]*)'/g)].map(m => m[1]))] : [];
  const named = labels ? [...new Set([...labels.matchAll(/'([a-z][a-z0-9-]*)'\s*:/g)].map(m => m[1]))] : [];
  const topic = (src.match(/G7_TOPIC_ID\s*=\s*'([^']+)'/) || [])[1];
  return { used, named, topic };
}

(async () => {
  if (!MODULES.length) { console.log('FAIL no modules found'); process.exit(1); }

  let w;
  try { w = await boot(HUB); } catch (e) { console.log('FAIL ' + HUB + ' — ' + e.message); process.exit(1); }
  ok(!!w.__hubSkills, 'the hub exposes __hubSkills for this guard');
  if (!w.__hubSkills) { console.log('\nFAIL cannot read the hub label maps'); process.exit(1); }

  const { labels: HUB_LABELS, subjects: SUBJECTS } = w.__hubSkills;

  // which subject owns which topic id
  const owner = {};
  SUBJECTS.forEach(s => (s.units || []).forEach(u => (u.topics || []).forEach(t => { owner[t.id] = s; })));

  for (const f of MODULES) {
    const { used, named, topic } = moduleMaps(fs.readFileSync(path.join(DIR, f), 'utf8'));
    console.log('\n' + f + '  (topic "' + topic + '", ' + used.length + ' skills)');

    ok(!!topic, f + ': declares a G7_TOPIC_ID');
    const subj = owner[topic];
    ok(!!subj, f + ': its topic id is owned by a hub subject (otherwise nothing can label it)');

    const selfMissing = used.filter(s => !named.includes(s));
    ok(selfMissing.length === 0,
       f + ': every declared skill is named in its OWN G7_SKILL_LABELS' +
       (selfMissing.length ? ' — missing: ' + selfMissing.join(', ') : ''));

    if (subj) {
      const sl = subj.skillLabels || {};
      const hubMissing = used.filter(s => !(s in sl) && !(s in HUB_LABELS));
      ok(hubMissing.length === 0,
         f + ': every declared skill is labelled by the hub subject "' + subj.id + '"' +
         (hubMissing.length ? ' — the dashboard would print a raw slug or a blank for: ' + hubMissing.join(', ') : ''));
    }

    // A label that names nothing is dead weight and usually means a skill was renamed on one side
    // only. 'reasoning' is exempt: g7log() falls back to it for any qid missing from G7_SKILLS
    // (`G7_SKILLS[qid]||'reasoning'`), so its label must exist even in a module that never tags a
    // card with it — Matter is exactly that case, tagging cards 'sci-reasoning' instead.
    const orphan = named.filter(s => !used.includes(s) && s !== 'reasoning');
    ok(orphan.length === 0,
       f + ': no label names a skill the module does not use' +
       (orphan.length ? ' — orphaned: ' + orphan.join(', ') : ''));
  }

  console.log('\n' + (fail ? 'FAIL ' + fail + ' assertion(s)'
    : 'PASS  every module skill is labelled by the module and by its hub subject'));
  process.exit(fail ? 1 : 0);
})();
