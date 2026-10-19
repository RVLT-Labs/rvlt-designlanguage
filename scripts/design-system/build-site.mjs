#!/usr/bin/env node
// Builds the live, browsable copy of design-system/ for GitHub Pages:
//
//   node scripts/design-system/build-site.mjs [siteRoot=_site]   → <siteRoot>/design-system/
//
// It does what the claude.ai design-system frame does around each card: compiles tokens.css from
// tokens.json, and wraps every components/<Card>/preview.html with tokens.css, bundle.css, React
// and bundle.js (→ view.html). Asset-store links (/_blob/<id>) become paths to the repo's own
// files, which the Pages workflow publishes under <siteRoot>/assets and <siteRoot>/design-system.
// No dependencies.
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAssets } from "./assets.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const SRC = path.join(REPO, "design-system");
const OUT = path.join(path.resolve(REPO, process.argv[2] ?? "_site"), "design-system");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(SRC, OUT, { recursive: true });
cpSync(path.join(HERE, "site"), OUT, { recursive: true });

const tokens = JSON.parse(readFileSync(path.join(SRC, "tokens.json"), "utf8"));
const index = JSON.parse(readFileSync(path.join(SRC, "design-system.json"), "utf8"));

// ── tokens.css, compiled the way the design-system type documents it ────────
const themes = tokens.color.themes.map((t) => t.id);
const ref = (v) => String(v).replace(/\{([a-z0-9-]+)\}/g, "var(--$1)");
const themed = (theme) => {
  const lines = [];
  for (const tok of [...tokens.color.tokens, ...tokens.shadow.tokens]) {
    const v = tok.value;
    if (theme === themes[0]) lines.push(`  --${tok.name}: ${ref(typeof v === "string" ? v : v[themes[0]])};`);
    // Later themes re-declare their own values, and every alias so it re-resolves.
    else if (typeof v === "string" ? /\{/.test(v) : theme in v) lines.push(`  --${tok.name}: ${ref(typeof v === "string" ? v : v[theme])};`);
  }
  return lines.join("\n");
};
const css = [
  `:root, [data-theme="${themes[0]}"] {\n${themed(themes[0])}\n}`,
  ...themes.slice(1).map((t) => `[data-theme="${t}"] {\n${themed(t)}\n}`),
  ":root {\n" + [
    ...["spacing", "radius", "layout"].flatMap((fam) => tokens[fam].tokens.map((t) => `  --${t.name}: ${t.value};`)),
    ...Object.entries(tokens.type.families).map(([k, v]) => `  --font-${k}: ${v};`),
  ].join("\n") + "\n}",
  ...tokens.type.groups.flatMap((g) => g.styles.map((s) => {
    const family = s.family ?? g.family;
    return `.${s.name} { font-family: var(--font-${family}); font-size: ${s.fontSize}; font-weight: ${s.fontWeight};` +
      (s.lineHeight !== undefined ? ` line-height: ${s.lineHeight};` : "") +
      (s.letterSpacing !== undefined ? ` letter-spacing: ${s.letterSpacing};` : "") + " }";
  })),
  ...tokens.type.fonts.map((f) =>
    `@font-face { font-family: "${f.family}"; src: url("${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style}; font-display: swap; }`),
].join("\n\n") + "\n";
writeFileSync(path.join(OUT, "tokens.css"), css);

// ── assets: /_blob/<id> → repo file (paths relative to <siteRoot>/design-system/) ──
const { byBlob, missing } = resolveAssets(REPO, index);
if (missing.length) throw new Error("unresolved assets:\n" + missing.join("\n"));
const fromDs = (file) => (file.startsWith("design-system/") ? file.slice("design-system/".length) : "../" + file);
const groups = {};
for (const { group, name, file } of byBlob.values()) (groups[group] ??= []).push({ name, src: fromDs(file) });
writeFileSync(path.join(OUT, "assets.json"), JSON.stringify(
  index.groups.filter((g) => groups[g]).map((g) => ({ name: g, files: groups[g] })), null, 2));

// ── cards: view.html per preview + cards.json ──────────────────────────────
const cards = [];
const compDir = path.join(SRC, "components");
for (const name of readdirSync(compDir)) {
  const dir = path.join(compDir, name);
  if (!statSync(dir).isDirectory() || name === "lib") continue;
  const html = readFileSync(path.join(dir, "preview.html"), "utf8");
  const [marker, ...rest] = html.split("\n");
  const attr = (k) => marker.match(new RegExp(`${k}=(?:"([^"]*)"|(\\S+))`))?.slice(1).find(Boolean);
  const head = [
    `<script>document.documentElement.setAttribute("data-theme", new URLSearchParams(location.search).get("theme") === "light" ? "light" : "dark");</script>`,
    `<link rel="stylesheet" href="../../tokens.css">`,
    `<link rel="stylesheet" href="../bundle.css">`,
    ...index.libraries.map((l) => `<script src="../../${l.file}"></script>`),
    `<script src="../bundle.js"></script>`,
  ].join("\n");
  // Like the design-system frame, the shared styles load before the preview's own <style>.
  let body = rest.join("\n").replace(/<head[^>]*>/i, (m) => m + "\n" + head);
  body = body.replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => {
    const hit = byBlob.get(id);
    if (!hit) throw new Error(`${name}: unknown asset ${m}`);
    return "../../" + fromDs(hit.file);
  });
  writeFileSync(path.join(OUT, "components", name, "view.html"), body);
  cards.push({
    name, group: attr("group") ?? null, height: Number(attr("height") ?? 120), subtitle: attr("subtitle") ?? "",
    live: /window\.Rvlt/.test(html), readme: name !== "Cover",
  });
}
writeFileSync(path.join(OUT, "cards.json"), JSON.stringify(cards, null, 2));

console.log(`design-system site → ${OUT}: ${cards.length} cards, ${byBlob.size} assets, tokens.css ${(css.length / 1024).toFixed(1)} KB`);
