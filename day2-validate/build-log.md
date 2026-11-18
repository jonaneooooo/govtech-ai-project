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

## Open

- Approve button: block it, or ask for confirmation, while a low-confidence line is in the draft. Not decided.
