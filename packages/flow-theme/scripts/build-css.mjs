#!/usr/bin/env node
/**
 * Generate dist/globals.css from tokens.json — the single source of truth.
 * Tailwind v4 convention: :root (dark default) + .light + @theme inline.
 * Run: node scripts/build-css.mjs   (or `npm run build`)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const t = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"));

const skip = (k) => k.startsWith("$");
const vars = (obj, indent = "  ") =>
  Object.entries(obj)
    .filter(([k]) => !skip(k))
    .map(([k, v]) => `${indent}--${k}: ${v};`)
    .join("\n");

const header = `/* ----------------------------------------------------------------------------
 * @rvlt/flow-theme v${t.version} — GENERATED from tokens.json. Do not edit by hand.
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
  /* === shadcn semantic aliases (theme-independent — restyle primitives through these) === */
${vars(t.aliases)}
}`;

const lightBlock = `.light {
  /* === primitives: light "Paper" (opt-in) === */
${vars(t.themes.light)}
}`;

const colorMappings = t.themeColors
  .map((c) => `  --color-${c}: var(--${c});`)
  .join("\n");

const themeBlock = `@theme inline {
  /* expose Tailwind utilities: bg-paper, text-ink, border-line-2, text-ok, font-display… */
${colorMappings}
  /* fonts */
  --font-display: ${t.fonts.display};
  --font-sans: ${t.fonts.sans};
  --font-hand: ${t.fonts.hand};
  --font-mono: ${t.fonts.mono};
  /* radius */
  --radius: ${t.radius.default};
}`;

const css = [header, rootBlock, lightBlock, themeBlock].join("\n\n") + "\n";

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "globals.css"), css);

// also emit a token export for runtime use (chart palettes, etc.) — plain ESM + .d.ts
const data = {
  version: t.version,
  themes: t.themes,
  radius: t.radius,
  fonts: t.fonts,
  typeScale: t.typeScale,
  avatarOrder: t.avatarOrder,
  datavizOrder: t.datavizOrder,
};
const js = `// @rvlt/flow-theme v${t.version} — GENERATED from tokens.json. Do not edit.
export const tokens = ${JSON.stringify(data, null, 2)};
export const avatarOrder = tokens.avatarOrder;
export const datavizOrder = tokens.datavizOrder;
`;
writeFileSync(join(root, "dist", "tokens.js"), js);

const dts = `// @rvlt/flow-theme v${t.version} — GENERATED. Do not edit.
export type ThemeName = "dark" | "light";
export declare const tokens: {
  version: string;
  themes: Record<ThemeName, Record<string, string>>;
  radius: Record<string, string>;
  fonts: Record<string, string>;
  typeScale: Record<string, number>;
  avatarOrder: string[];
  datavizOrder: string[];
};
export declare const avatarOrder: string[];
export declare const datavizOrder: string[];
`;
writeFileSync(join(root, "dist", "tokens.d.ts"), dts);

console.log("✓ wrote dist/globals.css, dist/tokens.js, dist/tokens.d.ts from tokens.json");
