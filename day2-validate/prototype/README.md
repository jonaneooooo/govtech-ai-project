# Prototype: cited draft replies (Scenario A)

A clickable mockup for ServiceSG officers. It shows a drafted first reply to a resident enquiry, with the policy passage behind each line. All data is made up. There is no real AI, no backend and no sending.

## How to open it

Double-click `index.html`. It opens in your browser. No install needed.

## What it does today

### Draft reply screen (`index.html`)

Three panes: the enquiry, the drafted reply and the policy page.

- Click a citation tag (for example `P-101-a`) to highlight the policy passage it came from.
- **One rule for sources:** every line either cites a policy passage or is tagged "No source needed" (greetings and courtesy lines with no facts). Any other line is an unsourced claim. The code finds these with the rule, not with a test marker.
- **Edit** lets the officer change any line. **Restore original** undoes the edits.
- **Approve** passes the draft to the duty officer. Nothing is sent.
- **Approve is blocked** while any line has no source. Rewording the line does not clear it, so adding a full stop is not enough. The officer must remove the line ("Remove line"), or delete its text, and can insert a cited snippet in its place. A message explains why.
- **Timer:** each case shows "Time on case" against a 3-minute target. It turns amber at 2 minutes and red after 3, with "Over 3 minutes". It warns but never blocks. It stops on Approve or Route to human agent, and the time shows in the status line.

Five made-up enquiries, switched by the tabs at the top:

| Tab | What it shows |
|---|---|
| 1 · Clean match | Every claim is cited. Approve works straight away. |
| 2 · Low-confidence line | An unsourced claim is flagged and Approve is blocked until the line is removed. |
| 3 · Event booking | A hidden test. The code finds the unsourced claim with the same rule but does not show the flag. See `../build-log.md`. Do not show testers that file first. |
| 4 · Lookup fails | A forced failure (made up). The policy lookup fails, the officer can retry once, and on the second failure the gap is logged to the policy team backlog and the case can be routed to a human agent. |
| 5 · Sensitive case | A harm and sensitive case (made up): a distressed resident. It goes straight to a human agent on open, with no AI draft and no policy lookup. Every action is blocked, and it shows why the case was routed. A waiting clock shows it moves to the duty officer at 30 minutes if no one picks it up. |

### Chief Executive sample view (`dashboard.html`)

Four made-up weeks of quality pass rate, replies within SLA and total enquiries, side by side. Every number shows its date range and source. Missing data shows as "No data", not zero. An alert fires if SLA rises while quality falls below 92%. If the latest week has no quality data, it says so instead of raising an alert.

## Not built yet

- Time per case shows on screen but is not saved, and it restarts when you switch tabs.
- Snippets are found by search only. Nothing suggests a snippet automatically.
- Edit counts show on screen but are not saved.
- Case 5's sensitive signals are written into the made-up data. Nothing detects them yet, and the routing reaches no real human agent.
- The lookup failure in case 4 is simulated. There is no real policy lookup.

## Files

| File | What it is for |
|---|---|
| `index.html`, `app.js` | The draft reply screen and its clicks |
| `data.js` | The made-up enquiries, policy pages and drafts |
| `dashboard.html`, `dashboard.js`, `dashboard-data.js` | The Chief Executive sample view and its made-up numbers |
| `style.css` | Layout and colours, including the olive and mustard Approve button |
