# Grade 8 — standards coverage matrix

**What this is.** Every Grade 8 mathematics requirement, checked against what the modules actually ask
a student to *do*. Built 21 Jul 2026 (scrutiny item **S6** in `../Grade 7/HANDOFF.md`) by reading the
CCSS text in `../Grade 7/Math_Standards.pdf` (Grade 8 overview, p. 53) and the module markup — not
from impression, and not from question counts.

**Why it exists.** Grade 8 passes every ported guard, and the guards are all *structural*: they check
that an item has a key, a skill, a phase and an honest label. **None of them can tell that a whole
domain is missing.** Grade 7's equivalent audit turned up a domain with zero worked examples and a
standard taught backwards, so the standing assumption was that Grade 8 had its own version of that
until somebody looked. It does.

## Headline: 2 of 5 mathematics domains are built

| Domain | CCSS clusters | Status | Where |
|---|---|---|---|
| **8.NS** The Number System | 1 | ✅ built | `The_Number_System.html` — 31 items, 10 exam |
| **8.EE** Expressions & Equations | 3 | ◐ built, one gap | `Expressions_and_Equations.html` — 33 items, 10 exam |
| **8.F** Functions | 2 | ❌ **absent** | hub tile: *coming soon* |
| **8.G** Geometry | 3 | ❌ **absent** | hub tile: *coming soon* |
| **8.SP** Statistics & Probability | 1 | ❌ **absent** | hub tile: *coming soon* |

Science (`Matter_and_Its_Interactions.html`, 31 items) is outside this matrix.

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
| 8.EE.6 | **Use similar triangles to explain why slope is the same between any two points**; derive `y = mx` and `y = mx + b` | ◐ | §3 states and uses `y = mx` / `y = mx + b`, but the **similar-triangles explanation is absent** — "similar triangle" appears nowhere in the repo. The *equations* are taught; the *reason slope is well defined* is not. This is the same shape of gap Grade 7's audit found: the conclusion present, the derivation missing. |
| 8.EE.7 | Solve linear equations in one variable; one / none / infinitely many solutions; expand and collect terms | ✅ | §4 solving, §5 one-none-infinite |
| 8.EE.8 | Systems: graph and interpret intersection, solve algebraically, real-world problems | ✅ | §6 |

## 8.F — Functions ❌ absent

| Std | Requirement | Status |
|---|---|---|
| 8.F.1 | A function assigns exactly one output to each input; graph = set of ordered pairs | ❌ |
| 8.F.2 | Compare two functions represented **differently** (algebraic, graphical, numerical, verbal) | ❌ |
| 8.F.3 | `y = mx + b` defines a linear function; recognise non-linear examples | ❌ |
| 8.F.4 | Construct a function to model a linear relationship; rate of change and initial value | ❌ |
| 8.F.5 | Describe a graph **qualitatively** (increasing/decreasing, linear/non-linear); sketch from a description | ❌ |

## 8.G — Geometry ❌ absent

| Std | Requirement | Status |
|---|---|---|
| 8.G.1–3 | Transformations: rotations, reflections, translations; congruence; coordinate effects; dilations | ❌ |
| 8.G.4–5 | Similarity via transformations; angle-sum, exterior angle, parallel-lines-and-transversal, AA similarity | ❌ |
| 8.G.6–8 | **Pythagorean Theorem** — explain a proof, apply in 2-D and 3-D, distance between two points | ❌ |
| 8.G.9 | Volume of **cylinders, cones and spheres** | ❌ |

## 8.SP — Statistics & Probability ❌ absent

| Std | Requirement | Status |
|---|---|---|
| 8.SP.1 | Scatter plots for bivariate measurement data; clustering, outliers, association, linear/non-linear | ❌ |
| 8.SP.2 | Straight line fit; informally assess the fit | ❌ |
| 8.SP.3 | Use the equation of a linear model; interpret slope and intercept in context | ❌ |
| 8.SP.4 | Bivariate **categorical** data in a two-way table; relative frequencies; association | ❌ |

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

1. **8.F Functions** — the spine of Grade 8 algebra; 8.EE.5/6 already lean on it, and 8.SP.3 needs it.
2. **8.G Geometry** — largest domain (9 standards), carries the Pythagorean Theorem, and is where two
   of the three inbound Grade 7 clusters land.
3. **8.SP Statistics** — smallest, and depends on 8.F for the linear-model work.
4. **8.EE.6's similar-triangles derivation** — small, and can ride any Expressions edit.

**Do not close these by relabelling.** `exam_coverage` counts an exam item per skill and will happily
pass a domain that does not exist, because it only sees the skills a module declares. The pressure
that produced 19 falsely-labelled MCAP capstones in Grade 7 applies here too.
