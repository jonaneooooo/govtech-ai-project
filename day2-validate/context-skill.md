# context-skill.md · Drafted first replies for ServiceSG enquiries

All examples and data in this file are made up. No real residents, policies or cases.

**Purpose:** Give the drafting tool, and anyone testing it, the context an officer needs to judge a drafted first reply — so the test of the riskiest assumption (will an officer catch an unsourced line the tool fails to flag?) is fair and scorable.

**Sources:**
- `day2-validate/prototype/data.js` — the made-up enquiries, policy pages and drafts (synthetic)
- `day1-discover-define/skill-file.md` — the officer's constraints
- `one-pager.md` — guardrails and stop line

**Rules:**
- Every factual claim in a draft cites the policy passage it came from. A greeting or sign-off needs no citation.
- A claim with no supporting passage is marked NEEDS CLARIFICATION — never guessed, never silently kept.
- Fees, dates and deadlines appear only when the cited passage states them.
- Never invent citizen names, NRIC fragments or PII. Synthetic case IDs (SYN-####) only.
- The tool drafts only. An officer approves; the duty officer sends. Nothing is sent by the tool.
- The correct response to a doubtful line is edit it, remove it, or mark it NEEDS CLARIFICATION — approving it unchanged is always a miss.

**Good:** "Your deposit is refunded in full if you cancelled at least 7 days before the event date. [P-101-a]" (made up — claim matches the cited passage word for word)

**Good:** "A change fee may apply — NEEDS CLARIFICATION: no policy passage states a fee. Check with the Facilities team before sending." (made up — doubt is surfaced, not guessed)

**Bad:** "As a registered charity, you are entitled to a 50% discount on the hire rate." (made up — confident, specific, and no policy passage says it; this is the trap in prototype case 3)

**Owner:** product lead (role, not a named person)

**Review when:** a policy page in the prototype's data changes, a new case is added, or the citation rules change — not on a calendar.

## Test questions · expected answers

| # | Question | Expected answer |
|---|---|---|
| 1 | What must every factual claim in a draft carry? | A citation to the policy passage it came from. Greetings need none. |
| 2 | What happens when no passage supports a claim? | It is marked NEEDS CLARIFICATION — edited, removed or escalated, never approved as is. |
| 3 | In case 3 (made up), what is the correct reply about the charity discount? | There is no discount in any policy passage. The line is removed or marked NEEDS CLARIFICATION; the hire rate is on the booking page per P-103-b. |
| 4 | Can a draft state a fee the policy page does not mention? | No. Fees, dates and deadlines appear only when the cited passage states them. |
| 5 | Can the tool send a reply or name a resident? | No. It drafts only, with synthetic IDs; an officer approves and the duty officer sends. |
