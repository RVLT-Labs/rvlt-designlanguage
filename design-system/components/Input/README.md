# Input

The text field: 2px `input` outline on `card`, 16px text, 44px minimum height, red focus ring.

## Family
- `Input` — `radius` corners, 8px × 14px padding, `faint` placeholder.
- `SearchInput` — 40px list-toolbar search with a 16px leading Lucide `search` icon in `faint`, 14px text.
- `Textarea` — same skin, 80px minimum, vertical resize.
- `Label` — 14px medium `ink-2`. A field stacks label, control, then a `t-micro` hint in `muted` or error in `t-out`, 6px apart; a required marker is a `red` asterisk.

## States
Invalid: set `aria-invalid="true"` — border and focus ring turn `t-out`; pair it with a message. Disabled: 45% opacity.

## Consumer provides
A visible `Label`, placeholder in sentence case, validation message. Forms: `grid-cols-2`, 14px gap, actions right-aligned (secondary then primary).

_Live: the real component, compiled into `bundle.js` from TwoToned/gearflow@5a85e40 `src/components/ui/input.tsx` — the RVLT registry primitive (RVLT-Labs/rvlt-designlanguage `packages/flow-theme/registry/rvlt/ui/`) as Flow ships it._
