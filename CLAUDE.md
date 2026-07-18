# CLAUDE.md

See [AGENTS.md](AGENTS.md), and read [PROJECT_STANDARD.md](PROJECT_STANDARD.md) +
`Module_Template.html` before building anything. The standard is the source of truth for this hub;
AGENTS.md connects it to the house pedagogy.

The short version:

- **`PROJECT_STANDARD.md` first.** Units, the shared data contract, module anatomy, and the hint
  rules all live there. Don't restate or fork it.
- **Hints are strategy-only.** A worked solution behind a Hint button is an answer key — it lowers
  the bar and silently corrupts mastery tracking. Never add one.
- **No advanced concept before its prerequisite.** The standard's rule; it is mastery gating.
- **Spaced review is shipped — keep it working.** The old gap (mastery tracked, topics never brought
  back) is closed: the hub surfaces "Due for review" on a `1 → 3 → 7 → 21 → 42` day ladder, the engine
  writes real per-topic *and* per-skill streaks, and `?review=<skill>` opens a module straight into a
  retrieval set of its own authored items. **A due revisit must never pre-fill its answers** — that is
  what review mode exists to prevent, and it is the one regression to watch for. Engine work happens in
  Grade 7 and is inherited here.
- **Public repo, publishes `.md`.** Any per-student data must be gitignored before commit (see how
  Grade 7 handles `<student>/`).

House pedagogy is in the root [AGENTS.md](../AGENTS.md).
