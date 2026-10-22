# PulseChannelCard

A channel as Pulse draws it: the real `ChannelCard` from Pulse's Live app, compiled into `pulse-bundle.js` (`window.RvltPulse`) and styled by `pulse-bundle.css`, which is Pulse's own stylesheet. It answers "is anything wrong, and is it mine" in one second. Shown: the channel in the operator's ears, a critical battery fault with its alert, and a channel whose telemetry is stale.

## Anatomy
- **Card** — `card` fill, 2px `line-2` outline, `r-lg`, hard offset shadow and the lit top edge. The channel in the operator's ears takes a 2px `ok` ring.
- **Meter** — a level trace. It redraws at its data rate and is never animated; a gap in the data is drawn as a gap, not as silence.
- **Status strip** — RF, Audio, Battery in fixed positions. A fault or caution fills that cell's background; every cell carries a glyph and a word.
- **Alert overlay** — a fault or caution flag across the photo area, in the status colour, with its words.
- **Mic type** — a glyph stands in for a missing photo; an inferred type says "Likely".

## Rules
- Red on a card is a critical fault and nothing else. Listening is `ok` green, so the two can't be confused on a 64-channel grid.
- Observed, inferred, stale and unknown look different. Unknown is never drawn as zero or healthy.
- Never colour alone: each state has a glyph and a word.
- Keyboard focus on a card is a 2px `ink` ring, so it never reads as a fault.
- The soft glow around an unacknowledged critical alert is Pulse's one sanctioned glow (the attention pulse).
- No mascot, stickers or Kalam on live screens.

_Live component from `qubered/a2-monitor` `apps/live/src/components/ChannelCard.tsx` at the commit recorded in `pulse-bundle.js`. Pulse is dark only, so this card stays dark in the light gallery theme. The meter here is fed a synthetic signal._
