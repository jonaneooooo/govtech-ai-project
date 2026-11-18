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

**Result:** _fill in after you run it: what worked, what broke._

## 2. Behavior

**Prompt:** retry or promot another champion human agent for help

**Forced failure:** inform policy team such scenarios are happening and they need to work it in

**Business rules:**
- Poiicy pages will not show up at all but prompt policy owners to look at it as part of backlog

**Edge cases:**
- The lookup fails twice in a row.
- The officer edits the draft while the retry runs.

**Result:** _fill in after you run it: what worked, what broke._

## 3. Refine

**Prompt:** succint, clear message and  consistency

**Business rules:**
- do not change auto drafted snippets and responses

**Edge cases:**
- officer can edit when is gray

**Result:** _fill in after you run it: what worked, what broke._
