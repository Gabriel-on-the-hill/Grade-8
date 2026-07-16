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
3b. **Run `setup` once — the only function you ever run by hand.** In the editor toolbar, choose
   **`setup`** from the function dropdown and click **Run**. Approve the permissions prompt (it's
   your own script). It creates the `Log` and `SyncStore` tabs and prints, in the **Execution log**,
   the exact line to paste at the top of the script:

       var SHEET_ID = '1AbC...';

   **Fill in the quotes on the `var SHEET_ID = '';` line that is already near the top of the
   script — do not paste a second copy of the line.** Two `var SHEET_ID` lines both run and the
   *last* one wins, so an empty duplicate would silently reset your id and undo the whole point.
   Save. Re-running `setup` is safe — it won't duplicate anything.

   > **Do not run `doGet` or `doPost` from the editor.** They are reserved names that Apps Script
   > calls *automatically* when your `/exec` URL is opened or posted to. Run by hand they have no
   > HTTP request to read, so `doPost` prints
   > `err: Cannot read properties of undefined (reading 'postData')`. That looks like a broken
   > script but only means "there was no request" — it is **not** a reason to start over with a new
   > Sheet. Test with `?op=ping` instead (see below).

   *Why `SHEET_ID` matters:* without it the script writes to "whichever Sheet this copy is bound
   to". If you ever make a second Sheet with a second copy of the script, each deployment silently
   fills its own Sheet and the others look empty forever. Pinning the id makes that impossible.
3c. **Set a `TEACHER_KEY`.** Near the top of the script, fill in the quotes on
   `var TEACHER_KEY = '';` with a long random string (24+ chars). This is what makes the public
   `/exec` URL harmless: **the URL alone grants nothing.**
   - The key stays **only** in the Apps Script. **Never** put it in the app HTML — the hub is served
     publicly, so anything in it is readable by anyone.
   - Type the same string once into **Teacher → Settings → "Teacher sync key"** on *your* device.
     That device then pulls the whole dashboard.
   - **Students never need it.** They authenticate with their own name + PIN and can only ever
     read/write their **own** record. First-time PIN sign-up still needs no setup.
   - Leave it `''` and the teacher dump is simply disabled (students still sync their own work).
4. Click **Deploy → New deployment** → gear icon → **Web app**.
   *(Editing later? Use **Deploy → Manage deployments → ✏️ Edit → Version: New version** to keep the
   **same URL**. "New deployment" mints a different URL and you'd have to re-bake it.)*
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

## Who can read what (why the public URL is safe)

The hub is served publicly, so the `/exec` URL **will** be readable by anyone who views source.
That is fine **only because the endpoint is scoped** — the URL on its own returns nothing:

| Caller | Sends | Gets |
|---|---|---|
| Anyone with just the URL | – | **empty doc; all writes rejected (`err: auth`)** |
| A student | their name + **their own PIN** | **only their own** record (read + write) |
| You (teacher) | the **`TEACHER_KEY`** | every student — the dashboard |
| Anyone | `?op=ping` | sheet name + row counts only — **no student data** |

Never bake `TEACHER_KEY` into the app. It belongs in the Apps Script and in your own device's
Settings, nowhere else.

## Check it actually works (10 seconds)

Open your Web app URL in a browser with `?op=ping` on the end:

    https://script.google.com/macros/s/AKfy.../exec?op=ping

- `cb({"ok":true,"sheet":"Study Hubs Cloud","id":"...","sync":12,"log":88})` — **working**, and it
  tells you the exact Sheet it writes to and how many rows are in each tab.
- `cb({"ok":false,"error":"No bound spreadsheet..."})` — the script can't find a Sheet: set `SHEET_ID`.
- A Google sign-in / "You need permission" page — redeploy with **Who has access: Anyone**.
- Anything else (HTML error page) — the URL isn't a deployed `/exec` web app.

In the app, **Teacher → Settings → Send test row** now runs this same check and reports the truth —
it names the Sheet it reached, or says it got no response. (It used to print "Test row sent" no
matter what, because a `no-cors` POST can never see a reply. That was the bug that hid everything.)

## Troubleshooting: "I have several Sheets and none of them record anything"

Almost always one of two things:

1. **No URL is wired up.** `SHEET_URL_SEED` in the hub is `''` by default, so sync is **off** until
   someone pastes the URL into Teacher → Settings on that device — or you bake it in (step 6, "Best").
   Every send path silently returns when there's no URL, so nothing is sent and nothing errors.
2. **You're looking at the wrong Sheet.** Each Sheet has its own bound copy of the script and its own
   `/exec` URL, and each writes only into itself. Run `?op=ping` on the URL the app is using: the
   `sheet` and `id` it returns is the live one. Keep that Sheet, set `SHEET_ID` to its id, redeploy,
   bake the new URL, and delete the rest.

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
