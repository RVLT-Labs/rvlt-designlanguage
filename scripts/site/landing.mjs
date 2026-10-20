#!/usr/bin/env node
// Regenerates the token-driven blocks of the Pages root (index.html) from
// packages/flow-theme/tokens.json and contrast.json, so the published brand reference can never
// drift from the canonical tokens. Hand-written prose lives outside the markers.
//
//   node scripts/site/landing.mjs           # rewrite the generated blocks in place
//   node scripts/site/landing.mjs --check   # exit 1 if index.html is stale
//
// Blocks: <!-- generated:NAME --> … <!-- /generated:NAME --> (and /* generated:css */ in <style>).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrast } from "../lib/contrast.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const FILE = path.join(REPO, "index.html");
const tokens = JSON.parse(readFileSync(path.join(REPO, "packages/flow-theme/tokens.json"), "utf8"));
const contract = JSON.parse(readFileSync(path.join(REPO, "packages/flow-theme/contrast.json"), "utf8"));
const THEMES = ["dark", "light"];
const SURFACES = contract.surfaces;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function resolve(theme, name) {
  const g = tokens._generator;
  let v = tokens.themes[theme][name] ?? g.aliasesByTheme[theme]?.[name] ?? g.aliases[name];
  if (v === undefined) throw new Error(`unknown token ${name}`);
  for (let i = 0; i < 8 && /var\(--/.test(v); i++) v = v.replace(/var\(--([a-z0-9-]+)\)/g, (_, n) => resolve(theme, n));
  return v;
}
const ratio = (fg, bg, under) => contrast(fg, bg, under);
const fmt = (r) => r.toFixed(2);

// ── CSS custom properties for both themes (dark default, .light alternate) ────
function cssBlock() {
  const skip = (k) => k.startsWith("$");
  const decl = (obj) => Object.entries(obj).filter(([k]) => !skip(k)).map(([k, v]) => `--${k}:${v};`).join(" ");
  const g = tokens._generator;
  const aliases = Object.entries(g.aliases).filter(([k]) => !skip(k)).map(([k, v]) => `--${k}:${v};`).join(" ");
  return [
    `:root,.dark{${decl(tokens.themes.dark)} ${aliases} --border:${g.aliasesByTheme.dark.border};`,
    `  --font-display:${tokens.fonts.display}; --font-sans:${tokens.fonts.sans}; --font-hand:${tokens.fonts.hand}; --font-wordmark:${tokens.fonts.wordmark}; --font-mono:${tokens.fonts.mono};`,
    `  --r:${tokens.radius.md}; --r-lg:${tokens.radius.lg}; --r-sm:${tokens.radius.sm};}`,
    `.light{${decl(tokens.themes.light)} --border:${g.aliasesByTheme.light.border};}`,
  ].join("\n");
}

// ── token tables ─────────────────────────────────────────────────────────────
const GROUPS = [
  ["Surfaces (the luminance ladder)", ["paper", "paper-2", "card", "elev"]],
  ["Text", ["ink", "ink-2", "muted"]],
  ["Non-text only", ["faint", "line", "line-2"]],
  ["Red roles", ["red", "action-red", "red-text", "red-700", "red-soft"]],
  ["Controls and links", ["control-line", "link", "info"]],
  ["Status", ["ok", "warn", "t-out", "rep", "ok-soft", "warn-soft", "out-soft", "rep-soft"]],
  ["Categorical (modules, avatars, charts; never red)", ["blue", "amber", "green", "purple", "coral", "teal", "pink", "lime", "dark"]],
  ["Utility", ["scrim", "select"]],
];
const ROLE = {
  paper: "page", "paper-2": "alternate sections, rails", card: "cards, inputs", elev: "the one hovered, active or live surface",
  ink: "headings, body", "ink-2": "secondary text, cells", muted: "meta, captions, placeholders",
  faint: "dividers, disabled marks (never text)", line: "1px hairlines", "line-2": "2px card outline on Espresso",
  red: "core red: mark, rings, strokes (locked)", "action-red": "fills under white text", "red-text": "red words", "red-700": "button drop shadow", "red-soft": "now-ring glow, tint",
  "control-line": "control boundaries (--input)", link: "inline links", info: "info status",
  ok: "pass, ready", warn: "check, due", "t-out": "short, overdue, error", rep: "in repair, neutral",
  "ok-soft": "ok pill", "warn-soft": "warn pill", "out-soft": "error pill", "rep-soft": "neutral pill",
  blue: "Projects", amber: "Gear", green: "Availability", purple: "Crew", coral: "Maintenance", teal: "Compliance", pink: "avatars, charts", lime: "avatars, charts", dark: "ink on Espresso fills",
  scrim: "overlay backdrop", select: "selection wash",
};
function tokensBlock() {
  const rows = [];
  for (const [title, names] of GROUPS) {
    rows.push(`<h3 class="tgroup">${esc(title)}</h3>`);
    rows.push(`<div class="table-wrap" tabindex="0"><table class="tokens"><thead><tr><th scope="col">Token</th><th scope="col">Espresso</th><th scope="col">Paper</th><th scope="col">Role</th></tr></thead><tbody>`);
    for (const n of names) {
      const cell = (theme) => {
        const v = resolve(theme, n);
        return `<td><span class="sw" style="background:${esc(v)}" aria-hidden="true"></span><code>${esc(tokens.themes[theme][n] ?? v)}</code></td>`;
      };
      rows.push(`<tr><th scope="row"><code>--${n}</code></th>${cell("dark")}${cell("light")}<td>${esc(ROLE[n] ?? "")}</td></tr>`);
    }
    rows.push(`</tbody></table></div>`);
  }
  return rows.join("\n");
}

// ── contrast matrix: every text role on every surface, both themes, rendered as real pairs ──
function contrastBlock() {
  const out = [];
  for (const theme of THEMES) {
    out.push(`<div class="cm ${theme === "light" ? "light" : "dark"}" data-theme-sample="${theme}">`);
    out.push(`<h3 class="tgroup">${theme === "dark" ? "Espresso" : "Paper"}</h3>`);
    out.push(`<div class="table-wrap" tabindex="0"><table class="contrast"><thead><tr><th scope="col">Role</th>${SURFACES.map((s) => `<th scope="col"><code>${s}</code></th>`).join("")}</tr></thead><tbody>`);
    for (const entry of contract.text) {
      for (const tok of [entry.token, ...(entry.tokens ?? [])]) {
        const allowed = entry.surfaces === "all" ? SURFACES : entry.surfaces[theme];
        const cells = SURFACES.map((s) => {
          if (!allowed.includes(s)) return `<td class="na" style="background:var(--${s})"><span>not used</span></td>`;
          const r = ratio(resolve(theme, tok), resolve(theme, s));
          return `<td style="background:var(--${s})" data-pair="${tok}|${s}" data-ratio="${fmt(r)}"><span style="color:var(--${tok})">Aa ${fmt(r)}</span></td>`;
        }).join("");
        out.push(`<tr><th scope="row"><code>--${tok}</code></th>${cells}</tr>`);
      }
    }
    for (const p of contract.pills) {
      const cells = SURFACES.map((s) => {
        const r = ratio(resolve(theme, p.fg), resolve(theme, p.bg), resolve(theme, s));
        return `<td style="background:var(--${s})" data-pair="${p.fg}|${p.bg}|${s}" data-ratio="${fmt(r)}"><span class="pill" style="color:var(--${p.fg});background:var(--${p.bg})">${fmt(r)}</span></td>`;
      }).join("");
      out.push(`<tr><th scope="row"><code>--${p.fg}</code> on <code>--${p.bg}</code></th>${cells}</tr>`);
    }
    {
      const r = ratio(resolve(theme, "primary-foreground"), resolve(theme, "action-red"));
      out.push(`<tr><th scope="row">white on <code>--action-red</code></th><td colspan="${SURFACES.length}"><span class="act" data-pair="primary-foreground|action-red" data-ratio="${fmt(r)}">Book gear out ${fmt(r)}</span></td></tr>`);
    }
    {
      const cells = SURFACES.map((s) => {
        const r = ratio(resolve(theme, "control-line"), resolve(theme, s));
        return `<td style="background:var(--${s})" data-pair="control-line|${s}" data-ratio="${fmt(r)}"><span class="ctl">${fmt(r)}</span></td>`;
      }).join("");
      out.push(`<tr><th scope="row"><code>--input</code> boundary (3:1)</th>${cells}</tr>`);
    }
    out.push(`</tbody></table></div></div>`);
  }
  return out.join("\n");
}

// ── app type ramp ────────────────────────────────────────────────────────────
function rampBlock() {
  const rows = Object.entries(tokens.app_type_ramp_px).filter(([k]) => !k.startsWith("$"))
    .map(([k, px]) => `<tr><th scope="row"><code>text-${k}</code></th><td>${px}px</td><td><span style="font-size:${px}px">${k === "page-title" ? "Enmore Theatre weekend" : "Load-out at 06:30, dock 2"}</span></td></tr>`);
  return `<div class="table-wrap" tabindex="0"><table class="tokens"><thead><tr><th scope="col">Role</th><th scope="col">Size</th><th scope="col">Sample</th></tr></thead><tbody>\n${rows.join("\n")}\n</tbody></table></div>`;
}

const BLOCKS = {
  version: () => `v${esc(tokens.version)}`,
  tokens: tokensBlock,
  contrast: contrastBlock,
  ramp: rampBlock,
};

export function render(html) {
  let out = html;
  for (const [name, fn] of Object.entries({ css: cssBlock, ...BLOCKS })) {
    const open = name === "css" ? "/* generated:css */" : `<!-- generated:${name} -->`;
    const close = name === "css" ? "/* /generated:css */" : `<!-- /generated:${name} -->`;
    if (out.split(open).length !== 2 || out.split(close).length !== 2 || out.indexOf(close) < out.indexOf(open)) {
      throw new Error(`index.html requires exactly one ordered generated:${name} marker pair`);
    }
    const from = out.indexOf(open) + open.length;
    const to = out.indexOf(close);
    const gap = name === "version" ? "" : "\n";
    out = out.slice(0, from) + gap + fn() + gap + out.slice(to);
  }
  return out;
}

// ── examples/shared/tokens.css: the same variables + self-hosted faces for static example pages ──
const SHARED = path.join(REPO, "examples/shared/tokens.css");
function sharedCss() {
  const ds = JSON.parse(readFileSync(path.join(REPO, "design-system/tokens.json"), "utf8"));
  const faces = ds.type.fonts.map((f) =>
    `@font-face{font-family:"${f.family}";src:url("../../design-system/${f.file}") format("woff2");font-weight:${f.weight};font-style:${f.style};font-display:swap}`);
  return `/* GENERATED by scripts/site/landing.mjs from packages/flow-theme/tokens.json and
   design-system/tokens.json. Do not edit. Espresso on :root and .dark, Paper on .light. */\n${faces.join("\n")}\n${cssBlock()}\n`;
}

// Importing render is read-only; CLI generation is explicit.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
const current = readFileSync(FILE, "utf8");
const next = render(current);
const sharedNow = (() => { try { return readFileSync(SHARED, "utf8"); } catch { return null; } })();
const sharedNext = sharedCss();
if (process.argv.includes("--check")) {
  const stale = [next !== current && "index.html", sharedNow !== sharedNext && "examples/shared/tokens.css"].filter(Boolean);
  if (stale.length) {
    console.error(`${stale.join(" and ")} stale; run node scripts/site/landing.mjs`);
    process.exit(1);
  }
  console.log("index.html generated blocks and examples/shared/tokens.css match tokens.json and contrast.json");
} else {
  writeFileSync(FILE, next);
  mkdirSync(path.dirname(SHARED), { recursive: true });
  if (sharedNow !== sharedNext) writeFileSync(SHARED, sharedNext);
  console.log(next === current && sharedNow === sharedNext ? "already up to date" : "generated blocks and shared tokens rewritten");
}

}
