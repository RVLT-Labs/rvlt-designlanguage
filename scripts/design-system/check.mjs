#!/usr/bin/env node
// Keeps design-system/ (the mirror of the claude.ai RVLT design system) honest:
//   1. its colours, shadows, radii and font stacks equal packages/flow-theme/tokens.json, the
//      canonical source, in both themes;
//   2. every font it lists is in design-system/fonts/;
//   3. every asset in design-system.json resolves to exactly one repo file of the same size;
//   4. every /_blob/<id> a preview references is one of those assets;
//   5. every component the bundle exports has a live preview, and every card has a README;
//   6. bundle.css Part 2 is exactly scripts/design-system/bundle/static.css (a local contract the
//      Flow/Binder generator must not overwrite).
// Exits non-zero on any failure. No dependencies: node scripts/design-system/check.mjs
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAssets } from "./assets.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DS = path.join(REPO, "design-system");
const read = (p) => readFileSync(path.join(REPO, p), "utf8");
const errors = [];
const fail = (msg) => errors.push(msg);

const ds = JSON.parse(read("design-system/tokens.json"));
const flow = JSON.parse(read("packages/flow-theme/tokens.json"));
const norm = (v) => String(v).toLowerCase().replace(/\s+/g, "").replace(/0(\.\d)/g, "$1");

// 1a. colours + shadows that Flow's theme also defines, per theme
const themes = ds.color.themes.map((t) => t.id);
const dsTokens = [...ds.color.tokens, ...ds.shadow.tokens];
let compared = 0;
for (const tok of dsTokens) {
  for (const theme of themes) {
    const raw = flow.themes[theme]?.[tok.name];
    if (raw === undefined) continue;
    // flow-theme writes some values as var(--token); the design system stores them resolved.
    let canonical = raw;
    for (let i = 0; i < 5 && /var\(--/.test(canonical); i++) {
      canonical = canonical.replace(/var\(--([a-z0-9-]+)\)/g, (m, n) => flow.themes[theme][n] ?? m);
    }
    const mirrored = typeof tok.value === "string" ? tok.value : tok.value[theme];
    compared++;
    if (norm(mirrored) !== norm(canonical)) {
      fail(`token ${tok.name} (${theme}): design-system ${mirrored} ≠ flow-theme ${canonical}`);
    }
  }
}
for (const theme of themes) {
  for (const name of Object.keys(flow.themes[theme] ?? {})) {
    if (!dsTokens.some((t) => t.name === name)) fail(`token ${name} is in flow-theme (${theme}) but not the design system`);
  }
}
// 1b. radii and font stacks
const radius = Object.fromEntries(ds.radius.tokens.map((t) => [t.name, t.value]));
for (const [dsName, flowName] of [["r-sm", "sm"], ["r", "md"], ["r-lg", "lg"], ["r-pill", "pill"], ["radius", "default"]]) {
  if (norm(radius[dsName]) !== norm(flow.radius[flowName])) {
    fail(`radius ${dsName} ${radius[dsName]} ≠ flow-theme radius.${flowName} ${flow.radius[flowName]}`);
  }
}
for (const [key, stack] of Object.entries(flow.fonts)) {
  if (norm(ds.type.families[key]) !== norm(stack)) fail(`font family ${key}: ${ds.type.families[key]} ≠ ${stack}`);
}

// 2. font files
for (const f of ds.type.fonts) {
  if (!existsSync(path.join(DS, f.file))) fail(`font file missing: design-system/${f.file}`);
}

// 3. assets
const index = JSON.parse(read("design-system/design-system.json"));
const { byBlob, missing } = resolveAssets(REPO, index);
for (const m of missing) fail(m);

// 4. blob references in previews
const cards = readdirSync(path.join(DS, "components")).filter((d) => statSync(path.join(DS, "components", d)).isDirectory() && d !== "lib");
for (const card of cards) {
  const html = readFileSync(path.join(DS, "components", card, "preview.html"), "utf8");
  for (const [, id] of html.matchAll(/\/_blob\/([0-9a-f]{32})/g)) {
    if (!byBlob.has(id)) fail(`${card}/preview.html references unknown asset /_blob/${id}`);
  }
}

// 5. bundle exports ↔ live previews ↔ READMEs
const bundle = read("design-system/components/bundle.js");
const exported = JSON.parse(bundle.match(/^\/\* @ds-bundle: (\{.*?\}) \*\//)[1]).components.map((c) => c.name);
for (const name of exported) {
  const p = path.join(DS, "components", name, "preview.html");
  if (!existsSync(p)) fail(`bundle exports ${name} but there is no components/${name}/preview.html`);
  else if (!/window\.Rvlt|R\./.test(readFileSync(p, "utf8"))) fail(`${name}/preview.html does not mount the bundle`);
}
// 5b. Pulse bundle (generated from qubered/a2-monitor): header ↔ live previews ↔ pinned commit
const pulseBundle = read("design-system/components/pulse-bundle.js");
const pulseHeader = JSON.parse(pulseBundle.match(/^\/\* @pulse-bundle: (\{.*?\}) \*\//)[1]);
if (!/^[0-9a-f]{40}$/.test(pulseHeader.commit)) fail("pulse-bundle.js header has no pinned qubered/a2-monitor commit");
if (!read("design-system/components/pulse-bundle.css").includes(pulseHeader.commit)) fail("pulse-bundle.css was not generated from the commit in pulse-bundle.js");
for (const { name } of pulseHeader.components) {
  const p = path.join(DS, "components", name, "preview.html");
  if (!existsSync(p)) fail(`pulse bundle serves ${name} but there is no components/${name}/preview.html`);
  else if (!/window\.RvltPulse/.test(readFileSync(p, "utf8"))) fail(`${name}/preview.html does not mount the Pulse bundle`);
}
for (const card of cards) {
  const marker = readFileSync(path.join(DS, "components", card, "preview.html"), "utf8").split("\n")[0];
  if (!marker.startsWith("<!-- @dsCard")) fail(`${card}/preview.html: line 1 is not a @dsCard marker`);
  if (card !== "Cover" && !existsSync(path.join(DS, "components", card, "README.md"))) fail(`${card} has no README.md`);
}

// 6. bundle.css Part 2 (static renditions) is the locally owned static.css, byte for byte
{
  const { splitBundleCss } = await import("./bundle/write-policy.mjs");
  const { part2 } = splitBundleCss(read("design-system/components/bundle.css"));
  if (part2 !== read("scripts/design-system/bundle/static.css")) {
    fail("bundle.css Part 2 differs from scripts/design-system/bundle/static.css (run bundle/splice-static.mjs)");
  }
}

if (errors.length) {
  console.error(`design-system check: ${errors.length} problem(s)\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log(`design-system check: ok — ${compared} token values match flow-theme, ${byBlob.size} assets resolve, ${cards.length} cards, ${exported.length + pulseHeader.components.length} live components (${pulseHeader.components.length} Pulse @ ${pulseHeader.commit.slice(0, 7)})`);
