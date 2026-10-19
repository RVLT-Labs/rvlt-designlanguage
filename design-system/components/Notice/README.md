# Notice

A toast-style notice card and the offline banner: `elev` fill, 2px `line-2` border, `r-md` corners.

## Notice
- Sticker shadow (`sh-stk`), 13.5px `ink` message, an optional action as a blue 600 link, and × to dismiss (32px desktop, 44px phone).
- A **problem** (a rejected write, an error) adds a 3px `red` bar down the left edge; good news has none. The words say what happened.
- Fixed bottom-right, 416px wide on desktop; on a phone above the tab bar.

## OfflineBanner
- A polite status, never an alert: wifi-off icon in `muted`, `ink-2` text, the waiting count in mono. "Offline. Changes are saved on this device — 3 waiting to sync."
- Drawn once, under the top bar of every signed-in screen, while offline.

## Copy
Name people and agents ("Oli moved LX 12 to p.2 while you were offline."); say what's recoverable.

_Static rendition hand-written from RVLT-Labs/binder `apps/web/src/components/Notices.tsx, OfflineBanner.tsx`._
