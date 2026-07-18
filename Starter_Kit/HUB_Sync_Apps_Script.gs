/** Shared cloud backend for ALL study hubs (SAT, Grade 7, Grade 8, ...).
 * One Google Sheet + one deployment serves every hub: each app sends a
 * `hub` id (e.g. 'grade8') and its rows are namespaced by it, so students
 * and topics can never collide across programs — and one student can be
 * in several programs at once.
 * Paste into a Sheet's Apps Script editor and deploy as a Web app
 * (Execute as: Me · Who has access: Anyone). See HUB_Google_Sheet_Setup.md.
 * Tabs auto-created: "Log" (activity feed across all hubs) and
 * "SyncStore" (sync state — do not edit by hand).
 *
 * Health check: open <your /exec URL>?op=ping in a browser. It names the exact
 * spreadsheet this deployment writes to, and the row counts. If you ever end up
 * with several copies of this Sheet, that is how you tell which one is live.
 */
var SHEET_LOG = 'Log', SHEET_SYNC = 'SyncStore', SHEET_HW = 'Homework';

/* Homework tab header. `raw` is load-bearing: it carries the whole posted JSON, so new fields can be
 * read later WITHOUT redeploying this script. Keep the order — a test parses this header, because a
 * column-map drift has already silently blanked a dashboard once and looks identical to "no data". */
var HW_HEADER = ['when', 'hub', 'student', 'subject', 'set', 'item', 'outcome', 'raw'];

/* ===================== PUT YOUR SHEET ID ON THE LINE BELOW =====================
 * Run `setup` once (Run ▸ setup) and it prints the exact id for you.
 * Fill in the quotes on the EXISTING line below — do not add a second
 * `var SHEET_ID` line: both would run, the last one wins, and an empty one
 * would silently undo this.
 *   https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/edit
 * Leaving it '' falls back to the bound Sheet (Extensions -> Apps Script).
 *
 * Why it matters: getActiveSpreadsheet() means "whichever Sheet this copy is
 * bound to". If several Sheets each carry a bound copy of this script, every
 * deployment quietly writes into its own Sheet and the others look empty
 * forever. Setting SHEET_ID makes every deployment agree on one Sheet.
 * ============================================================================== */
var SHEET_ID = '';   // <-- set in the Apps Script editor (this repo copy stays '')

/* ===================== TEACHER SYNC KEY (read this) =====================
 * The hub is served publicly, so the /exec URL is readable by anyone who views
 * source. This key is what makes that harmless: the URL ALONE grants nothing.
 *
 * !! FILL THIS IN INSIDE THE APPS SCRIPT EDITOR ONLY — NEVER IN THIS REPO. !!
 * This file is committed to a PUBLIC repository (and served by GitHub Pages).
 * A key committed here is a published key, which defeats the entire point. It
 * must live in exactly two private places: the Apps Script editor, and your own
 * device's Teacher > Settings. Keep the copy in this repo as '' forever.
 *
 *   - Use a long random string (24+ chars). It is typed ONCE per device and then
 *     stored, so it never needs to be memorable — do not reuse the teacher
 *     passcode or anything else that appears in the app's HTML.
 *   - Students never need it: they authenticate with their own name + PIN and
 *     can only ever read/write their OWN record.
 *
 * Leave it '' and the teacher dump is disabled entirely (students still sync).
 * ======================================================================== */
var TEACHER_KEY = '';   // <-- stays '' in the repo; set it in the Apps Script editor

function _ss() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No bound spreadsheet. Set SHEET_ID at the top of this script (standalone scripts have no active Sheet).');
  return ss;
}

function _sheet(name, headers) {
  var ss = _ss();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (headers && headers.length > 0) {
      sh.appendRow(headers);
    }
  }
  return sh;
}

/** THE ONLY FUNCTION YOU RUN BY HAND.  In the editor: pick `setup` ▸ Run  (once).
 * doGet/doPost are NOT run from the editor — they are reserved names Apps Script
 * calls automatically when your /exec URL is opened/posted to. Running them by hand
 * just errors (there is no HTTP request, so their `e` argument is undefined).
 *
 * setup() does three things:
 *   1. triggers the permissions prompt (approve it — it's your own script),
 *   2. creates the "Log" and "SyncStore" tabs,
 *   3. prints the SHEET_ID line to paste at the top of this file.
 * Its output appears in the editor's Execution log.
 */
function setup() {
  var ss = _ss();
  _sheet(SHEET_SYNC, ['key', 'hub', 'kind', 'name', 'sub', 'ts', 'json']);
  _sheet(SHEET_LOG, ['when', 'hub', 'student', 'topic', 'question', 'event', 'detail']);
  _sheet(SHEET_HW, HW_HEADER);
  var msg = 'Tabs ready in "' + ss.getName() + '".\n\n' +
            'EDIT THE LINE THAT IS ALREADY NEAR THE TOP OF THIS SCRIPT.\n' +
            "Find:   var SHEET_ID = '';   and put the id between its quotes, so it reads:\n\n" +
            "    var SHEET_ID = '" + ss.getId() + "';\n\n" +
            'Do NOT paste a second copy of that line. Two `var SHEET_ID` lines both run, the\n' +
            'LAST one wins, and the empty one would silently reset it — undoing this entirely.\n\n' +
            'Then save, and Deploy > New deployment > Web app\n' +
            '(Execute as: Me, Who has access: Anyone).\n' +
            'Check it with <your /exec URL>?op=ping — it should name this sheet back to you.';
  Logger.log(msg);
  return msg;
}

function _jsonp(cb, obj) {
  return ContentService.createTextOutput(cb + '(' + JSON.stringify(obj) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

/* ---- auth: the /exec URL is public, so it must grant nothing on its own ---- */

/** The PIN currently stored in the cloud for a student, or null if they have none yet. */
function _pinOf(hub, name) {
  var sh = _ss().getSheetByName(SHEET_SYNC);
  if (!sh || !name) return null;
  var key = [hub, 'pin', name, ''].join('|');
  var vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][0] === key) {
      try { var p = JSON.parse(vals[i][6]); return (p && p.v !== undefined && p.v !== '') ? String(p.v) : null; }
      catch (e) { return null; }
    }
  }
  return null;
}

/** 'teacher' | 'student' | null. A student proves who they are with their own PIN,
 *  which only ever unlocks their OWN record. */
function _who(hub, name, pin, key) {
  if (TEACHER_KEY && key && String(key) === String(TEACHER_KEY)) return 'teacher';
  if (name && pin !== undefined && pin !== null && String(pin) !== '') {
    var stored = _pinOf(hub, name);
    if (stored !== null && String(stored) === String(pin)) return 'student';
  }
  return null;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse((e.postData && e.postData.contents) || '{}');
    var hub = String(d.hub || 'default');
    if (d.op === 'put') {
      /* Authorise the write. `_who` proves the caller owns d.name (their PIN) or is
       * the teacher. Anyone with just the URL can do nothing here — except claim a
       * PIN for a student who has none yet, which is what makes zero-setup sign-up
       * work; the teacher can always reset it. */
      var who = _who(hub, d.name, d.pin, d.key);
      if (who !== 'teacher') {
        if (d.kind === 'pin') {
          // first claim is open; changing an existing PIN needs the owner or the teacher
          if (_pinOf(hub, d.name) !== null && who !== 'student') return ContentService.createTextOutput('err: auth');
        } else if (d.kind === 'review' || d.kind === 'hwplan') {
          // teacher-only. A student must never be able to rewrite their own homework plan.
          return ContentService.createTextOutput('err: auth');
        } else if (who !== 'student') {
          return ContentService.createTextOutput('err: auth');
        }
      }
      var sh = _sheet(SHEET_SYNC, ['key', 'hub', 'kind', 'name', 'sub', 'ts', 'json']);
      var key = [hub, d.kind, d.name, d.sub || ''].join('|');
      var ts = Number(d.ts) || Date.now();
      var vals = sh.getDataRange().getValues();
      for (var i = 1; i < vals.length; i++) {
        if (vals[i][0] === key) {
          if (Number(vals[i][5]) <= ts) {
            sh.getRange(i + 1, 6).setValue(ts);
            sh.getRange(i + 1, 7).setValue(JSON.stringify(d.payload));
          }
          return ContentService.createTextOutput('ok');
        }
      }
      sh.appendRow([key, hub, d.kind, d.name, d.sub || '', ts, JSON.stringify(d.payload)]);
      return ContentService.createTextOutput('ok');
    }

    /* Homework completion — append-only history in its own tab, so homework reads AS homework
     * instead of being dug out of the activity Log. A student may record their own; the teacher
     * may record any. Same auth as a topic write: the URL alone still grants nothing. */
    if (d.op === 'hw') {
      var whoHw = _who(hub, d.name, d.pin, d.key);
      if (whoHw !== 'teacher' && whoHw !== 'student') return ContentService.createTextOutput('err: auth');
      /* One row per homework EVENT. Two kinds arrive here:
       *   - an attempt on a homework item: item = the question id, outcome = correct | incorrect
       *   - a finished set:                item = "(set complete)", outcome = "4 / 5"
       * Every row in this tab is homework by definition, so homework can never be confused with
       * ordinary module practice — which is exactly what the Log tab could not distinguish. */
      var hw = _sheet(SHEET_HW, HW_HEADER);
      hw.appendRow([new Date(), hub, d.name || '', d.subject || '', d.set || '',
                    d.item || '', d.outcome || '',
                    JSON.stringify(d.payload || {})]);
      return ContentService.createTextOutput('ok');
    }

    var lg = _sheet(SHEET_LOG, ['when', 'hub', 'student', 'topic', 'question', 'event', 'detail']);
    lg.appendRow([new Date(), hub, d.student || '', d.topic || '', d.question || '', d.event || '', d.detail || '']);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    /* Say WHY. The app posts no-cors and ignores this body, but a bare 'err'
     * left every misconfiguration looking identical to silence. */
    return ContentService.createTextOutput('err: ' + ((err && err.message) ? err.message : err));
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet(e) {
  var cb = String((e && e.parameter && e.parameter.cb) || 'cb').replace(/[^\w$]/g, '');
  var op = (e && e.parameter && e.parameter.op) || '';
  try {
    /* op=ping — a truthful health check. Proves the deployment is reachable AND
     * names the Sheet it writes to, so "is it working, and which Sheet?" is one click. */
    if (op === 'ping') {
      var pss = _ss();
      var psy = pss.getSheetByName(SHEET_SYNC), plg = pss.getSheetByName(SHEET_LOG),
          phw = pss.getSheetByName(SHEET_HW);
      return _jsonp(cb, {
        ok: true,
        sheet: pss.getName(),
        id: pss.getId(),
        sync: psy ? Math.max(0, psy.getLastRow() - 1) : 0,
        log: plg ? Math.max(0, plg.getLastRow() - 1) : 0,
        hw:  phw ? Math.max(0, phw.getLastRow() - 1) : 0,
        serverTs: Date.now()
      });
    }
    if (op !== 'pull') return _jsonp(cb, null);
    var hub = String(e.parameter.hub || 'default');
    var doc = { pins: {}, assign: {}, reviews: {}, topics: {}, hwplan: {}, hwstate: {}, serverTs: Date.now() };

    /* Scope the read. The URL is public, so on its own it returns an empty doc —
     * the same shape the client already handles when there is no cloud data.
     *   teacher key  -> everyone (the dashboard)
     *   name + PIN   -> that student only
     *   neither      -> nothing */
    var who = _who(hub, e.parameter.name || '', e.parameter.pin || '', e.parameter.key || '');
    if (!who) return _jsonp(cb, doc);
    var only = (who === 'student') ? String(e.parameter.name || '') : null;

    var sh = _ss().getSheetByName(SHEET_SYNC);
    if (sh) {
      var vals = sh.getDataRange().getValues();
      for (var i = 1; i < vals.length; i++) {
        if (vals[i][1] !== hub) continue;
        var kind = vals[i][2], name = vals[i][3], sub = vals[i][4], p;
        if (only !== null && String(name) !== only) continue;
        try { p = JSON.parse(vals[i][6]); } catch (err) { continue; }
        if (kind === 'pin') doc.pins[name] = p;
        else if (kind === 'assign') { (doc.assign[name] = doc.assign[name] || {})[sub] = p; }
        else if (kind === 'review') { (doc.reviews[name] = doc.reviews[name] || {})[sub] = p; }
        else if (kind === 'topic') { (doc.topics[name] = doc.topics[name] || {})[sub] = p; }
        /* Homework is scoped by exactly the same rule as everything else above: teacher key -> all
         * students, name + PIN -> self only, neither -> nothing. That is what makes one student
         * unable to see another's homework, and it is enforced here, not in the app. */
        else if (kind === 'hwplan')  { (doc.hwplan[name]  = doc.hwplan[name]  || {})[sub] = p; }
        else if (kind === 'hwstate') { (doc.hwstate[name] = doc.hwstate[name] || {})[sub] = p; }
      }
    }
    return _jsonp(cb, doc);
  } catch (err) {
    /* Never emit an HTML error page: that breaks the JSONP callback and the app
     * would read it as "unreachable". A pull failure returns null (the shape the
     * client already handles); ping reports the real reason. */
    if (op === 'ping') return _jsonp(cb, { ok: false, error: String((err && err.message) ? err.message : err) });
    return _jsonp(cb, null);
  }
}
