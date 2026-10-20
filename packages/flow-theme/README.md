# @rvlt/flow-theme

The **RVLT Flow** brand, as code. One source of truth (`tokens.json`) → a generated
Tailwind v4 / shadcn theme (`globals.css`) + a shadcn **component registry** of
RVLT-styled primitives. This is the canonical, droppable form of
[`DESIGN.md`](../../DESIGN.md) — it should never disagree with it.

> Dark "espresso" is the default surface; `.light` is the opt-in "Paper" alternate.
> Single red accent · 2px outline + hard offset shadow · no gradients · calm data, fun chrome.

## What's in the box

| Path | What |
|---|---|
| `tokens.json` | **Source of truth.** Every colour/radius/font/type token (mirrors DESIGN.md Appendix A). |
| `dist/globals.css` | **Generated** from `tokens.json` — `:root` (dark) + `.light` + `@theme inline`. Drop into `app/globals.css`. |
| `dist/tokens.js` | Typed runtime export (`tokens`, `avatarOrder`, `datavizOrder`) for chart palettes etc. |
| `registry.json` + `registry/` | shadcn registry — 27 RVLT-styled components (see below). |

**Never hand-edit `dist/`.** Change `tokens.json`, then `npm run build`.

## Install

```bash
npm i @rvlt/flow-theme
```

**1 · Theme** — install the animation peer (the theme imports it) and wire your `app/globals.css`:

```bash
npm i tw-animate-css        # required peer — must be imported BEFORE globals.css
```
```css
@import "tailwindcss";
@import "tw-animate-css";                 /* animate-in/out, fade, zoom, slide utilities */
@import "@rvlt/flow-theme/fonts.css";     /* Archivo, Hanken Grotesk, Geist Mono, Kalam, Baloo 2 (self-hosted, OFL) */
@import "@rvlt/flow-theme/globals.css";   /* tokens, @theme utilities, accordion keyframes */
```

The font faces ship in the package (`dist/fonts/`, SIL OFL licences in `dist/fonts/licenses/`); without
that import every heading falls back to a system sans and the kit looks like stock shadcn.

That's it — Tailwind v4 utilities (`bg-paper`, `text-ink`, `border-line-2`, `text-ok`,
`font-display`, `bg-red` …) and the shadcn aliases (`--primary`, `--border`, `--ring` …)
are now wired. Default theme is dark; add `class="light"` on `<html>` for Paper.

**2 · Components** — via the shadcn CLI (copies source into your app, shadcn-style):

```bash
# point shadcn at the published registry (once it's hosted — see below)
npx shadcn@latest add @rvlt/dialog @rvlt/avatar @rvlt/stepper   # …or any below
```

Every component is **RVLT-styled** (2px outline, hard offset shadow, pill, scrim baked in)
and references semantic tokens (`bg-red`, `text-ok`, `border-border`), never raw hex
(§3.6) — so they re-theme automatically. The agent installs and goes; it shouldn't need to
re-derive look-and-feel from `DESIGN.md`.

**The kit (28):**

| Group | Components |
|---|---|
| **Core** | `button` (primary/halo/line/ghost/cream · loading) · `badge` (status) · `card` (interactive/live) · `input` · `textarea` · `label` · `kbd` (key cap, 11px) |
| **Overlays** | `dialog` (modal + scrim) · `sheet` (off-canvas) · `drawer` (mobile, vaul) · `popover` · `dropdown-menu` · `tooltip` · `command` (palette) · `sonner` (toasts) |
| **Forms/structure** | `select` · `checkbox` · `switch` · `tabs` · `accordion` (FAQ) · `table` · `separator` · `skeleton` |
| **RVLT signature** | `avatar` (8-hue palette, AA-safe initials · `PersonAvatar name=…`) · `stat` · `stepper` (lifecycle spine) · `empty-state` (mascot) · `flow-mascot` |

> Stock shadcn components you `add` from the official registry also inherit the brand
> automatically (the `@theme` exposes `--color-primary`, `border-border`, `bg-ok-soft`…) —
> these RVLT versions additionally bake in the *character* (outline, shadow, scrim, pill).

**3 · Tokens at runtime** (optional):

```ts
import { tokens, avatarOrder, datavizOrder } from "@rvlt/flow-theme/tokens";
// e.g. assign chart series colours in datavizOrder; red is reserved for thresholds.
```

## Develop

```bash
npm run build           # tokens.json → dist/globals.css + dist/tokens.js
node scripts/build-registry.mjs # registry.json → dist/r/*.json and dist/registry.json
```

To host the component registry, run `node scripts/build-registry.mjs` and serve `dist/r/` (e.g. on the
Pages site), then set the registry URL in consumers' `components.json`. Until hosted, the
component source under `registry/rvlt/` can be copied in directly.

## Keeping it in sync with DESIGN.md

`tokens.json`'s **theme values, fonts, type ramps, icon sizes and palette order mirror
DESIGN.md Appendix A** (the file adds a `_generator` block of emit config on top). The
`npm run check` script (run on `prepublishOnly`) **fails the build if they drift** —
`scripts/check-sync.mjs` diffs `tokens.json` against Appendix A. When a token changes,
change it in both and re-run `npm run build`; `globals.css` then can't drift.

— © RVLT Labs. Built for production companies, by a production company.

## Public examples and recovery

The source files in `examples/` compile unchanged against the distributed registry in preview-v2. They render at `/preview-v2/contracts/`. `form-field.tsx` demonstrates required/email/search fields and linked errors. `statuses.tsx` shows the public status vocabulary. `card-interactive.tsx` uses a real CardLink. `scan-return.tsx` and `scheduler-recovery.tsx` are in-memory references, without persistence, notifications or a backend.

CrewScheduler provides a phone agenda below 768px and a desktop timeline with separate lanes for overlaps. The full assignment list provides accurate targets for short calls. `onDayChange` lets a consumer change the date and rows together. Times are hours from local midnight; use 24+ for next-day starts. An end earlier than its start crosses midnight. `unavailable` is a row state, and reassignment must check both availability and overlaps. The examples demonstrate this check. A generic Table's sticky column or phone card list remains a consumer responsibility.

The gallery builds a local Flow overlay with `node scripts/design-system/bundle/build-registry.mjs` after installing preview-v2 dependencies. Pinned external Binder adapters remain separate. Token checks and successful compilation are not rendered, screen-reader or crew validation. See `docs/AUDIT-REMEDIATION-MATRIX.md` for evidence and pending checks.
