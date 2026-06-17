# RVLT Flow — website &amp; design language

Marketing site mockups and the brand/design system for **RVLT Flow** —
production operations software built by a production company (RVLT Labs, born
inside Two Toned Productions).

## What's here

| File | What it is |
|---|---|
| [`DESIGN.md`](DESIGN.md) | **The brand bible &amp; build spec.** Tokens, type, voice, the spotlight rule, components, the signature product screens, and a paste-ready app theme. Written for AI build agents — **read §0 first.** |
| [`index.html`](index.html) | Canonical homepage mockup — **dark "espresso", spotlit** (the brand's primary surface). |
| [`light.html`](light.html) | Light "Paper" twin — same copy &amp; system, light surface. |
| [`preview.html`](preview.html) | **Token &amp; component catalog** — every token and component from `DESIGN.md` rendered (dark-first, light toggle; swatch hexes read live from the CSS vars). The visual companion to the spec. |
| [`packages/flow-theme/`](packages/flow-theme) | **`@rvlt/flow-theme`** — the installable theme: `tokens.json` (source) → generated Tailwind v4 / shadcn `globals.css` + a shadcn component registry. The canonical *code* form of the design system; the app consumes this instead of hand-copying tokens. |
| `assets/` | Logo — full RVLT LABS wordmark + RVLT-only mark (SVG). |

## Preview

The mockups are self-contained static HTML (web fonts via Google Fonts; the
RVLT logo is inlined SVG). Open directly, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000/index.html  (dark)
# → http://localhost:8000/light.html  (light)
```

## Notes

- **Fonts:** headlines use **BC Alphapipe** (Adobe Fonts, licensed) with
  **Archivo** as the fallback until the Adobe Web Project kit URL is wired in
  (one commented `<link>` in each file). Body = Hanken Grotesk · handwriting =
  Kalam · the "Flow" wordmark = Baloo 2.
- **Brand red:** `#C12229` (light) / `#E0363D` (dark). One accent, no gradients.
- The design language is **dark-first** and built on a "calm data, fun chrome"
  principle — see `DESIGN.md` §15 for how it maps onto the app
  (Next.js · Tailwind v4 · shadcn/ui).

— © RVLT Labs. Built for production companies, by a production company.
