# Card

The bordered content surface: 2px `border` outline, `card` fill and a hard `sh-card` offset shadow, never a blur.

## Parts
`Card` › `CardHeader` (20px padding, 6px gap) › `CardTitle` (Archivo bold 15px) + `CardDescription` (13.5px `muted`); `CardContent` and `CardFooter` (20px, no top padding).

## Variants
- `interactive` — clickable: lifts 3px to `sh-hover` on hover, focus ring.
- `live` — the one active / real-time card: `elev` fill plus the `lit` top-edge highlight.

## Panel
`Panel` is the lighter surface for stat tiles and standalone sections: 1px `line` border, `r` radius, same `sh-card`, 20px padding (`responsive`: 24px from 640px).

## Don't
- Don't wrap every form section in a card — form sections are flat, separated by a top border.
- No coloured left-border accents, no gradients, no soft shadows.

_Live: the real component, compiled into `bundle.js` from TwoToned/gearflow@5a85e40 `src/components/ui/card.tsx` — the RVLT registry primitive (RVLT-Labs/rvlt-designlanguage `packages/flow-theme/registry/rvlt/ui/`) as Flow ships it._
