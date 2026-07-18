# Starter Kit — parity gap with the live engine

**Status: findings only. Not yet fixed.** Written 18 Jul 2026.

The Starter Kit is meant to be the canonical engine — "improve it in one place and re-propagate
deliberately" (`PROJECT_STANDARD.md` §8). **Today the opposite is true: the Starter Kit is the most
out-of-date copy of the engine in either grade.**

Nothing is broken for students right now — both live hubs and all live modules are current. The risk
is entirely forward-looking: **a hub or module stamped from this kit today would be born missing
features that shipped months ago.**

Verify at any time:

```
grep -c resolveName   Hub_Template.html      # 0 today
grep -c g7reviewMode  Module_Template.html   # 0 today
```

---

## `Hub_Template.html` — behind by a whole release

| Capability | Live hubs | Template |
|---|---|---|
| Typed-name sign-in (`resolveName`, roster-validated, list never shown) | ✅ | ❌ **absent** |
| Teacher sync key (`syncKey`, Settings field, `key-status`) — the v1.5 cloud dashboard | ✅ | ❌ **absent** |
| Homework view (`renderHomeworkSets`, release/catch-up, module links) | ✅ | ❌ absent |
| Publish plans (`hwValidatePlans`, file picker, confirm-by-readback) | ✅ | ❌ absent |
| Cross-grade bleed guard (`topicMeta` check on re-push) | ✅ | ✅ ported |
| Sync-health warning | ✅ | ✅ ported |

**This is not a one-feature gap.** Publishing homework depends on `resolveName` (to validate a student
against the roster) and on `syncKey` (the teacher key authorises the write). Both are missing, so
porting the homework engine here means **first porting the v1.5 sync-key layer and the typed-name
sign-in**. That is a re-propagation pass, not a patch.

## `Module_Template.html` — missing the whole retrieval layer

| Capability | Live modules | Template |
|---|---|---|
| Spaced review mode (`?review=<skill>`) | ✅ | ❌ **absent** |
| Homework deep-link (`?q=<qid>`) | ✅ | ❌ absent (depends on review's reset) |
| `rev-panel` / `rev-sub` / `rev-done` styles | ✅ | ❌ absent |

The dependencies it *does* already have: `g7level`, `setStepDisabled`, `G7_SKILL_LABELS`,
`restoreProgress`. So the port is self-contained — roughly `g7capture`, `g7hubHref`, `g7revParam`,
`g7revSet`, `g7revReset`, `g7reviewMode`, then the homework block, plus the panel CSS.

**Why it matters:** review mode exists because `restoreProgress()` re-fills a completed item with its
own correct answer — so a student sent back to revise would *re-read an answer key* instead of
retrieving. A module stamped from this template would have that bug and no homework support.

> Note: `Grade 7/Module_Template.html` **is** current (it has review, and homework was added
> 18 Jul 2026) — but it is grade-7-specific (`G7_SYNC_HUB='grade7'`), so it cannot simply be copied
> here. Use it as the reference for what the generic version should contain.

---

## Suggested order

1. **`Module_Template.html`** first — self-contained, all dependencies present, and it is what a new
   *unit* is stamped from (more frequent than a new hub).
2. **`Hub_Template.html`** second, in two steps: (a) typed-name sign-in + sync key (the v1.5 layer),
   then (b) the homework view and publish action on top.
3. Re-run both grades' suites afterwards; then record the engine version in `PROJECT_STANDARD.md` §8
   so the next drift is visible.

## The wider lesson

The drift went unnoticed because nothing tests the templates — the suites check the live hubs and
modules only. A cheap guard would be a test asserting the template contains the same capability
markers as the live files, so the kit can never silently fall a release behind again.
