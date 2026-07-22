/* Exam-provenance guard (Grade 8: MCAP + MISA).
 *
 * An item may claim `MCAP` or `MISA` ONLY if it is a real released item recorded in
 * MCAP_PROVENANCE.md with its citation. A question presented to a student as a released exam item
 * when it is not one is a false claim about the material they are practising with, and it launders
 * credibility from the genuinely sourced items beside it.
 *
 * This is not a style check. Before 21 Jul 2026 this app had no manifest and no guard, while ten
 * items were titled `MISA` and both maths footers told the student that real MCAP items are marked
 * Exam. The audit that followed verified 11 of those claims and demoted 9.
 *
 * Ported from Grade 7, where the same guard exists because 19 assistant-authored capstones shipped
 * titled "MCAP" on 20 Jul 2026 — they were MCAP-shaped, not MCAP-sourced.
 *
 * The check runs both ways, per label family:
 *   - every card claiming MCAP/MISA must appear in the matching table   (no unlabelled invention)
 *   - every manifest row must point at a card that still claims it      (no stale rows)
 *   - the two tables must not cross: a MISA item cannot be sourced from the MCAP table
 *
 * Run:  node tests/mcap_provenance.test.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const MANIFEST = path.join(DIR, 'MCAP_PROVENANCE.md');

if (!fs.existsSync(MANIFEST)) { console.log('FAIL MCAP_PROVENANCE.md is missing'); process.exit(1); }

// Each table grants a DIFFERENT label, so they parse into different maps. Reading them into one
// would let a science row authorise a maths claim.
const TABLES = {
  MCAP: { re: /^##\s+Verified items\s+[—-]\s+MCAP\b/, rows: new Map() },
  MISA: { re: /^##\s+Verified items\s+[—-]\s+MISA\b/, rows: new Map() },
};
let cur = null;
for (const line of fs.readFileSync(MANIFEST, 'utf8').split('\n')) {
  if (/^##\s/.test(line)) {
    cur = null;
    for (const k of Object.keys(TABLES)) if (TABLES[k].re.test(line)) cur = TABLES[k];
    continue;
  }
  if (!cur) continue;
  const m = line.match(/^\|\s*`([^`]+\.html)`\s*\|\s*`([^`]+)`\s*\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|/);
  if (m) cur.rows.set(m[1].trim() + '::' + m[2].trim(),
    // case is PRESERVED here: the stimulus marker is matched against alt/aria text, and folding it
    // made three rows fail on capitals while 7-1/7-3 falsely PASSED by matching the lower-case
    // words in their own stem ("table sugar molecules differ..."). A marker must match the figure.
    { cite: (m[3] + ' | ' + m[4]).trim(), stimulus: (m[6] || '').trim() });
}
const total = Object.values(TABLES).reduce((n, t) => n + t.rows.size, 0);
if (!total) { console.log('FAIL manifest parsed 0 item rows — the table format changed; fix this guard'); process.exit(1); }

// Two rows citing the SAME released question are usually a mistake, and one this guard is otherwise
// blind to: it can prove a claim has a source, never that the item still matches that source.
const SHARED_OK = new Set([]);
const byCitation = new Map();
for (const t of Object.values(TABLES)) {
  for (const [key, row] of t.rows) {
    const cite = row.cite;
    const q = (cite.split('|')[1] || cite).trim();
    if (!/Question\s*\d/.test(q)) continue;      // rows citing by stem can't be compared this way
    if (!byCitation.has(q)) byCitation.set(q, []);
    byCitation.get(q).push(key);
  }
}
let fail = 0;
for (const [q, keys] of byCitation) {
  if (keys.length > 1 && !SHARED_OK.has(q)) {
    console.log('FAIL ' + keys.length + ' items cite ' + q + ' — ' + keys.join(', '));
    console.log('     If one ADAPTED the item (different numbers or response format) it is no longer');
    console.log('     that item: relabel it Exam-style. If the re-use is deliberate, add the citation');
    console.log('     to SHARED_OK in this file with a note saying why.');
    fail++;
  }
}
if (fail) { console.log('\nFAIL duplicate citation(s) needing confirmation'); process.exit(1); }

const MODULES = fs.readdirSync(DIR)
  .filter(f => /\.html$/.test(f) && !/_Math_Hub\.html$/.test(f) && !/^index\.html$/.test(f))
  .filter(f => /G7_TOPIC_ID=/.test(fs.readFileSync(path.join(DIR, f), 'utf8')));

const seen = { MCAP: new Set(), MISA: new Set() };

for (const f of MODULES) {
  const h = fs.readFileSync(path.join(DIR, f), 'utf8');
  const bad = [];
  for (const p of h.split(/<div class="qcard[\s"]/).slice(1)) {
    const qid = (p.match(/data-qid="([^"]+)"/) || [])[1];
    if (!qid || /\+String/.test(qid)) continue;
    const body = p.split(/<\/section>/)[0];

    // A *claim* is what the student reads as "this is a real exam question": the card title. A
    // caption crediting where a data set came from is attribution, not a claim.
    const title = (body.match(/<span class="qtitle">([^<]*)/) || [])[1] || '';
    const key = f + '::' + qid;

    for (const label of ['MCAP', 'MISA']) {
      if (!new RegExp('\\b' + label + '\\b').test(title)) continue;
      seen[label].add(key);
      if (!TABLES[label].rows.has(key)) {
        bad.push(qid + ': claims ' + label + ' but has no row in "Verified items — ' + label
          + '" — source it or drop the label');
        fail++;
      }
      const other = label === 'MCAP' ? 'MISA' : 'MCAP';
      if (TABLES[other].rows.has(key)) {
        bad.push(qid + ': is labelled ' + label + ' but sourced from the ' + other
          + ' table — one item, one source');
        fail++;
      }
    }
  }
  if (bad.length) { console.log('FAIL ' + f); bad.forEach(b => console.log('     ' + b)); }
  else console.log('PASS ' + f);
}

// ---------------------------------------------------------------------------------------------
// Stimulus check (added 22 Jul 2026). A row marked `figure` says the RELEASED item supplies a
// picture the student needs. If the module renders no figure inside that card, the item has been
// shipped without the thing it is about.
//
// This is not cosmetic. Three MISA items shipped this way: the packet carries an alcohol-thermometer
// model, a liquid-vs-frozen-water model and a pair of molecule diagrams, and the module had none of
// them. `7-5` read "In the thermometer model, the liquid expanded because…" to a student who had
// never been shown a thermometer model. Beyond being unanswerable-as-intended, dropping the figure
// converts a MODEL-INTERPRETATION item into a RECALL item — and modelling is the practice the MISA
// blueprint weights at 50 to 67 per cent. Neither a11y (which only checks that figures PRESENT are
// named) nor the label check (which only checks a row exists) could see it.
for (const label of Object.keys(TABLES)) {
  for (const [key, row] of TABLES[label].rows) {
    if (!row.stimulus.toLowerCase().startsWith('figure')) continue;
    // The row NAMES its stimulus, e.g. `figure: ALCOHOL THERMOMETER MODEL`. Checking for "some figure
    // somewhere" is not enough: a released item SET shares one stimulus and its section holds several,
    // so a missing one would hide behind its neighbours. Two mutations proved exactly that before this
    // was tightened — both passed a section-wide "is there any figure?" test.
    const want = (row.stimulus.split(':')[1] || '').trim();
    if (!want) { console.log('FAIL ' + key + ': stimulus marked `figure` but names no figure'); fail++; continue; }
    const [file, qid] = key.split('::');
    if (!MODULES.includes(file)) continue;
    const html = fs.readFileSync(path.join(DIR, file), 'utf8');
    const i = html.indexOf('data-qid="' + qid + '"');
    if (i < 0) continue;
    let end = html.indexOf('<div class="qcard"', i + 10);
    if (end < 0) end = html.length;
    // A released item SET shares one stimulus, printed once above its questions — so a figure
    // anywhere earlier in the same <section> counts. Anything BELOW the item does not: the student
    // meets the question first, which is exactly the dangling reference this check exists to stop.
    let secStart = html.lastIndexOf('<section', i);
    if (secStart < 0) secStart = 0;
    const card = html.slice(secStart, end);
    if (!card.includes(want)) {
      console.log('FAIL ' + file + ' ' + qid + ': needs the figure "' + want + '" and nothing above'
        + ' it in the section renders one — the item has lost the stimulus it asks about');
      fail++;
    }
  }
}

// stale rows: the manifest promises a citation for something that no longer claims the label
for (const label of ['MCAP', 'MISA']) {
  for (const key of TABLES[label].rows.keys()) {
    if (!seen[label].has(key)) {
      console.log('FAIL stale manifest row: ' + key + ' no longer exists or no longer claims ' + label);
      fail++;
    }
  }
}

console.log('\n' + seen.MCAP.size + ' MCAP-claiming item(s), ' + TABLES.MCAP.rows.size + ' row(s)');
console.log(seen.MISA.size + ' MISA-claiming item(s), ' + TABLES.MISA.rows.size + ' row(s)');
if (fail) { console.log('FAIL ' + fail + ' provenance violation(s)'); process.exit(1); }
console.log('PASS  every MCAP and MISA label is backed by a cited released item');
