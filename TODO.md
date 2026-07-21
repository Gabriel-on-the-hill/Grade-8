# Grade 8 — open issues

**Raised 21 Jul 2026** from the Grade 7 session (scrutiny item **S6** in `../Grade 7/HANDOFF.md`),
which had never been done for this app. **P1 and P2 are closed**; P3–P6 are findings, not yet acted
on. Coverage detail is in [STANDARDS_COVERAGE_MATRIX.md](STANDARDS_COVERAGE_MATRIX.md); exam
provenance is in [MCAP_PROVENANCE.md](MCAP_PROVENANCE.md); the MCCRS 2025 map is in
[MCCRS_2025_DUAL_CODING.md](MCCRS_2025_DUAL_CODING.md); the textbook survey and lift register are in
[TEXTBOOK_SOURCES.md](TEXTBOOK_SOURCES.md).

**P3.1 — the 8.F/Functions build — is next, and it is now unblocked and fully scoped**: 6 standards,
sources mapped lesson-for-lesson, one standard (`8.AT.D.9`) known to need authoring, and the plot
format now guarded (P5) so the sketch-a-graph items can be built at their real bar.

> **Read the dual-coding before building any new unit.** It revised P3 and P4 on 21 Jul 2026: 8.G is
> a 5-standard build rather than 9, two new standards have no 2010 predecessor (so no 2010-coded
> audit can see them), and two clusters changed what the student is asked to *do*.

Ordered by *what could mislead a student*, then *what is missing*, then *what could regress*.

---

## P1 · Truth — RESOLVED 21 Jul 2026

All 30 exam-authority claims were adjudicated against the packets in `MCAP MATHS/` and
`MCAP SCIENCE/`, every one read off the **rendered** page. **11 verified, 9 demoted.** Full working,
keys and reasoning: [MCAP_PROVENANCE.md](MCAP_PROVENANCE.md).

- [x] **`MISA ·` labels resolved — 6 of 10 are real.** The first pass looked bad: the four items
      naming a standard cited `MS-PS1-2`, `MS-PS1-3` and `MS-PS1-5`, none of which has a packet.
      **Rendering the `MS-PS1-1 and MS-PS1-4` packet changed the answer** — six of the ten are
      faithful lifts from its sugar-and-water item set, and carry no standard code in their titles,
      which is exactly why a code-based search missed them. The split is almost too neat: **the six
      with no code are the six that are real; the four with codes are the four that are not.**
      `4-4`, `4-5`, `5-5`, `6-5` demoted to `Exam-style ·`. **Trap #11 nearly cost six real items.**
- [x] **MCAP maths claims resolved — 5 of 10 are real.** `3-3`=Q7, `6-4`=Q5, `1-5`=Q1, `2-4`=Q9,
      `4-4`=Q6, all from the Math 8 2024 release. `2-5`, `3-5`, `6-5`, `5-5`, `6-3` demoted.
      **Arithmetic broke this open before any reading did:** the entire released 8.NS supply is
      **two** items and the module claimed **five**.
- [x] **Both footers reworded.** They told the student *"Real MCAP practice items are marked Exam"*,
      which was true of 5 of 20 exam items. They now say lifted items are titled `MCAP` and cited in
      the manifest, and the rest are ours, titled `Exam-style`.
- [x] **`6-4` fidelity repair.** It printed `√(65/122)`; MCAP prints `√65 ÷ √122`. Equal in value,
      but the released form is what makes the item test `√a/√b = √(a/b)`. Notation restored to the
      release's rather than the label dropped.
- [x] **The guard exists.** `tests/mcap_provenance.test.js` ported and extended to two label
      families, mutation-checked on four paths (unbacked claim, stale row, cross-table sourcing,
      renamed headings). **10 guards green, behavioural 269** — the count as it stood that day;
      `plot_format` later made it 11.

**Nothing was relabelled *up* to compensate**, and the demoted items are not bad items — they are
ours, and now say so.

## P2 · Adopt Grade 7's sourcing practice — **DONE 21 Jul 2026**

Grade 7 treats **copying real questions and textbook exposition as preferred, not a fallback**
(`../Grade 7/PROJECT_STANDARD.md` §11) — only the source PDFs stay unpublished. Authoring our own is
the last resort, because a released item carries a difficulty and a phrasing we cannot invent. Grade 8
authors nearly everything and has richer sources sitting unopened than Grade 7 ever had.

All four bullets are closed. The practice now lives where a builder will actually meet it:
`PROJECT_STANDARD.md` **§7.7** (the five fidelity rules), [TEXTBOOK_SOURCES.md](TEXTBOOK_SOURCES.md)
(what each book holds + the lift register), and
[MCCRS_2025_DUAL_CODING.md](MCCRS_2025_DUAL_CODING.md) (which grade a standard belongs to now).
**The sources were richer than assumed in one direction and thinner in another** — the Additional
Practice workbook covers Functions lesson-for-lesson, while the Student Edition turned out to hold
none of what it was credited with.

- [x] **Textbooks opened and surveyed — done 21 Jul 2026.** Full map in
      [TEXTBOOK_SOURCES.md](TEXTBOOK_SOURCES.md). The Additional Practice workbook is confirmed as
      the best supply: **Topics 1–8 complete**, and its Topic 3 covers **5 of the 6 Functions
      standards lesson-for-lesson** (PDF pp. 45–56). Illustrative Mathematics Unit 5 is
      digital-native and clean — **IM for the teach cards, enVision for the climb.**
      **Two corrections to `PROJECT_STANDARD.md`'s source list fell out of it:** the Student Edition
      holds **Topics 5–8 only** and contains none of the "slope, functions, scientific notation" the
      standard credited it with (Topics 1–4 are simply not in the file), and `Grade 8 TEXTBOOK.pdf`
      is inside `Textbooks/`, not at the root. Under MCCRS 2025 three of the Student Edition's four
      topics are off-grade, so its remaining value here is **Pythagoras**.
      - **`8.AT.D.9` cannot be sourced** — it is new in 2025 and these books are 2019–2021. Author
        it, or adapt Additional Practice lesson 2-7; either way it gets a register row.
- [x] **Textbook-lift register created — `TEXTBOOK_SOURCES.md`.** Empty, and correctly so: nothing
      has been lifted yet. Kept **separate from `MCAP_PROVENANCE.md`** on purpose — textbook material
      carries **no exam label**, so a wrong attribution cannot mislead a student about what they are
      sitting, and it must never acquire one. Rules live in `PROJECT_STANDARD.md` §7.7.
- [x] **Fidelity rules codified 21 Jul 2026 — `PROJECT_STANDARD.md` §7.7.** They were sitting in this
      TODO, which nobody reads before building; they now sit in the standard, which `CLAUDE.md`
      requires be read first. All four were learned expensively, and a fifth was added (*record the
      lift*):
      1. `pdftotext` is an **index, never the evidence** — it drops figures, collapses drop-downs, and
         silently omits text. Render the page and read it before lifting *or un-lifting*. **Rendering
         in this repo is PyMuPDF** (`import fitz` → `get_pixmap(dpi=140)`); `pdftoppm` is not
         installed, which is worth knowing before losing time to it.
      2. Reproduce the stem **verbatim** and rebuild the figure to its stated dimensions. If a figure
         cannot be read off with certainty, the item is **blocked**, not approximated.
      3. **Recompute every key independently** (`fractions.Fraction`, never floats) *before* checking
         it against any published key — two independent derivations must agree.
      4. **An adapted item loses the label.** Change the numbers or the response format and it is no
         longer that released item.
- [x] **Dual-code to MCCRS 2025 — done 21 Jul 2026.** All 14 crosswalk pages rendered and read; full
      map in [MCCRS_2025_DUAL_CODING.md](MCCRS_2025_DUAL_CODING.md). It was worth doing early — it
      **cut against the plan below**. Headlines: the four domains are renamed and re-cut (Functions
      dissolves into **Algebraic Thinking**, exponents/roots move to **Number and Operation Sense**);
      **7 requirements leave Grade 8** (4 of the 9 old 8.G standards go up to Integrated Algebra,
      volume goes down to Math 7, `8.EE.A.4` is deleted); **3 are new**, one of them inside a module
      already called built; and all three inbound Grade 7 clusters are **confirmed and named** (P4).
      Caveat: the MCAP blueprint we hold is **Sept 2022 and 2010-coded**, so this governs *what to
      teach*, not how a released item is labelled.

## P3 · Coverage — 3 of 5 maths domains do not exist

Every one of these is a hub tile a student sees as *coming soon*. See the matrix for the per-standard
breakdown. **Revised 21 Jul 2026 against the MCCRS 2025 crosswalk** — the dual-coding changed the
scope of two of these items and added a third. 2025 codes in brackets.

> **Three of these need the plot format**, which is now guarded (P5, done 21 Jul) but still used by
> no module. `8.AT.D.11` *sketch a graph from a narrative*, `8.AT.B.4` *represent the solution set on
> a number line*, and `8.DS.B.2` *construct a scatter plot* all have **construction verbs**.
> Assessing them with multiple-choice would meet the letter of `exam_coverage` and quietly lower the
> bar — the standard's verb *is* the bar. The guard made the format safe to use; **using it is the
> remaining work**, and `8.AT.D.11`'s own textbook source items are "Sketch a graph" on an empty
> grid (`TEXTBOOK_SOURCES.md`).

- [x] **8.F Functions — BUILT 21 Jul 2026** → `Functions.html`, 8 sections / 36 items / 44 steps, all
      six formats, wired into the hub as `available`. Covers all 6 standards `[8.AT.C.6–8,
      8.AT.D.9–11]`, **4 real MCAP capstones**, 1 textbook lift, and `8.AT.D.9` authored (no released
      item, no textbook lesson — it is new in 2025). First unit to use the click-to-plot format.
      Detail in `PROJECT_STANDARD.md` §10. *Original entry, for the reasoning:* 5 standards + 1 new.
      **Built first on this evidence:**
      it is the **highest-weight unbuilt domain on the blueprint (5 of 23 content items)**, one of
      only three domains carrying a Reasoning statement, and under 2025 it **completes 8.AT**
      alongside the built Expressions & Equations. Author `8.AT.D.9` in from the start.
      **Capstones pre-cleared 21 Jul 2026** (`MCAP_PROVENANCE.md`): the `Math 8 Functions` packet
      holds exactly five items, one per 8.F standard, all read off the rendered page with keys
      recomputed independently. **Four are usable** (Q2 → `8.AT.C.6`, Q20 → `8.AT.C.7`,
      Q35 → `8.AT.D.10`, Q14 → `8.AT.D.11`). **Q8 is blocked:** it asks for *any two points* on
      `x + 3y = −3`, and the engine matches one exact string — constrain it and it loses the label,
      multiple-choice it and it lowers the bar. Cover `8.AT.C.8` from the textbook instead.
      So: **4 MCAP capstones + 1 textbook item + 1 authored (`8.AT.D.9`).**
- [x] **`8.AT.B.4` linear inequalities — BUILT 21 Jul 2026.** Expressions & Equations gained a
      **new section 8** (5 items, 1 exam-grade): solve two-step and bracketed inequalities, the
      sign-flip on dividing by a negative, a contextual range that must be rounded *down* to make
      sense, and the solution set on a number line. **The number-line item is deliberately
      decomposed** — plot the boundary, then choose open/closed and the direction — because the plot
      format places a point and cannot draw a ray; the student still *produces* the boundary rather
      than picking the right picture. Section numbering: it is section **8** sitting before section
      **7** on the page, and that is deliberate — see `PROJECT_STANDARD.md` §5, section numbers are
      allocation ids frozen at ship because qids key live student progress and published homework.
- [ ] **8.SP Statistics & Probability — absent.** 4 standards `[8.DS.B.2–4, 8.DS.C.5]`, **+1 new**
      `[8.DS.A.1 — evaluate predictions and conclusions; bias and generalisation]`, **+1 inbound**
      `[8.DS.C.6 compound events, from 7.SP.C.8]` = **6**. Depends on 8.F for the linear-model work.
      **Author to the 2025 verbs:** `8.DS.B.3`/`B.4` now ask the student to *compare given* fits and
      use a *provided* model, not to fit a line themselves — the cluster tilts from construction to
      critique. A module written off the 2010 text would drill the wrong verb.
- [ ] **8.G Geometry — absent, and much smaller than it looked.** **Not 9 standards — 5**
      `[8.GR.A.1–3, 8.GR.B.4–5]`, and only 4 of 23 blueprint items. It is **angle work plus
      Pythagoras**: two of the five are the inbound Grade 7 clusters (P4), one is triangle angle
      sum/exterior angle, two are Pythagoras + distance. **Do not build** transformations,
      congruence, dilations or similarity (`8.G.A.1–4` → Integrated Algebra 1/2) or volume
      (`8.G.C.9` → Math 7) — that is four standards of off-grade load for no exam return, against
      `PROJECT_STANDARD.md` §2.8. Handle the transformations block as a prerequisite note.
      **The hub tile currently promises three topics that will not be in it** — correct its `desc`
      when the unit ships.
- [x] **`8.EE.6` derivation — BUILT 21 Jul 2026** `[8.AT.A.2]`. A teach card now derives why slope is
      well defined from **equivalent ratios** across three different point-pairs on one line, with
      `3-6` (compute the second ratio) and `3-7` (say *why* it must be the same) to test it. Similar
      triangles get one parenthetical sentence as the classical framing, exactly as planned below.
      Also added `3-5`, a click-to-plot item for `8.AT.A.1a` *"graph proportional relationships"*.
      *Original entry, for the reasoning:* The module
      states and uses `y = mx` and `y = mx + b` but never says *why slope is well defined*. 2010 said
      *use similar triangles*; **2025 says use proportional reasoning — show the ratios of vertical to
      horizontal change between points are equivalent.** Build the ratio-equivalence argument;
      similar triangles are worth a sentence as the classical framing but **must not be the primary
      route**, because 8.G's similarity standards — which would supply that prerequisite — have left
      the grade. Small; can ride the same Expressions edit as `8.AT.B.4`.

## P4 · The MCCRS 2026-27 handoff lands nowhere — **both sides now agree**

- [ ] Maryland's 2025 crosswalk moves **three Grade 7 clusters into Math 8**, printing *"Not
      applicable — In Math 8"*: `7.G.A.2` (construct triangles), `7.G.B.5` (angle relationships →
      equations), `7.SP.C.8` (compound events). **Confirmed 21 Jul 2026 from the Grade 8 side**, which
      names the receiving standards: `7.G.B.5` → **`8.GR.A.1`**, `7.G.A.2` → **`8.GR.A.2`**,
      `7.SP.C.8` → **`8.DS.C.6`**. Both documents agree, which is the point of checking both.
      **All three receiving standards are real, named, and unbuilt.**
      This is why Grade 7 **kept** those eleven items (`../Grade 7/HANDOFF.md` **D10**). If Grade 7
      ever drops them to match Maryland's boundary before 8.GR and 8.DS exist, a student crossing the
      two apps meets that material **nowhere at all**. Revisit only once they ship — and the gate is
      **lower than it looked**, since 8.GR is a 5-standard build, not 9 (P3).

## P5 · Guards this app does not have

Grade 7 runs 13 `.test.js`; Grade 8 runs **12** (5 of which arrived on 21 Jul). *(This line and P1 both said 11
when the true count was 10; corrected, then `plot_format` took it to a real 11. The three still
missing below, less `homework_backend.test.js` which Grade 7 does not have, is the 13 → 11
difference.)* Still missing:

- [x] `mcap_provenance.test.js` — **done 21 Jul 2026**, covering both MCAP and MISA (see P1).
- [x] `module_smoke.test.js` — **ported 21 Jul 2026**, mutation-checked on three paths. Boots every
      module, drives a wrong then a right answer, and asserts locked controls are really disabled.
      **Grade-8 Part B added:** every `available` hub tile must point at a file that exists on disk
      whose `G7_TOPIC_ID` matches its topic id (§4 — a mismatch writes progress the dashboard never
      reads, and every page involved looks correct on its own), and every built module must be
      reachable from some tile. All three mutations caught.
- [x] `plot_format.test.js` — **ported 21 Jul 2026. 26 assertions, mutation-checked on five paths**
      (lock-guard removed · snapping un-rounded · `role="slider"` dropped · the `d10` demo card
      removed · the keyboard handler neutered — each caught, template restored bit-identically).
      **The old entry was wrong in both directions:** it said the guard was "only needed once Grade 8
      uses the click-to-plot input", but `Starter_Kit/Module_Template.html` **already carried the
      format** (`478816d`, both number-line and grid variants). Grade 8 had a shipped, working,
      **entirely unexercised** response format that nothing would have noticed rotting. Geometry is
      identical to Grade 7's, so the assertions ported unchanged; only the path differs.
      **Grade-8 addition:** Part B sweeps any *module* that adopts the format and holds it to the same
      structure, so the first unit to use the plot cannot quietly diverge. It iterates zero files
      today and **says so** — "0 files checked" and "all files passed" otherwise print identically.
      - **Two live standards are still under-assessed** because built modules don't use the format:
        `8.AT.A.1a` *"**Graph** proportional relationships"* — E&E §3 is four read-off/compute items
        (`Find the slope`, `Write the equation`, `read m and b`, `Unit rate as slope`), none placing
        anything; and `8.NOS.A.2` *"estimate their **locations on a number line**"* — NS `5-4`
        *"Locate between integers"* names the two integers rather than placing the point.
        **The guard does not fix these** — it makes the format safe to use. Using it is the fix.
- [ ] `starter_kit.test.js` — **Grade 8 does carry its own kit** (`Starter_Kit/Hub_Template.html`
      and `Starter_Kit/Module_Template.html`), and it is **half-fixed**. Checked 21 Jul 2026:
      neither template hardcodes a `gN.` storage literal ✅ and both ship the namespace as
      `CHANGEME` ✅ — but **neither renders a `role="alert"` banner while unconfigured** ❌.
      That is the *loud* half of `../Grade 7/HANDOFF.md` **D2**, and it is the half that matters:
      the damage a stamped-but-unedited kit does is **silent**. A new deployment that forgets to set
      the prefix writes into a live grade's data and nobody finds out until a student's record is
      already wrong. Port the banner, then port the guard.
- [ ] `backend_contract.test.js` — Grade 7's version asserts the shared `.gs` is reachable and
      hub-namespaced. Grade 8 **owns** that file, so its version should assert the inverse: that the
      file is present here and that `homework_backend.test.js` still drives it.

## P6 · Housekeeping

- [x] **Accessibility — done 21 Jul 2026.** Icon glyphs marked `aria-hidden`, and all three modals
      given `role="dialog"` + `aria-modal` + a name from their own heading. `tests/a11y.test.js` added
      and passing (2 svg, 30 exam cards, 3 modals).
- [x] **Storage namespace — done 21 Jul 2026.** `tests/store_prefix.test.js` added; Grade 8 already
      single-sourced via `G7_STORE`, and it passes.
- [ ] **Retire the `LEGACY_OK` row.** `tests/store_prefix.test.js` allow-lists `Grade_8_Math_Hub.html`
      reading the old `'g7.'` namespace for the 19 Jul 2026 migration. Once that migration is retired,
      delete the read **and** the allow-list row — the guard already fails if the row outlives the code.
- [ ] **Parent/child inversion, again.** Grade 8 had the single-sourced store constant (`G7_STORE`)
      before Grade 7 did, so Grade 7's T6 was a *port back*, not new work — the third time this
      direction has inverted (spaced review, cloud sync, now the store constant). `AGENTS.md` calls
      drift the standing risk; it is worth deciding which app is actually the parent.

---

**Verification protocol** (run all of it, every time):

```bash
cd "c:/Antigravity/Grade 8"
for t in tests/*.test.js; do node "$t" || echo "FAILED: $t"; done
node tests/behavioral_test_suite.js .
```

Currently **12 guards green, behavioural 269**.
