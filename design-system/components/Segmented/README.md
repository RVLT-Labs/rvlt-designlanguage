# Segmented

A one-of-many choice drawn as one 2px `line-2` outline with the chosen item on `elev` — an accessible radio group.

Radius `r-seg` (9px) at desktop, `r-md` on phones. Items: 600 weight, `muted`, 27px × 10px at 12px desktop; 44px × 12px at 14px on phones. No track fill, no padding. Focus is an inset 2px `ring`.

## Consumer provides
`value`, `onValueChange`, `options: { value, label }[]` and an `aria-label`. Renders `role="radiogroup"` with `role="radio"` items and `aria-checked`; pressing the active item never clears it.

Used for cue type (Go / Standby / Warn), keypad mode (Cue / Page) and print options.

_Live: the real component, compiled into `bundle.js` from RVLT-Labs/binder@f822fdb `apps/web/src/components/ui/segmented.tsx`._
