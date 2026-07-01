# New Grade Setup — instantiation checklist

Use this to spin up a new grade/subject hub (e.g., Grade 8 Math) from the Starter Kit, at full quality, no dilution.

## A. Create the project
1. Make a **new project** and a **new folder** for the grade (keeps memory + files clean and separate).
2. Copy the whole `Starter_Kit` into that folder.
3. Rename `Hub_Template.html` → e.g. `Grade_8_Math_Hub.html`.
4. Rename `PROJECT_STANDARD_TEMPLATE.md` → `PROJECT_STANDARD.md` and fill in every `[BRACKETED]` blank (grade, subject, exam program, curriculum units + standards, textbooks).

## B. Add the source materials
5. Drop the grade's **textbooks** and **exam materials** (test + answer key + blueprint) into the folder. These are mandatory sources — they get consulted for every unit.

## C. Configure the hub (one edit)
6. In the hub file, edit the **`SUBJECTS` array** (`subjects -> units -> topics`): list each subject and its units/topics. Set `status:'available'` + `file:'<module>.html'` for ready topics; `status:'soon'` for the rest. Give every topic id a subject prefix (e.g. `math.slope`, `sci.cells`) so subjects never collide in storage. Update the title text.

## D. Build units (repeat per unit)
7. For each unit, follow **"How to add a new unit"** in `PROJECT_STANDARD.md`:
   - copy `Module_Template.html`, set `G7_TOPIC_ID` (subject-prefixed) / `G7_TOPIC_TITLE` / `G7_SKILLS`;
   - scan the folder, read the unit's chapters, curate the **best** explanations + exercises;
   - weave the grade's real **exam items** as `Exam` capstones;
   - author in correct flow, hints sparingly, one worked example per skill;
   - add the topic to the right subject's `units` in the hub `SUBJECTS`; verify; confirm the dashboard updates.

## E. Optional cloud log
8. Follow `HUB_Google_Sheet_Setup.md` to connect a Google Sheet for activity logging.

## Kicking it off in a chat
Say: **"Set up a Grade 8 Math hub from the Starter Kit — follow PROJECT_STANDARD.md."** That single instruction is enough; the assistant reads the standard + template and proceeds the way this project works.

## Keep quality from diluting
- The engine is shared and **versioned** — note the version in `PROJECT_STANDARD.md`; improve it in one place and re-propagate deliberately.
- Never skip the **verify** step before shipping a module.
- Always **consult the textbooks**; only substitute when a researched item is genuinely better.
- One structure — never build a parallel system that duplicates the engine or contract.
