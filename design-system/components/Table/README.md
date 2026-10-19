# Table

The data table: 13.5px rows separated by 1px `line` rules, hover and selection on `elev`.

Heads: semibold `ink-2`, left aligned, 8px × 12px. Cells: `ink-2`, 8px × 12px. Footer: `paper-2`, top `line`. Caption: 12px `muted` below.

## Content rules
- IDs and asset tags in `t-mono` (Geist Mono, `muted`).
- Money and counts right-aligned, tabular, medium weight.
- Status as a StatusIndicator pill.
- Full width — tables escape the 1080px content max.
- Mobile switches to a card list.

_Live: the real component, compiled into `bundle.js` from TwoToned/gearflow@5a85e40 `src/components/ui/table.tsx` — the RVLT registry primitive (RVLT-Labs/rvlt-designlanguage `packages/flow-theme/registry/rvlt/ui/`) as Flow ships it._
