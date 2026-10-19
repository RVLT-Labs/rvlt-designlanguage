# RVLT — design language, brand &amp; website

The brand and design system for **RVLT Labs** and every RVLT product — **RVLT Flow**
(production operations) and **RVLT Binder** (the stage manager's script binder) —
plus the marketing site mockups. Software built by a production company (RVLT Labs,
born inside Two Toned Productions). This repo is the **master copy**: products and the
RVLT design-system artifact sync from it.

## What's here

| File | What it is |
|---|---|
| [`DESIGN.md`](DESIGN.md) | **The brand bible &amp; build spec.** Tokens, type, voice, the spotlight rule, components, the signature product screens, and a paste-ready app theme. Written for AI build agents — **read §0 first.** |
| [`index.html`](index.html) | Canonical homepage mockup — **dark "espresso", spotlit** (the brand's primary surface). |
| [`light.html`](light.html) | Light "Paper" twin — same copy &amp; system, light surface. |
| [`preview.html`](preview.html) | **Token &amp; component catalog** — every token and component from `DESIGN.md` rendered (dark-first, light toggle; swatch hexes read live from the CSS vars). The visual companion to the spec. |
| [`packages/flow-theme/`](packages/flow-theme) | **`@rvlt/flow-theme`** — the installable theme: `tokens.json` (source) → generated Tailwind v4 / shadcn `globals.css` + a shadcn component registry. The canonical *code* form of the design system; the app consumes this instead of hand-copying tokens. |
| `assets/` | Logo — full RVLT LABS wordmark + RVLT-only mark (SVG). |
| `assets/stickers/` | **Stickers &amp; Wordmarks pack 1.1.0** — 19 gear illustrations (sticker + line) and 7 word patches (patch + lettering), manifest, palette, style guide, licences (`DESIGN.md` §10). |
| `assets/albert/` | **Albert**, RVLT's character — coloured SVG heads, expressions, stickers, full-body derivatives, the three locked illustrations and the pack's manifest/design lock (`DESIGN.md` §11). |

## Preview

The mockups are self-contained static HTML (web fonts via Google Fonts; the
RVLT logo is inlined SVG). Open directly, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000/index.html  (dark)
# → http://localhost:8000/light.html  (light)
```

## Notes

- **Fonts:** **Archivo** is the official display face (2026-10-19); BC Alphapipe
  survives only as the drawn RVLT mark (SVG outlines). Body = Hanken Grotesk ·
  data = Geist Mono · handwriting = Kalam · the "Flow" wordmark = Baloo 2.
- **Brand red:** `#C12229` (light) / `#E0363D` (dark). One accent, no gradients.
- The design language is **dark-first** and built on a "calm data, fun chrome"
  principle — see `DESIGN.md` §15 for how it maps onto the app
  (Next.js · Tailwind v4 · shadcn/ui).

— © RVLT Labs. Built for production companies, by a production company.
