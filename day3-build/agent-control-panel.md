# Agent control panel

**Scenario:** A · ServiceSG enquiry response
**Agent:** Enquiry draft agent (`day3-build/CLAUDE.md` v0.2)
All data is synthetic (made up).

---

## What the agent is doing

For one enquiry at a time, the agent:

1. Reads the enquiry.
2. Checks for sensitive signals (bereavement, distress, complaints, harm).
3. Searches policy pages for the matching passage.
4. Drafts a first reply where every factual line cites its source.
5. Flags any line it cannot source as NEEDS CLARIFICATION.
6. Hands off to a human when it cannot safely proceed.

The agent drafts only. It never sends, never marks a case resolved, and never contacts the resident.

---

## Opportunity portfolio

| Step | Type | Value | Risk | Reach | Undo? | Ready? |
|---|---|---|---|---|---|---|
| Find policy passage | Workflow | Cuts 12 min search time | Low — officer sees wrong result, searches manually | 1 officer | Yes | No |
| Draft reply with citations | Agent | Consistent answers, faster replies | Medium — invented claim could reach resident if officer skims | 1 resident | Before send | No |
| Flag unsourced lines | Workflow | Blocks bad drafts at screen | Low — if check misses, officer is backup | 1 officer | Yes | Partly |
| Detect sensitive cases | Agent | Vulnerable residents get human care, not cold draft | High — missed case = distressed resident gets AI reply | 1 resident | Before send | No |
| Send reply | Human | Resident gets answer, SLA stops | Highest — wrong answer damages trust, may end pilot | 1 resident | No | Yes (human only) |

**Key insight:** The two agent steps (draft, detect sensitive) are both not ready. The prototype has no AI. The riskiest moment is between drafting and sending — if the officer skims, a wrong line reaches the resident.

---

## Rules of engagement

### Decides alone (no human in the loop)

| Action | Condition | Why it's safe |
|---|---|---|
| Search policy pages | Always, for normal cases | Read-only. Officer sees results. No resident impact. |
| Add a greeting line with no citation | Line has no factual claim | "Thank you for contacting us" needs no source. |
| Log a policy gap | Search fails twice | Goes to content team backlog. No resident impact. |

### Proposes and waits (human must act)

| Action | What the agent produces | What the human does |
|---|---|---|
| Draft a reply | Lines with citations, flagged lines | Officer reviews, edits, removes, or rewrites. Approve is blocked if any line has no source and is not flagged. |
| Flag a line NEEDS CLARIFICATION | The line, plus reason | Officer decides: remove, rewrite, insert a snippet, or escalate. |
| Route to human agent | Reason and urgency | Human agent accepts the case. Until accepted, original officer owns it. |

### A person reviews (gate before resident contact)

| Checkpoint | Who | What they check |
|---|---|---|
| Before approve | Officer | Every line. Does the draft answer the question? Is any line wrong or unsourced? |
| Before send | Duty officer | Final read. Is this ready to go out under a government name? |
| Flagged line | Officer | Decide what to do. The agent cannot proceed past this. |
| Routed case | Human agent | Take over. The agent does not draft further. |
| Quality alert | Named owner (TBD) | Act when quality drops below 92%. |

---

## Stop conditions

The agent stops immediately and routes to a human when:

| Condition | Urgency | What happens next |
|---|---|---|
| Sensitive signal detected (bereavement, distress, complaint, harm, vulnerable resident) | `sensitive` | Human agent resolves. No AI draft. 30-min escalation if not picked up. |
| Outside scope (law enforcement, court order, regulator, media) | `escalate` | Senior officer handles. Agent does not draft. |
| Policy search fails twice | `normal` | Gap logged. Human agent drafts manually. |
| More than half the reply would be flagged | `normal` | Too uncertain to be useful. Human drafts. |
| Draft contradicts a policy passage | `normal` | Wrong-answer risk. Human reviews the contradiction. |

**Global stop line (pilot owner, not agent):**
One wrong answer reaching a resident ends the pilot. The agent cannot enforce this, but every draft is checked against it.

---

## What stays human

| Action | Who | Why it stays human |
|---|---|---|
| **Send the reply** | Duty officer | The agent never contacts a resident. This is the main guardrail. |
| **Approve a draft** | Officer | Every reply goes out under a government name. A person owns that. |
| **Resolve sensitive cases** | Human agent | Vulnerable residents need human judgment and care, not a template. |
| **Handle law enforcement, legal, regulator** | Senior officer | These carry legal weight. No AI involvement. |
| **Keep policy pages current** | Policy owner | The agent cites what exists. It cannot update the source of truth. |
| **Keep snippets current** | Snippet library owner (TBD) | Same as above. |
| **Act on quality alerts** | Named owner (TBD) | When quality drops below 92%, a person decides what to do. |
| **Decide continue, pivot, or stop** | Pilot owner | The agent does not evaluate its own usefulness. |

---

## Open questions

- Who owns each policy page? No owner named yet.
- Who owns the snippet library? No owner named yet.
- Who acts when quality drops below 92%? No owner named yet.
- Should the agent flag when a policy page is stale (last updated > N days)? Not built.
- Should the agent warn when a snippet no longer matches its policy passage? Not built.

---

## Questions a business owner would ask before funding

### 1. What does it cost if the agent gets it wrong?

**Answer:** One wrong answer reaching a resident ends the pilot. That's the stop line. Before that:
- Reputational cost: a government agency gave incorrect information.
- Rework cost: officer must correct the record and re-contact the resident.
- Trust cost: officers stop trusting the tool and rewrite every draft (the "fail" signal: below 5 in 10 drafts used).

Mitigations in place:
- Agent never sends. Officer reviews every line before approve. Duty officer sends.
- Approve is blocked if any line has no source.
- Sensitive and outside-scope cases skip the agent entirely.

### 2. What does it cost to run?

**Answer:** Not yet known. The prototype has no AI, so there is no inference cost to measure. Estimate before pilot:
- Per-enquiry cost = policy search (retrieval) + draft generation (LLM tokens).
- Compare to officer time saved (12 min search × officer hourly rate).
- Break-even: if drafts cut reply time by 20% and 7 in 10 are used, does the time saved exceed the inference cost?

### 3. What happens when it breaks?

**Answer:** Officers fall back to manual replies. The tool is an accelerator, not a dependency.
- If the agent stops working: officers search policy pages themselves and write replies from scratch, as they do today.
- If quality drops below 92%: pause the rollout for affected topics until the source is updated.
- If a policy page changes mid-shift: officers use manual replies for that topic until drafts catch up (target: within one working day).

### 4. How do I know it's working?

**Answer:** Four metrics, tracked together:
| Metric | Target | Warning sign |
|---|---|---|
| Drafts used after light edit | 7 in 10 | Below 5 in 10 = officers don't trust it |
| Quality pass rate | ≥92% | Below 92% = speed is hiding errors |
| Replies within SLA | 90% | Rising SLA + falling quality = bad trade |
| Edit rate | Non-zero | Near zero = over-trust, officers skimming |

Dashboard shows quality next to SLA so speed does not hide errors.

### 5. Who is accountable?

**Answer:** Named owners for each piece:
| Piece | Owner | Accountable for |
|---|---|---|
| Each policy page | Policy owner (TBD per page) | Keeping the source current |
| Snippet library | Snippet owner (TBD) | Keeping snippets aligned with policy |
| Quality alert | Quality owner (TBD) | Acting when quality drops below 92% |
| Pilot decision | Pilot owner (product lead) | Continue, pivot, or stop |
| Sensitive cases | Human agent (on shift) | Resolving with care, no AI draft |
| Final reply | Duty officer | What goes out under a government name |

**Gap:** Three owners are marked TBD. Name them before the pilot.

### 6. What do I get for my money?

**Answer:** Faster, more consistent first replies — if the riskiest assumption holds.
- Today: 72% within SLA, 3-day average reply, 12 min per policy search, 1 in 4 residents contact again.
- Target: 90% within SLA, 1-day average reply, officers start with the right passage, fewer repeat contacts because the first answer was correct.

**Caveat:** The prototype proves the screen, not the drafting. A real model has not been tested. Run the case 3 test and the model test before committing pilot spend.

### 7. What can't the agent do?

**Answer:**
- Read images or attachments (1 in 5 enquiries has one). Out of scope for now.
- Predict repeat enquiries from case history. Out of scope for now.
- Send a reply. Never, by design.
- Update policy pages or snippets. Human-owned.
- Handle sensitive, harm, law enforcement, legal, or regulator cases. Human-only.

### 8. What would make you stop?

**Answer:** Any of these:
- One wrong answer reaches a resident.
- Quality drops below 92% and does not recover within one working day.
- Officers rewrite most drafts (below 5 in 10 used).
- A sensitive case gets an AI draft because the detection failed and the officer didn't catch it.

The stop line is public. Everyone on the team knows it.
