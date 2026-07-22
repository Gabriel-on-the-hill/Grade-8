# Grade 8 — standards coverage matrix

**What this is.** Every Grade 8 mathematics requirement, checked against what the modules actually ask
a student to *do*. Built 21 Jul 2026 (scrutiny item **S6** in `../Grade 7/HANDOFF.md`) by reading the
CCSS text in `../Grade 7/Math_Standards.pdf` (Grade 8 overview, p. 53) and the module markup — not
from impression, and not from question counts.

> **This matrix audits against the 2010 standards.** That is deliberate — 2010 is what the modules
> cite and what the MCAP blueprint we hold (Sept 2022) still uses. But Maryland re-cut the grade
> effective **SY 2026-27**, and a 2010-coded audit is structurally blind to it: **two of the new
> Grade 8 standards have no 2010 predecessor at all**, so there is no row here they could ever
> appear in. Read [MCCRS_2025_DUAL_CODING.md](MCCRS_2025_DUAL_CODING.md) alongside this file —
> it changes the scope of 8.G, adds a gap inside 8.EE, and changes what 8.EE.6 and 8.SP should
> teach. Per-domain notes below flag where.

**Why it exists.** Grade 8 passes every ported guard, and the guards are all *structural*: they check
that an item has a key, a skill, a phase and an honest label. **None of them can tell that a whole
domain is missing.** Grade 7's equivalent audit turned up a domain with zero worked examples and a
standard taught backwards, so the standing assumption was that Grade 8 had its own version of that
until somebody looked. It does.

## Headline: 3 of 5 mathematics domains are built

| Domain | CCSS clusters | Status | Where |
|---|---|---|---|
| **8.NS** The Number System | 1 | ✅ built | `The_Number_System.html` — 32 items, 10 exam |
| **8.EE** Expressions & Equations | 3 | ✅ built, **both gaps closed** 21 Jul | `Expressions_and_Equations.html` — 41 items, 11 exam, 8 sections |
| **8.F** Functions | 2 | ✅ **built** 21 Jul 2026 | `Functions.html` — 36 items, 9 exam |
| **8.G** Geometry | 3 | ❌ **absent** | hub tile: *coming soon* |
| **8.SP** Statistics & Probability | 1 | ❌ **absent** | hub tile: *coming soon* |

Science (`Matter_and_Its_Interactions.html`, 31 items) **was outside this matrix until 21 Jul 2026** —
audited below. A module nobody has checked cannot be called complete, whatever its item count.

**8.EE's second gap was invisible to this table, and is now closed.** MCCRS 2025 adds `8.AT.B.4` —
solve linear *inequalities* in one variable — with **no 2010 predecessor**, so it has no row below
and never could; "inequality" had appeared nowhere in the repo. **Built 21 Jul 2026** as Expressions
& Equations section 8. Worth keeping in view: a 2010-coded matrix is structurally blind to a 2025
standard, so **this table can show a domain fully green while a standard is entirely absent.**

---

## 8.NS — Know that there are numbers that are not rational ✅

| Std | Requirement | Status | Evidence |
|---|---|---|---|
| 8.NS.1 | Rational = terminating or eventually repeating decimal; convert a repeating decimal to a fraction | ✅ | §1 decimals, §2 repeating → fractions, §3 irrationals |
| 8.NS.2 | Approximate irrationals by rationals; locate on a number line; estimate the value of expressions (e.g. `π²`) | ✅ | §5 approximating, §6 comparing, ordering & estimating — and `5-5` (21 Jul) makes the student **place** `√17` and `π²` on a number line, which `5-4` had only been *naming* the bounding integers for |

## 8.EE — Expressions & Equations ✅

| Std | Requirement | Status | Evidence / gap |
|---|---|---|---|
| 8.EE.1 | Properties of integer exponents | ✅ | §1 |
| 8.EE.2 | `x² = p`, `x³ = p`; square and cube root symbols; `√2` is irrational | ✅ | NS §4 roots |
| 8.EE.3 | Numbers as a single digit × an integer power of 10; compare magnitudes | ✅ | §2 scientific notation |
| 8.EE.4 | Operations in scientific notation, including choosing units | ✅ | §2 |
| 8.EE.5 | Graph proportional relationships; interpret unit rate as **slope**; compare two in different representations | ✅ | §3 — and `3-5` now makes the student **plot** two points of a proportional relationship, meeting the *graph* verb in `8.AT.A.1a` rather than only reading one |
| 8.EE.6 | **Use similar triangles to explain why slope is the same between any two points**; derive `y = mx` and `y = mx + b` | ✅ **21 Jul** | §3 teach card derives it from **equivalent ratios** across three point-pairs on one line — the **2025 route** (`8.AT.A.2`), since similar triangles' own prerequisite left the grade; they get one parenthetical sentence as the classical framing. Tested by `3-6` (compute the second ratio) and `3-7` (say why it must match). |
| 8.EE.7 | Solve linear equations in one variable; one / none / infinitely many solutions; expand and collect terms | ✅ | §4 solving, §5 one-none-infinite |
| 8.EE.8 | Systems: graph and interpret intersection, solve algebraically, real-world problems | ✅ | §6 |

## 8.F — Functions ✅ built 21 Jul 2026

| Std | 2025 | Requirement | Status | Evidence |
|---|---|---|---|---|
| 8.F.1 | `8.AT.C.6` | A function assigns exactly one output to each input; graph = set of ordered pairs | ✅ | §1, incl. the vertical line test; **MCAP Q2** capstone (`1-5`) |
| 8.F.2 | `8.AT.C.7` | Compare two functions represented **differently** (algebraic, graphical, numerical, verbal) | ✅ | §2 four representations, §6 comparing; **MCAP Q20** capstone (`6-4`) |
| 8.F.3 | `8.AT.C.8` | `y = mx + b` defines a linear function; recognise non-linear examples | ✅ | §3, incl. a textbook-lifted three-table item (`3-2`) |
| — | **`8.AT.D.9`** | **NEW in 2025** — interpret the graph of `y = mx + b`; identify slope and intercept; match equation to graph | ✅ | **§4, authored** — no released item and no textbook lesson exists for it |
| 8.F.4 | `8.AT.D.10` | Construct a function to model a linear relationship; rate of change and initial value | ✅ | §5; **MCAP Q35** capstone (`5-5`) |
| 8.F.5 | `8.AT.D.11` | Describe a graph **qualitatively**; sketch from a description | ✅ | §7, incl. the first **click-to-plot** items; **MCAP Q14** capstone (`7-5`) |

**This is the row that justifies the dual-coding.** `8.AT.D.9` has no 2010 predecessor, so on the
2010-only view above there is no row it could occupy — the unit would have shipped complete-looking
and one standard short. It exists in the module only because the crosswalk was read first.

## 8.G — Geometry ❌ absent

| Std | Requirement | Status |
|---|---|---|
| 8.G.1–3 | Transformations: rotations, reflections, translations; congruence; coordinate effects; dilations | ❌ — **do not build; → Integrated Algebra 1/2 in 2025** |
| 8.G.4–5 | Similarity via transformations; angle-sum, exterior angle, parallel-lines-and-transversal, AA similarity | ◐ **split in 2025**: angle sum + exterior angle stay (`8.GR.A.3`); similarity and parallel-lines-and-transversal leave |
| 8.G.6–8 | **Pythagorean Theorem** — explain a proof, apply in 2-D and 3-D, distance between two points | ❌ — **stays** (`8.GR.B.4–5`), and gains acute/obtuse via Pythagorean inequalities |
| 8.G.9 | Volume of **cylinders, cones and spheres** | ❌ — **do not build; → Math 7 in 2025** |

**Under MCCRS 2025 this domain is 5 standards, not 9**, and only 4 of the blueprint's 23 content
items. Two of the five arrive from Grade 7 (below); one is triangle angle sum; two are Pythagoras.
Four of the nine listed above leave the grade entirely. Building them anyway would be four standards
of off-grade load for no exam return, against `PROJECT_STANDARD.md` §2.8.

## 8.SP — Statistics & Probability ❌ absent

| Std | Requirement | Status |
|---|---|---|
| 8.SP.1 | Scatter plots for bivariate measurement data; clustering, outliers, association, linear/non-linear | ❌ |
| 8.SP.2 | Straight line fit; informally assess the fit | ❌ — **2025 restates it** (`8.DS.B.3`): compare the fit of *different given* linear models, rather than fitting one |
| 8.SP.3 | Use the equation of a linear model; interpret slope and intercept in context | ❌ — **2025 restates it** (`8.DS.B.4`): use a ***provided*** model |
| 8.SP.4 | Bivariate **categorical** data in a two-way table; relative frequencies; association | ❌ |

**2025 makes this a 6-standard domain and changes its verb.** It adds a new cluster head
`8.DS.A.1` — evaluate whether a conclusion drawn from bivariate data is justified, and identify bias
or limitations in the collection — with no 2010 predecessor. Together with the two restatements
above, the cluster tilts from *constructing* models to *critiquing* them. It also receives compound
events from Grade 7 (`8.DS.C.6`). A module authored off the 2010 text would drill the wrong verb.

---

---

## Science — MS-PS1 Matter & Its Interactions ✅ (audited 21 Jul 2026)

`Matter_and_Its_Interactions.html` — 7 sections, 31 items, 10 exam, 8 skills. Audited against NGSS
**MS-PS1** because the module had **never been checked against its own standards**; it was excluded
from this matrix from the day it shipped (2026-07-15) purely because the matrix was written for
mathematics.

| Std | Requirement | Status | Evidence |
|---|---|---|---|
| MS-PS1-1 | Develop models of atoms, molecules and extended structures | ✅ | §1 atoms/elements/molecules; **MISA capstones** on sugar composition and why water is a molecule |
| MS-PS1-2 | Analyse data on properties before and after a reaction to decide if one occurred | ✅ | §4 physical vs chemical change; `4-2`/`4-4` reaction evidence |
| MS-PS1-3 | Synthetic materials from natural resources, and their impact | ✅ | §6; `6-4` where materials come from, `6-5` exam-style |
| MS-PS1-4 | Model how temperature and pressure change particle motion and state | ✅ | §2 particle model, §3 thermal energy; **MISA two-part thermometer capstone** |
| MS-PS1-5 | Conservation of mass in a chemical reaction | ✅ | §5, incl. the released constructed-response |
| MS-PS1-6 | **Design a device** that releases or absorbs thermal energy | ✅ | §6 endo/exothermic + `6-3` *Judge the design*, which applies stated criteria |

**All six covered.** Two things this audit settled that the item count could not:

- **`MS-PS1-6` is the one that could have been missing** — it is an *engineering design* performance
  expectation sitting inside a chemistry unit, and it is the kind of standard that gets absorbed into
  "energy in reactions" without ever being assessed. It is genuinely there (`6-3`).
- **Only three MS-PS1 codes appear anywhere in the file** (`-2`, `-3`, `-5`). The other three are
  covered by items that carry **no code in their title** — which is exactly the pattern that made the
  P1 provenance audit nearly discard six real MISA items. **A code search is not a coverage audit**,
  in either direction.

**Dual-coding question settled 21 Jul 2026 — there is nothing to crosswalk.** Maryland adopted NGSS
*unchanged* in 2013; the 2025 re-cut revised Maryland's own MCCRS, which has no science counterpart.
The **October 2024** MISA blueprint still cites the Maryland NGSS and the full 6–8 band. Treat this
table as 2013-NGSS-coded, and treat that as **answered**, not unknown (`SOURCE_ACQUISITION.md`).

### But the exam is not the course — a scope finding, not a module defect

`Curriculum/MCAP-Science-Blueprint-Grade-8-2024-A.pdf` (acquired 21 Jul) says the Grade 8 MISA uses
**all Middle School (6–8) performance expectations**, split roughly evenly:

| Domain | Percent of blueprint | Units planned in this hub |
|---|---|---|
| Earth and Space Science | 30–35% | one space topic |
| Life Science | 30–35% | **none** |
| Physical Science | 30–35% | all four |

The hub's Science subject follows the MCPS *Investigations in Physical Science* course, which is
right for the **curriculum** — but two thirds of the **exam** is Life and Earth/Space, taught in
Grades 6–7. §2.2 requires *curriculum ∪ exam, never a trade-off*; today only the curriculum half is
met. This also explains why **nine of the ten released MISA packets are unused** — they span ESS and
LS because the exam does. The blueprint also splits the paper by **practice** (Sensemaking 50–67%,
Investigating 17–33%, Critiquing 17–33%), which no module has been checked against.

**The Matter unit is not at fault** — it is on-curriculum, on-grade and complete for MS-PS1.

**And this is not a scope *choice*** *(framing corrected 22 Jul 2026)*. §2.2 is **curriculum ∪ exam,
never a trade-off**, so the question was never which half to serve. Two corrections to the paragraph
above: the planned *A Voyage Through Space* unit covers the two `MS-ESS1` packets, so the current
plan already accounts for **6 of 10** released packets, not one; and the real gap is **packets 3, 4,
5 and 6** — all of Life Science, plus Earth systems and resources.

The two halves need **different depths, not equal shares**: Physical Science is taught *this year*
and needs full taught units; Life and Earth Science were learned in **Grades 6-7** and need
**retrieval** units — leaner, built on the released packets, wired into the spaced-review ladder.
Plan and sequencing in `TODO.md` P5.6.

## The MCCRS 2026-27 handoff does not currently land

Maryland's 2025 crosswalk (`../Grade 7/Curriculum/grade-7-mccrs-math-crosswalk-a.pdf`) moves **three
Grade 7 clusters into Math 8**, printing *"Not applicable — In Math 8"* against each:

| Leaves Grade 7 | Topic | Lands in | Grade 8 status |
|---|---|---|---|
| 7.G.A.2 | Construct triangles from three measures | 8.G | ❌ **not built** |
| 7.G.B.5 | Angle relationships → write and solve equations | 8.G | ❌ **not built** |
| 7.SP.C.8 | Compound events; sample spaces | 8.SP | ❌ **not built** |

**All three land in domains this app does not have.** That is the strongest argument for
`../Grade 7/HANDOFF.md` **D10** (retain those eleven items in Grade 7 and flag them): if Grade 7 drops
them to match Maryland's boundary while Grade 8 has no Geometry or Statistics module, a student
crossing the two apps meets the material **nowhere at all**. Retention is not conservatism here — it
is the only thing keeping the sequence whole.

## Recommended order, by exam weight and dependency

1. ~~**8.F Functions**~~ — **done 21 Jul 2026.**
2. **`8.AT.B.4` linear inequalities + `8.AT.A.2`'s derivation** — both ride one Expressions edit, and
   the inequalities standard is a whole missing standard rather than a missing explanation.
3. **8.SP Statistics** — 6 standards under 2025; now unblocked, since it depends on 8.F for the
   linear-model work. Author to the 2025 verbs (judge a given model, don't fit one).
4. **8.G Geometry** — **5 standards under 2025, not 9**, and only 4 of 23 blueprint items. Two of the
   five are the inbound Grade 7 clusters, so this is the one that closes P4.

**Do not close these by relabelling.** `exam_coverage` counts an exam item per skill and will happily
pass a domain that does not exist, because it only sees the skills a module declares. The pressure
that produced 19 falsely-labelled MCAP capstones in Grade 7 applies here too.
