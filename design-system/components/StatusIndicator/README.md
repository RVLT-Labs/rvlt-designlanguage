# StatusIndicator

Shows a domain status as a dot plus coloured label (detail views) or a compact dotted pill (tables).

## Variants
- `dot` (default) — 7px dot with a 2px 20% glow ring + 13px medium label in the intent colour. Headers, detail views.
- `pill` — 4px-radius pill, 6px dot inside, 11px medium label, intent tint behind. Tables and compact rows.

## Intents
`success` (`ok`), `warning` (`warn`), `error` (`t-out` on `out-soft`), `info` (`blue`), `neutral` (`rep`), `primary` (solid `red`, white text — live).

Domain mappings live in one table: asset AVAILABLE → success, CHECKED_OUT → primary, IN_MAINTENANCE → warning, RESERVED → info, LOST → error; project ENQUIRY → neutral, QUOTED → info, AWAITING_PAYMENT → warning, CONFIRMED → success, PREPPING → warning, CHECKED_OUT / ON_SITE / RETURNED → primary, COMPLETED / INVOICED → success, CANCELLED → error.

## Consumer provides
`label` (always, sentence case) and either `category` + `value` (a domain status) or a direct `intent`.

_Live: the real component, compiled into `bundle.js` from TwoToned/gearflow@5a85e40 `src/components/ui/status-indicator.tsx` — the RVLT registry primitive (RVLT-Labs/rvlt-designlanguage `packages/flow-theme/registry/rvlt/ui/`) as Flow ships it._
