# Grade 8 Mathematics Hub — Project Operating Standard

**Purpose:** Single source of truth for this Grade 8 Mathematics hub, built from the Starter Kit. Any assistant/session should **read this file and `Module_Template.html` first**, then continue at (or above) this standard with minimal prompting. Keep this file updated as the standard evolves.

> Project facts:
> - **Grade:** 8
> - **Subject:** Mathematics
> - **Exam program / focus:** MCAP Grade 8 Mathematics (Maryland Comprehensive Assessment Program)
> - **Curriculum units + standards (CCSS / MCCRS domains):**
>   - **The Number System (8.NS)** — irrational numbers; rational vs irrational; decimal expansions (terminating/repeating); converting repeating decimals to fractions; square & cube roots; approximating, comparing and ordering irrationals on a number line; estimating expressions. *(BUILT — first unit.)*
>   - **Expressions & Equations (8.EE)** — integer exponents & properties; scientific notation; proportional relationships & slope; solving linear equations (one solution / none / infinite); systems of two linear equations. *(BUILT — second unit.)*
>   - **Functions (8.F)** — define/evaluate/compare functions; linear vs nonlinear; rate of change & initial value; construct & interpret functions and graphs. *(coming soon)*
>   - **Geometry (8.G)** — rigid transformations & congruence; dilations & similarity; angle relationships; Pythagorean Theorem & its converse; distance; volume of cylinders, cones & spheres. *(coming soon)*
>   - **Statistics & Probability (8.SP)** — scatter plots & bivariate data; lines of best fit; two-way tables & association. *(coming soon)*
> - **Textbooks / source materials in folder (consult every unit):**
>   - `Grade 8 TEXTBOOK.pdf` — Illustrative Mathematics Grade 8 Student Edition, **Units 4–6 only** (Linear Equations, Functions & Volume, Data). Scanned; render pages to images to read. Does NOT cover the Number System.
>   - `Textbooks/` (added 2026-06-22 — **grade-verified by title + content**):
>     - ✅ `enVision … Teacher's Edition GRADE 8 VOLUME 1` — Grade 8; primary textbook source for the Number System / exponents (irrational & rational numbers, square & cube roots, scientific notation).
>     - ✅ `Envision … Student Edition … Grade 8 Volume 2` (Scott Foresman, 228 pp) — Grade 8 (slope, functions, scientific notation, geometry).
>     - ✅ `Envision … National Additional Practice Grade 8` — Grade 8 practice items.
>     - ✅ `Connected Mathematics 2 : grade 8` (Lappan) — Grade 8 (scanned; OCR weak — render to images).
>     - ❌ `ENVISION … "GRADE" … Berry … isbn 9780768567779` — **actually Grade 7 Volume 2** (filename is misleading). DO NOT use as a Grade 8 source.
>   - `MCAP MATHS/` — MSDE public-release item sets by domain (The Number System, Functions, Geometry, Modeling, Reasoning, Statistics and Probability).
>   - `MD1126620_Gr8Mth_PT.pdf` — Grade 8 Paper Practice Test (real items).
>   - `MCAP_2025-26_PT-Answer-Key_Math_Grade-8_Paper_FINAL.pdf` — answer key + standards alignment.
>   - `Curriculum/` — `Math_Standards.pdf`, MCCRS Standards Companion Guide, Crosswalk, MCAP Blueprint, MCAP Grade 8 Reference Sheet.
>   - `Rising Math 8 Summer Packet.pdf` — Grade 7 review (prerequisite framing).
>   - `Summer Boost Grade 8 (IXL Skill Plan).pdf` — skill sequencing reference.
>   - `eq-editor-tips_GR6-8v7.pdf` — how MCAP's equation/answer entry works (informs fill-in answer phrasing).

---

## 1. Vision
A Grade 8 Mathematics **study & practice hub** for a teacher with one or more students. Students sign in by name, open a topic, and climb a guided, self-paced lesson. The teacher sees who practiced what, where they struggled (by concept), exam-readiness, and can assign homework. Warm, professional, age-appropriate. Low stress, high rigor, MCAP-ready. Multi-student.

## 2. Non-negotiable principles
1. **Consult the textbooks; use the best, no filler.** All source PDFs live in the project folder and **must be consulted** every unit. Scan the folder, read the relevant chapters/items, and select the strongest explanations and exercises *from them*. Only substitute a created item when it is genuinely better.
2. **Curriculum ∪ exam (union, never trade-off).** Cover every concept the grade's curriculum requires, AND weave in real MCAP items on top as capstones. Never drop curriculum to chase the test.
3. **Flow builds up.** No advanced concept before its prerequisite. Representation before operations. Within a lesson: Learn → Guided → Practice → Apply → Exam.
4. **Hints sparingly.** Only on multi-step/hard items. Never on trivial questions or exam capstones.
5. **One structure, no duplicates.** Reuse the single engine and shared data contract. Never build a parallel system.
6. **Don't bog the student down.** Strategic and lean; quality over quantity.
7. **Professional, not "AI".** No emoji, no gradient/clichéd styling. Clean, real-product look.
8. **On grade.** Match Grade 8; shelve/rebuild anything above or below grade.

## 3. Files
- `Grade_8_Math_Hub.html` — the home hub (renamed from `Hub_Template.html`). Multi-subject: edit the `SUBJECTS` array + title only. Hosts Mathematics (built) and Science (coming soon); one sign-in, one roster, one teacher dashboard across all subjects.
- `Module_Template.html` — canonical module engine + showcase of all 5 formats. **Stamp every unit from this.**
- `The_Number_System.html` — first built unit (8.NS).
- One HTML module per remaining unit (built from the template).
- `Starter_Kit/HUB_Google_Sheet_Setup.md` — optional cloud activity log (not yet connected).

## 4. Shared data contract (localStorage — same browser/origin)
Keys retain the `g7.` prefix from the engine via a single `STORE_PREFIX` constant (change it only to isolate a deployment; default `g7.` keeps back-compat). Keys: `g7.roster`, `g7.current`, `g7.subject` (last-selected subject), `g7.pins` (`{ "<name>": "<4-digit PIN>" }` — per-student light gate, plaintext, set by the student on first sign-in, teacher-resettable; not real security), `g7.sheetURL`, `g7.teacherPass`, and `g7.data` with the per-student/per-topic tree (tree of steps, totalSteps, sectionTotals, lastPracticed, attempts, correct, skillStats, struggles, exam, responses). Teacher homework is per-subject under `students[name].assignments[subjectId]` (legacy `students[name].assignment` is still read and treated as Mathematics). A module writes the topic tree; the hub reads it.

**Multi-subject model:** the hub config is `SUBJECTS → units → topics`. A topic's `id` **is** the storage key its module writes (`G7_TOPIC_ID`). Existing Math topics keep their bare ids (`number-system`, `expressions-equations`) for back-compat; **every NEW subject's topics must be prefixed with the subject** (e.g. `sci.life`) so two subjects can never collide in a student's data. Because hub + modules share one localStorage, they must be served from the **same origin** (a single deployment) for one combined dashboard.

**To add a unit:** set `G7_TOPIC_ID` (subject-prefixed for new subjects), `G7_TOPIC_TITLE`, the `G7_SKILLS` map; author content; add one entry to the right subject's `units` in the hub `SUBJECTS` array (status `available` + `file`).

## 5. Module baseline (anatomy)
Header (title · unit · standard · objectives) → hub bar → progress → **5–8 sections**, each = objective + teach card with **one worked example** + a climb of step-locked questions → **module check** (mixed, exam-style) → **make-your-own** challenge → export/reset.

**Phase tags (only chip vocabulary):** Learn / Guided / Practice / Apply / Exam / Stretch.

**Five item formats (all in the template):** fill-in (accepts equivalent fractions), single multiple-choice, multi-select, two-part (A unlocks B), constructed-response. Mark exam-grade items with `data-exam="1"`.

### The Number System — skill tags used (drives the struggle dashboard)
`rational-decimal` (rational numbers & decimal expansions), `repeat-fraction` (repeating decimal → fraction), `irrational` (identify irrational numbers), `roots` (square & cube roots), `estimate` (approximate irrationals between integers / truncating), `compare` (compare & order on a number line), `expr-est` (estimate value of expressions), `reasoning` (reasoning & error analysis).

## 6. Homework model
Auto-suggested from each student's weakest concepts; optional teacher-set per-student assignment; the make-your-own challenge as the creative anchor. Verification is automatic via timestamped tracking + dashboard.

## 7. Build & verify discipline
1. **Consult the sources first** (scan folder, read chapters/items); build from the best.
2. Author from the template; lean, best-of.
3. **Verify every build:** `node --check` the script; check structure (`</html>`, one `<script>`, balanced braces/parens, qid uniqueness, skill-map coverage); recompute every answer key.
4. **Large files (>~70KB)** edit via bash (python in-place / heredoc), verify a copy before swapping into the live file.
5. Keep this standard updated.

## 8. Engine versioning (anti-dilution)
Engine: **Engine v1.2** (v1.1 + the multi-subject hub layer: flat `UNITS` replaced by `SUBJECTS → units → topics`, subject switcher, per-subject stats/homework/assignments, subject-grouped teacher dashboard, `STORE_PREFIX`, and the subject-prefixed topic-id convention, 2026-06-23). v1.1 = v1 from Grade 7 + an "Entering your answers" guide card and fraction-format placeholders. Do not fork the engine per grade/subject; improve in one place and re-propagate deliberately. The hub and `Starter_Kit/Hub_Template.html` carry the same engine; module files are unchanged by v1.2 (no module edits required).

## 9. How to add a new unit (checklist)
1. Copy `Module_Template.html` → `<Unit_Name>.html`; set `G7_TOPIC_ID`, `G7_TOPIC_TITLE`, `G7_SKILLS`.
2. Scan the folder; read the unit's chapters/items; list curriculum concepts + aligned MCAP items.
3. Author sections in correct flow; weave MCAP items as `Exam` capstones; hints sparingly; one worked example per skill.
4. Add the topic to the hub `UNITS` array (status `available`, `file`).
5. Verify (Section 7) and confirm the dashboard reflects it.

## 10. Build log
- **2026-06-22** — Project instantiated from Starter Kit. Hub configured for Grade 8 (5 domains). **The Number System (8.NS)** built as the first full unit, with both real MCAP NS items woven in as exam capstones. Remaining four domains marked "coming soon".
- **2026-06-22** — `Textbooks/` folder added and grade-verified (see textbook list above; one enVision file is actually Grade 7 and is excluded). **Enriched The Number System** using the verified enVision Grade 8 Teacher's Edition Vol 1: sharpened the teach cards/worked examples (real-numbers framing, explicit powers-of-10 STEP method, number-line ordering) and added one in-standard item — converting an *eventually*-repeating decimal (0.6333… → 19/30, 8.NS.A.1). Quality-over-quantity per standard: 27 → 28 items, no filler.
- **2026-06-23** — **Engine v1.2: multi-subject hub.** Added a Subject layer above units (`SUBJECTS → units → topics`) with a subject switcher, per-subject stat tiles / homework / teacher assignments, and a subject-grouped teacher dashboard. Added `STORE_PREFIX` (default `g7.`, back-compat) and the subject-prefixed topic-id rule (Math keeps bare ids; new subjects use e.g. `sci.*`). Science added as a "coming soon" subject (Life / Physical / Earth & Space). No module edits required; existing student data preserved. Verified with `node --check`, brace/paren/bracket balance, getElementById-target check, and a headless jsdom render (student subject switch + back-compat homework + subject-grouped teacher view). Propagated the same engine to `Starter_Kit/Hub_Template.html` (generic `[SUBJECT]/[UNIT]/[TOPIC]` placeholders).
- **2026-06-22** — Built **Expressions & Equations (8.EE)** as the second unit → `Expressions_and_Equations.html` (7 sections, 29 items, all 5 formats). Flow: integer exponents → scientific notation → proportional relationships & slope → solving linear equations → one/none/infinite solutions → systems. Grounded in enVision G8 TE Vol 1 (exponent properties, scientific notation, slope) and IM textbook Unit 4 (linear equations & systems). Four real MCAP items woven as exam capstones: 8⁻⁴·8³=1/8 (8.EE.A.1), 8×10⁹÷2×10⁸=40 (8.EE.A.3), 5(x−6)−2(x+3)=12→16 (8.EE.C.7), system-solution reasoning (8.EE.C.8). Wired into hub as `available`; all answers verified.
