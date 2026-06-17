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
| `registry.json` + `registry/` | shadcn registry — RVLT-styled `button`, `badge`, `card`, `input`, `utils`. |

**Never hand-edit `dist/`.** Change `tokens.json`, then `npm run build`.

## Install

```bash
npm i @rvlt/flow-theme
```

**1 · Theme** — in your `app/globals.css`:

```css
@import "tailwindcss";
@import "@rvlt/flow-theme/globals.css";
```

That's it — Tailwind v4 utilities (`bg-paper`, `text-ink`, `border-line-2`, `text-ok`,
`font-display`, `bg-red` …) and the shadcn aliases (`--primary`, `--border`, `--ring` …)
are now wired. Default theme is dark; add `class="light"` on `<html>` for Paper.

**2 · Components** — via the shadcn CLI (copies source into your app, shadcn-style):

```bash
# point shadcn at the published registry (once it's hosted — see below)
npx shadcn@latest add @rvlt/button @rvlt/badge @rvlt/card @rvlt/input
```

Components reference the semantic tokens (`bg-red`, `text-ok`, `--primary`), never raw
hex (DESIGN.md §3.6), so they re-theme automatically.

**3 · Tokens at runtime** (optional):

```ts
import { tokens, avatarOrder, datavizOrder } from "@rvlt/flow-theme/tokens";
// e.g. assign chart series colours in datavizOrder; red is reserved for thresholds.
```

## Develop

```bash
npm run build           # tokens.json → dist/globals.css + dist/tokens.js
npm run build:registry  # registry.json → public/r/*.json (needs the shadcn CLI)
```

To host the component registry, run `build:registry` and serve `public/r/` (e.g. on the
Pages site), then set the registry URL in consumers' `components.json`. Until hosted, the
component source under `registry/rvlt/` can be copied in directly.

## Keeping it in sync with DESIGN.md

`tokens.json` is the same data as DESIGN.md Appendix A. When a token changes, change it in
**both** (or generate Appendix A from here). The generated `globals.css` then can't drift —
that's the whole point of centralising.

— © RVLT Labs. Built for production companies, by a production company.
