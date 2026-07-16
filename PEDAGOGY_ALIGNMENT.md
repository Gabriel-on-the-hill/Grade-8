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
| **Memory & retention** | ● **solid** | **spaced review shipped in both hubs — "Due for review" ladder + engine-written consecutive-session streak (phase-1 + phase-2)** |
| Mastery & sequencing | ● solid | no advanced concept before its prerequisite |
| Assessment & feedback | ● solid | active check-and-feedback; hints never give the answer |
| Motivation & UX | ◐ partial | honest mastery bars; anti-cheat; no gamification |
| Adaptive & analytics | ◐ partial | per-topic tracking + acquisition-vs-retention readout (`AN-4` ✅) + per-skill ~85% calibration band (`AS-4` diagnostic ✅); auto difficulty-selection still needs difficulty-tagged item pools |

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
2. **Spaced review — `MR-1`. ✅ shipped in full (phase-1 + phase-2) in both grades (16 Jul 2026).**
   A mastered topic was never brought back; `lastPracticed` was recorded and unused. Now:
   - **Phase-1 (hub surface).** `Grade_8_Math_Hub.html` renders a **"Due for review"** surface in
     `renderApp()`: ladder `due = lastPracticed + rung(streak)`, rungs `1 → 3 → 7 → 21 → 42` days,
     most-overdue first, never listing an unstarted topic, separate from the (monotonic) mastery bar.
   - **Phase-2 (engine-written streak).** The module engine now records a real **consecutive-session
     streak** on each topic record: a *review session* = one module visit; a visit with ≥3
     first-attempt items advances the streak one rung (≥80% first-attempt) or resets it to 0, **at most
     once per calendar day** (the day-guard stops two back-to-back sessions from skipping the ladder).
     Two additive fields — `reviewStreak`, `reviewDay` — carried inside the topic record, so they ride
     the existing `lastPracticed`-LWW sync with **no protocol change**; when `reviewStreak` is absent
     the hub falls back to the phase-1 inferred proxy (zero-regression migration). Engine hook is
     `g7review()` in every module (`__modReview` for tests); the hub prefers the stored value in
     `reviewStreak()`.
   - **Both grades.** Built in Grade 8 and ported to Grade 7 ("change both, check both"): 4 G8 engine
     files + 3 G7 engine files + both hubs + both suites. Guarded by 26 review assertions in G8
     (**131 passed**) and 26 in G7 (**95 passed**). Note the drift confirmed while porting: **Grade 7's
     hub/modules are behind Grade 8's engine** (no `__hubSync`/v1.5 cloud-sync layer), so the G7 module
     block omits `schedulePush`; the spaced-review layer itself is now at parity.
   - **Phase-3 (open, optional):** per-*skill* streaks and an in-module `?review=<skill>` retrieval mode.
3. **~85% difficulty calibration — `AS-4`. ◑ diagnostic shipped (16 Jul 2026); auto-selection blocked on content.**
   *Finding:* the modules have **no difficulty metadata and no draw-from-pool Practice** — each is a
   fixed run of unique qcards shown top-to-bottom, ~1 Practice item per skill. So literal "bias item
   selection within the author's difficulty range" **cannot be built without content authoring**
   (tagging item difficulty + adding several varied-difficulty items per skill) — an author decision,
   not something to fabricate. *Shipped instead:* a per-skill **calibration band** on the teacher
   dashboard from stored first-attempt accuracy — **>90% "too easy → advance", <70% "too hard →
   re-teach", else "on target (~85%)"** (min 4 attempts) — the actionable lever for the teacher to
   raise/lower difficulty by hand. Hub-only, no engine/contract change; 4 assertions each grade.
   **Still open (needs content):** difficulty-tagged item pools + an engine that auto-serves toward the
   sweet spot. Raise with the author before building.
4. **Durable-learning readout — `AN-4`. ✅ shipped in both grades (16 Jul 2026).** The engine buckets
   every **first-attempt** by whether the topic was **due for review when the session started**
   (`_revWasDue`, snapshotted at load): due → **retention**, not-due → **acquisition** (four additive
   fields `acqFirst/acqCorrect/retFirst/retCorrect`, ride the topic-record sync). The teacher dashboard
   shows a **"Retrieval — first-time X% (a/b) · on review Y% (c/d)"** line per topic, with retention
   flagged red when it falls >15 pts below acquisition — the "forgot vs never learned" signal parents'
   reports assert. Read-only to students (teacher-gated). 8 assertions each grade (**139 / 103 pass**).

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
