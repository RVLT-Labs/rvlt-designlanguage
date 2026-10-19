# BinderButton

Binder's button: a rounded rectangle, never a pill — 30px tall with a 10px radius from 768px up, 44px with a 12px radius on phones.

## Variants
- `primary` — `red` fill and border, white label, the `sticker` shadow (hard drop + lit edge). Hover lifts 1px; press moves 2px down-right onto `lit`. A Binder view may carry several (the top bar's, each script row's Open).
- `line` — the default: `card` fill, 2px `border`; hover `elev` with an `ink-2` border.
- `ghost` — `ink-2` text, 10px side padding; hover `ink`.
- `halo` and `cream` exist as in the RVLT Button, for marketing moments.

## Sizes
`sm` 26px / `r-sm` / 12px · default 30px / `r-btn` / 13px · `lg` 40px / `r-btn` / 14px — at 768px and up. Phones: 44px (48 `lg`) with `r-md`. On a tablet an invisible layer keeps a 44px hit area. Icons 16px.

## Why it differs from Flow
Binder's approved mockups are its binding standard: the denser markup tool needs compact controls next to the page. Flow and marketing keep the pill.

_Live: the real component, compiled into `bundle.js` from RVLT-Labs/binder@f822fdb `apps/web/src/components/ui/button.tsx`._
