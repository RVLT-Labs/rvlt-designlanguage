# Badge

A labelled soft-fill pill for a record's status; colour and words together, never colour alone.

## Statuses
| status | colours | means |
|---|---|---|
| `ok` | `ok` on `ok-soft` | available, ready, pass |
| `warn` | `warn` on `warn-soft` | check, due, warning |
| `overbooked` | `t-out` on `out-soft` | overbooked, short, error |
| `repair` | `rep` on `rep-soft` | in repair, neutral |
| `neutral` (default) | `ink-2` on `paper-2` | draft, plain |
| `info` | `blue` on `blue-soft` | sent, in progress but not live |
| `primary` | white on solid `red` | live / active / in use / accepted |

11px bold, `r-pill`, 4px × 10px padding. Always render a visible label.

## In Binder
Same statuses and colours at the mockups' size: 20px high (18px inline flag), 8px side padding, 5px gap, weight 600. `neutral` uses `rep` on `rep-soft`. An open show wears the green `ok` "Active" pill — "live" is red's word.

## Don't
- Don't put solid red on a problem state — problems are the tinted `t-out` on `out-soft`.
- Don't hand-roll pill classes; map domain statuses through the status-colour table (see StatusIndicator).
- Light theme: `ok` and `warn` text sits under 3:1 on its soft fill — the label carries the meaning.

_Live: the real component, compiled into `bundle.js` from TwoToned/gearflow@5a85e40 `src/components/ui/badge.tsx` — the RVLT registry primitive (RVLT-Labs/rvlt-designlanguage `packages/flow-theme/registry/rvlt/ui/`) as Flow ships it._
