# Badge

A labelled soft-fill pill for a record's status; colour and words together, never colour alone.

## Statuses
| status | colours | means |
|---|---|---|
| `ok` | `ok` on `ok-soft` | available, ready, pass |
| `warn` | `warn` on `warn-soft` | check, due, warning |
| `overbooked` | `t-out` on `out-soft` | overbooked, short, error |
| `repair` | `rep` on `rep-soft` | in repair |
| `neutral` (default) | `ink-2` on `paper-2` | draft, sent, checked out, plain |

These five are the whole API. There is no `info` or `primary` status: in-progress states such as "Sent" are `neutral` with the word. A solid red "live" pill is not a Badge either; it is a deliberate `action-red` composition a consumer chooses for an active operational state, with white text.

11px bold, `r-pill`, 4px × 10px padding. Always render a visible label. Every status pair passes 4.5:1 in both themes (`packages/flow-theme/contrast.json`).

## In Binder
Same statuses and colours at the mockups' size: 20px high (18px inline flag), 8px side padding, 5px gap, weight 600. `neutral` uses `rep` on `rep-soft`. An open show wears the green `ok` "Active" pill.

## Don't
- Don't put solid red on a problem state. Problems are the tinted `t-out` on `out-soft`.
- Don't hand-roll pill classes. Map domain statuses to a status explicitly in the consumer (see StatusIndicator for the same mapping as a dot).

_Published Flow preview: local registry source, compiled by `scripts/design-system/bundle/build-registry.mjs`. The pinned external bundle is retained for Binder adapters._
