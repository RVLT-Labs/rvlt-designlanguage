# StatusIndicator

A decorative status dot with a visible, muted text label beside it; colour alone never carries state.

## Intents
| intent | dot | means |
|---|---|---|
| `ok` | `ok` | available, ready, confirmed |
| `warn` | `warn` | prepping, due, check |
| `overbooked` | `t-out` | clash, overdue, lost |
| `repair` | `rep` | in repair |
| `neutral` (default) | `muted` | enquiry, checked out, plain |
| `live` | `ok`, pulsing, with a soft glow | connection freshness only |

Sizes `sm`, `default`, `lg`. `glow` adds a soft ring in the intent's soft fill; `live` turns it on and stops pulsing under reduced motion. The label is 12px medium `muted`.

`live` means the data connection is fresh ("Connection live"). It is not an active selection (that is a focus/selection treatment) and not an equipment state: checked-out gear is `neutral` with the visible label "Checked out".

## Consumer provides
`label` (sentence case), or visible status text right beside the dot. Domain values are mapped explicitly by the consumer, for example AVAILABLE → `ok`, IN_MAINTENANCE → `warn`, LOST → `overbooked`, CHECKED_OUT → `neutral` "Checked out". No domain adapter or pill variant is exported: for a pill, use Badge with its visible text.

Copyable source: `packages/flow-theme/examples/statuses.tsx`, rendered at `/preview-v2/contracts/#statuses`.

_Published Flow preview: local registry source, compiled by `scripts/design-system/bundle/build-registry.mjs`. The pinned external bundle is retained for Binder adapters._
