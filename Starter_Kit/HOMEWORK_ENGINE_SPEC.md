# Homework engine — specification

**Status: SPEC (not yet built). Agree this before writing code.**

A homework engine that lives *inside* the hub — not beside it. It delivers per-student, per-subject
sets on a daily schedule, records what was actually done, and lands it in the Sheet in a form a
tutor can read.

This file is part of the **Starter Kit**, so every hub built from the kit inherits one engine. Do not
fork it per grade — the two R&W apps are already kept in sync by hand, and the two `Hub_Template`
copies have already drifted. One engine, re-propagated deliberately.

---

## 1. The two rules that shape everything

**Rule 1 — isolation is enforced by the backend, never by the UI.**
The hub is a public static site and the `/exec` URL is readable by anyone who views source. Hiding
another student's homework in the client is decoration, not privacy. A student may read **only their
own** assignment and results, and that is enforced by the existing auth: a student pull carries their
name + PIN and returns only their record; the teacher pull carries the teacher key and returns
everyone.

**Rule 2 — separate the *content* from the *assignment*.**

| Layer | Lives in | Visibility | Why |
|---|---|---|---|
| **Bank** — the questions themselves | the repo (public) | public, impersonal | reviewable, versioned, testable |
| **Plan** — who does which items, on which day | tutor-side file → published to the Sheet | private, per student | isolation; keeps names out of public code |
| **State** — opened / completed / scores | the Sheet (synced) | private, per student | it is an assessment (root rule 6) |

Because the plan holds only **ids and scheduling**, publishing it is cheap, and no student can tell
what another was assigned even though the bank is public.

---

## 2. The item model

A set is a list of **item references**, not a list of questions. An item is one of:

```js
// 1. Module reference — send the student to an existing question inside a module
{ ref:'module', topic:'expressions-equations', qid:'2-3' }

// 2. Bank item — a question authored for homework
{ ref:'bank', id:'sn-neg-exp-01' }
```

A set may freely **mix both**. Which to use is a teaching decision per set, not an engine constraint.

**Module references need no separate recording.** Modules already store per-question completion
(`tree: { "<qid>": { steps: {...} } }`) and sync it. The engine marks a referenced item done by
*reading what the module already recorded* — one source of truth, no double-counting, and it feeds
the existing per-concept struggle data. **Prefer a module reference wherever the question already
exists.**

**Required module change:** modules currently accept only `?review=<skill>`. They must also accept
`?q=<qid>` to land on an exact question. This goes into `Module_Template.html` **and** every live
module.

---

## 3. Plan schema

One plan per **student × subject**, so subjects are delivered separately and cleanly.

**Homework is not assumed to be daily.** A plan is a list of **sets**, and each set carries its own
optional release date. A single set, a set a day, or an irregular run are all the same shape — the
engine has no daily counter baked into it.

```js
{
  hub: 'grade8',              // must match the hub's SYNC_HUB_ID
  student: '<roster name>',   // resolved against the roster
  subject: 'math',            // must match a SUBJECTS id in the hub
  sets: [
    {
      id: 'sn-1',             // stable id — state is keyed on it
      label: 'Set 1',
      releaseOn: '2026-07-20', // OMIT => available immediately
      timed: false,           // untimed before timed — see §6
      review: 2,              // due-review items added on top (0 to freeze)
      items: [
        { ref:'module', topic:'expressions-equations', qid:'2-3' },
        { ref:'bank',   id:'sn-neg-exp-01' }
      ]
    }
  ]
}
```

- **One single set** → one entry, `releaseOn` omitted. Nothing daily about it.
- **A daily run** → several entries on consecutive dates. An authoring helper expands a date
  sequence so you never hand-type one, but what is *published* is always explicit per-set dates.
- **An irregular run** → any dates you like, gaps included.

Sets whose `releaseOn` is in the future are shown but locked.

**Never lock a student out of catching up.** A released set that was missed stays open forever. The
students this exists for are the ones who fall behind; adding friction there defeats the purpose.

**Multi-subject.** Math, Science and ELA plans coexist as separate records and render as separate
cards. Sets in different subjects may release on the same date.

---

## 4. Storage

### SyncStore (upserted state — no backend change needed)

The existing `op:'put'` path already keys on `hub|kind|name|sub` for any `kind`, so these work as-is:

| Key | Holds |
|---|---|
| `<hub>\|hwplan\|<student>\|<subject>` | the published plan |
| `<hub>\|hwstate\|<student>\|<subject>` | progress: per day, per item — done, score, timestamps |

**`hwplan` must be teacher-only to write.** The backend currently restricts only `kind==='review'`.
`hwplan` must be added to that restriction, or a student could rewrite their own homework.

### `Homework` tab (append-only history — backend change required)

A human-scannable feed, one row per completed set:

```
when | hub | student | subject | day | set | correct | total | seconds | raw
```

- **`raw` is load-bearing.** It carries the full posted JSON, so new fields can be read later
  *without redeploying the script*. This is the lesson from the existing tutor sheet.
- **Guard the header with a test.** A column-map drift has already silently blanked a dashboard once;
  it looks identical to "no data."

---

## 5. Apps Script changes (and the redeploy trap)

1. Add `SHEET_HW = 'Homework'`; create it in `setup()` with the header above.
2. `doPost`: route a homework-completion post to the `Homework` tab.
3. `doPost`: add `hwplan` to the **teacher-only** kinds.
4. `doGet` pull: include `hwplan` and `hwstate` in the returned doc, scoped exactly as topics are —
   teacher key → everyone, name + PIN → self only, neither → empty.

> **Redeploy as a NEW VERSION on the SAME URL** (Deploy ▸ Manage deployments ▸ Edit ▸ New version).
> "New deployment" mints a different URL and breaks the baked `SHEET_URL_SEED` in every hub.

---

## 6. What the engine enforces (so it cannot rot)

These are house pedagogy, not preferences. The engine enforces them; tests guard them.

- **Attempt before answer.** The answer is never rendered before the student commits.
- **Untimed before timed.** A day may only be `timed` for a skill the student has already met
  untimed. New skill → untimed, always.
- **A "mixed" day must declare exact counts per skill.** Without this a mixed pool silently collapses
  to one skill and still looks correct in the file. This is the single most common failure.
- **Due reviews return automatically** on top of the day's own items (`review: n`, default 2).
- **A redo never overwrites the first attempt.** It records "put right on the redo."
- **Short sets that get finished beat long sets that get abandoned.**
- **Referenced items must resolve.** A plan naming a `topic`/`qid` or bank `id` that does not exist
  fails validation rather than silently rendering an empty set.
- **Ownership guard.** A hub never renders or publishes a plan for a subject or topic it does not
  own — the same guard that stops cross-grade record bleed.

## 7. It must announce its own failure

Every write is `no-cors` and can never report an error. A homework engine that silently fails to
reach a student, or silently loses their answers, recreates the exact bug this system already had.

- It inherits the existing **sync-health warning**: a student with local work and no cloud record is
  told so, on their own screen.
- A student whose plan has not arrived sees "no homework yet" **distinguished from** "could not
  reach the cloud." Those must never look the same.

## 8. Authoring workflow

1. **Bank items** are authored in the repo (public, impersonal, versioned).
2. **Plans** are authored tutor-side in a file that is **gitignored and never committed** — this is
   what keeps student names out of a public repo.
3. A **"Publish homework"** action in the teacher dashboard reads the plan and pushes one `hwplan`
   record per student, authenticated with the teacher key.
4. Validation runs before publishing. A plan that fails §6 is rejected, not published.

## 9. Never

- Never put a student's name, or anything *about* a student, into the repo or into anything the
  student can read. Assignment text renders on their screen; tutor notes belong elsewhere.
- Never bake plans into the deployed HTML — that is the isolation failure this design exists to
  prevent.
- Never let "delivered" or "completed" appear when the write did not land.
- Never fork this engine per grade.
