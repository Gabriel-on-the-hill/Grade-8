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
| **8.NS** The Number System | 1 | ✅ built | `The_Number_System.html` — 31 items, 10 exam |
| **8.EE** Expressions & Equations | 3 | ◐ built, **two** gaps | `Expressions_and_Equations.html` — 33 items, 10 exam |
| **8.F** Functions | 2 | ✅ **built** 21 Jul 2026 | `Functions.html` — 36 items, 9 exam |
| **8.G** Geometry | 3 | ❌ **absent** | hub tile: *coming soon* |
| **8.SP** Statistics & Probability | 1 | ❌ **absent** | hub tile: *coming soon* |

Science (`Matter_and_Its_Interactions.html`, 31 items) is outside this matrix.

**8.EE's second gap is invisible to this table.** MCCRS 2025 adds `8.AT.B.4` — solve linear
*inequalities* in one variable — with **no 2010 predecessor**, so it has no row below and never
could. "inequality" appears nowhere in the repo. From SY 2026-27 the Expressions & Equations unit is
one whole standard short, not just missing a derivation.

---

## 8.NS — Know that there are numbers that are not rational ✅

| Std | Requirement | Status | Evidence |
|---|---|---|---|
| 8.NS.1 | Rational = terminating or eventually repeating decimal; convert a repeating decimal to a fraction | ✅ | §1 decimals, §2 repeating → fractions, §3 irrationals |
| 8.NS.2 | Approximate irrationals by rationals; locate on a number line; estimate the value of expressions (e.g. `π²`) | ✅ | §5 approximating, §6 comparing, ordering & estimating |

## 8.EE — Expressions & Equations ◐

| Std | Requirement | Status | Evidence / gap |
|---|---|---|---|
| 8.EE.1 | Properties of integer exponents | ✅ | §1 |
| 8.EE.2 | `x² = p`, `x³ = p`; square and cube root symbols; `√2` is irrational | ✅ | NS §4 roots |
| 8.EE.3 | Numbers as a single digit × an integer power of 10; compare magnitudes | ✅ | §2 scientific notation |
| 8.EE.4 | Operations in scientific notation, including choosing units | ✅ | §2 |
| 8.EE.5 | Graph proportional relationships; interpret unit rate as **slope**; compare two in different representations | ✅ | §3 |
| 8.EE.6 | **Use similar triangles to explain why slope is the same between any two points**; derive `y = mx` and `y = mx + b` | ◐ | §3 states and uses `y = mx` / `y = mx + b`, but the **derivation is absent** — the *equations* are taught; the *reason slope is well defined* is not. Same shape of gap Grade 7's audit found: conclusion present, derivation missing. **Build the 2025 version** (`8.AT.A.2`): proportional reasoning — show the ratios of vertical to horizontal change between points are equivalent. Similar triangles are *not* the 2025 route, and 8.G's similarity standards that would supply them have left the grade. |
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
