#!/usr/bin/env node
/**
 * Generate dist/globals.css + dist/tokens.{js,d.ts} from tokens.json — the source of truth —
 * and dist/fonts.css + dist/fonts/ (the self-hosted brand faces) from the design-system font list.
 * Tailwind v4 convention: :root (dark default) + .light + @theme inline.
 * Run: node scripts/build-css.mjs           (or `npm run build`)
 *      node scripts/build-css.mjs --check   (exit 1 if a committed dist file is stale)
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const CHECK = process.argv.includes("--check");
const t = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"));
const G = t._generator;
const outputs = {}; // dist-relative path → contents (written, or compared under --check)

const skip = (k) => k.startsWith("$");
const vars = (obj, indent = "  ") =>
  Object.entries(obj)
    .filter(([k]) => !skip(k))
    .map(([k, v]) => `${indent}--${k}: ${v};`)
    .join("\n");

const header = `/* ----------------------------------------------------------------------------
 * @rvlt/flow-theme — GENERATED from tokens.json. Do not edit by hand.
 * Source of truth: tokens.json  ·  Design spec: ${t.designSpec}
 * Tailwind v4 + shadcn convention (direct hex / var() aliases, @theme inline).
 * Dark "espresso" is the default; .light is the opt-in "Paper" alternate.
 * -------------------------------------------------------------------------- */`;

const rootBlock = `:root {
  /* === primitives: dark "espresso" (default) === */
${vars(t.themes.dark)}
  /* === radius === */
  --radius: ${t.radius.default};
  --r: ${t.radius.md}; --r-lg: ${t.radius.lg};
  /* === shadcn semantic aliases + brand constants (restyle primitives through these) === */
${vars(G.aliases)}
  /* === theme-dependent aliases: 2px outline = --line-2 on dark === */
${vars(G.aliasesByTheme.dark)}
}`;

const lightBlock = `.light {
  /* === primitives: light "Paper" (opt-in) === */
${vars(t.themes.light)}
  /* === theme-dependent aliases: 2px outline = --ink on light === */
${vars(G.aliasesByTheme.light)}
}`;

const colorMap = (names) =>
  names.map((c) => `  --color-${c}: var(--${c});`).join("\n");
const textMap = Object.entries(t.app_type_ramp_px)
  .filter(([k]) => !skip(k))
  .map(([k, px]) => `  --text-${k}: ${px / 16}rem;`)
  .join("\n");

const themeBlock = `@theme inline {
  /* brand palette → bg-paper, text-ink, border-line-2, text-ok, bg-ok-soft, bg-red… */
${colorMap(G.themeColors)}
  /* shadcn role utilities → bg-primary, text-foreground, border-border, ring-ring… */
${colorMap(G.roleColors)}
  /* app functional type ramp (§5.5) → text-page-title, text-ui-text, text-table-cell… */
${textMap}
  /* fonts */
  --font-display: ${t.fonts.display};
  --font-sans: ${t.fonts.sans};
  --font-hand: ${t.fonts.hand};
  --font-wordmark: ${t.fonts.wordmark};
  --font-mono: ${t.fonts.mono};
  /* radius */
  --radius: ${t.radius.default};
  /* accordion animation (shadcn) */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
}`;

// tw-animate-css is a peer dep — consumers must import it in their own globals.css
// BEFORE importing this file. Accordion keyframes are inlined here so no external
// @import is needed from within the package (avoids CSS resolver issues with local
// file: deps and monorepos where tw-animate-css isn't in the package's own node_modules).
const keyframes = `@keyframes accordion-down {
  from { height: 0 }
  to { height: var(--radix-accordion-content-height) }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height) }
  to { height: 0 }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}`;

const css = [header, rootBlock, lightBlock, themeBlock, keyframes].join("\n\n") + "\n";

outputs["globals.css"] = css;

// token export for runtime use (chart palettes, type ramp, etc.) — plain ESM + .d.ts
const data = {
  version: t.version,
  themes: t.themes,
  radius: t.radius,
  fonts: t.fonts,
  typeScalePx: t.type_scale_px,
  appTypeRampPx: t.app_type_ramp_px,
  iconPx: t.icon_px,
  avatarOrder: t.avatar_palette_order,
  datavizOrder: t.dataviz_series_order,
};
const js = `// @rvlt/flow-theme — GENERATED from tokens.json. Do not edit.
export const tokens = ${JSON.stringify(data, null, 2)};
export const avatarOrder = tokens.avatarOrder;
export const datavizOrder = tokens.datavizOrder;
`;
outputs["tokens.js"] = js;

const dts = `// @rvlt/flow-theme — GENERATED. Do not edit.
export type ThemeName = "dark" | "light";
export declare const tokens: {
  version: string;
  themes: Record<ThemeName, Record<string, string>>;
  radius: Record<string, string>;
  fonts: Record<string, string>;
  typeScalePx: Record<string, number>;
  appTypeRampPx: Record<string, number>;
  iconPx: number[];
  avatarOrder: string[];
  datavizOrder: string[];
};
export declare const avatarOrder: string[];
export declare const datavizOrder: string[];
`;
outputs["tokens.d.ts"] = dts;

// self-hosted brand faces (§5): the design system's font list and files are the single source
const FONT_SRC = join(root, "..", "..", "design-system");
const ds = JSON.parse(readFileSync(join(FONT_SRC, "tokens.json"), "utf8"));
const faces = ds.type.fonts.map((f) =>
  `@font-face {\n  font-family: "${f.family}";\n  src: url("./fonts/${basename(f.file)}") format("woff2");\n  font-weight: ${f.weight};\n  font-style: ${f.style};\n  font-display: swap;\n}`);
outputs["fonts.css"] = `/* @rvlt/flow-theme: GENERATED brand font faces (Archivo, Hanken Grotesk, Geist Mono, Kalam,
 * Baloo 2), SIL OFL, self-hosted. Import before globals.css: @import "@rvlt/flow-theme/fonts.css";
 * Licences: ./fonts/licenses/. Source: design-system/fonts in RVLT-Labs/rvlt-designlanguage. */
${faces.join("\n")}
`;

if (CHECK) {
  const stale = Object.entries(outputs).filter(([f, s]) => !existsSync(join(root, "dist", f)) || readFileSync(join(root, "dist", f), "utf8") !== s).map(([f]) => f);
  if (stale.length) {
    console.error(`✗ dist is stale: ${stale.join(", ")} (run node scripts/build-css.mjs)`);
    process.exit(1);
  }
  console.log("✓ dist/globals.css, tokens.js, tokens.d.ts and fonts.css match tokens.json");
  process.exit(0);
}
mkdirSync(join(root, "dist", "fonts", "licenses"), { recursive: true });
for (const [f, s] of Object.entries(outputs)) writeFileSync(join(root, "dist", f), s);
for (const f of ds.type.fonts) copyFileSync(join(FONT_SRC, f.file), join(root, "dist", "fonts", basename(f.file)));
for (const l of readdirSync(join(FONT_SRC, "fonts", "licenses"))) copyFileSync(join(FONT_SRC, "fonts", "licenses", l), join(root, "dist", "fonts", "licenses", l));
console.log("✓ wrote dist/globals.css, dist/tokens.js, dist/tokens.d.ts, dist/fonts.css (+ dist/fonts/) from tokens.json");
