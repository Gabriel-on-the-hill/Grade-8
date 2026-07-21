# Grade 8 — open issues

**Raised 21 Jul 2026** from the Grade 7 session (scrutiny item **S6** in `../Grade 7/HANDOFF.md`),
which had never been done for this app. **P1 has since been worked and closed**; everything else is a
finding, not yet acted on. Coverage detail is in
[STANDARDS_COVERAGE_MATRIX.md](STANDARDS_COVERAGE_MATRIX.md); provenance working is in
[MCAP_PROVENANCE.md](MCAP_PROVENANCE.md).

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
      renamed headings). **11 guards green, behavioural 269.**

**Nothing was relabelled *up* to compensate**, and the demoted items are not bad items — they are
ours, and now say so.

## P2 · Adopt Grade 7's sourcing practice

Grade 7 treats **copying real questions and textbook exposition as preferred, not a fallback**
(`../Grade 7/PROJECT_STANDARD.md` §11) — only the source PDFs stay unpublished. Authoring our own is
the last resort, because a released item carries a difficulty and a phrasing we cannot invent. Grade 8
authors nearly everything and has richer sources sitting unopened than Grade 7 ever had.

- [ ] **Open the textbooks.** `Textbooks/` holds **Connected Mathematics 2 (Grade 8)**, **enVision
      2021 Student Edition**, its **Teacher's Edition Vol. 1**, the **National Additional Practice**
      workbook, and `Grade 8 TEXTBOOK.pdf`. The Additional Practice book in particular is a ready
      supply of exercises for the three unbuilt domains. **Render pages — do not trust OCR**; Grade 7
      lost time to garbled enVision extraction and the fix was always to render the page and read it.
- [ ] **Record textbook lifts.** Grade 7's manifest has a *Textbook lifts* table so a future editor
      can tell what is the book's and what is ours. Textbook material carries **no exam label**, so a
      wrong attribution cannot mislead a student about what they are sitting — but it still gets
      recorded.
- [ ] **Keep fidelity rules when lifting a released item.** All four were learned expensively:
      1. `pdftotext` is an **index, never the evidence** — it drops figures, collapses drop-downs, and
         silently omits text. Render the page and read it before lifting *or un-lifting*.
      2. Reproduce the stem **verbatim** and rebuild the figure to its stated dimensions. If a figure
         cannot be read off with certainty, the item is **blocked**, not approximated.
      3. **Recompute every key independently** (`fractions.Fraction`, never floats) *before* checking
         it against any published key — two independent derivations must agree.
      4. **An adapted item loses the label.** Change the numbers or the response format and it is no
         longer that released item.
- [ ] **Dual-code to MCCRS 2025.** `Curriculum/grade-8-mccrs-math-crosswalk-a.pdf` is present, so
      Grade 8 can get the same treatment Grade 7 had on 21 Jul. Worth doing early: it will say
      authoritatively **where the three inbound Grade 7 clusters land** (P4 below assumes 8.G / 8.SP
      from the Grade 7 side of the crosswalk — the Grade 8 document can confirm it).

## P3 · Coverage — 3 of 5 maths domains do not exist

Every one of these is a hub tile a student sees as *coming soon*. See the matrix for the per-standard
breakdown.

- [ ] **8.F Functions — absent.** 5 standards. Build first: it is the spine of Grade 8 algebra,
      `8.EE.5`/`8.EE.6` already lean on it, and `8.SP.3` needs it.
- [ ] **8.G Geometry — absent.** 9 standards, the largest domain, and it carries the **Pythagorean
      Theorem** (`8.G.6–8`) and volume of cylinders/cones/spheres (`8.G.9`).
- [ ] **8.SP Statistics & Probability — absent.** 4 standards — scatter plots, line of fit, two-way
      tables. Depends on 8.F for the linear-model work, so build it after.
- [ ] **`8.EE.6` is partial.** The module states and uses `y = mx` and `y = mx + b`, but the
      **similar-triangles explanation of why slope is well defined is missing** — "similar triangle"
      appears nowhere in the repo. The conclusion is taught, the derivation is not. Small; can ride
      any Expressions edit.

## P4 · The MCCRS 2026-27 handoff lands nowhere

- [ ] Maryland's 2025 crosswalk moves **three Grade 7 clusters into Math 8**, printing *"Not
      applicable — In Math 8"*: `7.G.A.2` (construct triangles), `7.G.B.5` (angle relationships →
      equations), `7.SP.C.8` (compound events). **All three land in 8.G / 8.SP, neither of which is
      built.**
      This is why Grade 7 **kept** those eleven items (`../Grade 7/HANDOFF.md` **D10**). If Grade 7
      ever drops them to match Maryland's boundary before 8.G and 8.SP exist, a student crossing the
      two apps meets that material **nowhere at all**. Revisit only once 8.G and 8.SP ship.

## P5 · Guards this app does not have

Grade 7 runs 13; Grade 8 runs **11** (3 of which arrived on 21 Jul). Still missing:

- [x] `mcap_provenance.test.js` — **done 21 Jul 2026**, covering both MCAP and MISA (see P1).
- [ ] `module_smoke.test.js` — catches a module that loads but does not work.
- [ ] `plot_format.test.js` — only needed once Grade 8 uses the click-to-plot input (8.F and 8.SP will
      want it; `a11y.test.js` already guards its keyboard affordances *if* it appears).
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

Currently **10 guards green, behavioural 269**.
