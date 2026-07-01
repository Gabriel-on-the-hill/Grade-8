# Grade 8 — Study & Practice Hub

A self-paced study and practice hub for Grade 8, built as static HTML (no build step, no server).
One sign-in per student, a passcode-gated teacher dashboard, and a multi-subject layout.

**Open it:** [`Grade_8_Math_Hub.html`](Grade_8_Math_Hub.html) (the site root redirects here).

## Subjects
- **Mathematics** — *available.* The Number System (8.NS) and Expressions & Equations (8.EE), MCCRS- and MCAP-aligned. Functions, Geometry, and Statistics & Probability are coming.
- **Science** — *coming soon* (Life, Physical, Earth & Space).

## How it works
- Students sign in by name and climb each topic: Learn → Guided → Practice → Apply → Exam.
- Progress, concept-level struggles, exam-readiness, and written responses are tracked per student and shown in the teacher dashboard (set a passcode under Settings).
- All data is stored locally in the browser (localStorage). Use **Settings → Export** to back it up.
- The teacher dashboard groups every subject for each student in one place.

## Structure
- `Grade_8_Math_Hub.html` — the hub (edit the `SUBJECTS` array to configure subjects/units/topics).
- `The_Number_System.html`, `Expressions_and_Equations.html` — topic modules.
- `Starter_Kit/` — the reusable, subject-agnostic engine + templates for spinning up new hubs.

> Note: third-party source materials (textbooks, exam PDFs, standards documents) used to author the
> content are intentionally **not** included in this repository.
