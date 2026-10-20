# CueTag

A cue drawn on the script page: a white pill in the margin outlined in the department colour, the department code in that colour and the cue number in bold page ink.

## Anatomy (points; screen and print share the geometry)
- **Tag** — 14pt pill (radius 7), opaque `page` fill, 9pt Helvetica: code in the department colour, number bold in `page-ink`. 6pt end padding, 3pt between code and number, 4pt from the page edge, 2pt between stacked tags.
- **Type** — go: 1pt outline · standby: 1pt dashed (3 2) · warn: 1.5pt outline.
- **Trigger** — the words the cue goes on, underlined 1.5pt in the department colour, 1pt below the word box. On screen only, a 10% fill while selected or hovered; print never fills.
- **Leader** — 0.75pt at the underline's level, so it never crosses a glyph; a stacked tag jogs through a 2pt gutter.
- **Selection** — 2px `red` outline, 3pt clear of the tag, radius 4. A peer's selection uses their person colour.

## Rules
- The page is `page` white in every theme and the brightest thing on screen. Department colour is the only colour on it.
- Use the stored department colour as is on the page. In chrome use its tint (amber, blue, purple, teal, pink, coral, lime) — never a dark department colour as text on espresso.
- Red is never a department colour; the picker refuses anything within ΔE76 20 of RVLT red.
- Labels never print on the page — they live in the tag's accessible name and title, the cue editor, lists and sheets.
- Markup type is Helvetica-metric so screen and paper measure identically — the one place RVLT's UI fonts aren't used.

_Static rendition hand-written from RVLT-Labs/binder `packages/core/src/markup/cueTags.ts, apps/web/src/markup/CueMarker.tsx`._

Department colour is for outlines and leaders (3:1 graphical floor). All cue words and numbers use page-ink on the fixed white page, with a 4.5:1 text floor. Go, standby and warn retain shape and dash distinctions. Actual script zoom, monochrome print and live calling still require Binder product validation.
