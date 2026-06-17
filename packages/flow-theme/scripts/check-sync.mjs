#!/usr/bin/env node
/**
 * Verify tokens.json stays in sync with DESIGN.md Appendix A (the spec's machine-readable
 * token block). Compares theme primitives, fonts, type ramps, icon sizes and palette order.
 * Exits non-zero on any mismatch. Run: node scripts/check-sync.mjs (or `npm run check`).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const tok = JSON.parse(readFileSync(join(here, "..", "tokens.json"), "utf8"));
const doc = readFileSync(join(here, "..", "..", "..", "DESIGN.md"), "utf8");

const blocks = [...doc.matchAll(/```json\n([\s\S]*?)\n```/g)].map((m) => m[1]);
const appendix = JSON.parse(blocks[blocks.length - 1]); // Appendix A = last json block

const problems = [];
const eq = (label, a, b) => {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) problems.push(`${label}: tokens.json=${A} vs Appendix A=${B}`);
};

// 1) theme primitives (tokens.json themes carry shadows too — compare the colour keys)
const SHADOWS = new Set(["sh-card", "sh-hover", "lit", "sh-stk"]);
for (const theme of ["dark", "light"]) {
  const a = appendix.themes[theme];
  const b = tok.themes[theme];
  for (const k of Object.keys(a)) eq(`themes.${theme}.${k}`, b[k], a[k]);
  for (const k of Object.keys(b)) {
    if (SHADOWS.has(k) || k.startsWith("$")) continue;
    if (!(k in a)) problems.push(`themes.${theme}.${k}: in tokens.json but not Appendix A`);
  }
}

// 2) palette order + icon sizes
eq("avatar order", tok.avatar_palette_order, appendix.avatar_palette_order);
eq("dataviz order", tok.dataviz_series_order, appendix.dataviz_series_order);
eq("icon_px", tok.icon_px, appendix.icon_px);

// 3) fonts (normalized — quotes + whitespace are CSS-equivalent)
const normFonts = (f) =>
  Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.replace(/["']/g, "").replace(/\s+/g, " ").trim()]));
eq("fonts", normFonts(tok.fonts), normFonts(appendix.fonts));

// 4) type scale (display) + app ramp (px) — full value comparison
eq("type_scale_px", tok.type_scale_px, appendix.type_scale_px);
eq("app_type_ramp_px", tok.app_type_ramp_px, appendix.app_type_ramp_px);

// 5) radius (tokens.json uses px strings; Appendix A uses numbers — compare numerically)
for (const k of Object.keys(appendix.radius_px)) {
  eq(`radius.${k}`, parseFloat(tok.radius[k]), appendix.radius_px[k]);
}

// 6) every Appendix A rule is mirrored in tokens.json (extras allowed)
for (const k of Object.keys(appendix.rules)) {
  eq(`rules.${k}`, tok.rules[k], appendix.rules[k]);
}

if (problems.length) {
  console.error("✗ tokens.json is OUT OF SYNC with DESIGN.md Appendix A:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}
console.log("✓ tokens.json is in sync with DESIGN.md Appendix A");
