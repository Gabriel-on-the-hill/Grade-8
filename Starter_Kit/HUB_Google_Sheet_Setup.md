# Cloud sync setup (ONE time, ~5 minutes — shared by ALL hubs)

Cloud sync makes the hubs truly multi-device: students' progress appears on the
teacher dashboard anywhere, and homework you set, PINs you reset, and responses
you mark reviewed appear on the students' devices. It runs on a Google Sheet
**you own** — no accounts for the students, nothing to install.

**One backend for everything:** this same Sheet + URL serves the SAT hub,
Grade 7, Grade 8, and any future hub. Each app identifies itself with a hub id
(`SYNC_HUB_ID`, e.g. `grade8`), so programs never collide — and one student can
be in several programs at once. Set this up once; give every hub the same URL.

## Steps

1. Go to **sheets.new** (creates a new Google Sheet). Name it e.g. `Study Hubs Cloud`.
2. In the Sheet: **Extensions → Apps Script**. Delete any code in the editor.
3. Open `Starter_Kit/HUB_Sync_Apps_Script.gs` from this project, copy ALL of it,
   paste it into the Apps Script editor, and **save** (Ctrl+S).
4. Click **Deploy → New deployment** → gear icon → **Web app**.
   - Description: anything.
   - **Execute as: Me**
   - **Who has access: Anyone**
   - Click **Deploy**, approve the permissions prompt (it's your own script).
5. Copy the **Web app URL** (ends in `/exec`).
6. Either:
   - **Best:** give the URL to your assistant to bake in as `SHEET_URL_SEED`
     and redeploy — every device then syncs with zero setup; or
   - Paste it on each device: Teacher → Settings → "Google Sheet web app URL" → Save.

## What syncs

- **Students → teacher:** all practice progress, struggles, exam-readiness,
  written responses (pushed ~1.5 s after work happens; pulled when the hub or a
  module opens, and every 60 s while the hub is open).
- **Teacher → students:** homework assignments (and their done-state), PIN
  resets, "Mark reviewed" on written responses.
- **Not synced:** the roster and passcodes — those are baked into the deployed
  app (`ROSTER_SEED` / `TEACHER_PASS_SEED`) so they're identical everywhere.

## Notes

- Offline-first: with no URL set (or no internet) everything keeps working on
  the device; sync resumes when it can.
- The `SyncStore` tab is machine-managed — don't edit it. The `Log` tab is a
  human-readable activity feed you can watch or chart.
- If two devices edit the same thing, the newest change wins (per topic /
  per assignment / per PIN).
- Redeploying the Apps Script (after edits) creates a NEW URL — re-bake it.
- The `Log` tab's `hub` column tells you which program each event came from —
  one feed across SAT, Grade 7 and Grade 8.
