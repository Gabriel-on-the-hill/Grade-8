# Grade 8 — dual-coding to MCCRS 2025

**What this is.** Every Grade 8 mathematics standard mapped from the 2010 CCSS codes this app is
built on to the **Maryland College and Career Ready Standards adopted July 2025**, whose
implementation year is **SY 2026-27**. Built 21 Jul 2026 from
`Curriculum/grade-8-mccrs-math-crosswalk-a.pdf`, **read off all 14 rendered pages**, not the text
extraction.

**Why it exists.** `STANDARDS_COVERAGE_MATRIX.md` audits this app against the **2010** standards,
because that is what the modules cite and what the MCAP blueprint we hold still uses. Maryland has
since re-cut the grade. Three things follow that the 2010-only view cannot see:

1. **Four domains become four differently-named domains, and the membership moves.** Functions is
   dissolved into Algebraic Thinking; exponents and radicals leave Expressions & Equations for
   Number and Operation Sense.
2. **Seven Grade 8 requirements leave the grade** — four up to Integrated Algebra, one down to
   Math 7, one deleted outright, one cut in half.
3. **Three requirements are new**, and one of them lands inside a module this app already calls
   built.

**The timing is not hypothetical.** Adoption July 2025, implementation SY 2026-27 — which begins
roughly six weeks after this file was written. Anything authored for the coming year should be
authored to the 2025 cut.

**But the assessment has not visibly followed yet.** `Curriculum/Grade_8_MCAP_Public_Blueprint-A.pdf`
is dated **September 2022** and is entirely 2010-coded, and the released items in `MCAP MATHS/` are
the 2024 release against 2010 codes. **We do not hold a 2025-aligned blueprint or item release.** So
this document governs *what to teach*; it does **not** license restating an MCAP item's alignment in
2025 codes. See "What this does not authorise" at the end.

---

## The four 2025 domains

| 2025 domain | Previously | Standards |
|---|---|---|
| **Number and Operation Sense (NOS)** | The Number System (NS) | 5 |
| **Algebraic Thinking (AT)** | Expressions & Equations (EE); **Functions (F)** | 11 |
| **Geometric Reasoning and Measurement (GR)** | Geometry (G) | 5 |
| **Reasoning with Data, Statistics, and Probability (DS)** | Statistics & Probability (SP) | 6 |

27 standards, against 28 under 2010. The count barely moves; **the membership moves a great deal.**

Note what this does to "largest domain": under 2010 that was 8.G with 9 standards. Under 2025 it is
**8.AT with 11**, and 8.GR is down to **5**.

---

## Full map, 2010 → 2025

Status is against this app as it stands (`The_Number_System.html`, `Expressions_and_Equations.html`).

### Number and Operation Sense — 8.NOS

| 2025 | 2010 | Requirement | App |
|---|---|---|---|
| `8.NOS.A.1` | `8.NS.A.1` | Irrational = decimal expansion neither terminates nor repeats; not a ratio of two integers | ✅ NS §1–3 |
| `8.NOS.A.2` | `8.NS.A.2` | Rational approximations; locate on a number line; estimate expressions in context | ✅ NS §5–6 |
| `8.NOS.B.3` | `8.EE.A.1` | Properties of integer exponents | ✅ EE §1 |
| `8.NOS.B.4` | `8.EE.A.2` | Square/cube roots as solutions to `x²=p`, `x³=p`; perfect squares 1–100, cubes 1–125 **by inspection** | ✅ NS §4 |
| `8.NOS.B.5` | `8.EE.A.3` | Scientific notation to represent and compare magnitudes; **use technology to compute** | ✅ EE §2 |
| — | `8.EE.A.4` | Operations in scientific notation; choose units | ⚠️ **deleted — "Not included as a standard"** |

**The domain boundary moved under the app's feet.** Exponents, roots and scientific notation are
2025 *Number* standards, but this app teaches roots in The Number System and exponents/scientific
notation in Expressions & Equations. Under 2025 the whole of 8.NOS is split across two units. Not
wrong — a unit is a teaching sequence, not a domain — but it is why a 2025-coded coverage claim
cannot be read off the unit names.

### Algebraic Thinking — 8.AT

| 2025 | 2010 | Requirement | App |
|---|---|---|---|
| `8.AT.A.1` | `8.EE.B.5` | Analyse and compare proportional relationships using slope | ✅ EE §3 |
| `8.AT.A.2` | `8.EE.B.6` | Slope well defined; derive `y=mx` and `y=mx+b` | ◐ EE §3 — derivation absent (see below) |
| `8.AT.B.3` | `8.EE.C.7` | Solve linear equations in one variable; one / none / infinitely many | ✅ EE §4–5 |
| `8.AT.B.4` | **New standard** | **Solve linear *inequalities* in one variable; represent the solution set on a number line** | ❌ **absent — "inequality" appears nowhere in the repo** |
| `8.AT.B.5` | `8.EE.C.8` | Systems of two linear equations; graphing and substitution; strategic method choice | ✅ EE §6 |
| `8.AT.C.6` | `8.F.A.1` | A relationship is a function iff each input has exactly one output | ❌ |
| `8.AT.C.7` | `8.F.A.2` | Compare properties of two linear functions represented differently | ❌ |
| `8.AT.C.8` | `8.F.A.3` | Linear vs non-linear, justified by constant rate of change | ❌ |
| `8.AT.D.9` | **New standard** | **Interpret the graph of `y=mx+b`: identify slope and intercept; match equation to graph** | ❌ |
| `8.AT.D.10` | `8.F.B.4` | Construct a linear function from two pairs / graph / table / description | ❌ |
| `8.AT.D.11` | `8.F.B.5` | Describe a graph qualitatively; sketch from a narrative | ❌ |

**`8.AT.A.2` restates the derivation, and the restatement matters for the open P3 item.** The 2010
text is *"**Use similar triangles** to explain why the slope m is the same between any two distinct
points…"*. The 2025 text drops similar triangles and says instead: *"Use proportional reasoning to
explain why the slope m is the same between any two points on a non-vertical line **by showing that
the ratios of vertical change to horizontal change between points are equivalent**."*

So the fix filed in `TODO.md` P3 as "the similar-triangles explanation is missing" should be built as
the **ratio-equivalence** argument. Similar triangles are worth a sentence as the classical framing,
but under 2025 they are not the required route — and 8.G's similarity standards, which would have
supplied them, have left the grade (below). Building the similar-triangles version as the primary
derivation would rest a 2025 standard on a prerequisite Maryland no longer teaches in Grade 8.

### Geometric Reasoning and Measurement — 8.GR

| 2025 | 2010 | Requirement | App |
|---|---|---|---|
| `8.GR.A.1` | **`7.G.B.5`** | Supplementary/complementary/vertical/adjacent angles → write and solve equations | ❌ **inbound from Grade 7** |
| `8.GR.A.2` | **`7.G.A.2`** | Draw or build triangles from three measures; unique / many / none | ❌ **inbound from Grade 7** |
| `8.GR.A.3` | `8.G.A.5` *(part)* | Triangle angle sum = 180°; exterior angle = sum of remote interior angles | ❌ |
| `8.GR.B.4` | `8.G.B.6` | Explain the Pythagorean Theorem and its converse; **extended to acute/obtuse via Pythagorean inequalities** | ❌ |
| `8.GR.B.5` | `8.G.B.7` + `8.G.B.8` | Apply Pythagoras: unknown sides; distance between two points | ❌ |
| — | `8.G.A.1` | Verify properties of rotations, reflections, translations | ⚠️ **→ Integrated Algebra 1** |
| — | `8.G.A.2` | Congruence via a sequence of rigid motions | ⚠️ **→ Integrated Algebra 1** |
| — | `8.G.A.3` | Effect of dilations/translations/rotations/reflections on coordinates | ⚠️ **→ Integrated Algebra 1 & 2** |
| — | `8.G.A.4` | Similarity via a sequence including dilations | ⚠️ **→ Integrated Algebra 2** |
| — | `8.G.A.5` *(part)* | Angles from parallel lines cut by a transversal; **AA similarity criterion** | ⚠️ **struck through → Int Alg 1 & 2** |
| — | `8.G.C.9` | Volume of cylinders, cones and spheres | ⚠️ **→ Math 7** |

**This is the largest single finding in the document.** Grade 8 geometry under 2025 is **five
standards, and three of them are angle work** — two arriving from Grade 7. The transformations /
congruence / dilations / similarity block, which is what most people picture when they hear "Grade 8
geometry", is **gone to high school**, and volume has gone **down** to Math 7. What remains is angle
relationships plus Pythagoras.

`Grade_8_Math_Hub.html` currently advertises the coming-soon Geometry tile as *"Transformations &
congruence, similarity, angle relationships, the Pythagorean Theorem and volume"*. **Three of those
five named topics are off-grade from SY 2026-27.**

### Reasoning with Data, Statistics, and Probability — 8.DS

| 2025 | 2010 | Requirement | App |
|---|---|---|---|
| `8.DS.A.1` | **New standard** | **Evaluate predictions and conclusions from bivariate data; generalisation to a population; bias and limitations** | ❌ |
| `8.DS.B.2` | `8.SP.A.1` | Construct and interpret scatter plots; clustering, outliers, association | ❌ |
| `8.DS.B.3` | `8.SP.A.2` | **Compare the fit of different linear models shown on the same scatter plot** | ❌ |
| `8.DS.B.4` | `8.SP.A.3` | **Use a *provided* linear model** to predict; interpret slope and y-intercept in context | ❌ |
| `8.DS.C.5` | `8.SP.A.4` | Two-way tables; relative frequencies; association between categorical variables | ❌ |
| `8.DS.C.6` | **`7.SP.C.8`** | Probabilities of compound events; sample spaces via lists, tables, tree diagrams | ❌ **inbound from Grade 7** |

**`8.DS.B.3` and `8.DS.B.4` shift the student's job from producing to judging.** 2010 had the student
*informally fit* a straight line and *use the equation of a linear model*; 2025 has them **compare
given lines for fit** and **use a provided model**. Paired with the new `8.DS.A.1` (is this
generalisation justified? what biased this collection?), the whole cluster tilts from construction
toward critique. An 8.SP module authored straight off the 2010 text would drill the wrong verb.

This also revises a note in `PROJECT_STANDARD.md` and `TODO.md` P5: the click-to-plot input was
expected to be needed for "8.SP". Under 2025, `8.DS.B.3`/`B.4` no longer ask the student to draw the
line — plotting points for `8.DS.B.2` still does, but line-fitting does not.

---

## Summary of movement

**Leaves Grade 8 (7):** `8.EE.A.4` (deleted) · `8.G.A.1` `8.G.A.2` `8.G.A.3` `8.G.A.4` (→ Integrated
Algebra) · `8.G.A.5` in part (parallel lines/transversal, AA similarity → Integrated Algebra) ·
`8.G.C.9` (→ Math 7).

**Arrives in Grade 8 (3):** `7.G.A.2` → `8.GR.A.2` · `7.G.B.5` → `8.GR.A.1` · `7.SP.C.8` →
`8.DS.C.6`.

**New, no predecessor (3):** `8.AT.B.4` linear inequalities · `8.AT.D.9` interpret `y=mx+b` graphs ·
`8.DS.A.1` evaluate conclusions from bivariate data.

**Restated enough to change the teaching (4):** `8.AT.A.2` (ratio equivalence, not similar
triangles) · `8.NOS.B.5` (compute *with technology*) · `8.DS.B.3` (compare given fits) ·
`8.DS.B.4` (use a *provided* model).

---

## What this does to the build plan

`TODO.md` P3 and the matrix's "Recommended order" were written against the 2010 cut. Both need
amending, and one of their premises is now false.

**MCAP exam weight** (`Grade_8_MCAP_Public_Blueprint-A.pdf`, Sept 2022, 23 content items):
8.EE **10** · 8.F **5** · 8.G **4** · 8.NS **2** · 8.SP **2**. Reasoning statements exist for
Expressions & Equations, **Functions**, and Geometry only.

| Order | Build | 2025 codes | Why |
|---|---|---|---|
| **1** | **Functions** | `8.AT.C.6–8`, `8.AT.D.9–11` | Unchanged as first priority, and now better supported: 6 standards, the **highest-weight unbuilt domain on the blueprint (5 items)**, one of three domains carrying a Reasoning statement, and it **completes 8.AT** alongside the built Expressions & Equations. `8.AT.D.9` is new — build it in from the start rather than retrofitting. |
| **2** | **`8.AT.B.4` + `8.AT.A.2`** | new + restated | Both ride an Expressions edit. **`8.AT.B.4` is the sharper of the two**: `STANDARDS_COVERAGE_MATRIX.md` calls Expressions & Equations "built, one gap", but from SY 2026-27 it is **two** gaps, and the new one is a whole standard with zero coverage in the repo. |
| **3** | **Statistics & Probability** | `8.DS.A.1`, `8.DS.B.2–4`, `8.DS.C.5–6` | 6 standards. Depends on Functions for the linear-model work. Author to the 2025 verbs (judge, don't fit) and include the inbound compound-events cluster. |
| **4** | **Geometry** | `8.GR.A.1–3`, `8.GR.B.4–5` | **Down-scoped from 9 standards to 5**, and only 4 blueprint items. Two of the five are the inbound Grade 7 clusters. |

**Do not build the four departed 8.G standards.** Transformations, congruence, dilations and
similarity are Integrated Algebra 1/2 material from SY 2026-27, and volume is Math 7's. Building them
into a Grade 8 module would violate `PROJECT_STANDARD.md` §2.8 ("On grade — shelve/rebuild anything
above or below grade") and put four standards' worth of off-grade load in front of a student for no
exam return. The honest treatment of the transformations block is a **prerequisite note**, not a unit.

**The hub's Geometry tile description should be corrected when 8.GR is built** — it currently
promises three topics that will not be in it.

---

## What this does to P4 — the handoff now lands, on paper

`TODO.md` P4 and the matrix both assumed, from the *Grade 7* side of the crosswalk, that the three
departing Grade 7 clusters land in 8.G and 8.SP. **The Grade 8 side confirms all three, and names
them:**

| Leaves Grade 7 | Grade 7 crosswalk says | Grade 8 crosswalk confirms | Built here? |
|---|---|---|---|
| `7.G.B.5` angle relationships → equations | *Not applicable — In Math 8* | **`8.GR.A.1`** | ❌ |
| `7.G.A.2` construct triangles | *Not applicable — In Math 8* | **`8.GR.A.2`** | ❌ |
| `7.SP.C.8` compound events | *Not applicable — In Math 8* | **`8.DS.C.6`** | ❌ |

Both documents agree, which is the point of checking both sides. **The conclusion in
`../Grade 7/HANDOFF.md` D10 is unchanged and now better evidenced:** Grade 7 must keep those eleven
items until 8.GR and 8.DS exist here, because the receiving standards are real, named, and unbuilt.
The revisit condition stays exactly as P4 states it.

One thing does get easier: 8.GR is a **5**-standard build, not a 9-standard one, so the gate on
Grade 7 dropping that material is lower than it looked.

---

## What this does *not* authorise

**No exam label changes.** `MCAP_PROVENANCE.md` governs the `MCAP ·` label, and every verified row
there cites a 2010-coded item from the 2024 release. This document adds a *curriculum* code; it does
not re-align a released item. Restating a verified item's standard as a 2025 code would be a
provenance claim about a document MSDE has not published — the same class of error as the 19
falsely-labelled capstones, arrived at by a more respectable route.

**Dual-code, don't re-code.** Modules keep citing 2010 codes while the blueprint and the released
items do. This file is the mapping; when a 2025-aligned blueprint and item release appear, that is
the moment to move the module-facing codes, and it should be its own audited change.

**The extraction lied here too, and this is the fourth time.** `pdftotext -layout` collapsed the
`8.NOS.B.4` / `8.NOS.B.5` / *Not applicable* rows on crosswalk page 3 into a single run —
`8.NOS.B.5` and `Not applicable` printed as one cell — which would have mis-assigned the deletion of
`8.EE.A.4` and quietly lost either a standard or the fact that one was dropped. **Every claim in
this file was read off a 140-dpi render of the page.** The rule in `TODO.md` P2 holds without
exception: *`pdftotext` is an index, never the evidence.*

---

## Provenance

| Claim | Source | Page (PDF / printed) |
|---|---|---|
| Domain renames; NOS table | `grade-8-mccrs-math-crosswalk-a.pdf` | 2 / 1 |
| `8.EE.A.4` deleted | same | 3 / 2 |
| Algebraic Thinking header; `8.AT.A.1–2` | same | 4 / 3 |
| `8.AT.B.3–5` incl. new inequalities standard | same | 5 / 4 |
| `8.AT.C.6–7` | same | 6 / 5 |
| `8.AT.C.8`; `8.AT.D.9–10` incl. new graph standard | same | 7 / 6 |
| `8.AT.D.11` | same | 8 / 7 |
| GR header; `8.GR.A.1–3`; `8.G.A.1` departure | same | 9 / 8 |
| `8.G.A.2–4` departures; `8.GR.B.4` | same | 10 / 9 |
| `8.GR.B.5`; `8.G.C.9` → Math 7 | same | 11 / 10 |
| DS header; new `8.DS.A.1`; `8.DS.B.2–3` | same | 12 / 11 |
| `8.DS.B.4`; `8.DS.C.5–6` | same | 13 / 12 |
| `8.DS.C.6` detail | same | 14 / 13 |
| Blueprint item counts; Reasoning/Modeling statements | `Grade_8_MCAP_Public_Blueprint-A.pdf` (Sept 2022) | 1–2 |
