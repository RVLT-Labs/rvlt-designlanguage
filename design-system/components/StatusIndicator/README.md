# StatusIndicator

The distributed registry component shows a decorative dot and a visible, muted text label. Supply `label` or adjacent visible status text. Colour alone never carries state.

Public intents: `ok`, `warn`, `overbooked`, `repair`, `neutral`, `live`. Sizes: `sm`, `default`, `lg`. `glow` enables a soft ring. `live` means connection freshness, uses green and stops pulsing under reduced motion. Active selection is a focus/selection treatment. Checked-out equipment is a domain label, not connection freshness.

Domain values are mapped explicitly by the consumer: AVAILABLE to `ok`, IN_MAINTENANCE to `warn`, LOST to `overbooked`, CHECKED_OUT to `neutral` with the visible label “Checked out”. No domain adapter or pill variant is exported. For a pill use Badge and retain visible text.

Copyable, compiled source: `packages/flow-theme/examples/statuses.tsx`, rendered at `/preview-v2/contracts/#statuses`. Table's phone alternative is a consumer responsibility: retain the semantic table in a scroll region or provide a labelled card list; never hide required columns silently.
