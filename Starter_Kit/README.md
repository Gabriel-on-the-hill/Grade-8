# Hub Starter Kit — portable, grade/subject-agnostic

This kit lets you reproduce the study-hub system for **any grade or subject** at full quality. Everything here is reusable as-is; only content and a thin config layer change per grade.

## What's inside
- **`Module_Template.html`** — the engine: all five item formats (fill-in with equivalent-fraction checking, single MC, multi-select, two-part, constructed-response), step-locking, per-student tracking, exam-readiness, and a live format showcase. Grade-agnostic.
- **`Hub_Template.html`** — the home hub: sign-in by name, roster, passcode-gated teacher dashboard (mastery, exam-readiness, section progress, concept-level struggles, constructed-response review), homework (auto-suggested + teacher-set), data backup, optional Google Sheet logging. **Multi-subject:** edit the `SUBJECTS` array (`subjects -> units -> topics`) + title per deployment. One sign-in, one roster, one teacher dashboard across every subject.
- **`PROJECT_STANDARD_TEMPLATE.md`** — the methodology/pedagogy/flow/contract/build-discipline. Fill the `[BRACKETED]` blanks, rename to `PROJECT_STANDARD.md`.
- **`NEW_GRADE_SETUP.md`** — step-by-step instantiation checklist.
- **`HUB_Google_Sheet_Setup.md`** — deploy the cloud activity logger (optional).

## Quick start
1. New project + folder → copy this kit in.
2. Drop the grade's textbooks + exam materials in the folder.
3. Fill `PROJECT_STANDARD_TEMPLATE.md` blanks; rename to `PROJECT_STANDARD.md`.
4. Edit the hub `SUBJECTS` array (subjects -> units -> topics) + title.
5. Build units from `Module_Template.html` (consult textbooks, best-of, verify).

In a chat, this one line is enough: **"Set up a [GRADE] [SUBJECT] hub from the Starter Kit — follow PROJECT_STANDARD.md."**

## Engine version
**Engine v1.2** (multi-subject hub: `SUBJECTS -> units -> topics`, subject switcher, per-subject stats/homework/dashboard, `STORE_PREFIX`, subject-prefixed topic ids). Improve in one place; re-propagate to deployments deliberately (no auto-sync across projects).
