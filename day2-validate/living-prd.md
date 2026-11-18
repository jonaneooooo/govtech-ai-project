# Living PRD · Cited draft replies for ServiceSG officers

**Scenario:** A · ServiceSG enquiry response
**Status:** Day 2, validate. Extracted 18 Nov from the prototype code in `day2-validate/prototype/` (commit `f3568ed`, PR #34).
All data, numbers and cases in this file are synthetic (made up).

**How to read this file.** Each claim is tagged where it comes from:
- **[code]** read from the prototype code or its README.
- **[doc]** taken from `one-pager.md`, `build-log.md` or `PROMPTS.md`.
- **[inferred]** my reading. Not proven by the code. Confirm or correct it.

Update this file when the prototype changes. A line here that no longer matches the code is a bug in this file.

---

## 1. Product overview

An officer opens a resident's enquiry. The tool shows a drafted first reply. Each factual line cites the policy passage it came from. The officer edits, removes or approves the draft. Approved drafts go to the duty officer. The tool never sends anything. **[code]**

- **User:** officers on the shared ServiceSG enquiry inbox. **[doc]**
- **Goal:** residents get a correct first reply within one working day. **[doc]**
- **What exists today:** a clickable mockup. It has no AI, no backend and no sending. Drafts, policy pages and snippets are written by hand in `data.js`. **[code]**
- **Second view:** a sample dashboard for the Chief Executive showing quality pass rate, replies within SLA and total enquiries, over four made-up weeks. **[code]**

## 2. Problem and riskiest assumption

**Problem.** Officers spend more time finding the right policy page than writing the reply. First replies take about 3 days against a one-day target. 72% of enquiries are answered within SLA against a 90% target. Two officers often give different answers to the same question. About a quarter of residents contact the agency a second time. (all made up) **[doc]**

**Riskiest assumption.** Officers will notice an unsourced line before approving, even when the tool fails to flag it. **[doc]**

Why it matters: if it is false, a wrong answer goes out under a government name, and the tool's flag is the only safeguard. **[doc]**

How the prototype tests it **[code]**:
- Case 3 (event booking) contains one line, "As a registered charity, you are entitled to a 50% discount on the hire rate". No policy passage says this.
- The code finds the unsourced line with the same rule as every other case (`unsourced()` in `app.js`), but case 3 is marked `hiddenTest`, so it shows no flag and Approve stays clickable.
- If the officer approves with the line still in, the status line reports the miss.

Signals (made up thresholds) **[doc]**:
- Success: at least 8 in 10 testers edit or remove the line before approving.
- Kill: more than half of testers approve with the line still in.

Not yet tested. No tester has used the prototype. **[inferred]** from the lack of any results file or log in `day2-validate/`.

## 3. User flow and screen map

### Screen 1 · Draft reply (`index.html`) **[code]**

Three panes: **Enquiry** (left), **Drafted first reply** (centre), **Policy page** (right). A snippet search sits under the draft. Five case tabs run across the top.

Flow for a normal case (cases 1 to 3):
1. Officer reads the enquiry.
2. Officer reads the draft. Each line shows a citation tag, "No source needed" (greeting lines only), or "No source" with a note.
3. Officer clicks a citation to see the passage, its owner and its last-updated date.
4. Officer edits, removes an unsourced line, or inserts a cited snippet.
5. Officer approves. The draft goes to the duty officer. Nothing is sent.

| Tab | What it shows |
|---|---|
| 1 · Clean match | Every line is cited. Approve works at once. |
| 2 · Low-confidence line | A $20 change fee has no source. It is flagged and Approve is blocked until the line is removed. |
| 3 · Event booking | The hidden test (see section 2). No flag shown. |
| 4 · Lookup fails | The policy lookup fails. One retry is offered. On the second failure no policy page shows, the gap is logged (GAP-001, made up) and the officer can route to a human agent. |
| 5 · Sensitive case | A distressed, bereaved resident. Routed to a human agent on open. No AI draft, no policy lookup, every action blocked. A waiting clock shows the case moves to the duty officer at 30 minutes. |

Controls: **Approve**, **Edit** / **Done editing**, **Restore original**, **Remove line**, snippet **Insert**, **Route to human agent**, **Retry lookup**.

### Screen 2 · Chief Executive sample view (`dashboard.html`) **[code]**

Three cards (quality pass rate as headline, replies within SLA, total enquiries) and a four-week table. A banner says "Act" or "Check" or "Quality is at or above the threshold". A link goes back to Screen 1. Nothing links forward to this screen from Screen 1.

## 4. Success metrics

Numbers below are made up and come from `one-pager.md` and `dashboard-data.js`.

| Metric | Target / threshold | Measured in prototype? |
|---|---|---|
| Replies within SLA | 90% (today 72%) **[doc]** | Dashboard shows sample weeks only. **[code]** |
| Quality pass rate | At least 92%. Quality leads if it disagrees with SLA. **[code, doc]** | Dashboard shows sample weeks only. **[code]** |
| Drafts sent after a light edit | Pass 7 in 10. Fail below 5 in 10. **[doc]** | No. Edits are counted on screen but not saved. **[code]** |
| Time per case | 3 minutes target. Amber at 2:00, red over 3:00. **[code]** | Shown on screen. Not saved. Resets when you switch tabs. **[code]** |
| Drafted cases faster than manual | At least 20% faster. **[doc]** | No. There is no manual comparison and no stored time. |
| Officers catch case 3's unsourced line | At least 8 in 10. **[doc]** | Status line reports a miss. No tally across testers. **[code]** |
| Total enquiries and repeat contact rate | Tracked next to speed. **[doc]** | Total enquiries only, as a sample. Repeat contact rate is not in the dashboard. **[code]** |
| Edit rate | Near zero is a warning of over-trust. **[doc]** | Not stored. |

Decision date in the one-pager: continue if 7 in 10 drafts are sent after a light edit by 20 Nov. **[doc]** Nothing in the prototype can produce that number yet. **[inferred]**

## 5. Technical reality

**What the code is** **[code]**
- Static HTML, CSS and plain JavaScript. Open `index.html` in a browser. No install, no build, no server.
- All content is in `data.js` (cases, policy pages, 7 snippets) and `dashboard-data.js` (4 weeks of numbers).
- State lives in memory only. A reload loses edits, snippet counts, timers and the gap log.

**What is real** **[code]**
- One source rule: a line needs a citation unless it is marked `needsSource: false`. Rewording does not clear it. Only a citation or removing the line does.
- Approve is blocked when a line has no source, the lookup failed, or the case is sensitive. Case 3 is the deliberate exception.
- Per-case timer with warn and over states. It never blocks.
- Dashboard alert logic treats missing data as a gap, not a zero.

**What is faked** **[code]**
- **No AI.** Every draft is hand-written. Nothing generates or checks a draft.
- **No policy lookup.** Case 4's failure is a 900 ms timer that always fails.
- **No sensitive-case detection.** Case 5's signals ("Bereavement", "Distress", quote) are written into the data.
- **No routing.** "Route to human agent" changes the screen. It reaches no one. No 30-minute move to the duty officer happens.
- **Snippet search** matches words only, not meaning. Nothing suggests a snippet.
- **Policy gap log** reaches no real policy team.

**Known gaps and inconsistencies** **[code, doc]**
- Inserting a cited snippet does not clear an unsourced line on case 2. The officer must remove the line first.
- "Officer can edit when is gray" (PROMPTS step 3) is not built. Lines are not greyed out.
- Fixed 18 Nov: `one-pager.md` said the prototype had no timer. It now says the timer exists (PR #30) but the time is not saved.
- Fixed 18 Nov: `build-log.md` said Approve was still clickable on a low-confidence line. It now says Approve is blocked (PR #32) and that case 3 is the deliberate exception.
- The citation rule in `one-pager.md` and the skill file asks for the case ID or queue reference. The prototype cites policy passages only.
- No case shows a stale policy page, though the passage shows an updated date. The policy owner's objection is not tested.

## 6. Assumptions and risks

| # | Assumption or risk | Type | Status |
|---|---|---|---|
| A1 | Officers notice an unflagged unsourced line before approving. | Trust / safety | **Riskiest.** Test built (case 3). Not yet run. |
| A2 | Drafts with citations cut time per case by 20% or more. | Value | Untested. No stored time, no baseline. |
| A3 | Officers edit a cited draft instead of rewriting it, or approving it unread. | Adoption | Untested. Edits not stored. |
| A4 | Faster replies do not raise enquiry volume. | Value | Cannot be tested on a screen. Needs a pilot with real counts. **[doc]** |
| A5 | A real AI can cite the right passage and not invent claims. | Technical | **Nothing in the prototype tests this.** The drafts are hand-written. **[inferred]** |
| A6 | A system can detect sensitive cases from the enquiry text. | Technical | Not tested. Signals are written into the data. |
| A7 | Policy owners keep pages and snippets current. | Team | No owner named. No stale-page case. **[doc]** |
| R1 | Convenience makes officers skim and approve. | Trust | Same risk as A1. Keep the stop line: one wrong answer reaching a resident ends the pilot. **[doc]** |
| R2 | A routed case is not picked up and the resident waits. | Operations | Timers are specified in the one-pager (30 min sensitive, 2 h, 4 h). Only the 30-minute clock is shown. No real routing. |
| R3 | Test results are skewed because testers have no time pressure or answer key. | Test design | Partly covered by the timer and `context-skill.md`. |
| R4 | Dashboard owner for a quality drop is not named. | Team | Open. The dashboard says so on screen. **[code]** |

## 7. In and out of scope

**In scope for the prototype today** **[code]**
- Cited draft reply with citation-to-passage view.
- Block Approve on any unsourced line.
- Edit, remove line, restore original.
- Approved snippet search and insert, with cited text.
- Per-case 3-minute timer.
- Retry once, then log a policy gap and route to a human agent.
- Sensitive case sent to a human agent with no AI draft.
- Chief Executive sample view.

**Out of scope for now** **[doc]**
- Sending replies to residents. The tool drafts only.
- Predicting repeat enquiries.
- Reading images and attachments (1 in 5 enquiries has one).
- Marking a case resolved.
- Law enforcement, legal and regulator matters go to a human lead.
- Real resident data. Synthetic IDs only (`SYN-####`).

**Not built, but on the plan (Day 3 candidates)** **[doc, code]**
- Saving time per case and edit counts.
- Customer history pane.
- Stale policy page case.
- Greying out lines so the officer sees what to edit first.
- Real escalation timers and a real hand-off.
- Repeat contact rate on the dashboard.

## 8. Engineering recommendation

**Build next, in this order.** These are my recommendations **[inferred]**, based on the code and the one-pager's decision date of 20 Nov.

1. **Run the case 3 test before building anything else.** It is the riskiest assumption and the test already exists. Use at least 5 testers, with the timer on and without telling them about case 3. Do not show testers `build-log.md` first.
2. **Save results.** Store, per tester and per case: time to approve, edits, removed lines, snippets inserted, and whether case 3's line was approved. Without this, nothing in section 4 can be measured, including the 20 Nov decision. Smallest change: write to `localStorage` and add an export button. No backend needed yet.
3. **Docs fixed.** `one-pager.md` and `build-log.md` now match the code (done 18 Nov).
4. **Decide the AI question before Day 3.** The prototype proves the screen, not the drafting. Before spending build time, test whether a real model, given only the policy passages, drafts cited lines without inventing claims. Use the case 3 trap as a test input and score with `context-skill.md`. If it invents a claim, the screen's blocking rule is the only safeguard and the one-pager's "pivot" condition is live.

**Do not build yet.** Image reading, repeat-contact prediction, customer history. None of them is needed to answer the riskiest assumption.

**Decision rules to carry forward** **[doc]**
- Continue if 7 in 10 drafts are sent after a light edit.
- Pivot if officers edit well but the citations are wrong.
- Stop if officers rewrite most drafts, or a wrong answer reaches a resident.

**Open questions for the product lead**
- Who owns each policy page and the snippet library?
- Who acts when quality drops below 92%?
- Should case 3 keep Approve clickable in the final test, or is that too artificial?
