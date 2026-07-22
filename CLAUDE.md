# CLAUDE.md

See [AGENTS.md](AGENTS.md), and read [PROJECT_STANDARD.md](PROJECT_STANDARD.md) +
[Starter_Kit/Module_Template.html](Starter_Kit/Module_Template.html) before building anything. The
standard is the source of truth for this hub; AGENTS.md connects it to the house pedagogy.
*(Template path corrected 21 Jul 2026 — it has never been at the repo root.)*

The short version:

- **`PROJECT_STANDARD.md` first.** Units, the shared data contract, module anatomy, and the hint
  rules all live there. Don't restate or fork it.
- **Hints are strategy-only.** A worked solution behind a Hint button is an answer key — it lowers
  the bar and silently corrupts mastery tracking. Never add one.
- **No advanced concept before its prerequisite.** The standard's rule; it is mastery gating.
- **Build to MCCRS 2025, not the 2010 codes the modules cite.** Maryland re-cut Grade 8 effective
  **SY 2026-27**. Four of the nine old 8.G standards have gone up to Integrated Algebra and volume
  has gone down to Math 7 — *don't build them*; three standards are new, two of them with no 2010
  predecessor at all, so no 2010-coded audit can see them. The map is
  [MCCRS_2025_DUAL_CODING.md](MCCRS_2025_DUAL_CODING.md); **read it before any new unit.** It governs
  what to *teach* only — the MCAP blueprint we hold is Sept 2022 and 2010-coded, so it never licenses
  restating a released item's alignment.
- **Pick the item format from the standard's verb.** *Construct / graph / sketch / represent on a
  number line* is not met by choosing the right picture. The click-to-plot 6th format exists in the
  template for exactly this and is currently used by nothing.
- **Spaced review is shipped — keep it working.** The old gap (mastery tracked, topics never brought
  back) is closed: the hub surfaces "Due for review" on a `1 → 3 → 7 → 21 → 42` day ladder, the engine
  writes real per-topic *and* per-skill streaks, and `?review=<skill>` opens a module straight into a
  retrieval set of its own authored items. **A due revisit must never pre-fill its answers** — that is
  what review mode exists to prevent, and it is the one regression to watch for. Engine work happens in
  Grade 7 and is inherited here.
- **Public repo, publishes `.md`.** Any per-student data must be gitignored before commit (see how
  Grade 7 handles `<student>/`).

- **Science is a union, and the sequencing is half the point.** The Grade 8 MISA is **~1/3 Earth &
  Space, ~1/3 Life, ~1/3 Physical**, drawn from **all of Grades 6-8** — but the Grade 8 *course* is
  Physical Science. §2.2 is *curriculum ∪ exam, never a trade-off*, so the answer is both, at
  **different depths**: PS is taught this year and needs full units; LS and the rest of ESS were
  learned in Grades 6-7 and need **retrieval** units — leaner, built on the released packets, wired
  into the review ladder. **Start them early and space them.** MISA is at the *end* of Grade 8, and
  a topic learned two years ago and revisited only in a final cram is the exact failure the review
  ladder exists to prevent. Plan in `TODO.md` P5.6; packet map in `STANDARDS_COVERAGE_MATRIX.md`.
- **A lifted exam item must bring its stimulus.** If the released item shows a model, diagram or
  graph, rebuild it — dropping it turns a model-interpretation item into a recall item and quietly
  lowers the bar. The manifest's `Stimulus` column and `tests/mcap_provenance.test.js` enforce this.

House pedagogy is in the root [AGENTS.md](../AGENTS.md).
