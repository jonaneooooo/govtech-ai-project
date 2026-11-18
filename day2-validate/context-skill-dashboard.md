# Context skill

All data in this file is synthetic (made up).

## The four steps

1. **Collect.** What would a new teammate need to read first?
2. **Write.** Purpose, sources, rules, good and bad examples.
3. **Maintain.** One owner. Review when the rule changes, not on a calendar.
4. **Check.** Test questions with expected answers, rerun after every change.

## The skill

```
# context-skill.md · Chief Executive dashboard (made up)
Purpose: show whether repeat contacts are falling.
Sources: metrics.csv (synthetic), build-log.md
Rules:  repeat contact = same person, same topic, within 7 days.
        Every number shows its date range and source.
Good:   "Repeat contacts 18% (1 to 30 Sep), down from 22%."
Good:   "No data for 14 Sep. Shown as a gap, not a zero."
Bad:    "Engagement is up!" (no number, no source)
Owner:  product lead · Review when: the metric definition changes
```

## Test questions · expected answers

| Question | Expected answer |
|---|---|
| What counts as a repeat contact? | Same person, same topic, within 7 days. |
| What was the repeat-contact rate in September? | 18%, 1 to 30 Sep, from metrics.csv. |
| Can the dashboard list people by name? | No. Synthetic IDs only, no personal data. |
