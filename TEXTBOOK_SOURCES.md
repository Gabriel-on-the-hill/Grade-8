# Grade 8 — textbook sources, surveyed

**What this is.** What each book in `Textbooks/` *actually contains*, page-mapped, plus the
**Textbook lifts** register. Built 21 Jul 2026 (`TODO.md` P2). Companion to
[MCAP_PROVENANCE.md](MCAP_PROVENANCE.md), which registers **released exam** items; this file
registers **textbook** material.

**Why the two registers are separate.** A textbook lift carries **no exam label**, so a wrong
attribution cannot mislead a student about what they are sitting — the failure mode that produced
`MCAP_PROVENANCE.md` does not apply here. It is still recorded, so a future editor can tell what is
the book's and what is ours.

**The survey was needed because the inventory was wrong.** `PROJECT_STANDARD.md` described the
enVision Student Edition as covering *"slope, functions, scientific notation, geometry"*. It contains
none of the first three. That entry was **already carrying a known error** — one enVision file in the
folder is Grade 7 mislabelled as Grade 8 — so a second wrong entry in the same list is worth taking
seriously rather than patching quietly.

---

## Inventory — corrected

| Book | Pages | Text layer | What it **actually** contains |
|---|---|---|---|
| **enVision National Additional Practice** | 116 | scanned + OCR | **Topics 1–8, complete.** Two practice pages per lesson. **The best supply in the folder for the unbuilt domains.** |
| **enVision Student Edition** | 228 | scanned + OCR (some images fail to decode) | **Topics 5–8 ONLY** — Systems · Congruence & Similarity · Pythagoras · Surface Area & Volume. **Topics 1–4 are absent**, including Functions and Bivariate Data. |
| **enVision Teacher's Edition Vol. 1** | 400 | digital, dense | Number/exponents exposition. Already used for The Number System (§10 build log, 2026-06-22). |
| **Illustrative Mathematics `Grade 8 TEXTBOOK.pdf`** | 356 | **digital-native, clean** | Units 4–6. **Unit 5 = Functions & Volume**, functions from PDF p114. Activity/discovery exposition — complements enVision's drill. |
| **Connected Mathematics 2** | 212 | scanned, weak OCR | Not surveyed for Functions. Render before use. |

**Three corrections to `PROJECT_STANDARD.md`'s source list, all applied 21 Jul 2026:**

1. The Student Edition is **not** a functions/slope/scientific-notation source. Its four topics are
   Systems, Congruence & Similarity, Pythagoras, and Surface Area & Volume.
2. `Grade 8 TEXTBOOK.pdf` is listed as a **root-level** file. It is at `Textbooks/Grade 8
   TEXTBOOK.pdf`; there is no such file at the root. (Same class of error as the
   `Module_Template.html` path, fixed the same day.)
3. Every book has a text layer, so extraction works **as an index**. It is still not evidence — see
   the trap below.

### The Student Edition is mostly off-grade from SY 2026-27

Cross-referencing [MCCRS_2025_DUAL_CODING.md](MCCRS_2025_DUAL_CODING.md), three of its four topics
teach material Maryland has moved off Grade 8:

| Topic | 2025 status |
|---|---|
| 5 · Analyze and Solve Systems of Linear Equations | ✅ stays — `8.AT.B.5` (already built) |
| 6 · Congruence and Similarity | ⚠️ **→ Integrated Algebra 1 & 2** |
| 7 · Understand and Apply the Pythagorean Theorem | ✅ stays — `8.GR.B.4–5` |
| 8 · Solve Problems Involving Surface Area and Volume | ⚠️ **volume → Math 7** |

So its remaining value to this app is **Topic 7 only** — Pythagoras, for the eventual 8.GR build.
It is not the geometry source it looks like.

---

## Page offsets — check before citing

Every citation in this file is a **PDF page**, with the printed page in brackets. They differ, and
citing the wrong one sends the next editor to the wrong place.

| Book | Offset |
|---|---|
| enVision Additional Practice | printed = PDF **− 6** |
| Illustrative Mathematics | printed = PDF **− 4** |

---

## Functions supply — the next build (`8.AT.C`/`8.AT.D`)

**enVision Additional Practice, Topic 3 — "Use Functions to Model Relationships"**, six lessons,
PDF pp. 45–56 (printed 39–50). Lesson-for-lesson against the 2025 standards:

| Lesson | PDF (printed) | Title | 2025 standard |
|---|---|---|---|
| 3-1 | 45–46 (39–40) | Understand Relations and Functions | `8.AT.C.6` |
| 3-2 | 47–48 (41–42) | Connect Representations of Functions | `8.AT.C.7` |
| 3-3 | 49–50 (43–44) | Compare Linear and Nonlinear Functions | `8.AT.C.8` |
| 3-4 | 51–52 (45–46) | Construct Functions to Model Linear Relationships | `8.AT.D.10` |
| 3-5 | 53–54 (47–48) | Intervals of Increase and Decrease | `8.AT.D.11` (part) |
| 3-6 | 55–56 (49–50) | Sketch Functions from Verbal Descriptions | `8.AT.D.11` |

**Five of the six standards are covered lesson-for-lesson.** Two pages were read as renders to
confirm the supply is real and on-standard, not just correctly titled:

- **PDF p48 (printed 42), lesson 3-2** — three distance-time graphs, *"Determine whether each graph
  is a function. Justify your answer"* + *"Which graph must be incorrect?"*; a Higher-Order-Thinking
  item with three input/output tables asking which represent a **nonlinear** function (squares,
  linear −5, cubes); and an Assessment Practice **two-part** item (Greta's savings, `w = 0…5`,
  `m = 25, 45, 65, 85, 105, 125`) whose Part A writes the function and Part B justifies linear vs
  nonlinear. **Part A/Part B maps straight onto the engine's two-part format.**
- **PDF p56 (printed 50), lesson 3-6** — *"Sketch a graph that shows the relationship between the
  price of the car and the number of cars sold"* on an empty grid; a four-phase narrative
  (up / down / constant / up) to sketch; a 4-option graph-matching Assessment Practice item; and a
  constructed-response *"Describe the graph…"*.

### The one standard the books cannot supply

**`8.AT.D.9` — interpret the graph of `y = mx + b`; identify slope and y-intercept; match an equation
to its graph — has no lesson.** It is **new in MCCRS 2025** and these books are 2019–2021, so this is
expected rather than an oversight. Nearest material is Additional Practice **lesson 2-7 "Analyze
Linear Equations"** (PDF p39, printed 33), which is slope-intercept work but aimed at the equation,
not at reading a graph. Plan to **author** `8.AT.D.9`, or adapt 2-7 — adaptation is fine here, since
textbook material carries no exam label, but it still gets a row in the register below.

### Second source, for exposition

**Illustrative Mathematics, Unit 5 "Functions & Volume"**, functions from PDF p114 (printed 110),
85 function-bearing pages. Lesson 2 *"Introduction to Functions"* opens with *Square Me* (square each
of `1, −3, −½, 3, 2, ¼, 0.5`; why do the two lists have different counts of distinct numbers?) and
*You Know This, Do You Know That?* (say yes/no, draw an input-output diagram, or give two outputs for
one input). It is **digital-native and clean**, unlike the enVision scans, and it is
activity/discovery-shaped — so **IM for the teach cards, enVision Additional Practice for the climb.**

### This confirms the plot-format dependency

Lesson 3-6's items say *"**Sketch** a graph"* and supply an empty grid. That is the textbook's own
choice of response format for `8.AT.D.11`, and it is the format this app has ported into
`Starter_Kit/Module_Template.html` but never used and never guarded (`TODO.md` P5). **Lifting 3-6
faithfully requires the plot input**; rendering it as multiple choice would change the item and
lower the bar (`PROJECT_STANDARD.md` §5). Port `tests/plot_format.test.js` before, or with, the
Functions build.

---

## Textbook lifts — the register

**Empty. No textbook item has been lifted into a module yet.** Add a row when one is, per
`PROJECT_STANDARD.md` §7.7.5.

| File | qid | Book | Lesson | Page (PDF / printed) | Verbatim or adapted |
|---|---|---|---|---|---|
| `Functions.html` | `3-2` | enVision Additional Practice G8 | 3-2 *Connect Representations of Functions*, Q6 | 48 / 42 | **Adapted** — the three input/output tables are reproduced exactly; the stem was changed from *"Which of these tables represent a nonlinear function?"* (open) to *"Select every table that represents a non-linear function"* (multi-select), because the engine grades a fixed option set. The mathematics is unchanged: Tables I and III are non-linear, II is linear with rate −5. |

**Rules for this table** (`PROJECT_STANDARD.md` §7.7):

- Reproduce the stem **verbatim** and rebuild the figure to its stated dimensions; a figure that
  cannot be read off with certainty **blocks** the item rather than being approximated.
- **Recompute every key independently** before checking it against any published key.
- **Adapted ≠ verbatim.** Changing numbers or the response format is fine for textbook material —
  it carries no exam label — but say so in the last column.
- **Never let a textbook lift acquire an exam label.** `MCAP ·` and `MISA ·` mean a released item,
  cited in `MCAP_PROVENANCE.md` and checked by `tests/mcap_provenance.test.js`. A textbook item is
  `Practice`/`Apply`, or `Exam-style ·` if written to exam shape.

---

## The trap, for the next reader

**Extraction said the Student Edition had "3 pages mentioning *function*" in 228.** Taken at face
value that reads as *the book has no functions content* — which happens to be true, but for the wrong
reason, and the same evidence would have been produced by a broken OCR layer over a book that was
full of it. The contents page **lists Topic 3 "Use Functions to Model Relationships"**, which flatly
contradicts the extraction.

What settled it was neither: mapping the **lesson numbers in the running heads across all 228 pages**
showed the file jumps from the contents straight to Topic 5 and runs 5 → 6 → 7 → 8. The book is the
back half of the course; the contents page lists the whole of it.

**A negative search is not proof of absence, and a table of contents is not proof of presence.**
Both were wrong here in opposite directions, and the page structure was right. This is the fifth time
extraction has misled in this repo — see `MCCRS_2025_DUAL_CODING.md` for the fourth.
