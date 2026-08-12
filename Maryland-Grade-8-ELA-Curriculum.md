# Maryland Grade 8 English Language Arts / Literacy Curriculum — Comprehensive Breakdown

### Aligned to the MCCRS revised ELA standards + Montgomery County Public Schools (MCPS)

*Prepared for integration into the Grade 8 app. Course: **English 8**. Verified against MSDE and MCPS sources: **5 August 2026**. Companion to [Maryland-Grade-8-Science-Curriculum.md](Maryland-Grade-8-Science-Curriculum.md); governed by [PROJECT_STANDARD.md](PROJECT_STANDARD.md).*

---

## 0. How to read this document

- **Bold quoted text in the standards tables is verbatim** from the MSDE *Maryland College and Career Ready Standards for English Language Arts* revised grade-level documents. These are the legal grade-level expectations.
- **"Essential skills"** lists are MSDE's own expansion of each standard into teachable sub-ideas — they come from the same PDFs, in the "Essential Skills and Knowledge / Grade Levels: Grade 8" column. **Use these as the skill nodes in the app** (`G7_SKILLS`); they are the closest thing ELA has to the maths evidence statements, and they are authored by the state rather than by us.
- **§4 is the assessment layer and it is NOT the same list as §3.** MCAP assesses a strict subset of the standards. Building only what is tested would gut the course; building without knowing the subset would misallocate the exam capstones. §2.2 of `PROJECT_STANDARD.md` — *curriculum ∪ exam, never a trade-off* — applies here exactly as it does in Science.
- The **term-by-term plan** in §6 follows the MCPS four-marking-period year and the CKLA 6–8 unit sequence MCPS adopted for SY 2025-26.
- **§7 is the part to read before writing any HTML.** ELA does not fit the existing module engine as cleanly as maths or science does, and the gaps are named there.

---

## 1. The things to understand before you build anything

### 1.1 Maryland ELA standards are CCSS-derived, and MSDE re-published them per grade, per strand

Maryland adopted the Common Core State Standards for ELA/Literacy as the **Maryland College and Career Ready Standards (MCCRS)**, fully implemented statewide in 2014. Unlike the 2025 mathematics re-cut (`MCCRS_2025_DUAL_CODING.md`), **there is no renumbering** — Grade 8 ELA still uses `RL.8.x`, `RI.8.x`, `W.8.x`, `SL.8.x`, `L.8.x`.

What *did* change is the packaging. MSDE has published a **revised set of grade-level standards documents**, one per strand per grade, at
`marylandpublicschools.org/programs/Documents/ELA/revised-standards/Grade-Levels/Grade-8-<Strand>-A.pdf`.
Each shows three columns — **Pre-Requisite Skills: Grade 7 · Grade Levels: Grade 8 · Next Progression: Grade 9-10** — plus an MSDE-written "Essential Skills and Knowledge" expansion under each. **This vertical framing is the single most useful thing in the source set** and it maps directly onto the hub's prerequisite rule (§2.3, *no advanced concept before its prerequisite*): the Grade 7 column tells you what a struggling student is missing, and the Grade 9-10 column tells you where the stretch item lives.

> **Caution — the wording in these documents is not always the wording MCAP assesses.** See §9. Where the two disagree, teach from the standards document and **write exam-grade items to the evidence-statement wording**.

### 1.2 Unlike Science, ELA is not a union of three years — but it *is* a union of two courses

The Grade 8 MISA problem (a Grade 8 test covering Grades 6–8 content) has no ELA analogue: **MCAP ELA Grade 8 tests Grade 8 standards only.** However, the Grade 8 ELA test *does* reach outside the English classroom. Its Reading Informational claim explicitly assesses the **literacy-in-content standards**:

- **RST.6-8.x** — Reading Standards for Literacy in Science and Technical Subjects
- **RH.6-8.x** — Reading Standards for Literacy in History/Social Studies

These sit alongside `RI.8.x` in the MCAP Grade 8 evidence statements, one RST and one RH statement per RI anchor. **A Grade 8 student is assessed on reading a lab procedure and a primary source, in the ELA test.** That is a real coverage obligation, and it is the natural bridge to the Science hub already in this repo — an RST item can legitimately use a Physical Science stimulus.

### 1.3 The test is computer-adaptive. This changes what "exam-style" means

Since **Spring 2024**, MCAP ELA/L in grades 6–8 and 10 uses **multistage testing (MST)** — a form of computerized adaptive testing. Students take a common medium-difficulty *router* module, then get routed to an easy/medium or medium/hard module in each subsequent stage.

Two consequences for this hub:

1. **There is no single fixed form to practise against.** Difficulty is a first-class property of an item, not an afterthought. The template's existing phase tags (Foundational / Target / Exam / Stretch) already carry this, and `levelStats{1..4}` already records per-level attempts — **use them properly here**, because for the first time the real exam does the same thing.
2. **Every module is grade-level.** MSDE is explicit: *"All modules, no matter their difficulty level, are grade-level appropriate."* An easy/medium module is not a Grade 7 module. Do not build below-grade content and label it "easy" — that is §2.8 (*on grade*) and it is exactly the bar-lowering §2.4 warns about.

Test length: **four 70-minute stages** (called *sections*), three operational plus one field-test module which may be inserted anywhere. Students must answer each question before advancing, may review within a stage but not after submitting it, and **unanswered questions pull the reported score down**.

### 1.4 MCPS replaced its middle-school ELA curriculum in 2025

MCPS's contract with McGraw Hill **StudySync** expired at the end of SY 2024-25. The Board approved **Core Knowledge Language Arts (CKLA) 6–8** (Core Knowledge Foundation, 2023 middle-school edition) as the replacement, launched **Fall 2025**. So the SY 2026-27 Grade 8 English course a Montgomery County student is actually sitting in is **CKLA Grade 8** — eight knowledge-building units, each built around one full-length core text.

**This matters more than a textbook swap normally would.** CKLA is a *knowledge-building*, science-of-reading curriculum: comprehension is taught through sustained study of a topic, morphology is studied from the core text, and grammar is embedded in unit-long writing projects rather than taught as a separate strand. A practice hub that serves up disconnected passages works *against* that design. §7.4 says what to do about it.

**CKLA 6–8 is openly licensed and downloadable** from `coreknowledge.org` — teacher guides, unit assessments, and most student readers. This is the strongest available source for this subject and it should be acquired before authoring (see §8).

---

## 2. The five strands

Every Grade 8 ELA standard belongs to one of five strands. Two more (RST, RH) apply across content areas.

| Code | Strand | Grade 8 count | Assessed by MCAP? |
|------|--------|---------------|-------------------|
| **RL** | Reading Literature | 10 (RL.8.8 is N/A to literature) | RL.1–3, 5–7, 9 in the *Reading Literature* claim; **RL.4 in the *Vocabulary* claim**; RL.10 not assessed |
| **RI** | Reading Informational Text | 10 | RI.1–3, 5–9 in the *Reading Informational* claim; **RI.4 in the *Vocabulary* claim**; RI.10 not assessed |
| **W** | Writing | 10 | **W.1–W.3 only**, via constructed response. W.4–W.10 are *instructional standards only* |
| **SL** | Speaking & Listening | 6 | **Not assessed at all** |
| **L** | Language | 6 | **L.4, L.5 (and L.6 per the evidence statements)** in the *Vocabulary* claim. L.1–L.3 are assessed **only indirectly**, through the Written Conventions score on a CR |
| **RST** | Literacy in Science & Technical Subjects (6–8 band) | 9 | RST.1–9 within the *Reading Informational* claim |
| **RH** | Literacy in History/Social Studies (6–8 band) | 9 | RH.1–9 within the *Reading Informational* claim |

> **Read that table twice before planning modules.** Roughly half the Grade 8 ELA standards are never directly tested — and they include the entire Speaking & Listening strand and seven of the ten Writing standards. That is not permission to skip them (§2.2), but it *is* the map for where exam capstones can and cannot go. **Never attach a `data-exam="1"` chip to an SL, W.4–W.10, or RL/RI.10 item** — there is no released MCAP item behind it, and the chip would be a false claim about provenance.

---

## 3. Grade 8 standards, with skill nodes

Standard text below is verbatim MSDE. Bullets under each are the MSDE Grade 8 "Essential Skills and Knowledge" (condensed), which are the intended `G7_SKILLS` nodes.

### 3.1 Reading Literature (RL)

| Code | Grade 8 standard (verbatim) |
|------|------------------------------|
| **RL.8.1** | *"Cite multiple pieces of textual evidence that most strongly support an analysis of what the text says explicitly as well as inferences drawn from the text."* ⚠️ see §9.1 |
| **RL.8.2** | *"Determine a theme or central idea of a text and analyze its development over the course of the text, including its relationship to the characters, setting, and plot; provide an objective summary of the text."* |
| **RL.8.3** | *"Analyze how particular lines of dialogue or incidents in a story or drama propel the action, reveal aspects of a character, or provoke a decision."* |
| **RL.8.4** | *"Determine the meaning of words and phrases as they are used in a text, including figurative and connotative meanings; analyze the impact of specific word choices on meaning and tone, including analogies or allusions to other texts."* |
| **RL.8.5** | *"Compare and contrast the structure of two or more texts and analyze how the differing structure of each text contributes to its meaning and style."* |
| **RL.8.6** | *"Analyze how differences in the points of view of the characters and the audience or reader (e.g., created through the use of dramatic irony) create such effects as suspense or humor."* |
| **RL.8.7** | *"Analyze the extent to which a filmed or live production of a story or drama stays faithful to or departs from the text or script, evaluating the choices made by the director or actors."* |
| **RL.8.8** | *Not applicable to literature.* |
| **RL.8.9** | *"Analyze how a modern work of fiction draws on themes, patterns of events, or character types from myths, traditional stories, or religious works such as the Bible, including describing how the material is rendered new."* |
| **RL.8.10** | *"By the end of the year, read and comprehend literature, including stories, dramas, and poems, at the high end of grades 6–8 text complexity band independently and proficiently."* |

**Skill nodes (MSDE Grade 8 essential skills):**

- `rl.evidence.strongest` — among multiple pieces of evidence, determine, select and state **the piece that confirms** the meaning; identify the **strongest** piece that supports an inference. *(The comparative — "strongest" — is the whole Grade 8 delta from Grade 7's "multiple pieces." Do not author an item that only asks for* an *ok piece of evidence.)*
- `rl.theme.develop` — determine the interaction among characters, setting and plot; examine that interaction to express a theme; present sound reasoning and well-chosen details.
- `rl.summary.objective` — paraphrase to compose an unbiased summary including beginning, middle and end.
- `rl.character.dialogue` — examine what a character thinks, says or does; connect a character's speech/thoughts/actions to movement in the plot; show how speech reflects traits.
- `rl.word.tone` — interpret **analogies and literary allusions**; use context; use Greek/Latin affixes and roots; verify inferred meaning in a dictionary.
- `rl.structure.compare` — demonstrate understanding of literary style; explain how the structures of multiple texts are alike and different; examine how structure influences the way a text is written.
- `rl.pov.irony` — demonstrate knowledge of mood; compare one's own views to a character's; explain how shared or opposing points of view between reader and character generate mood.
- `rl.media.production` — examine likenesses/differences between a written text and its filmed or staged version; assess the positive and negative effects of departing from the original.
- `rl.archetype.modern` — demonstrate an understanding of **universality**; compare literary elements of a modern text to a traditional one; examine how characters, plots and themes evolved from traditional to modern.
- `rl.complexity.independent` — adjust strategies for a range of grade-appropriate literary texts across diverse cultures and time periods while self-monitoring for comprehension.

### 3.2 Reading Informational Text (RI)

| Code | Grade 8 standard (verbatim) |
|------|------------------------------|
| **RI.8.1** | *"Cite the textual evidence that most strongly supports an analysis of what the text says explicitly as well as inferences drawn from the text."* |
| **RI.8.2** | *"Determine a central idea of a text and analyze its development over the course of the text, including its relationship to supporting ideas; provide an objective summary of the text."* |
| **RI.8.3** | *"Analyze how an author makes connections among and distinctions between individuals, ideas, or events (e.g., through comparisons, analogies, or categories)."* |
| **RI.8.4** | *"Analyze the impact of specific word choices on meaning and tone, including analogies or allusions to other texts; determine the meaning of words and phrases as they are used in a text, including figurative, connotative, and technical meanings."* |
| **RI.8.5** | *"Analyze in detail the structure of a specific paragraph in a text, including the role of particular sentences in developing and refining a key concept."* |
| **RI.8.6** | *"Determine an author's point of view or purpose in a text and analyze how the author acknowledges and responds to conflicting evidence or viewpoints."* |
| **RI.8.7** | *"Evaluate the advantages and disadvantages of using different mediums (e.g., print or digital text, video, multimedia) to present a particular topic or idea."* |
| **RI.8.8** | *"Delineate and evaluate the argument and specific claims in a text, assessing whether the reasoning is sound and the evidence is relevant and sufficient; recognize when irrelevant evidence is introduced."* |
| **RI.8.9** | *"Analyze a case in which two or more texts provide conflicting information on the same topic and identify where the texts disagree on matters of fact or interpretation."* |
| **RI.8.10** | *"By the end of the year, read and comprehend literary nonfiction at the high end of the grades 6–8 text complexity band independently and proficiently."* |

**Skill nodes:**

- `ri.evidence.strongest` — select, among multiple pieces, the evidence that confirms meaning and the piece that logically suggests an author's purpose, opinion or important idea; use word relationships; distinguish connotation from denotation.
- `ri.central.develop` — determine relationships among ideas throughout a text; synthesize relevant evidence to formulate a central idea; paraphrase into an unbiased summary that tracks the idea's development.
- `ri.connections.distinctions` — determine likenesses/differences among individuals, ideas or events; identify **how** those are revealed (comparison, analogy, category); draw conclusions about the effectiveness of the method.
- `ri.word.technical` — determine effect of **analogy and allusion** on meaning; figures of speech in context; Greek/Latin roots; connotations of words sharing a technical meaning.
- `ri.paragraph.structure` — determine the development of an identified paragraph (main idea/details, cause-effect, examples, description); determine its purpose; determine relationships among its sentences; conclude how those relationships grow the idea.
- `ri.pov.counterclaim` — identify author's purpose and point of view; determine the difference between the author's position and opposing positions; examine transitions that signal and address opposing viewpoints; use words/phrases/clauses to clarify claim–counterclaim–reason relationships.
- `ri.medium.evaluate` — draw conclusions about positive and negative aspects of text vs audio vs visual presentation; determine how sound and sight affect perception of words; **assess the value of one medium versus another** for a specific topic.
- `ri.argument.evaluate` — demonstrate knowledge of the organizational pattern of an argument; assess its value on supported claims; **identify immaterial support**; assess credibility and accuracy of evidence.
- `ri.conflict.sources` — compare opposing information on the same topic from multiple texts; determine the credibility of each; examine opposing portions for bias; draw conclusions about the purpose of opposing facts or interpretations.
- `ri.complexity.independent` — demonstrate understanding of a wide range of sufficiently complex literary nonfiction.

### 3.3 Literacy in Science/Technical (RST) and History/Social Studies (RH), grades 6–8 band

Assessed inside the Reading Informational claim. Paired one-to-one with the RI anchors:

| Anchor | RST.6-8 | RH.6-8 |
|--------|---------|--------|
| 1 · Evidence | Cite specific textual evidence to support analysis of science and technical texts | Cite specific textual evidence to support analysis of primary and secondary sources |
| 2 · Central idea | Determine central ideas/conclusions; summarize distinct from prior knowledge or opinion | Determine the central idea of a primary or secondary source; summarize accurately |
| 3 · Process | **Follow precisely a multistep procedure** when carrying out experiments, taking measurements, or performing technical tasks | Identify key steps in a text's description of a process (e.g., how a bill becomes a law) |
| 4 · Vocabulary | Determine meaning of symbols, key terms and domain-specific words in a scientific/technical context | Determine meaning of words including vocabulary specific to history/social studies |
| 5 · Structure | Analyze the structure an author uses to organize a text and how major sections contribute to the whole | Describe how a text presents information (sequentially, comparatively, causally) |
| 6 · Purpose | Analyze the author's purpose in providing an explanation, describing a procedure, or discussing an experiment | Identify aspects revealing point of view or purpose (loaded language, avoided facts) |
| 7 · Integration | Integrate quantitative/technical information in words with the same information expressed **visually** (flowchart, diagram, model, graph, table) | Integrate visual information (charts, graphs, photographs, videos, maps) with print and digital text |
| 8 · Reasoning | Distinguish among fact, reasoned judgment based on research findings, and speculation | Distinguish among fact, opinion, and reasoned judgment |
| 9 · Cross-source | Compare information from experiments/simulations/videos with that gained from reading | Analyze the relationship between a primary and a secondary source on the same topic |

> **RST.7 and RH.7 demand a real graphic.** This is the ELA form of the standard's *"A lifted exam item must bring its stimulus"* rule (`CLAUDE.md`): an RST.7 item without the flowchart is a reading-comprehension item wearing an RST label.

### 3.4 Writing (W)

| Code | Grade 8 standard (verbatim, MCAP evidence-statement wording) |
|------|--------------------------------------------------------------|
| **W.8.1** | *"Write arguments to support claims with clear reasons and relevant evidence."* — a. introduce claim(s), **acknowledge and distinguish from alternate or opposing claims**, organize reasons and evidence logically · b. support with logical reasoning, relevant evidence, accurate credible sources · c. use words, phrases and clauses to create cohesion and clarify relationships among claim(s), reasons and evidence · d. establish and maintain a formal style · e. provide a concluding statement or section that follows from the argument |
| **W.8.2** | *"Write informative/explanatory texts to examine a topic and convey ideas, concepts, and information through the selection, organization, and analysis of relevant content."* — a. introduce topic, preview, organize into broader categories, include formatting/graphics/multimedia · b. develop with relevant facts, definitions, concrete details, quotations · c. appropriate and varied transitions · d. precise language and domain-specific vocabulary · e. formal style · f. concluding statement |
| **W.8.3** | *"Write narratives to develop real or imagined experiences or events using effective technique, relevant descriptive details, and well-structured event sequences."* — a. engage and orient the reader, establish context and point of view, organize a natural event sequence · b. narrative techniques: **dialogue, pacing, description, reflection** · c. transitions signalling shifts in time frame or setting · d. precise words and sensory language · e. conclusion that reflects on the narrated events |
| **W.8.4** | Produce clear and coherent writing appropriate to task, purpose and audience. *(instructional only)* |
| **W.8.5** | Develop and strengthen writing by planning, revising, editing, rewriting or trying a new approach, **focusing on how well purpose and audience have been addressed**. *(instructional only)* |
| **W.8.6** | Use technology to produce and publish and to present relationships between information and ideas efficiently. *(instructional only)* |
| **W.8.7** | Conduct short research projects to answer a question (including a self-generated question), drawing on several sources and generating further focused questions. *(instructional only)* |
| **W.8.8** | Gather information from multiple print and digital sources using search terms effectively; assess credibility; quote or paraphrase while avoiding plagiarism and following a standard citation format. *(instructional only)* |
| **W.8.9** | Draw evidence from literary or informational texts to support analysis, reflection and research. *(instructional only — but it is the hinge between reading and the CR)* |
| **W.8.10** | Write routinely over extended and shorter time frames for a range of discipline-specific tasks, purposes and audiences. *(instructional only)* |

### 3.5 Speaking & Listening (SL) — taught, never tested

| Code | Grade 8 standard (verbatim) |
|------|------------------------------|
| **SL.8.1** | *"Engage effectively in a range of collaborative discussions (one-on-one, in groups, and teacher-led) with diverse partners on grade 8 topics, texts, and issues, building on others' ideas and expressing their own clearly."* — a. come prepared, drawing explicitly on preparation · b. follow rules for collegial discussions, set goals and deadlines, define roles · c. pose questions that elicit elaboration · d. **acknowledge new information and, when warranted, modify their own views** |
| **SL.8.2** | *"Analyze the purpose of information presented in diverse media and formats (e.g., visually, quantitatively, orally) and evaluate the motives (e.g., social, commercial, political) behind the presentation."* |
| **SL.8.3** | *"Delineate a speaker's argument and specific claims, evaluating the soundness of the reasoning and relevance and sufficiency of the evidence and identifying when irrelevant evidence is introduced."* |
| **SL.8.4** | *"Present claims and findings, emphasizing salient points in a focused, coherent manner with relevant evidence, sound valid reasoning, and well-chosen details; use appropriate eye contact, adequate volume, and clear pronunciation."* |
| **SL.8.5** | *"Integrate multimedia and visual displays into presentations to clarify information, strengthen claims and evidence, and add interest."* |
| **SL.8.6** | *"Adapt speech to a variety of contexts and tasks, demonstrating command of formal English when indicated or appropriate."* |

> **SL.8.2 and SL.8.3 are the two worth building.** SL.8.3 is RI.8.8 in an audio wrapper — same delineate-and-evaluate move, same *"recognize irrelevant evidence"* delta — so a shared skill node serves both. SL.8.2's *evaluate the motives* is the media-literacy standard and has no written analogue. The other four are performance standards a self-paced hub cannot honestly assess; **teach them, do not fake-score them.**

### 3.6 Language (L)

| Code | Grade 8 expectations (verbatim sub-standards) |
|------|-----------------------------------------------|
| **L.8.1** | Conventions of grammar and usage. a. *Explain the function of **verbals (gerunds, participles, infinitives)*** in general and in particular sentences · b. *Form and use verbs in the **active and passive voice*** · c. *Form and use verbs in the **indicative, imperative, interrogative, conditional and subjunctive mood*** · d. *Recognize and correct **inappropriate shifts in verb voice and mood*** |
| **L.8.2** | Capitalization, punctuation, spelling. a. *Use **punctuation (comma, ellipsis, dash) to indicate a pause or break*** · b. *Use an **ellipsis to indicate an omission*** · c. *Spell correctly* |
| **L.8.3** | *"Use verbs in the active and passive voice and in the conditional and subjunctive mood to achieve particular effects (e.g., emphasizing the actor or the action; expressing uncertainty or describing a state contrary to fact)."* |
| **L.8.4** | Determine or clarify meaning of unknown and multiple-meaning words based on grade 8 reading. a. context · b. **Greek and Latin affixes and roots** (*precede, recede, secede*) · c. reference materials · d. verify the preliminary determination |
| **L.8.5** | Figurative language, word relationships, nuance. a. *Interpret figures of speech (e.g., **verbal irony, puns**) in context* · b. *Use the relationship between particular words to better understand each* · c. *Distinguish among the connotations of words with similar denotations (e.g., **bullheaded, willful, firm, persistent, resolute**)* |
| **L.8.6** | *"Acquire and use accurately grade-appropriate general academic and domain-specific words and phrases; gather vocabulary knowledge when considering a word or phrase important to comprehension or expression."* |

**Grade 8 is the verbals-and-mood year.** Grade 7 did phrases and clauses; Grade 9-10 does parallel structure. The Grade 8 delta is precisely: verbals, active/passive voice, the five moods, and correcting inappropriate shifts. Anything else in the grammar strand is review, and should be tagged Foundational, not Target.

---

## 4. What MCAP actually assesses

*Source: MCAP ELA/L Grades 4-8 and 10 High Level Blueprint, February 2024; MCAP ELA/L Grade 8 Evidence Statements, 2023-24.*

### 4.1 Test structure

| Section | Task | Standards | Items |
|---------|------|-----------|-------|
| 1 | Informational Single Passage **AND** Literary Single Passage | RI.1–RI.9 · RL.1–RL.9 · L.4–L.5 | 6–8 items **per passage** |
| 2 | **Literary Performance Task** — paired literary passages linked by theme or topic | RL.1–RL.9 · L.4–L.5 · W.1–W.3 | 6–9 items **+ 1 CR** |
| 3 | **Informational Performance Task** — paired informational passages linked by topic | RI.1–RI.9 · L.4–L.5 · W.1–W.3 | 6–9 items **+ 1 CR** |
| 4 | One of the above three formats | as above | 6–9 items (+1 CR if a PT) |

Three sections are operational; one contains field-test items, and field-test content may appear in **any** of the four. Under MST, section 1 is the router; the literary and informational performance tasks alternate across stages 2 and 3, so **every student sees exactly one literary PT and one informational PT**.

**Points per claim: Reading 44 · Writing 22.** *(The published blueprint does not show how 22 writing points decompose; two CRs at 4 written-expression + 3 written-conventions = 14. Do not present a derived breakdown as fact — see §9.6.)*

### 4.2 The four claims

1. **Reading Literature** — *Students read and demonstrate comprehension of grade-level complex literary texts.* → RL.1, 2, 3, 5, 6, 7, 9
2. **Reading Informational Text** — *…complex informational texts.* → RI.1, 2, 3, 5, 6, 7, 8, 9 **+ RST.1–9 + RH.1–9**
3. **Vocabulary Interpretation and Use** — *Students use context to determine the meaning of words and phrases.* → **RL.4, RI.4, RST.4, RH.4, L.4, L.5, L.6**
4. **Writing** — *Students write effectively when using and/or analyzing sources.* → W.1, W.2, W.3

> **Claim 3 is the one people get wrong.** RL.4 and RI.4 are *not* reported under reading — they sit in Vocabulary alongside the Language standards. A hub that files "word choice and tone" under a reading unit will produce a mastery bar that doesn't match the score report the family receives.

### 4.3 Explicitly not assessed

The Grade 8 evidence statements state, in these words, *"Instructional standard only. This standard is not directly assessed on the ELA/L Grade 8 MCAP"* for: **W.4, W.5, W.6, W.7, W.8, W.9, W.10.** Also absent from every claim: **RL.8** (N/A to literature), **RL.10**, **RI.10**, **all of Speaking & Listening**, and **L.1–L.3** (which surface only through the Written Conventions dimension of a CR score).

### 4.4 Scoring

Constructed responses are scored on **two dimensions**, holistically:

- **Written Expression — 0 to 4 points.** At 4: full and complete understanding of ideas in the texts; accurate analysis with effective and convincing textual evidence; clear and coherent development, organization and style appropriate to task, purpose and audience; strong connections among ideas; **for argument, opposing claims clearly acknowledged and soundly addressed**.
- **Written Conventions — 0 to 3 points.** At 3: full command of conventions; varied, well-formed and effectively controlled sentence structures; strong grammar and usage; spelling, punctuation and capitalization mostly correct.

Three rubrics exist for grades 6-8 and 10 — **Argumentative, Informative/Explanatory, Narrative** — and the prompt determines which applies.

Reported performance is on a **four-level scale**. Grade 8 reading PLDs are defined *against text complexity*, not against item count: at Level 4 a student shows *mostly accurate* understanding of **very complex** text, *accurate* understanding of **moderately complex** text, and *extensive* understanding of **readily accessible** text. Text complexity is set by two quantitative tools (**Lexile and Flesch-Kincaid**) plus MSDE's qualitative Text Complexity Analysis Worksheets, and each passage is classified **readily accessible / moderately complex / very complex**.

> **This is the most build-relevant fact in the whole assessment section.** MSDE says *50 percent of an item's complexity is linked to the complexity of the text used as its stimulus.* A hub that tracks mastery per *skill* without tracking the *complexity of the passage the skill was demonstrated on* is measuring half of what MCAP measures. See §7.3.

### 4.5 When it happens

**SY 2026-27 spring administration: 29 March – 28 May 2027** (ELA grades 3–8 and 10; the LEA picks its own window inside the state window). Grade 8 students in Maryland therefore sit **ELA, Mathematics, MISA science and Social Studies 8 in the same window** — a scheduling fact that should shape the review ladder's spacing across all three subjects in this hub.

---

## 5. Text complexity

| | |
|---|---|
| Band | Grades 6–8 |
| Grade 8 target | **The high end of the 6–8 band, independently and proficiently** (RL.8.10, RI.8.10) |
| Quantitative tools | Lexile **and** Flesch-Kincaid, both applied to every passage |
| Qualitative tool | MSDE/New Meridian *Text Complexity Analysis Worksheets* — one informational, one literary |
| Classification | readily accessible · moderately complex · very complex |

⚠️ The specific Lexile range for the 6–8 CCR "stretch" band lives in **CCSS Appendix A**, which this repo does not hold. Acquire it (§8) rather than citing a remembered number.

---

## 6. Term-by-term plan (MCPS / CKLA Grade 8)

MCPS runs four marking periods. CKLA Grade 8 has eight units, each anchored to one full-length core text — two per marking period is the natural fit, though MCPS pacing may differ and should be confirmed against the school's own calendar.

| MP | CKLA units | Core texts | Dominant strands |
|----|-----------|------------|------------------|
| **1** | **U1 Us, in Progress** — short stories about young Latinos · **U2 Frankenstein** (Shelley) | short-story collection; novel | RL.1–3, RL.6 (dramatic irony is *made* for *Frankenstein*'s frame narrative), L.4–L.5, W.3 |
| **2** | **U3 Narrative of the Life of Frederick Douglass** · **U4 The Genius of the Harlem Renaissance** | autobiography / primary source; poetry & essays | RI.1–3, RI.6, **RH.1–9** (Douglass is a primary source — the RH standards land here naturally), RL.4, W.2 |
| **3** | **U5 A More Perfect Union: Voices for Civil Rights in America** · **U6 The Squatter and the Don** | speeches & documents; novel | **RI.8 (argument), RI.9 (conflicting sources)**, RL.9, W.1, SL.8.2–8.3 |
| **4** | **U7 The Importance of Being Earnest** (Wilde) · **U8 Realms of Gold, Vol. 3** | drama; poetry/short story/essay anthology | RL.3, RL.5, RL.7 (staged production), L.5a **verbal irony and puns** — Wilde is the canonical vehicle; RL.8.10 independent reading |

**Sequencing note.** MCAP falls at the *end* of MP4 (late March at the earliest). Two obligations follow, and they are the same two the Science plan (`TODO.md` P5.6) already carries:

1. **The argument standards (RI.8.8, RI.8.9, W.8.1) land in MP3, and the test is in MP4.** They must enter the review ladder immediately, not be re-taught in a cram.
2. **RST is homeless.** Nothing in the CKLA Grade 8 sequence is a science or technical text, yet RST.1–9 are assessed. **Build RST retrieval sets against the Science hub's own Physical Science material** — a lab procedure from *Matter and Its Interactions* is a legitimate RST.3 and RST.7 stimulus, and reusing it costs nothing and reinforces both subjects.

---

## 7. Build implications for the hub

### 7.1 Naming and storage

Per `PROJECT_STANDARD.md` §4, **every new subject's topic ids must be subject-prefixed**. Use `ela.` — e.g. `ela.reading-literature`, `ela.reading-informational`, `ela.language`, `ela.writing`. `G7_STORE` stays `g8.`; do not fork it. Add ELA as a new entry in the hub's `SUBJECTS` array with its own `units`, and honour `STUDENT_SUBJECTS` for per-student visibility.

### 7.2 The six item formats do not cover ELA. Say so before authoring, not after

| MCAP ELA item behaviour | Existing template format | Verdict |
|---|---|---|
| **Two-part evidence-based selected response** (Part A: inference/claim → Part B: which quotation best supports it) | **two-part (A unlocks B)** | ✅ **Already supported, and it is the single most important ELA format.** RL.8.1 / RI.8.1's *"most strongly supports"* is literally a Part B. Build these first. |
| Single multiple choice over a passage | single MC | ✅ |
| Select **all** correct statements / multiple evidence pieces | multi-select | ✅ |
| **Constructed response, rubric-scored** | constructed-response | ⚠️ Exists but is self-check. See §7.5. |
| **Select-in-passage / hot text** — click the sentence where the author introduces irrelevant evidence (RI.8.8), or the sentence that refines the key concept (RI.8.5) | *none* | ❌ **Gap.** This is the ELA analogue of the click-to-plot problem: a standard whose verb is *identify within the text* is not met by picking a paraphrase from four options. |
| Drag-to-order / categorise (sequence events, sort claims vs evidence) | *none* | ❌ Gap; lower priority. |
| Fill-in numeric | fill-in | — not applicable to ELA |

**Do not hand-roll the missing formats inside an ELA module.** `PROJECT_STANDARD.md` §7.2 and the click-to-plot precedent are explicit: a new input surface belongs in `Starter_Kit/Module_Template.html`, painted over a hidden `.ans-input` so the ordinary engine still does grading, locking, restore and review-reset — and it needs its own test file alongside `tests/plot_format.test.js`. **Select-in-passage should be built in the template first, in Grade 7, and inherited.**

### 7.3 Passages are stimuli, and the stimulus rule bites harder here

`CLAUDE.md`: *"A lifted exam item must bring its stimulus."* In maths that means a diagram; **in ELA the stimulus is the entire passage**, and a passage-less ELA item is not a weakened item — it is not an item. Consequences:

- ELA modules will be **much larger files** than maths modules. Budget for it; do not compensate by shortening passages, which silently lowers text complexity and therefore, per MSDE, half the item's difficulty.
- **Record text complexity per passage** (`readily accessible` / `moderately complex` / `very complex` plus the Lexile if known) as an attribute on the passage, and surface it in the teacher dashboard. This is the ELA equivalent of the `Stimulus` column in `MCAP_PROVENANCE.md`, and it should be enforced the same way — by a test.
- Paired passages are not decoration. RL.8.5 (*compare the structure of two or more texts*), RI.8.9 (*two texts provide conflicting information*) and RL.8.9 (*modern fiction drawing on traditional sources*) **cannot be assessed with one passage.** A module claiming those standards must ship two.

### 7.4 Knowledge-building vs. drill

CKLA teaches comprehension through sustained knowledge of a topic; a hub that serves random passages fights that. **Organise ELA modules around the CKLA units, not around the standards.** A `ela.harlem-renaissance` module that exercises RI.1, RI.2, RI.6, RL.4 and L.5 on Harlem Renaissance texts is both better pedagogy and a better match to what the student is doing in class than five thin per-standard modules. The skill nodes in §3 still do the mastery tracking underneath — that is exactly what `skillStats` is for.

### 7.5 Constructed responses, hints, and the one thing that must not happen

A rubric-scored CR cannot be auto-graded honestly. Three defensible options, in order of preference:

1. **Self-assessment against the actual MSDE rubric**, shown to the student *after* they submit, with the two dimensions separated (Written Expression 0–4, Written Conventions 0–3). Record the self-score as evidence, flag it as self-reported, and surface the response verbatim on the teacher dashboard for real scoring.
2. **Teacher-scored**, via the existing dashboard.
3. Structured pre-writing that *is* auto-gradable (choose the strongest claim; select the two quotations that best support it; identify the sentence that acknowledges the opposing claim) — feeding into an ungraded full write.

**What must never happen:** a Hint button on a CR that contains a model paragraph. That is a worked solution and an answer key (§2.4), and in ELA it is worse than in maths because the student can transcribe it. Hints on ELA items name the move — *"reread the paragraph before the quotation and ask what the narrator knows that the character does not"* — and stop.

### 7.6 Spaced review: what belongs on the ladder and what doesn't

The `1 → 3 → 7 → 21 → 42` ladder and `?review=<skill>` work by re-serving **already-authored items** for the skill. That is a clean fit for some ELA skills and a bad fit for others:

| Fits the ladder | Does not |
|---|---|
| `L.8.4` Greek/Latin roots, `L.8.5` connotation and figures of speech, `L.8.1` verbals/voice/mood, `L.8.2` punctuation — discrete, re-testable, and **exactly the Vocabulary claim MCAP reports separately** | Passage-dependent reading analysis. Re-serving the *same* passage tests memory of that passage, not the skill. |
| Argument-structure recognition (`ri.argument.evaluate`) on short, swappable stimuli | Anything where the student has already seen and discussed the text at length |

For the reading skills, the ladder needs **a fresh passage at the same complexity level** on each revisit — which means authoring a *bank* per skill, not a single set. Until that bank exists, put Language and Vocabulary on the ladder and leave reading analysis off it rather than shipping a review that is really a recall test.

**And the one regression to watch for is unchanged: a due revisit must never pre-fill its answers.** `restoreProgress()` re-fills completed work by design; review mode exists to prevent exactly that. In ELA the failure would be even quieter — a student re-reading their own annotation of a passage feels like reviewing.

---

## 8. Sources to acquire

None of these are in the repo yet. Nothing ELA is. Priority order:

**Tier 1 — cannot author without these**

1. **CKLA Grade 8 teacher guides and student readers, Units 1–8** — `coreknowledge.org` (openly licensed; some third-party student books are copyrighted and print-only). This is the curriculum MCPS is actually teaching and it is free. *Direct example already located: `coreknowledge.org/wp-content/uploads/2023/08/CKLA_G8_U2_TG_Web.pdf` (Unit 2, Frankenstein).*
2. **MCAP released ELA items** — MSDE Public Release Site, `itempra.org/public`. The direct analogue of `MCAP MATHS/`. Every lifted item must arrive **with its passage**, or it is not usable.
3. **MCAP ELA/L practice tests, grades 3-8 and 10** — `support.mdassessments.com/practice-tests/english/`. These show the real MST interface and item interactions, which is how to specify the select-in-passage format correctly.

**Tier 2 — needed for correct alignment**

4. The five MSDE revised standards PDFs for Grade 8 (`Reading-Literature`, `Reading-Informational`, `Writing`, `Speaking-and-Listening`, `Language`) — plus the **Grade 7** and **Grade 9-10** equivalents, since the prerequisite/next-progression columns are what the mastery gating needs.
5. **MSDE Disciplinary Literacy Frameworks, Grades 6-8** — Reading in History/Social Studies and in Science/Technical Subjects. These are the RST/RH standards this hub must cover and currently has nothing for.
6. **MCAP ELA/L Grade 8 Evidence Statements** and the **Grades 4-8 & 10 High-Level Blueprint (Feb 2024)** — archive locally, as the maths equivalents are.
7. The three **grades 6-8 & 10 rubrics** (Argumentative, Informative/Explanatory, Narrative), 2024 versions.
8. **CCSS Appendix A and B** — text complexity bands and exemplar texts. §5 has a hole without them.
9. **New Meridian Text Complexity Analysis Worksheets** (literary and informational) — the actual instrument MSDE uses to classify a passage, i.e. how to classify our own.

**Tier 3 — context**

10. MCPS Board of Education middle-school ELA curriculum approval package (May 2025) — the adoption record and the pacing intent.
11. MCAP ELA/L Grade 8 Performance Level Descriptors (DRAFT, August 2021) — useful for mastery thresholds; **confirm whether a post-2021 version exists** before treating it as current.

---

## 9. Provenance notes and errata

These are real defects and inconsistencies in the official documents. Record them; do not silently "fix" them in a module, and do not let a coded audit assume the documents agree.

1. **RL.8.1 disagrees with itself across MSDE documents.** The revised standards PDF reads *"Cite **multiple pieces of** textual evidence that most strongly **support**…"*; the MCAP Grade 8 evidence statements (and CCSS) read *"Cite **the** textual evidence that most strongly **supports**…"*. **RI.8.1 uses the second wording in both.** Author exam-grade RL.8.1 items to the evidence-statement wording.
2. **The RL.8.6 evidence statement describes the Grade 7 standard.** It pairs the Grade 8 dramatic-irony standard with the evidence bullet *"Provides an analysis of how an author develops and contrasts the points of view of different characters or narrators in a text"* — which is RL.7.6. The Grade 8 PLD document has the correct Grade 8 bullet. **Trust the PLD here.**
3. **The RI.8.7 evidence statement pairs the Grade 7 standard text with the Grade 8 evidence.** The standard column shows RI.7.7 (*compare and contrast a text to an audio, video, or multimedia version*) while the evidence bullet correctly describes RI.8.7 (*evaluate the advantages and disadvantages of using different mediums*). The revised standards PDF confirms RI.8.7 is the mediums-evaluation standard.
4. **RI.8.3 subject differs by document:** standards PDF says *"Analyze how **an author** makes connections…"*; evidence statements say *"Analyze how **a text** makes connections…"*. Immaterial to item design; noted so a diff doesn't look like a finding.
5. **The Language strand PDF has a column-header error.** The Language Standard 3 "Desired Student Performance" table is headed *"Pre-Requisite Skills: Grade 1 · Grade Levels: Grade 2 · Next Progression: Grade 3"*. The content beneath is Grade 7/8/9-10 and is correct.
6. **The blueprint's point totals do not decompose from published information.** Reading 44 / Writing 22 are stated; the item-to-point mapping is not. Two CRs at (4 + 3) = 14 ≠ 22. Do not publish a derived breakdown.
7. **The blueprint lists `L.4 – L.5`; the evidence statements also assess `L.6`.** The Grade 8 PLD reading table says *"Language MCCRS 4-5"*. Treat L.6 as assessed-but-unblueprinted and weight it lightly.
8. **The blueprint PDF carries a stray header line** reading *"Restraint and Seclusion Student Data Collection Manual MCAP ELA/L (Grades 4-8 and 10) 2022 – 2023"* — a template artefact. The document's own footer dates it **February 2024**. The same artefact appears in the 2024 rubric PDFs.
9. **The RL.8.1 "Next Progression" column shows RL.11-12.1** while the column is headed Grade 9-10.
10. **The MST design document is dated 2023–2024** and states MST covers grades 6-8 and 10, with grades 3-5 targeted for Spring 2026. **Confirm the current-year status** before describing grades 3-5 to a user.
11. **The PLD document is marked DRAFT, August 2021** — it predates both MST and the revised standards documents. Everything in §4.4 drawn from it is flagged accordingly.

---

## 10. Sources

- [MCCRS for ELA — standards landing page (MSDE)](https://marylandpublicschools.org/programs/pages/ela/standards.aspx)
- [Grade 8 Reading Literature (MSDE, revised standards)](https://www.marylandpublicschools.org/programs/Documents/ELA/revised-standards/Grade-Levels/Grade-8-Reading-Literature-A.pdf)
- [Grade 8 Reading Informational Text (MSDE, revised standards)](https://www.marylandpublicschools.org/programs/Documents/ELA/revised-standards/Grade-Levels/Grade-8-Reading-Informational-A.pdf)
- [Grade 8 Writing (MSDE, revised standards)](https://marylandpublicschools.org/programs/documents/ela/revised-standards/grade-levels/grade-8-writing-a.pdf)
- [Grade 8 Speaking and Listening (MSDE, revised standards)](https://www.marylandpublicschools.org/programs/Documents/ELA/revised-standards/Grade-Levels/Grade-8-Speaking-and-Listening-A.pdf)
- [Grade 8 Language (MSDE, revised standards)](https://marylandpublicschools.org/programs/documents/ela/revised-standards/grade-levels/grade-8-language-a.pdf)
- [MCAP ELA/L Grades 4-8 and 10 High Level Blueprint, Feb 2024](https://marylandpublicschools.org/programs/Documents/ELA/MCAP/MCAP-Blueprint-ELA-4-8-and-10-2024-A.pdf)
- [MCAP ELA/L Grade 8 Evidence Statements](https://marylandpublicschools.org/programs/Documents/ELA/EvidenceStatements/MCAP-ELA-Evidence-Statements-Grade-8-A.pdf)
- [Multistage Testing (MST) in MCAP English Language Arts](https://marylandpublicschools.org/programs/Documents/ELA/MCAP-ELA-MST-A.pdf)
- [MCAP Argumentative Rubric, Grades 6-8 and 10 (2024)](https://marylandpublicschools.org/programs/Documents/ELA/MCAP/Rubrics/2024/MCAP-Rubric-ELA-Grades-6-8-10-Argumentative-A.pdf)
- [MCAP ELA/L Grade 8 Performance Level Descriptors (DRAFT Aug 2021)](https://www.marylandpublicschools.org/programs/Documents/ELA/MCAP/Grades/Grade8PLDsELA.pdf)
- [MCAP English Language Arts and Literacy — assessment page (MSDE)](https://marylandpublicschools.org/about/pages/daait/assessment/mcap/elal.aspx)
- [State Assessment Calendar 2026-2027 (MSDE)](https://marylandpublicschools.org/programs/Documents/Testing/26-27-State-Assessment-Calendar.pdf)
- [MSDE Public Release Site — released MCAP items](https://itempra.org/public/)
- [MCAP practice tests, grades 3-8 and 10](https://support.mdassessments.com/practice-tests/english/)
- [MCPS Middle School English Language Arts Curriculum Approval, May 2025](https://go.boarddocs.com/mabe/mcpsmd/Board.nsf/files/DGVTGQ775603/$file/MS%20ELA%20Curr%20Approval%20250522.pdf)
- [Core Knowledge Language Arts 6-8 — curriculum profile (Knowledge Matters)](https://knowledgematters.org/curriculum/core-knowledge-language-arts-6-8/)
- [CKLA Grade 8 Unit 2 (Frankenstein) Teacher Guide — Core Knowledge Foundation](https://www.coreknowledge.org/wp-content/uploads/2023/08/CKLA_G8_U2_TG_Web.pdf)
- [MCPS to implement new middle school English curriculum (Bethesda Magazine, June 2025)](https://bethesdamagazine.com/2025/06/04/mcps-middle-school-curriculum/)
