# [GRADE] [SUBJECT] Hub — Project Operating Standard (TEMPLATE)

**Purpose:** Single source of truth for a grade/subject hub built from this Starter Kit. Any assistant/session should **read this file and `Module_Template.html` first**, then continue at (or above) this standard with minimal prompting. Fill every `[BRACKETED]` blank when instantiating a new grade. Keep this file updated as the standard evolves.

> Fill these in for this project:
> - **Grade:** [GRADE]
> - **Subject:** [SUBJECT, e.g. Mathematics]
> - **Exam program / focus:** [EXAM PROGRAM, e.g. MCAP Grade 8 Mathematics]
> - **Curriculum units:** [LIST THE UNITS + STANDARDS FOR THIS GRADE]
> - **Textbooks in folder:** [LIST — scan the folder; more may be added over time]

---

## 1. Vision
A [GRADE] [SUBJECT] **study & practice hub** for a teacher with one or more students. Students sign in by name, open a topic, and climb a guided, self-paced lesson. The teacher sees who practiced what, where they struggled (by concept), exam-readiness, and can assign homework. Warm, professional, age-appropriate. Low stress, high rigor, exam-ready. Multi-student; the student may be anyone.

## 2. Non-negotiable principles
1. **Consult the textbooks; use the best, no filler.** All textbooks live in the project folder and **must be consulted** every unit. Scan the folder for source PDFs at the start of each unit, read the relevant chapters, and select the strongest concept explanations and exercises *from them*. Only substitute a created/alternative item when research and a clear read of what the student needs show it is genuinely better.
2. **Curriculum ∪ exam (union, never trade-off).** Cover every concept the grade's curriculum requires, AND weave in real exam-program items on top as capstones. Never drop curriculum to chase the test.
3. **Flow builds up.** No advanced concept before its prerequisite. Representation before operations. Within a lesson: Learn → Guided → Practice → Apply → Exam.
4. **Hints sparingly.** Only on multi-step/hard items. Never on trivial questions or exam capstones.
5. **One structure, no duplicates.** Reuse the single engine and the shared data contract. Never build a parallel system that does the same job.
6. **Don't bog the student down.** Strategic and lean; quality over quantity.
7. **Professional, not "AI".** No emoji, no gradient/clichéd styling. Clean, real-product look.
8. **On grade.** Match the grade level; shelve/rebuild anything above or below grade.

## 3. Files
- `Hub_Template.html` → rename to the grade's hub; edit the `UNITS` array + title only.
- `Module_Template.html` — canonical module engine + showcase of all 5 formats. **Stamp every unit from this.**
- One HTML module per unit (built from the template).
- `HUB_Google_Sheet_Setup.md` — deploy the Apps Script logger (optional cloud log).
- **Textbooks / source materials:** [LIST]. Consult every unit; scan the folder for new ones.

## 4. Shared data contract (localStorage — same browser)
Keys: `g7.roster`, `g7.current`, `g7.sheetURL`, `g7.teacherPass`, and:
```
g7.data = { students: { "<name>": {
  assignment:{text,ts},
  topics:{ "<topicId>": {
    title, tree:{ "<qid>":{steps:{ "<i>":true }} },
    totalSteps, sectionTotals:{ "<sec>":n },
    lastPracticed, attempts, correct,
    skillStats:{ "<skill>":{attempts,misses} },
    struggles:[ {qid,label,skill,skillLabel,your,ts} ],
    exam:{attempts,correct},
    responses:[ {qid,label,text,ts} ]
  } } } } }
```
A module writes this; the hub reads it. The `g7.` key prefix is shared across all grades' files within the same browser — if you run multiple grades on one device, that's fine (data is namespaced by student+topic), but consider distinct rosters.

**To add a unit:** set `G7_TOPIC_ID`, `G7_TOPIC_TITLE`, the `G7_SKILLS` map; author content; add one entry to the hub `UNITS` array (status `available` + `file`).

## 5. Module baseline (anatomy)
Header (title · unit · standard · objectives) → hub bar → progress → **5–8 sections**, each = objective + teach card with **one worked example** + a climb of step-locked questions → **module check** (mixed, exam-style) → **make-your-own** challenge → export/reset.

**Phase tags (only chip vocabulary):** Learn / Guided / Practice / Apply / Exam / Stretch. Concept is tracked invisibly via `G7_SKILLS`.

**~8 concept skill tags per unit** drive the struggle dashboard — define them per grade/unit.

**Five item formats (all in the template):** fill-in (accepts equivalent fractions, nudges to simplify), single multiple-choice, multi-select ("select all"), two-part (A unlocks B), constructed-response (typed, logged to teacher). Mark exam-grade items with `data-exam="1"`.

## 6. Homework model
Auto-suggested from each student's weakest concepts (`skillStats`/`struggles`); optional teacher-set per-student assignment; the make-your-own challenge as the creative anchor. Verification is automatic via the timestamped tracking + dashboard.

## 7. Build & verify discipline
1. **Consult the textbooks first** (scan folder, read chapters); build from the best; substitute only when research shows a better fit.
2. Author from the template; lean, best-of.
3. **Verify every build:** `node --check` the script; check structure (`</html>`, one `<script>`, balanced braces/parens, qid uniqueness, skill-map coverage); DOM/logic-test new behavior; recompute answer keys.
4. **Large files (>~70KB) truncate** with Write/Edit — edit big modules via bash (python in-place or `head`+`cat >>` heredoc); verify a transformed copy before swapping it into the live file.
5. Keep this standard updated as it evolves.

## 8. Engine versioning (anti-dilution)
The engine (`Module_Template.html`) is the canonical artifact. Note its version here: **Engine v[X]**. When the engine improves, re-propagate deliberately to each grade project (there is no auto-sync across projects). Do not fork the engine per grade.

## 9. How to add a new unit (checklist)
1. Copy `Module_Template.html` → `<Unit_Name>.html`; set `G7_TOPIC_ID`, `G7_TOPIC_TITLE`, `G7_SKILLS`.
2. Scan the folder; read the unit's chapters in the textbooks; list curriculum concepts + aligned exam items.
3. Author sections in correct flow; weave exam items as `Exam` capstones; hints sparingly; one worked example per skill.
4. Add the topic to the hub `UNITS` array (status `available`, `file`).
5. Verify (Section 7) and confirm the dashboard reflects it.
