# Source acquisition — 21 Jul 2026

**Why.** The Science module was audited on 21 Jul and found substantively complete against NGSS
MS-PS1, but **not dual-coded**: no science crosswalk was in `Curriculum/`, so whether Maryland had
re-cut science for SY 2026-27 the way it re-cut mathematics was unknown. Gabriel asked for the
missing documents to be fetched, and for anything unobtainable to be named so he can get it.

Two of the four things found were not what was being looked for, and both matter more than the thing
that was.

---

## Acquired

| Document | Where it now lives | Why it matters |
|---|---|---|
| **MCAP Science Blueprint, Grade 8 — October 2024** | `Curriculum/MCAP-Science-Blueprint-Grade-8-2024-A.pdf` | **The headline finding — see below.** Also *newer* than the maths blueprint we hold (Sept 2022). |
| **Grade 8 Mathematics Evidence Statements** (33 pp) | `Curriculum/Grade_8_Evidence_Statements-A.pdf` | The per-standard document the maths blueprint **references but we never held**. Covers all 28 Grade 8 standards. Defines what an item must *elicit* — the sharpest available guide for authoring exam-grade items. |
| **`Math 8 Expressions and Equations` released module** | `MCAP MATHS/…Expressions and Equations… .html` | **The 8th of 8.** We held seven. See the provenance consequence below. |
| Grade 5 science blueprint; Life Science MISA standards | `Curriculum/` | Reference only — neither is Grade 8. |

`MCAP SCIENCE/` was checked against MSDE's own count and is **complete: 10 of 10** released MISA
modules. Nine of the ten have never been used.

---

## Finding 1 — the Grade 8 science exam is not the Grade 8 science course

Read off the rendered blueprint, not the extraction:

> *"The grade 8 MISA uses **all the Middle School Performance Expectations (grades 6 through 8)** from
> the Maryland Next Generation Science Standards."*

| Domain | Percent of blueprint |
|---|---|
| Earth and Space Science | 30–35% |
| Life Science | 30–35% |
| Physical Science | 30–35% |

**The hub's Science subject is built on the MCPS *Investigations in Physical Science* course** — four
units, all Physical Science plus a space unit. That is correct for the *curriculum*. But the exam a
Maryland Grade 8 student actually sits is **roughly one third Life Science and one third Earth &
Space**, drawn from the whole 6–8 band — material taught in Grades 6 and 7.

So the built Matter unit covers part of one third. **Life Science has no unit planned at all**, and
Earth & Space only via the space topic. `PROJECT_STANDARD.md` §2.2 requires **curriculum ∪ exam,
never a trade-off**; the Science plan currently satisfies only the curriculum half.

This also explains the ten released packets: they span ESS, LS and PS **because the exam does**.

The blueprint enumerates every assessable performance expectation by domain and practice — 55 in all
(ESS 15, LS 21, PS 19) — and splits the paper by **Science and Engineering Practice**, not just
content: Sensemaking 50–67%, Investigating 17–33%, Critiquing 17–33%. Any future science unit should
be built against that practice split, which the current module has never been checked against.

**Not a defect in the Matter module** — it is on-curriculum, on-grade and complete for MS-PS1. It is
a **scope decision about the Science subject** that should be taken deliberately rather than by
default, and it is now evidenced.

## Finding 2 — the P1 provenance audit ran against 7 of 8 packets

MSDE publishes **eight** released Math 8 modules. The folder held **seven**. The missing one was
**Expressions & Equations** — the highest-weight domain on the blueprint at 10 of 23 content items.

The three verified E&E rows are safe (`1-5`, `2-4`, `4-4` cite the 2024 release, and those same items
appear in the new packet too). **The demotion of `6-3` is not.** Its recorded reason is *"Every
released 8.EE.C.8 item was checked — Q11, Q15, Q17, Q27, Q28, Q34"*, and that list cannot have
included this packet's own two-part 8.EE.C.8 drop-down item about the graph of a system. The
conclusion may survive; the reasoning does not. Full note in `MCAP_PROVENANCE.md`.

**The lesson is the one that file already teaches, turned on itself:** a negative claim needs its
search space proved complete. *"Every released item was checked"* was true of every packet **we
had** — and nobody had checked we had them all. The count was on MSDE's own collection page.

**Newly available and unused:** a real `8.EE.B.6` **similar-triangles-on-the-coordinate-plane** item
(triangles *PRT* and *QRS*) — directly relevant to the `8.AT.A.2` derivation built the same day —
plus `8.EE.A.2` (`x² = 49/16`) and a two-part `8.EE.B.5`.

## Finding 3 — there is no science crosswalk, and probably no science re-cut

Searched for a 2025 science crosswalk equivalent to `grade-8-mccrs-math-crosswalk-a.pdf`. **None
exists that I can find**, and the surrounding evidence says that is because there is nothing to
crosswalk:

- Maryland adopted **NGSS unchanged** in 2013 as its science standards; the maths re-cut was a
  revision of Maryland's *own* MCCRS, which has no science counterpart.
- The **October 2024** MISA blueprint — the most recent science document found — still cites "the
  Maryland Next Generation Science Standards" and the full 6–8 band. If a re-cut were imminent, this
  is where it would show.
- The only 2024–25 science-standards activity found is a **proposed PreK-4 Science Early Learning
  Standards** (State Board, Dec 2024) — early years only, no sign of a 5–12 revision.

**Conclusion: treat Science as 2013-NGSS, and treat that as answered rather than unknown.** Not
proof of a negative, but the question has been asked properly of the available record.

---

## Could not obtain — worth Gabriel getting

| Item | Why it is wanted | Blocker |
|---|---|---|
| **MSDE Science Branch page** — `marylandpublicschools.org/about/Pages/DCAA/Science/index.aspx` | The likeliest place a science standards revision or framework would be announced. | **HTTP 403** to automated fetch (bot protection). Opens fine in a normal browser — a save-as or a copy of the linked document list would close Finding 3 completely. |
| **Confirmation that no middle-school science standards revision is planned for SY 2026-27** | Finding 3 is inference from absence. A one-line answer from the MSDE Science Branch would make it fact. | Needs a human enquiry, not a search. |
| **MCPS *Investigations in Physical Science* curriculum / pacing guide** | Would confirm the unit sequence the hub's Science subject is modelled on, and how MCPS handles the LS/ESS two-thirds of MISA. | District curriculum is generally not published; may need a teacher or parent portal login. |
| **A science evidence-statements document** | The maths equivalent turned out to exist and is valuable. No science analogue was found; the MISA blueprint uses practice categories instead, so one may simply not exist. | Probably does not exist — worth one look if you have MSDE contact. |

**Nothing above blocks current work.** The Science scope decision (Finding 1) rests on the blueprint
already in hand.
