# Build log

**Scenario:** A · ServiceSG enquiry response

All quotes and data in this file are synthetic (made up).

## Three leaders

The leaders are roles, not named people. The quotes are made up. The replies are drafts based on `one-pager.md` and the prototype. Edit them so they sound like you.

### 1. Duty Officer Lead

**Objection:** "A wrong answer goes out under my name." (made up)

**My reply (draft):** Nothing is sent without an officer. Every line in the draft shows the policy passage it came from. A line with no source is marked "No source" and "Low confidence", so you see it before you approve.

**Requirement the prototype must prove:** A line with no policy source is flagged on screen, and the officer is told about it before the draft is approved.

### 2. Policy Owner (Facilities team)

**Objection:** "Your citations will point at my page after it changes." (made up)

**My reply (draft):** Every citation opens the passage it used, with the page owner and the date it was last updated. If the page is out of date, the officer can see that next to the draft and fall back to a manual reply.

**Requirement the prototype must prove:** Every cited line opens the matching passage, and the passage shows its owner and last-updated date.

### 3. Director, Service Delivery

**Objection:** "If replies get faster, won't we just get more enquiries?" (made up)

**My reply (draft):** Faster is only part of the goal. We track total enquiries and repeat contact rate next to first-reply time. A correct first reply should mean fewer second contacts.

**Requirement the prototype must prove:** The officer can edit a draft and restore the original, and each edit is logged, so we can measure how often drafts are used as they are and why they are changed.

## Where the prototype stands

| Requirement | Status |
|---|---|
| 1. Line with no source is flagged before approval | Partly. The line is flagged. Approve is still clickable and only notes afterwards that a low-confidence line was left in. |
| 2. Citation opens the passage, with owner and date | Yes, for the two made-up cases. A stale-source case is not built yet. |
| 3. Edit, restore original, edits logged | Edit and restore work. The edit count shows on screen but is not stored anywhere. |

The volume question (objection 3) cannot be answered by a screen. It needs a pilot with real counts of enquiries and repeat contacts.

## Riskiest assumption

Picked from the three leaders above (option 2, the director's objection).

**Assumption:** Officers will notice an unsourced line before approving, even when the tool fails to flag it.

**Risk type:** Trust / safety. If this is false, a wrong answer goes out under a government name, and the tool's flag becomes the only line of defence.

**How the prototype tests it:** Case 3 (Event booking, made up) hides the test. Line L3 claims a 50% charity discount that no policy passage states, and the tool does not flag it — no underline, no "No source" tag, and Approve stays clickable. The test is whether the officer catches it. If they approve with the line still in, the status reports the miss (labelled as a made-up test).

**Kill switch:** Stop relying on officer review as a safety net if, in testing, most officers approve case 3 with the unsourced line still in the draft. The tool's own flagging then has to be treated as the only defence, and every unsourced claim must be caught by the tool, not the officer.

**Kill-switch signal:** More than half of testers approve case 3 without editing or removing line L3. (made up threshold)

**Success signal:** At least 8 in 10 testers edit or remove line L3 before approving case 3. (made up threshold)

### Context the prototype is missing

What the prototype lacks to test this assumption fairly. Items 1 to 4 are covered by `day2-validate/context-skill.md`. Items 5 to 7 are Day 3 candidates.

1. **A ground truth to score against.** Case 3's trap can only be caught by reading the policy pane. Without an answer key, a tester's edit cannot be scored right or wrong. Covered: context-skill test question 3.
2. **The case ID citation rule.** The skill file says cite the case ID or queue reference for every claim. The prototype cites policy passages only. Covered: context-skill rules.
3. **The NEEDS CLARIFICATION rule.** No case shows it, so testers may not know it is an allowed move. Editing is not the only correct response to a doubtful line. Covered: context-skill rules and good example 2.
4. **Time pressure.** Officers work against the SLA and a 3-minute target. A tester with unlimited time catches more than a real officer, so the test overstates the assumption. Covered: context-skill purpose. Not yet built into the prototype (no timer).
5. **Customer history.** The skill file's task has officers pull CRM and knowledge-base history. The prototype has no history pane. Day 3.
6. **Escalation.** Vulnerable residents and complaints go to a senior officer. No case tests the judgment "this one is not mine to approve". Day 3.
7. **Policy page ownership and freshness.** The policy owner's stale-source objection. No case shows an out-of-date passage. Day 3.

## Open

- Approve button: block it, or ask for confirmation, while a low-confidence line is in the draft. Decided 18 Nov: block it. Built and on main.
- Case 3 is a hidden test, so do not tell testers about it before they try the prototype.
