# Grade 8 — open issues

**Raised 21 Jul 2026** from the Grade 7 session (scrutiny item **S6** in `../Grade 7/HANDOFF.md`),
which had never been done for this app. Findings only — nothing here has been acted on except where
it says *done*. Detail for the coverage half is in [STANDARDS_COVERAGE_MATRIX.md](STANDARDS_COVERAGE_MATRIX.md).

Ordered by *what could mislead a student*, then *what is missing*, then *what could regress*.

---

## P1 · Truth — an exam claim with nothing behind it

- [ ] **`MISA ·` labels are unbacked — and the first check does not look good.** Ten items in
      `Matter_and_Its_Interactions.html` are titled `MISA ·` (Maryland Integrated Science Assessment),
      asserting to the student that they are sitting a real released item. There is **no provenance
      manifest in this repo and no guard**. This is precisely the failure
      `../Grade 7/MCAP_PROVENANCE.md` was created to prevent, in a different programme's name.

      **What a first pass found (21 Jul 2026).** `MCAP SCIENCE/` holds **10 genuine MSDE public-release
      packets** (verified by rendering, not by filename — they are titled *"8th Grade MISA · Released
      Questions in Standard …"*). Between them they cover:

      > MS-ESS1-1/2/3/4 · MS-ESS2-2/3/4 · MS-ESS3-1 · MS-LS1-1/3 · MS-LS2-1/2/3 · MS-LS3-2 ·
      > MS-LS4-4 · MS-PS1-1 · **MS-PS1-4** · MS-PS2-1/3/4/5 · MS-PS3-3/4/5

      Four of our ten `MISA ·` items name a standard in their title, and they name
      **`MS-PS1-2` (×2), `MS-PS1-3` and `MS-PS1-5`** — **none of which appears in any packet**, by
      title or in the extracted text. The remaining six name no standard at all (*"structure of table
      sugar"*, *"why water is a molecule"*, …).

      This is **not** proof the items are invented — the author may have used a source not in this
      repo. It does mean **the claim cannot be verified from anything here**, which is the whole
      problem. Grade 7's trap #11 cuts both ways: do not demote on a failed search either. **Render
      the packets and look before deciding.**

      **Do:** port `MCAP_PROVENANCE.md` + `tests/mcap_provenance.test.js`, then resolve all ten. Any
      that cannot be traced to a real released item get relabelled `Exam-style ·` — *never* the
      reverse, and never by relabelling something else up to compensate.

- [ ] **Both maths modules claim their exam items are real MCAP — and this one is fully checkable.**
      The page description reads *"Aligned to MCCRS 8.NS.A.1–8.NS.A.2 and MCAP. **Real MCAP practice
      items are marked Exam.**"* (and the same for 8.EE). That is **20 exam items** carrying an
      exam-authority claim. **This may well be true — the point is that nothing records it and nothing
      checks it.**

      Unlike the science half, the sources are all here: **`MCAP MATHS/` holds 7 MSDE public-release
      packets** — *Math 8 2024*, plus per-domain packets for *The Number System, Functions, Geometry,
      Statistics and Probability, Reasoning* and *Modeling*. Every one of the 20 claims can be
      resolved against them.

      **Do:** work one packet at a time, and **count sources against claims** — Grade 7 found two real
      errors that way (a packet holding five items with seven rows citing it). Record each in the
      manifest with packet + question number. Anything unresolved becomes `Exam-style ·`.
      Grade 7 shipped 19 falsely-labelled capstones on 20 Jul 2026 for exactly this reason: the title
      convention was copied from the genuinely sourced item next door.

- [ ] **No `exam_coverage` pressure valve.** Grade 7's manifest documents that a guard rewarding
      *having* a capstone creates pressure to manufacture one. Grade 8 runs `exam_coverage.test.js`
      with no provenance guard beside it — the same pressure, none of the counterweight.

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

Grade 7 runs 13; Grade 8 runs 10 (2 of which arrived on 21 Jul). Missing, in rough value order:

- [ ] `mcap_provenance.test.js` — see P1. **Highest value of the four.**
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
