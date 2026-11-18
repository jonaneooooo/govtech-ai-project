# Prototype: cited draft replies (Scenario A)

A clickable mockup for ServiceSG officers. It shows a drafted first reply to a resident enquiry, with the policy passage behind each line. All data is made up. There is no real AI, no backend and no sending.

## How to open it

Double-click `index.html`. It opens in your browser. No install needed.

## What it does today

### Draft reply screen (`index.html`)

Three panes: the enquiry, the drafted reply and the policy page.

- Click a citation tag (for example `P-101-a`) to highlight the policy passage it came from.
- **Edit** lets the officer change any line. **Restore original** undoes the edits.
- **Approve** passes the draft to the duty officer. Nothing is sent.
- **Approve is blocked** while a line marked low-confidence is still unchanged. A message explains why.

Three made-up enquiries, switched by the tabs at the top:

| Tab | What it shows |
|---|---|
| 1 · Clean match | Every claim is cited. Approve works straight away. |
| 2 · Low-confidence line | A line with no source is flagged and Approve is blocked until it is edited. |
| 3 · Event booking | A test case. See `../build-log.md`. Do not show testers that file first. |
| 4 · Lookup fails | A forced failure (made up). The policy lookup fails, the officer can retry once, and on the second failure the gap is logged to the policy team backlog and a champion agent can be asked. |

### Chief Executive sample view (`dashboard.html`)

Four made-up weeks of quality pass rate, replies within SLA and total enquiries, side by side. Every number shows its date range and source. Missing data shows as "No data", not zero. An alert fires if SLA rises while quality falls below 92%.

## Not built yet

- No timer, so time per case is not tracked.
- No automated snippets.
- Edit counts show on screen but are not saved.
- No harm or sensitive case that routes to a human agent.
- The header says "screen X of 5", but only 4 cases exist.
- The lookup failure in case 4 is simulated. There is no real policy lookup.

## Files

| File | What it is for |
|---|---|
| `index.html`, `app.js` | The draft reply screen and its clicks |
| `data.js` | The made-up enquiries, policy pages and drafts |
| `dashboard.html`, `dashboard.js`, `dashboard-data.js` | The Chief Executive sample view and its made-up numbers |
| `style.css` | Layout and colours, including the olive and mustard Approve button |
