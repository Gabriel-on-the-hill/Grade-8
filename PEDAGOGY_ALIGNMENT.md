# Pedagogy Alignment — Grade 8 Math Hub

> **The backlog that carries this hub to 100% handbook alignment.** Implementation-ready. Ranked by
> learning impact per unit of effort.

**Read first:** [AGENTS.md](AGENTS.md) + [PROJECT_STANDARD.md](PROJECT_STANDARD.md) (this hub's source
of truth and mechanics) · root [AGENTS.md](../AGENTS.md) (the house rules — *whether*) ·
[Pedagogical-Design-Handbook.md](../Pedagogical-Design-Handbook.md) (the *why*, by ID). The full
evaluation is the "app-pedagogy-eval" artifact.

> **This hub is stamped from Grade 7 and shares its engine and `g7.` data contract.** The
> shared-engine work below — chiefly the spaced-review layer — **is implemented in
> `../Grade 7`, and Grade 8 inherits it.** Do the engine work there, then **confirm it here** (the
> built modules and hub are Grade-8 copies, so a re-stamp or a parallel edit is needed to pick up a
> template change). This file tracks the same backlog so it is visible when working in Grade 8.

---

## Where this hub stands (15 Jul 2026)

Same engine, same standard, same verdict as Grade 7: the best lesson *structure* of the three
families, missing the retention layer entirely.

| Category | Status | |
|---|---|---|
| Cognitive load | ● solid | Learn→Guided→Practice→Apply→Exam; strategy-only hints |
| **Memory & retention** | ◐ **partial** | **phase-1 spaced review shipped in the Grade 8 hub ("Due for review" ladder); streak still inferred not stored; Grade 7 port pending** |
| Mastery & sequencing | ● solid | no advanced concept before its prerequisite |
| Assessment & feedback | ● solid | active check-and-feedback; hints never give the answer |
| Motivation & UX | ◐ partial | honest mastery bars; anti-cheat; no gamification |
| Adaptive & analytics | ◐ partial | per-topic tracking; no adaptive dose or calibration |

---

## The backlog is Grade 7's — do it there, confirm here

The three build items are shared-engine work and live in
[`../Grade 7/PEDAGOGY_ALIGNMENT.md`](../Grade%207/PEDAGOGY_ALIGNMENT.md). In priority order:

1. **Prerequisite: make the tests runnable. — ✅ done (15 Jul 2026).** `node tests/behavioral_test_suite.js`
   (or `npm test`) now runs **91 passed, 0 failed, exit 0**. The failure was a missing `jsdom` require,
   not a shim gap: unlike Michael SAT's pure-logic module tests, this suite loads the real HTML and runs
   the embedded engine via `runScripts:'dangerously'`, so it genuinely needs a DOM. Fixed by pinning
   `jsdom` as a dev-only dependency (`package.json`; `node_modules/` already gitignored) rather than by
   copying the localStorage-shim bootstrap, which does not fit a DOM-driven suite.
2. **Spaced review — `MR-1`. Phase-1 ✅ shipped in the Grade 8 hub (15 Jul 2026); Grade 7 port pending.**
   A mastered topic was never brought back; `lastPracticed` was recorded and unused. Now
   `Grade_8_Math_Hub.html` renders a **"Due for review"** surface in `renderApp()`: a read-only ladder
   `due = lastPracticed + rung(streak)`, rungs `1 → 3 → 7 → 21 → 42` days, most-overdue first, never
   listing an unstarted topic, and separate from the mastery bar (which stays monotonic). The streak is
   **inferred** from existing stats (accuracy earns a longer rung, capped by evidence, pulled back a
   rung by a currently-shaky skill) — **phase-2** is a real stored consecutive-success streak written by
   the module engine (that one touches the `g7.` contract; raise before building). Exposed for tests as
   `window.__hubReview`; guarded by 16 new assertions in `tests/behavioral_test_suite.js`.
   **Not yet done:** this was built in Grade 8 first (per the delegated call), so the **canonical Grade 7
   hub still lacks it** — port the same surface there ("change both, check both"). Note the drift found
   while porting: **Grade 7's hub is behind Grade 8's engine** (no `__hubSync`/v1.5 cloud-sync layer) and
   its test harness has the same jsdom gap — both need handling as part of the Grade 7 port.
3. **~85% difficulty calibration — `AS-4`.** Bias Practice selection toward the sweet spot per
   student, within the author's difficulty range.
4. **Durable-learning readout — `AN-4`.** Retention = accuracy on due-review attempts, shown against
   acquisition accuracy on the teacher dashboard.

**Guardrails specific to Grade 8:** the `g7.` prefix is shared back-compat — do not rename it here.
This repo is **public and publishes markdown**, and it has **no student folder gitignored yet**
(Grade 7 ignores `Fareedah/`); the moment a student folder or `LEDGER.md` is added, it must be
gitignored *before* the first commit (root rule 6).

---

## The bar for anything new (future-proofing)

Identical to Grade 7 — every new unit or feature must clear it:

- [ ] **Active loop** (Learn→Guided→Practice→Apply→Exam, real attempt + immediate feedback).
- [ ] **Enrolled in spacing** — records `lastPracticed`/`skillStats`, appears in due-for-review.
- [ ] **Prerequisite-gated**; representation before operations.
- [ ] **Strategy-only hints** — never the final answer behind a hint.
- [ ] **Un-telegraphed MCAP exam capstones**, on top of the curriculum, never instead of it.
- [ ] **Student data gitignored before commit**, tutor-facing `LEDGER.md` only (root rule 6).
- [ ] **A test guards it** — keep the suite green.

## Definition of 100% aligned

The Grade 7 engine items shipped and **verified as inherited here** (spaced review surfacing Grade 8
topics; tests green), calibration and the retention readout landed. At that point Memory & retention
moves ○ → ● for both hubs together.
