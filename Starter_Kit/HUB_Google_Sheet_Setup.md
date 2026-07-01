# Grade 7 Hub — Google Sheet logging (Apps Script) setup

This connects the Hub and lessons to a Google Sheet so you (the teacher) can see, in one place,
**who practiced what, when, and where they struggled** — across every student and topic.

The hub works fully **without** this (everything saves in the browser). The Sheet just gives you a
cloud copy you can open from anywhere and filter/sort.

---

## What you'll do (about 5 minutes)

1. Create a new Google Sheet. Name it e.g. **"Grade 7 Hub — Activity Log"**.
2. In the menu: **Extensions → Apps Script**. Delete any code there.
3. Paste in the script below. Click **Save**.
4. Click **Deploy → New deployment**.
   - Click the gear → **Web app**.
   - **Description:** Grade 7 Hub
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*  (this lets the lesson pages post to it; no one can read your sheet from the URL)
   - Click **Deploy**, authorise when prompted (choose your account → Advanced → Go to project → Allow).
5. Copy the **Web app URL** (ends in `/exec`).
6. Open the **Hub** → **Settings (gear icon)** → paste the URL → **Save**.

That's it. Each completed step and each wrong attempt now also appears as a row in your sheet.

---

## The Apps Script code

```javascript
// Grade 7 Hub — receives activity events and appends them to the sheet.
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Log')
              || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Log');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Student', 'Topic', 'Question', 'Event', 'Detail']);
    }
    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(d.ts || Date.now()),
      d.student || '',
      d.topic   || '',
      d.question || '',
      d.event   || '',
      d.detail  || ''
    ]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

// Optional: lets you test from the editor (Run ▸ doGet).
function doGet() {
  return ContentService.createTextOutput('Grade 7 Hub logger is running.');
}
```

The sheet will build a tab called **Log** with these columns:

| Timestamp | Student | Topic | Question | Event | Detail |
|---|---|---|---|---|---|
| 2026-06-20 14:02 | Damilare | Number System Connections | Q4.2a | struggle | typed "1/4" (answer -1/4) |
| 2026-06-20 14:03 | Damilare | Number System Connections | Q4.2a | step_complete | — |

**Event types:** `step_complete` (got it right), `struggle` (a wrong attempt — Detail shows what they typed),
`topic_opened`, `topic_finished`.

To make a quick teacher view, add a second tab and use a `FILTER` or a Pivot Table on **Log**
(e.g. group by Student + Event to see each student's struggle list).

---

## Data contract (for reference / future cloud upgrade)

The hub and every lesson share these browser keys (same browser), so progress flows between them:

- `g7.roster` — JSON array of student names (you edit this in the Hub).
- `g7.current` — the name of the student currently signed in.
- `g7.sheetURL` — your Apps Script `/exec` URL (set in Hub Settings).
- `g7.data` — all progress: `{ students: { "<name>": { topics: { "<topicId>": {
    title, stepsDone:{"<qid>::<stepIndex>":true}, totalSteps, lastPracticed,
    attempts, correct, struggles:[ {qid, label, your, ts} ] } } } } }`

Each lesson declares its own `topicId` (e.g. `number-system`). Because the shape is stable,
moving to a real cloud backend later just means swapping where `g7.data` is read/written.
