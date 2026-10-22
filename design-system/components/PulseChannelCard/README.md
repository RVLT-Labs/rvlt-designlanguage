# PulseChannelCard

A channel as Pulse draws it: a meter, the name, one tick per dimension that can fail on its own, and a reading. It answers "is anything wrong, and is it mine" in one second.

## Anatomy
- **Card** — `card` fill, 2px `line-2` outline, `r-lg`, hard offset shadow (`0 3px 0`) and the lit top edge. The channel in the operator's ears takes a 2px `ok` ring; a critical fault takes a 2px `t-out` ring.
- **Meter** — a level trace on `paper`. A fault or caution draws a flag across the top in the status colour with its words ("Battery critical").
- **Ticks** — RF, Audio, Battery. `ok` on all clear; a fault or caution fills that cell's background with its soft status fill. Every tick carries a glyph and a word.
- **Reading** — Geist Mono, tabular: anything a machine measured.
- **Note** — an operator's own words are Hanken Grotesk italic in `ink-2`, never mono.

## Rules
- Red on a card is a critical fault and nothing else. Listening is `ok` green, so the two can't be confused on a 64-channel grid.
- Observed, inferred, stale and unknown look different. Unknown is drawn `rep` with a "?" and "—", never as zero or healthy.
- Never colour alone: each state has a glyph and a word.
- Cards carry the outline and offset shadow. Secondary controls around them are 1px lines with no shadow.
- Keyboard focus on a card is a 2px `ink` ring, so it never reads as a fault.
- No mascot, stickers or Kalam on live screens.

The header lockup shown above the cards is the Pulse glyph on a red tile with "Pulse" in Archivo 800 and a "by RVLT" pill (`assets/Logos/pulse-mark.svg`).

_Static rendition hand-written from `qubered/a2-monitor` (`apps/live/src/components/ChannelCard.tsx`, `packages/ui/brand`, `docs/design/DESIGN.md` §10.1). The live component is not in the bundle._
