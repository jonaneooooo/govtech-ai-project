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
