# Grade 8 — exam item provenance

**Rule: an item may carry the `MCAP` or `MISA` label only if it is a real released item, and only if
it is listed here with its citation.** No exceptions, and "written in the MCAP style" is not one.
`tests/mcap_provenance.test.js` makes the claim mechanically checkable, in both directions.

**Why this file exists.** Until 21 Jul 2026 this app had **no manifest and no provenance guard**,
while ten items were titled `MISA ·` and both maths modules told the student in their footer that
*"Real MCAP practice items are marked Exam."* That is an exam-authority claim on 30 items with
nothing recording it and nothing checking it — the exact state Grade 7 was in before it shipped 19
falsely-labelled capstones on 20 Jul 2026. The audit below resolved every one of those claims.

**The pressure that causes this, so it can be watched for.** `exam_coverage.test.js` counts whether
every skill has an exam-grade item. A guard that rewards *having* a capstone creates pressure to
manufacture one, and the cheapest way to manufacture one is to copy the format — label included — of
the real item next to it. Close a coverage gap with a sourced item or an honestly-labelled one.
**Never by relabelling.**

---

## Verified items — MCAP (mathematics)

Every row was read off the **rendered** packet page in `MCAP MATHS/`, not the text extraction, and
its key recomputed independently. Citations are as MSDE prints them.

| File | qid | Packet | Citation | Standard |
|---|---|---|---|---|
| `The_Number_System.html` | `3-3` | `…Math 8 2024` | Math 8 2024 Release, Question 7 | 8.NS.A.1 |
| `The_Number_System.html` | `6-4` | `…Math 8 2024` | Math 8 2024 Release, Question 5 | 8.NS.A.2 |
| `Expressions_and_Equations.html` | `1-5` | `…Math 8 2024` | Math 8 2024 Release, Question 1 | 8.EE.A.1 |
| `Expressions_and_Equations.html` | `2-4` | `…Math 8 2024` | Math 8 2024 Release, Question 9 | 8.EE.A.3 |
| `Expressions_and_Equations.html` | `4-4` | `…Math 8 2024` | Math 8 2024 Release, Question 6 | 8.EE.C.7b |

**Keys, recomputed independently before checking anything:**

| qid | Item | Working | Key |
|---|---|---|---|
| `3-3` | Which of the following numbers are rational? *Select all.* | `−72` ✓, `4/5` ✓, `√6` ✗, `√(5/16)=√5/4` ✗, `√100=10` ✓ | −72, 4/5, √100 |
| `6-4` | Best estimate for `√65 ÷ √122` | `√(65/122)=√0.5328≈0.7299`; `8/11≈0.7273` is nearest | `8/11` |
| `1-5` | Equivalent to `8⁻⁴ · 8³` | `8⁻⁴⁺³ = 8⁻¹` | `1/8` |
| `2-4` | `8×10⁹` is how many times `2×10⁸`? | `8/2 × 10⁹⁻⁸ = 4 × 10¹` | `40` |
| `4-4` | `5(x−6) − 2(x+3) = 12` | `5x−30−2x−6=12 → 3x=48` | `x = 16` |

**One fidelity repair, 21 Jul 2026.** `6-4` printed the stem as `√(65/122)` — one root of a quotient.
MCAP prints `√65 ÷ √122`, a quotient of two roots. They are equal in value, but the released form is
what makes the item test `√a/√b = √(a/b)`; rewriting it quietly removes the step being assessed. The
notation was restored to the release's rather than the label being dropped.

## Verified items — MISA (science)

All six come from **one item set** built on a single "Sugar and Water Investigation" stimulus, which
is why they sit together as the module check. The release numbers them Question 1–5 plus a
constructed response.

| File | qid | Packet | Citation | Standard |
|---|---|---|---|---|
| `Matter_and_Its_Interactions.html` | `7-1` | `…MS-PS1-1 and MS-PS1-4` | MISA Released Questions, "Table sugar is composed of…" | MS-PS1-1 |
| `Matter_and_Its_Interactions.html` | `7-2` | `…MS-PS1-1 and MS-PS1-4` | MISA Released Questions, "Water is classified as a molecule because…" | MS-PS1-1 |
| `Matter_and_Its_Interactions.html` | `7-3` | `…MS-PS1-1 and MS-PS1-4` | MISA Released Questions, "How do table sugar molecules differ from water molecules?" | MS-PS1-1 |
| `Matter_and_Its_Interactions.html` | `7-4` | `…MS-PS1-1 and MS-PS1-4` | MISA Released Questions, Question 1 — "The volume of water increases when water freezes because…" | MS-PS1-4 |
| `Matter_and_Its_Interactions.html` | `7-5` | `…MS-PS1-1 and MS-PS1-4` | MISA Released Questions, "In the thermometer model, the liquid expanded because…" (two-part) | MS-PS1-4 |
| `Matter_and_Its_Interactions.html` | `7-6` | `…MS-PS1-1 and MS-PS1-4` | MISA Released Questions, Constructed Response — "explain what causes water to change phases" | MS-PS1-4 |

### Rows carrying a caveat

**The packet is confirmed; the per-question numbering is not, for five of the six.** The stimulus
pages and the *Thermometers* section were rendered and read, and every stem above appears in that
packet verbatim. But the release interleaves three stimulus sections with its questions, and the text
extraction emits each section body *before* its heading, so mapping stems onto "Question 2" vs
"Question 3" from extraction order alone is not safe. `7-4` (Question 1) and `7-6` (Constructed
Response) are confirmed by render. **Before relying on the others' numbers, render pages 5–8 and read
the headings.** The *identity* of each item is not in doubt — only its ordinal.

## Demoted 21 Jul 2026 — claimed an exam label, no source found

These were titled `MCAP` or `MISA` and are now `Exam-style ·`. They are **not bad items**; they are
ours, and they are now labelled as ours. Nothing was relabelled *up* to compensate.

| File | qid | Claimed | Why demoted |
|---|---|---|---|
| `The_Number_System.html` | `2-5` | MCAP · 8.NS.A.1 | The entire released 8.NS supply is **two items** — Q5 and Q7 — and this is neither. |
| `The_Number_System.html` | `3-5` | MCAP · 8.NS.A.1 | Same. No released 8.NS item is an error-analysis of `√20`. |
| `The_Number_System.html` | `6-5` | MCAP · 8.NS.A.2 | Same. Q5 is the only released 8.NS.A.2 item, and it is `6-4`. |
| `Expressions_and_Equations.html` | `5-5` | MCAP · 8.EE.C.7 | Q13 is the only other released 8.EE.C.7 item and it is a **table** item ("select one cell per row"), not this error analysis. Q6 is `4-4`. |
| `Expressions_and_Equations.html` | `6-3` | MCAP · 8.EE.C.8 | Every released 8.EE.C.8 item was checked — Q11, Q15, Q17, Q27, Q28, Q34 — and none is "two graphs cross at (2, 7)". |
| `Matter_and_Its_Interactions.html` | `4-4` | MISA · MS-PS1-2 | **No packet exists for MS-PS1-2.** All ten MISA packets were scanned; none mentions chemical reactions. |
| `Matter_and_Its_Interactions.html` | `4-5` | MISA · MS-PS1-2 | Same. |
| `Matter_and_Its_Interactions.html` | `5-5` | MISA · MS-PS1-5 | **No packet for MS-PS1-5**; no packet mentions conservation of mass. |
| `Matter_and_Its_Interactions.html` | `6-5` | MISA · MS-PS1-3 | **No packet for MS-PS1-3.** The single "synthetic" hit across all packets is *photo**synthetic*** in a coral-reef passage. |

## Counting sources against claims

Grade 7's cheapest check, and it is what broke this audit open. **Count the items a packet holds
against the rows citing it.**

| Domain | Released supply | Claimed | Verdict |
|---|---|---|---|
| 8.NS | **2** (2024 Q5, Q7) | 5 | 3 demoted |
| 8.EE | 17 across the 2024 release | 5 | 2 demoted, 3 verified |
| MS-PS1 | 1 packet (`MS-PS1-1 and MS-PS1-4`), one item set | 10 | 4 demoted, 6 verified |

**The tell was arithmetic, not reading.** Five 8.NS claims against a two-item supply is impossible
before you look at a single stem.

## What nearly went wrong — trap #11, again

The first pass noted that the four MISA items naming a standard cited `MS-PS1-2`, `MS-PS1-3` and
`MS-PS1-5`, none of which has a packet, and it would have been easy to conclude the whole `MISA`
label was invented. **It was not.** Rendering the `MS-PS1-1 and MS-PS1-4` packet showed six of the
ten are faithful lifts from its sugar-and-water item set — they simply carry no standard code in
their titles, which is why a code-based search missed them.

The split is almost too neat: **the six items with no standard code are exactly the six that are
real; the four carrying codes are exactly the four that are not.** The likeliest story is that the
set was lifted wholesale and the four were authored later to fill standard coverage, taking their
codes from the standards list rather than from a packet.

**The rule that saved them: a negative search is not proof of absence. Render the pages and look
before demoting an item — the same discipline that governs lifting one.**

## Pre-cleared for the Functions build — adjudicated 21 Jul 2026, not yet used

**These are not claims yet.** No module carries them, so they are deliberately **outside the
"Verified items" tables above** — `tests/mcap_provenance.test.js` parses only those two headings, and
a row there pointing at no card would (correctly) fail as a stale row. Move a row up into the MCAP
table **in the same commit** as the item that uses it.

**Why clear them before authoring rather than after.** The P1 audit above exists because labels were
applied first and checked never. Doing it in this order costs nothing and makes the mistake
structurally impossible: by the time an item can be titled `MCAP ·`, its stem, its citation and its
independently recomputed key are already written down.

The `Math 8 Functions` packet holds **exactly five items — one per 8.F standard.** All five were read
off the rendered page (`MCAP MATHS/…Math 8 Functions…pdf`, pp. 2–6). Citations are as MSDE prints
them, including the internal item codes.

| Packet p. | Citation | Standard | Format | Fit |
|---|---|---|---|---|
| 2 | Math 8 2024 Release, Question 2 (8.F.A.1-1) — No Calculator | 8.F.A.1 → `8.AT.C.6` | multi-select | ✅ direct |
| 3 | Math 8 2024 Release, Question 8 (8.F.A.3-1) — No Calculator | 8.F.A.3 → `8.AT.C.8` | **place two points** | ⚠️ **blocked — see below** |
| 4 | Math 8 2024 Release, Question 14 (8.F.B.5-1) — No Calculator | 8.F.B.5 → `8.AT.D.11` | single MC | ✅ direct |
| 5 | Math 8 2024 Release, Question 20 (8.F.A.2) — Calculator | 8.F.A.2 → `8.AT.C.7` | two drop-downs | ✅ as a two-part item |
| 6 | Math 8 2024 Release, Question 35 (8.F.B.4) — Calculator | 8.F.B.4 → `8.AT.D.10` | single MC | ✅ direct |

**Keys, recomputed independently (`fractions.Fraction`, never floats) before any published key was
consulted:**

| Citation | Working | Key |
|---|---|---|
| Q2 | Distinct inputs: A `1,2,3` ✓ · B `2,2,4` ✗ · C `3,4,5` ✓ · D `6,6,6` ✗ · E `7,8,9` ✓ (repeated *outputs* are fine) | **A, C, E** |
| Q14 | Constant rate of change = the one **straight** segment. `P→Q` is a line segment; `Q→R`, `R→S`, `S→T` are curved | **A — from `P` to `Q`** |
| Q20 | J: `(7−2)/(1−0)=5` and `(12−7)/(2−1)=5` — one slope, so linear; `b=2`. K: `y=3x+8` → `m=3`, `b=8` | slope J **greater than** K; y-intercept J **less than** K |
| Q35 | `m=(600−450)/(20−10)=15`; `b=450−15·10=300`. Only `y=15x+300` fits both `(10,450)` and `(20,600)` | **C — `y = 15x + 300`** |

### `Q8` is blocked, and the reason is worth keeping

The item gives `x + 3y = −3` and asks the student to **place two points** on a −9…9 grid; MCAP then
draws the line through them. Its integer lattice points in view are `(−9,2) (−6,1) (−3,0) (0,−1)
(3,−2) (6,−3) (9,−4)` — and **any two distinct points on the line are correct**, plus non-lattice
points MCAP's interface also accepts.

Our engine grades a plot by exact string match on one hidden `.ans-input`. It cannot express *"any
two of infinitely many"*. Three options, and only one is honest:

1. **Constrain it** — "place the point where the line crosses the y-axis", then the x-axis. This
   grades cleanly, but it **changes the response format and the reasoning**: the released item tests
   *generate any solution*, the constrained one tests *find the intercepts*. Per §7.7.4 that is an
   adaptation, so it **loses the MCAP label** and ships as `Exam-style ·`.
2. **Multiple-choice the points.** Worse — it converts production to recognition, the bar-lowering
   §5 warns about.
3. **Leave it out** and cover `8.AT.C.8` with the textbook supply (Additional Practice 3-3, *Compare
   Linear and Nonlinear Functions* — `TEXTBOOK_SOURCES.md`).

**Take option 1 or 3, never 2, and never option 1 while keeping the label.** This is precisely the
pressure that produced the nine demotions above: a real item that *almost* fits, and a label that
travels with the shape instead of the source.

So the Functions module can carry **four** genuine MCAP capstones covering `8.AT.C.6`, `8.AT.C.7`,
`8.AT.D.10` and `8.AT.D.11`. `8.AT.C.8` gets a textbook-sourced item, and **`8.AT.D.9` has no
released item at all** — it is new in MCCRS 2025, and the 2024 release predates it
(`MCCRS_2025_DUAL_CODING.md`).

## Known-good items not yet used

Real released items available for future capstones, from the 2024 Math 8 release (33 questions):

| Domain | Questions |
|---|---|
| 8.F Functions | Q2, Q8, Q14, Q16, Q20, Q35 — **all unused; 8.F is unbuilt** |
| 8.G Geometry | Q4, Q10, Q19, Q22, Q26, Q29 — **all unused; 8.G is unbuilt** |
| 8.SP Statistics | Q12, Q23 — **both unused; 8.SP is unbuilt** |
| 8.EE | Q3, Q11, Q13, Q15, Q17, Q18, Q21, Q24, Q25, Q27, Q28, Q30, Q32, Q34 |

Plus the per-domain packets (*Functions, Geometry, Modeling, Reasoning, Statistics and Probability*),
which together are the 2024 release. **The Modeling and Reasoning packets are the Type 2/Type 3
material** and are entirely unused.
