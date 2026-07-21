# Grade 8 — open issues

**Raised 21 Jul 2026** from the Grade 7 session (scrutiny item **S6** in `../Grade 7/HANDOFF.md`),
which had never been done for this app. Findings only — nothing here has been acted on except where
it says *done*. Detail for the coverage half is in [STANDARDS_COVERAGE_MATRIX.md](STANDARDS_COVERAGE_MATRIX.md).

Ordered by *what could mislead a student*, then *what is missing*, then *what could regress*.

---

## P1 · Truth — an exam claim with nothing behind it

- [ ] **`MISA ·` labels are unbacked.** Ten items in `Matter_and_Its_Interactions.html` are titled
      `MISA ·` (Maryland Integrated Science Assessment) — an assertion to the student that they are
      sitting a real released item. There is **no provenance manifest in this repo and no guard**.
      This is precisely the failure `../Grade 7/MCAP_PROVENANCE.md` was created to prevent, in a
      different programme's name.
      **Do:** port `MCAP_PROVENANCE.md` + `tests/mcap_provenance.test.js` from Grade 7, then check all
      ten against the actual MISA releases. Any that are not real released items get relabelled
      `Exam-style ·` — *never* the reverse.

- [ ] **Both maths modules claim their exam items are real MCAP.** The page description reads
      *"Aligned to MCCRS 8.NS.A.1–8.NS.A.2 and MCAP. **Real MCAP practice items are marked Exam.**"*
      (and the same for 8.EE). That is **20 exam items** carrying an exam-authority claim.
      **This may well be true — the point is that nothing records it and nothing checks it.**
      **Do:** verify each against a real release and record it, or reword the description. Note Grade 7
      shipped 19 falsely-labelled MCAP capstones on 20 Jul 2026 for exactly this reason: the title
      convention was copied from the genuinely sourced item next door.

- [ ] **No `exam_coverage` pressure valve.** Grade 7's manifest documents that a guard rewarding
      *having* a capstone creates pressure to manufacture one. Grade 8 runs `exam_coverage.test.js`
      with no provenance guard beside it — the same pressure, none of the counterweight.

## P2 · Coverage — 3 of 5 maths domains do not exist

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

## P3 · The MCCRS 2026-27 handoff lands nowhere

- [ ] Maryland's 2025 crosswalk moves **three Grade 7 clusters into Math 8**, printing *"Not
      applicable — In Math 8"*: `7.G.A.2` (construct triangles), `7.G.B.5` (angle relationships →
      equations), `7.SP.C.8` (compound events). **All three land in 8.G / 8.SP, neither of which is
      built.**
      This is why Grade 7 **kept** those eleven items (`../Grade 7/HANDOFF.md` **D10**). If Grade 7
      ever drops them to match Maryland's boundary before 8.G and 8.SP exist, a student crossing the
      two apps meets that material **nowhere at all**. Revisit only once 8.G and 8.SP ship.

## P4 · Guards this app does not have

Grade 7 runs 13; Grade 8 runs 10 (2 of which arrived on 21 Jul). Missing, in rough value order:

- [ ] `mcap_provenance.test.js` — see P1. **Highest value of the four.**
- [ ] `module_smoke.test.js` — catches a module that loads but does not work.
- [ ] `plot_format.test.js` — only needed once Grade 8 uses the click-to-plot input (8.F and 8.SP will
      want it; `a11y.test.js` already guards its keyboard affordances *if* it appears).
- [ ] `starter_kit.test.js` — only if Grade 8 ever carries its own kit; it does not today.
- [ ] `backend_contract.test.js` — Grade 7's version asserts the shared `.gs` is reachable and
      hub-namespaced. Grade 8 **owns** that file, so its version should assert the inverse: that the
      file is present here and that `homework_backend.test.js` still drives it.

## P5 · Housekeeping

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
