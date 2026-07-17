# Working on the Grade 8 Math Hub

A multi-student Grade 8 Mathematics study-and-practice hub (MCAP-aligned): sign in by name, climb a
guided lesson, teacher sees mastery per concept. No build step — open the HTML, edit, reload.

**Read [PROJECT_STANDARD.md](PROJECT_STANDARD.md) and `Module_Template.html` first.** That standard is
the source of truth for how this hub is built — units, the shared data contract, the module anatomy,
the hint rules. Do not restate it here; this file only connects it to two things it does not mention.

## This hub already follows the house pedagogy — keep it that way

The house rules for **how we teach** are in the root [AGENTS.md](../AGENTS.md), and they apply here.
`PROJECT_STANDARD.md` already encodes most of them, arrived at independently:

- *"Flow builds up. No advanced concept before its prerequisite"* — that is mastery gating (root
  rule 2; `M5`/`CD-2`).
- *"A worked solution behind a Hint button is an answer key, and it silently invalidates mastery
  tracking"* — that is **never lower the bar** (root rule 2; `FS-2`) *and* the reason why: a
  give-away hint corrupts the one measurement that tells you if the student learned anything (`M1`).
  This is a sharp insight. Do not let anyone "helpfully" add worked solutions behind hints.
- *"Low stress, high rigor"* — warmth is the tone, not a lowered standard (root rule 5).

When you work here, hold those. If a change would soften a standard to make a lesson feel easier,
that is the one move the whole system exists to prevent.

## The gap this hub has closed: spacing

This hub used to track mastery per topic (`attempts`, `correct`, `skillStats`, `struggles`,
`lastPracticed`) and then **never bring a topic back** — the bar went green and the topic was quietly
forgotten (root rule 3; `MR-1`, the single largest effect in the learning literature). That is now
closed, in three parts, **built in Grade 7 (the parent engine) and inherited here**:

1. **The hub surfaces "Due for review"** on a `1 → 3 → 7 → 21 → 42` day ladder over `lastPracticed`,
   most-overdue first, never listing an unstarted topic, and always separate from the (monotonic)
   mastery bar.
2. **The engine writes real streaks** — per topic (`reviewStreak`/`reviewDay`) and per skill
   (`skillStats[k].streak`/`.day`/`.last`) — advancing one rung per clean session, at most one rung
   per calendar day, resetting on a miss.
3. **`?review=<skill>` is a retrieval, not a re-read.** This is the load-bearing part. `restoreProgress()`
   re-fills a completed item with its own correct answer, so a plain revisit of a due topic *hands back
   the answer key*. Review mode takes the due skill's already-authored Target/Exam items, clears them for
   a genuine attempt, and hides the rest of the lesson. It never writes to the stored tree, so the mastery
   bar cannot move backwards, and the attempt lands in the `AN-4` retention bucket.

**If you touch this, keep the invariant: a due revisit must never show its own answers.** The suites in
both grades assert it. The engine work belongs in Grade 7 — **change both, check both.**

## Sister app & the shared engine

Grade 7 (`../Grade 7`) is the parent this was stamped from — same engine, same `g7.` storage prefix,
same `Module_Template.html`. A fix to the engine here is **not** a fix there. If you change shared
engine behaviour, change both and check both.

## The repo is PUBLIC, and it publishes `.md` files

The `.gitignore` blocks PDFs, textbooks, and `Curriculum/` — but it **publishes markdown**. So the
moment a per-student folder or note is added here, it must be gitignored *before* it is committed, or
it goes to the public internet attached to a named minor (root rule 6). Grade 7 already does this for
`Fareedah/`. Follow that pattern: private student data is ignored, and a `LEDGER.md` (tutor-facing,
never student-readable) is where per-student state lives. Ask the `pedagogy` skill to set one up.
