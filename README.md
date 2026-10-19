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
| [`design-system/`](design-system) | **The RVLT design system, mirrored file for file** from the claude.ai design-system artifact: overview, `tokens.json`, the artwork and Albert guides, 25 component cards (README + preview; 20 mount the real Flow and Binder components), the live bundle, self-hosted fonts, and every logo and icon. **Live at [`/design-system/`](https://rvlt-labs.github.io/rvlt-designlanguage/design-system/).** |
| `assets/stickers/` | **Stickers &amp; Wordmarks pack 1.1.0** — 19 gear illustrations (sticker + line) and 7 word patches (patch + lettering), manifest, palette, style guide, licences (`DESIGN.md` §10). |
| `assets/albert/` | **Albert**, RVLT's character — coloured SVG heads, expressions, stickers, full-body derivatives, all 30 illustrations (the three locked ones included) and the pack's manifest/design lock (`DESIGN.md` §11). |

## The design-system mirror

`design-system/` has the same layout as the claude.ai design system's `project/` folder, so a
file there and its counterpart in the artifact are one and the same. The asset groups are the
one exception: the artifact keeps them in its asset store, and here they are the repo's own files
(Logos and Icons in `design-system/assets/`, the sticker pack and Albert in `assets/`; the mapping
is `scripts/design-system/assets.mjs`).

| Command | What it does |
|---|---|
| `node scripts/design-system/check.mjs` | Fails if a mirrored colour, shadow, radius or font stack drifts from `packages/flow-theme/tokens.json` (both themes), or a font, asset, preview or README is missing. Pages runs it before every deploy. |
| `node scripts/design-system/build-site.mjs [_site]` | Builds the browsable copy at `_site/design-system/` (tokens.css, each preview wrapped with the bundle, the gallery). |
| `GEARFLOW_DIR=… BINDER_DIR=… node scripts/design-system/bundle/build.mjs` | Rebuilds `components/bundle.js` and `bundle.css` from the real component source in Flow and Binder (needs both checkouts with dependencies installed). |

Change the design system here first, then publish the same files to the artifact.

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
