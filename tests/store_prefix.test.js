/* Storage-namespace guard for the SERVED app (T6 — the deferred half of D2).
 *
 * `starter_kit.test.js` already enforces single-sourcing inside Starter_Kit/, because a stamped-but-
 * unedited kit would write into a live grade's data. This file enforces the same property on the
 * files actually served, which is where the original defect lived: the hub honoured STORE_PREFIX
 * while every module carried ten hardcoded 'g7.<key>' strings. MODULE_REPAIR_BACKLOG §8's lesson,
 * verbatim: *a constant only one of the sharing files honours is not a constant.*
 *
 * D2 declined to do this as a standalone refactor of two shipping products — the harm fires once per
 * new deployment and the kit now fails loudly — and said it should ride the next substantial engine
 * change. It rode the S4 accessibility pass on 21 Jul 2026.
 *
 * Three assertions:
 *   1. no file builds a storage key from a literal — every key comes off the constant
 *   2. each file declares its namespace exactly ONCE (that declaration is the single source)
 *   3. the modules and the hub AGREE. This is the one that actually protects a student: the module
 *      writes the progress the hub's dashboard reads, so if the two prefixes drift apart the work
 *      does not error, it silently stops being seen.
 *
 * Run:  node tests/store_prefix.test.js
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const FILES = fs.readdirSync(DIR).filter(f => /\.html$/.test(f) && !/^index\.html$/.test(f));
let fail = 0;
const bad = m => { console.log('     ' + m); fail++; };

/* A hub that has CHANGED its namespace must still be able to read the OLD one — once — to carry a
 * student's existing work across. Grade 8 declared 'g7.' until 19 Jul 2026, so its hub copies that
 * data forward on first load; those literals are the migration doing its job, not a stray. This is
 * an allow-list per file with the reason, deliberately not a blanket exemption: a NEW literal, or a
 * legacy read in a file with no migration to perform, still fails. Delete the row once the
 * migration is retired. */
const LEGACY_OK = {
  'Grade_8_Math_Hub.html': 'g7.',   // one-time copy off the shared namespace (19 Jul 2026)
};

const prefixes = new Map();   // file -> declared namespace

for (const f of FILES) {
  const legacy = LEGACY_OK[f] || null;
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  // Prose explaining which prefix belongs to which deployment is documentation we want, and must
  // not read as a hardcoded literal — same reasoning as the Starter Kit guard.
  const code = src.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const errs = [];

  // 1. keys must never be spelled out (except reads of an allow-listed legacy namespace)
  const keyLits = [...new Set([...code.matchAll(/'g\d+\.[a-zA-Z]+'/g)].map(m => m[0]))]
    .filter(l => !(legacy && l.startsWith("'" + legacy)));
  if (keyLits.length) {
    errs.push('builds storage keys from literals instead of the constant: ' + keyLits.join(', '));
  }

  // 2. exactly one declaration of the namespace itself
  const decls = [...code.matchAll(/(?:STORE_PREFIX|G7_STORE)\s*=\s*'([^']*)'/g)].map(m => m[1]);
  if (!decls.length) {
    errs.push('declares no storage namespace (expected STORE_PREFIX or G7_STORE)');
  } else if (decls.length > 1) {
    errs.push('declares its storage namespace ' + decls.length + ' times: ' + decls.join(', ')
      + ' — one of them is not the single source');
  } else {
    prefixes.set(f, decls[0]);
    // a bare 'gN.' anywhere else is a second, competing source
    const stray = [...new Set([...code.matchAll(/'g\d+\.'/g)].map(m => m[0]))]
      .filter(l => l !== "'" + decls[0] + "'" && !(legacy && l === "'" + legacy + "'"));
    if (stray.length) errs.push('has a competing namespace literal: ' + stray.join(', '));
    // an allow-list row with nothing to migrate is stale — it would hide a real stray later
    if (legacy && !code.includes("'" + legacy)) {
      errs.push('is allow-listed for legacy namespace ' + legacy + ' but never reads it — '
        + 'the migration is done; remove the LEGACY_OK row in this guard');
    }
  }

  if (errs.length) { console.log('FAIL ' + f); errs.forEach(bad); }
  else console.log('PASS ' + f + "  ('" + prefixes.get(f) + "')");
}

// Vacuous-pass protection (trap #7).
if (!prefixes.size) { console.log('FAIL parsed 0 namespace declarations — the constant was renamed; fix this guard'); fail++; }

// 3. every served file must agree, or the dashboard reads a different store than the modules write
const distinct = [...new Set(prefixes.values())];
if (distinct.length > 1) {
  console.log('FAIL the served files disagree about the storage namespace: ' + distinct.join(', '));
  for (const [f, p] of prefixes) console.log("     " + f + " -> '" + p + "'");
  console.log('     The module writes the progress the hub reads. Disagreement does not throw —');
  console.log("     it silently stops a student's work from being seen.");
  fail++;
}

console.log('\n' + prefixes.size + ' served file(s), namespace ' + JSON.stringify(distinct));
if (fail) { console.log('FAIL ' + fail + ' storage-namespace violation(s)'); process.exit(1); }
console.log('PASS  one storage namespace, single-sourced, and every served file honours it');
