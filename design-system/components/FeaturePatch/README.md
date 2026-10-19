# FeaturePatch

A module wayfinding icon badge: a Lucide glyph on its module hue, as a sticker or a soft tile.

- `sticker` — full hue fill, 2px `patch-border` (#FFFDF8) edge, `sh-stk` shadow (marketing stickers use a 3px edge; tilt 2–5° in apps, up to ±11° in marketing hero clusters), `sh-stk` shadow, 24px icon at 2.6 stroke. Feature cards, hero blocks.
- `soft` — `*-soft` fill, hue-coloured 20px icon. Nav, launcher tiles.
- Sizes: 42px with `r` corners, or `sm` 32px with `r-sm`.

Flow module hues: Projects `blue`, Assets `amber`, Schedule `green`, Crew `purple`, Maintenance `coral`, Warehouse / compliance `teal`. Binder's rail: Script `blue`, Cues `amber`, Docs `teal`, Activity `purple`, Exports `green`. Red is never a module hue.

## On-fill rule
Sticker icon colour is `dark` in the dark theme; in light it's white, except on `amber` (stays `dark`). Always give it a visible label or `aria-label`.

_Live: the real component, compiled into `bundle.js` from TwoToned/gearflow@5a85e40 `src/components/ui/feature-patch.tsx` — the RVLT registry primitive (RVLT-Labs/rvlt-designlanguage `packages/flow-theme/registry/rvlt/ui/`) as Flow ships it._
