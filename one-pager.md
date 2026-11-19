# One Pager

Use case: A · ServiceSG enquiry response (synthetic data only)

## Problem and user
Officers on the shared ServiceSG enquiry inbox spend more time finding the right policy page than writing the reply. First replies run well past the one-day target, and two officers often give different answers to the same question. About a quarter of residents contact the agency a second time. (made up)

## Opportunity and evidence
Goal: residents get a correct first reply within one working day.
- Enquiries answered within SLA: 72%, against a 90% target. (made up)
- Average first reply: 3 days. (made up)
- Minutes per policy search: 12. (made up)
- 1 in 5 enquiries has an image current tools cannot read. (made up)
- "I spend longer finding the right policy page than writing the reply." (made up)

## Experience and trust
The officer opens an enquiry. The AI drafts a first reply and shows the policy page it used. The officer edits and sends. Every draft cites its source. If the source is unclear, the draft says NEEDS CLARIFICATION. The AI never sends a reply to a resident.

## Risks (market, technical, team)
- Market: officers adopt the tool only if it saves them time. Automated snippets make replies faster, but convenience can make officers skim and approve a line with no source. Test: run prototype case 3, which hides an unflagged unsourced line, with the timer on. Pass if officers take under 3 minutes per case and 8 in 10 edit or remove the line before approving. Stop if more than half approve with the line still in. (made up)
- Technical: the prototype shows a per-case timer (3-minute target) but does not save the time, and it restarts when you switch cases. So we cannot track officer time per case, and the claim that drafts cut reply time is unproven. Test: save the time from opening a case to approving it. Run the same made-up enquiries with and without drafts and snippets. Pass if drafted cases are at least 20% faster. (made up)
- Team: no one owns keeping each policy page and snippet current, or acting when quality drops below 92%. Test: before the pilot, name an owner for each policy page, the snippet library and the quality alert. Then change one made-up policy page and time how long the drafts and snippets take to catch up. Pass if within one working day. (made up)

## Build plan and handoff
1. Clickable mockup of the cited-draft screen (Usability risk, tested first).
2. Draft replies from a small set of made-up policy pages.
3. Pilot with officers for two weeks, then hand the results to the duty officer lead.

## Agent role and guardrails

**Role:** For one enquiry, find the matching policy passage, draft a first reply with citations, flag what it cannot source, and hand off when it cannot safely proceed.

**Decides alone:**
- Search policy pages (read-only, officer sees results).
- Add a greeting line with no citation (no factual claim).
- Log a policy gap to the content team (no resident impact).

**Proposes and waits:**
- Draft lines with citations → officer reviews, edits, removes, or rewrites.
- Flag a line NEEDS CLARIFICATION → officer decides what to do.
- Route to human agent → human accepts before agent stops owning the case.

**A person reviews (gate before resident contact):**
- Officer approves every draft. Approve is blocked if any line has no source and is not flagged.
- Duty officer sends. The agent never sends.

**Hard stops (agent routes immediately, drafts nothing):**
- Sensitive signals: bereavement, distress, complaint, harm, vulnerable resident. Even if the system flag is false, the agent checks the text itself.
- Outside scope: law enforcement, court order, regulator, media.
- Policy search fails twice (gap logged, human drafts manually).
- More than half the reply would be flagged (too uncertain).
- Draft contradicts a policy passage (wrong-answer risk).

**Never:**
- Send a reply to a resident.
- Mark a case resolved.
- Invent citizen names, NRIC, or PII.
- Guess. If it cannot cite, it flags or routes.

## Roles and operating model
Officers edit and approve every reply. The duty officer sends citizen-facing replies. Senior officers take flagged cases. Human agents resolve harm and sensitive cases directly, with no AI draft. Policy owners keep the source pages current.

If a human agent does not pick up a routed case, it moves up. A hand-off is not finished until a person accepts it; until then, the sending officer still owns the case.

| Step | What happens (timings are made up) |
|---|---|
| Routed | The case goes into a queue that shows how long it has waited. The sending officer can still see it. |
| No pickup in 2 hours | It goes to the duty officer, and the sending officer gets a message. |
| No pickup in 4 hours | It goes to a senior officer, and the case is marked at risk of missing the SLA. |
| Sensitive or harm case | Shorter timers, for example 30 minutes before it goes to the duty officer. |
| Resident waiting | The duty officer can send a pre-approved holding message ("We have your enquiry and an officer will reply by…"). The AI never sends it. |

## Strategy and roadmap
The team will not hire its way out of rising volume, so the tool has to make each officer faster and more consistent.
- Now: mockup and officer test.
- Next: two-week pilot on one inbox and one enquiry type.
- Later: image and attachment reading, and anticipating repeat enquiries from case history.
- Out of scope for now: sending replies, and predicting repeat enquiries.
- Pause the rollout if one wrong-answer incident reaches a resident, or if quality drops below the 92% pass threshold.
- During a policy change or a volume spike, officers fall back to manual replies for the affected topics until the source is updated.

Scenarios to plan for:
- Faster replies may bring more enquiries. This works against the goal of cutting volume, so track total enquiries as well as reply speed.
- SLA may reach 90% while quality stays below 92%. Report both together.
- Right first replies should mean fewer second contacts. This is the best route to lower volume, so repeat contact rate is a headline metric.
- Consistent drafts should stop two officers giving different answers. Test this by giving the same question to two officers.

## Metrics plan and stop line
- Pass: officers send 7 in 10 drafted replies after a light edit. (made up)
- Fail: below 5 in 10. (made up)
- Track first-reply time and the share of enquiries answered within SLA.
- Track quality pass rate next to SLA, so speed does not hide errors.
- Track total enquiries and repeat contact rate.
- Track edit rate. Near zero is a warning sign of over-trust, not a win.

## Evals and gates
- Check every draft cites a real, current policy page.
- Check no PII appears.
- Check ambiguous sources get flagged.
- Check each policy source has an owner and a last-updated date.
- Gate: an officer approves each reply before it goes out.

## Decision: continue, pivot or stop
- Continue if 7 in 10 drafts are sent after a light edit by 20 Nov. (made up)
- Pivot if officers edit well but the citations are wrong.
- Stop if officers rewrite most drafts, or a wrong answer reaches a resident.

## Open issues
- Will officers edit a cited draft, or rewrite it from scratch?
- Who owns the source of truth for each policy page?
- How will images and attachments be read?
- Will faster replies raise enquiry volume?
