# Handoff note · Day 2 to Day 3

**Scenario:** A · ServiceSG enquiry response
**Written:** 18 Nov, from the prototype at commit `f3568ed` and `living-prd.md`.
All data in this file is synthetic (made up).

## What you are getting

A clickable prototype in `day2-validate/prototype/`. Open `index.html` in a browser. It shows a drafted first reply to a resident enquiry, with the policy passage behind each line. An officer edits, removes or approves it. Nothing is sent.

It has **no AI**. Every draft, policy page and snippet is written by hand in `data.js`. Read `living-prd.md` for the full picture. Each claim there is tagged `[code]`, `[doc]` or `[inferred]`.

## What Day 2 proved

- A line with no policy source is found by one rule in the code, and Approve is blocked until the officer removes it. Rewording does not clear it.
- Every citation opens the passage, with its owner and last-updated date.
- Hard cases route to a human agent: a failed policy lookup (after one retry, with the gap logged) and a sensitive case (no AI draft).
- Each case has a 3-minute timer. It warns and never blocks.

## What Day 2 did not prove

1. **The riskiest assumption is untested.** Will officers catch an unsourced line the tool does not flag? Case 3 holds the test. No tester has run it. Do not show testers `build-log.md` first.
2. **A real model has not been tried.** Nothing shows an AI can draft cited lines without inventing claims.
3. **Nothing is saved.** Time per case, edit counts and the gap log vanish on reload. The "7 in 10 drafts sent after a light edit" decision (due 20 Nov) cannot be measured yet.
4. **Routing is pretend.** "Route to human agent" changes the screen and reaches no one. Sensitive-case signals are written into the data, not detected.
5. **Volume is unanswered.** Whether faster replies raise enquiry volume needs a pilot with real counts.

## Do these first

1. Run the case 3 test with at least 5 testers, timer on, without telling them about case 3.
2. Save results per tester and case: time to approve, edits, removed lines, snippets inserted, and whether case 3's line was approved. Smallest change: `localStorage` plus an export button.
3. Test a real model against the case 3 trap, given only the policy passages. Score it with `context-skill.md`. If it invents a claim, only the screen's blocking rule stands between the draft and the resident.

## Known problems in the prototype

- Inserting a cited snippet does not clear an unsourced line on case 2. The officer must remove the line first.
- "Edit when gray" (PROMPTS step 3) is not built. Lines are not greyed out.
- Snippet search matches words only, not meaning.
- The prototype cites policy passages only. The skill file asks for the case ID or queue reference too.
- No case shows a stale policy page.

## Do not build yet

Image and attachment reading, repeat-contact prediction, customer history. None of them is needed to answer the riskiest assumption.

## Guardrails to keep

- Synthetic data only. Case IDs look like `SYN-####`.
- The tool drafts only. An officer approves and the duty officer sends. It never sends and never marks a case resolved.
- Mark NEEDS CLARIFICATION instead of guessing.
- Sensitive and harm cases go straight to a human agent with no AI draft.
- Stop line: one wrong answer reaching a resident ends the pilot.

## Decision rules

- **Continue** if 7 in 10 drafts are sent after a light edit.
- **Pivot** if officers edit well but the citations are wrong.
- **Stop** if officers rewrite most drafts, or a wrong answer reaches a resident.

## Open questions

- Who owns each policy page and the snippet library? No owner is named.
- Who acts when quality drops below 92%? No owner is named.
- Should case 3 keep Approve clickable in the final test, or is that too artificial?
- `validation-brief.md` is listed in the Day 2 README but does not exist in the repo yet.

## Files to read, in order

1. `day2-validate/living-prd.md`: the full picture.
2. `day2-validate/build-log.md`: the three leaders' objections and the riskiest assumption.
3. `day2-validate/context-skill.md`: the answer key for scoring tests.
4. `one-pager.md`: strategy, escalation timings and the stop line.
5. `day2-validate/prototype/README.md`: what each screen does and what is not built.
