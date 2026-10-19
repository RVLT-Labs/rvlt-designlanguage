# Sticker

Pack artwork (stickers, patches, linework, lettering) placed as a plain image: one focal piece in an app moment, a small cluster in marketing.

## Usage
- Render with an ordinary `<img>`, or the pack's `RvltArt` wrapper: `id` (e.g. `"coffee-mug"`, `"go"`), `variant` (`sticker` | `line` for illustrations, `patch` | `wordmark` for phrases), `width`, optional `tilt` (applies the design's gallery tilt once), `decorative` (default true → `alt=""`, `aria-hidden`, no pointer events) or `decorative={false}` with a `label`.
- Set width only; height follows the SVG's own viewBox. Stickers 96–240px (160 default), patches 160–320px each sized by eye.
- In apps: one piece, in a welcome, onboarding, empty or success state, with real copy beside it ("All gear's back."). Never in tables, controls, alerts, compliance, errors or destructive confirmations.
- In marketing: one focal patch or sticker plus one or two smaller companions around a heading, hero or final CTA; tilts up to ±11° in hero clusters. Apps keep the gallery's 2–5°.
- Keep ~10% of the art's shorter side clear of text and controls; drop pieces on phones rather than overlap.

## Don't
Redraw, recolour, stretch, crop the shadow, add a CSS shadow or border, animate continuously, or use art as a tiny UI icon (use Lucide). Patches like Go!, Standby and On air never stand in for real status.

_Preview loads the uploaded masters from this system's asset store; source: RVLT Flow Stickers and Wordmarks pack 1.1.0 (`examples/react/RvltArt.tsx`)._
