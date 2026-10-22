# PulseRunOfShow

The run-of-show rows behind one disclosure: the real `RunOfShow` and `SessionBar` from Pulse's Live app. Each row says what is on now, what is next and how many channels the turnover still needs.

## Rules
- Open by default; the choice is remembered per device. The summary stays visible when the rows are hidden, so a turnover that needs someone is never hidden with them.
- The rows have no panel of their own: the page background and one hairline between rooms.
- Secondary controls (the Turnover button) are quiet: no outline, no offset shadow. The outline and offset shadow belong to cards, panels and the one red primary.
- Starting a session happens in the turnover sheet, never from a single press on the row.

_Live components from `qubered/a2-monitor` `apps/live/src/components/RunOfShow.tsx` and `SessionBar.tsx` at the commit recorded in `pulse-bundle.js`._
