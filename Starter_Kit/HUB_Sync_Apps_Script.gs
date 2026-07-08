/** Shared cloud backend for ALL study hubs (SAT, Grade 7, Grade 8, ...).
 * One Google Sheet + one deployment serves every hub: each app sends a
 * `hub` id (e.g. 'grade8') and its rows are namespaced by it, so students
 * and topics can never collide across programs — and one student can be
 * in several programs at once.
 * Paste into a Sheet's Apps Script editor and deploy as a Web app
 * (Execute as: Me · Who has access: Anyone). See HUB_Google_Sheet_Setup.md.
 * Tabs auto-created: "Log" (activity feed across all hubs) and
 * "SyncStore" (sync state — do not edit by hand).
 */
var SHEET_LOG = 'Log', SHEET_SYNC = 'SyncStore';

function _sheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) { 
    sh = ss.insertSheet(name); 
    if (headers && headers.length > 0) {
      sh.appendRow(headers); 
    }
  }
  return sh;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var d = JSON.parse((e.postData && e.postData.contents) || '{}');
    var hub = String(d.hub || 'default');
    if (d.op === 'put') {
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
    var lg = _sheet(SHEET_LOG, ['when', 'hub', 'student', 'topic', 'question', 'event', 'detail']);
    lg.appendRow([new Date(), hub, d.student || '', d.topic || '', d.question || '', d.event || '', d.detail || '']);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('err');
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

function doGet(e) {
  var cb = String((e.parameter && e.parameter.cb) || 'cb').replace(/[^\w$]/g, '');
  if (!e.parameter || e.parameter.op !== 'pull') {
    return ContentService.createTextOutput(cb + '(null)').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  var hub = String(e.parameter.hub || 'default');
  var doc = { pins: {}, assign: {}, reviews: {}, topics: {}, serverTs: Date.now() };
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_SYNC);
  if (sh) {
    var vals = sh.getDataRange().getValues();
    for (var i = 1; i < vals.length; i++) {
      if (vals[i][1] !== hub) continue;
      var kind = vals[i][2], name = vals[i][3], sub = vals[i][4], p;
      try { p = JSON.parse(vals[i][6]); } catch (err) { continue; }
      if (kind === 'pin') doc.pins[name] = p;
      else if (kind === 'assign') { (doc.assign[name] = doc.assign[name] || {})[sub] = p; }
      else if (kind === 'review') { (doc.reviews[name] = doc.reviews[name] || {})[sub] = p; }
      else if (kind === 'topic') { (doc.topics[name] = doc.topics[name] || {})[sub] = p; }
    }
  }
  return ContentService.createTextOutput(cb + '(' + JSON.stringify(doc) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
