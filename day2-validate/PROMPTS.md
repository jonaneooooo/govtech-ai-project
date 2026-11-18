# Prompt chain

**Scenario:** A · ServiceSG enquiry response
**Prototype today:** resolves customer's issues fast under a specific time to meet the SLA of 90%

All data is synthetic and labelled as made up.

## 1. Expand

**Prompt:** let them find drafted snippets approved by policy

**Business rules:**
- no buzzwords or motherhood statement. Be explicit and succinct

**Edge cases:**
- when officers cannot solve, it will route to human agent

**Result:** Built 18 Nov as a snippet search in the draft pane (PR #24).
- Worked: officers search 7 approved snippets (made up), each tied to a policy passage, and Insert adds a cited line to the draft. Wording is plain, with no buzzwords. A search with no match shows Route to human agent, which locks the case with no AI draft. Restore removes inserted snippets.
- Broke: inserting a snippet does not unblock Approve on case 2, so the officer still has to fix the unsourced line. Search matches words only, not meaning. Edit and snippet counts are not saved.

## 2. Behavior

**Prompt:** retry or promot another champion human agent for help

**Forced failure:** inform policy team such scenarios are happening and they need to work it in

**Business rules:**
- Poiicy pages will not show up at all but prompt policy owners to look at it as part of backlog

**Edge cases:**
- The lookup fails twice in a row.
- The officer edits the draft while the retry runs.

**Result:** Built 18 Nov as case 4, a simulated lookup that always fails (PR #25).
- Worked: the first failure offers one retry. The second failure is the forced failure: no policy page is shown, gap GAP-001 is logged to the policy team backlog (made up), Approve stays blocked and the officer can ask a champion agent. Edits made while the retry runs are kept. Switching cases does not log the gap twice.
- Broke: the gap log is lost on reload and reaches no real policy team. "Ask a champion agent" and "Route to human agent" do the same thing, which may confuse testers.

## 3. Refine

**Prompt:** succint, clear message and  consistency

**Business rules:**
- they can change auto drafted snippets and responses

**Edge cases:**
- officer can edit when is gray

**Result:** _fill in after you run it: what worked, what broke._
