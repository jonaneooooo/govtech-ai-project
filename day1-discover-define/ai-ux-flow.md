# AI user flow: officers see predictive resoonses based on popular history enquiries by individual customer or trend

**Scenario:** A · ServiceSG enquiry response

All data in this file is synthetic.

## The moment

officers see predictive resoonses based on popular history enquiries by individual customer or trend

## The iceberg

### Above the line: what the user sees

fast, targeted responses

### Below the line

- Data: questions asked by category and also frequency of such questions
- Model: consistent language that does not sound AI and uses buzzwords
- Rules: no more than 5 mins waiting time is allowed
- Handoffs: unstructured enquires should be handed off to a human and no AI

## The flow

1. **Trigger:** when customer starts the convo via chatbot. agent or call us
   - Trust gap: none
2. **AI step:** know the historical background after verification check
   - Trust gap: Control
3. **Human check:** if the human reponsed after the case is closed. check back after 2-3 hours.
   - Trust gap: Hallucination
4. **Outcome:** happy customers at SLA 90%
   - Trust gap: none

## Fallback when the AI is unsure (Advanced)

call /trigger the agent asap

## How we measure trust (Expert)

happy customer with high csat score.

## AI-UX readiness

**Scenario:** A · ServiceSG enquiry response
**Moment:** An officer opens an enquiry and sees a drafted responses ready to click and send within a second, without any edits.
**Level reached:** 1 of 3
**What we ship:** You cannot pass Level 2 yet, so ship a Level-2 UI: a reliable validator the user can check in under three seconds. A reliable validator beats a magical liar.

### Levels

- Level 01 · Trigger Accuracy: Pass. responses are ready to be used when it matches the policy 100%
- Level 02 · System Transparency: Not yet. officer is unsure if the responses is aligned with policy
- Level 03 · Invisible Integration: Not sure. Track the share of drafts officers rewrite and why they dont use the responses drafted

### Trust gaps

- Black box: The officer cannot see which policy page a sentence came from.
- Hallucination: not filled in yet Move: An inline citation on every claim, linked to the passage.
- Control: A draft states a fee or a deadline the policy page does not mention. Move: Dotted underline and a draft watermark on low-confidence lines.
