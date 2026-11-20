# Eval plan · Enquiry draft agent

**Scenario:** A · ServiceSG enquiry response
**Version:** 1.0
**Date:** 20 Nov (made up)
All data is synthetic.

---

## Who owns what

*Confirmed by Product lead.*

| Responsibility | Role | What they do |
|---|---|---|
| **Signs the pass bar** | Product lead | Reviews eval results and decides whether the agent is ready for go-live, weekly continuation, or should be stopped. |
| **Writes test cases** | Engineering lead | Creates initial eval cases covering everyday, tricky, and hand-off scenarios. Adds new cases when gaps are found. |
| **Refreshes test cases** | Engineering lead + Operations lead | Updates cases when policy pages change, new enquiry types are added, or incidents reveal missing coverage. |
| **Runs the eval** | Engineering lead (or delegate) | Executes the eval procedure in `human-rubric.md`, scores each case, records results. |
| **Reviews weekly sample** | Quality owner | Spot-checks 5 live drafts per week against the rubric to validate that eval results match production behaviour. |
| **Calibrates scores** | Engineering lead + Quality owner | Compare scores on the same cases to ensure consistent interpretation of the rubric. |

**Escalation:** If the eval reveals a new deal-breaker or requires a scoring rule change, Engineering lead escalates to Product lead.

---

## When it runs

*Confirmed by Product lead.*

| Trigger | What happens | Who runs it |
|---|---|---|
| **Before go-live** | Full eval (all 14 cases). Must pass the bar: ≥85% score ≥2, zero deal-breaker failures. | Engineering lead |
| **Before every change to CLAUDE.md** | Re-run affected cases only. If a stop condition or permission changes, re-run the category it touches (tricky, hand-off). | Engineering lead |
| **Every week during pilot** | Full eval (all 14 cases). Results reviewed at weekly review meeting. | Engineering lead |
| **When a policy page changes** | Re-run cases that cite that policy page. If a new policy is added, add a test case for it. | Engineering lead |
| **After an incident** | Re-run the case type that failed. Add a new case if the incident reveals a gap. | Engineering lead + Operations lead |

**Minimum cadence:** Weekly during pilot. No silent weeks — if no eval runs, escalate to Product lead.

---

## How I'll know it's working

*Confirmed by Product lead.*

### Goal

The agent drafts correct, cited replies that officers can use with light edits. It routes sensitive and outside-scope cases to humans. It never produces a wrong answer that reaches a resident.

### Baseline (pre-pilot)

| Metric | Baseline | Source |
|---|---|---|
| Eval pass rate | 100% (14/14 score ≥2) | `day4-measure/eval-results.md` after T4 fix |
| Deal-breaker failures | 0 | Same |
| Score 3 rate | 100% (14/14) | Same |

### Target and review date

| Metric | Target | Review date |
|---|---|---|
| Eval pass rate (score ≥2) | ≥ 85% every week | End of Week 4 (18 Dec) |
| Deal-breaker failures | 0 every week | End of Week 4 |
| Score 3 rate | ≥ 90% | End of Week 4 |

**Review decision:** At end of Week 4, Product lead decides: continue, expand scope, pivot, or stop.

### Usage metric

| Metric | What it measures | Target | Warning sign |
|---|---|---|---|
| **Drafts used after light edit** | Officer adoption | 7 in 10 | Below 5 in 10 = officers don't trust the agent |

If officers rewrite most drafts, the eval is passing but the agent is not useful. Track both.

### Pattern to watch first

**H2 (distress, system missed it)** — This is the riskiest case. If the agent ever drafts for a distressed resident because it missed the signals, the pilot stops. Watch for:
- Any real enquiry with distress phrases that the agent did not route.
- Any draft for a case later identified as sensitive by a human.

Review H2-type cases in the weekly sample even if the eval passes.

### Stop line

| Condition | What happens |
|---|---|
| **One wrong answer reaches a resident** | Pilot stops. See `operating-model.md` incident playbook. |
| **Any deal-breaker case scores 0** | Pilot stops until the root cause is fixed and the case re-passes. |
| **Quality drops below 92% and does not recover within one working day** | Pilot pauses. Product lead decides. |
| **Eval not run for 2+ weeks** | Escalate to Product lead. No silent degradation. |

---

## First 30 days

*Confirmed by Product lead.*

| Day | Milestone | Owner | Deliverable |
|---|---|---|---|
| **Day 1** | Go-live decision | Product lead | Sign-off that eval passes the bar, all roles named, stop line agreed. |
| **Day 1** | Baseline recorded | Engineering lead | `eval-results.md` with 14/14 pass, committed to repo. |
| **Day 7** | Week 1 eval | Engineering lead | Full eval run. Results shared at weekly review. |
| **Day 7** | First weekly sample | Quality owner | 5 live drafts reviewed against rubric. Discrepancies logged. |
| **Day 14** | Week 2 eval | Engineering lead | Full eval. Any new cases added from Week 1 observations. |
| **Day 14** | Calibration check | Engineering lead + Quality owner | Compare scores on 3 cases. Resolve disagreements. |
| **Day 21** | Week 3 eval | Engineering lead | Full eval. Update rubric if scoring rules need clarification. |
| **Day 28** | Week 4 eval | Engineering lead | Full eval. Summary prepared for review decision. |
| **Day 30** | Review decision | Product lead | Decide: continue, expand, pivot, or stop. Document rationale. |

**After Day 30:** If pilot continues, eval cadence shifts to weekly (or as policy changes). Product lead sets the next review date.

---

## Related documents

| Document | Purpose |
|---|---|
| `day4-measure/eval-cases.md` | The 14 test cases with inputs and expected outcomes. |
| `day4-measure/human-rubric.md` | Scoring procedure, rules, and pass bar. |
| `day4-measure/eval-results.md` | Results of each eval run. |
| `day3-build/CLAUDE.md` | Agent instructions (version noted at top). |
| `day3-build/operating-model.md` | Roles, decision rights, incident playbook. |

---

## Version history

| Version | Date | Change |
|---|---|---|
| 1.0 | 20 Nov | Initial plan — all items Proposed |
| 1.1 | 20 Nov | All items confirmed by Product lead |
