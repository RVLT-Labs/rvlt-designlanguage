// Token contrast guard. Every text, pill, on-fill, action and control-boundary pairing that the
// contract (packages/flow-theme/contrast.json) allows must meet WCAG 2.x AA on every surface it
// allows, in both themes, computed from the canonical tokens (packages/flow-theme/tokens.json).
// Soft fills are composited over the real surface. No exceptions are accepted.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrast } from "../../scripts/lib/contrast.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const tokens = JSON.parse(readFileSync(path.join(REPO, "packages/flow-theme/tokens.json"), "utf8"));
const CONTRACT = path.join(REPO, "packages/flow-theme/contrast.json");
const THEMES = ["dark", "light"];
const SURFACES = ["paper", "paper-2", "card", "elev"];

// resolve a token or alias name to a concrete colour for one theme
function resolve(theme, name) {
  const g = tokens._generator ?? {};
  let v = tokens.themes[theme][name] ?? g.aliasesByTheme?.[theme]?.[name] ?? g.aliases?.[name];
  if (v === undefined) throw new Error(`token ${name} is not defined for ${theme}`);
  for (let i = 0; i < 8 && /var\(--/.test(v); i++) {
    v = v.replace(/var\(--([a-z0-9-]+)\)/g, (_, n) => resolve(theme, n));
  }
  return v;
}
const surfacesFor = (entry, theme) =>
  entry.surfaces === "all" || entry.surfaces === undefined ? SURFACES
    : Array.isArray(entry.surfaces) ? entry.surfaces : entry.surfaces[theme] ?? [];
const failures = [];
const check = (label, ratio, min) => {
  if (!(ratio >= min)) failures.push(`${label}: ${ratio.toFixed(2)}:1 < ${min}:1`);
};

test("the shadcn primary action keeps white labels at 4.5:1 in both themes", () => {
  const bad = [];
  for (const theme of THEMES) {
    const fg = resolve(theme, "primary-foreground");
    const bg = resolve(theme, "primary");
    const r = contrast(fg, bg);
    if (r < 4.5) bad.push(`${theme}: primary-foreground ${fg} on primary ${bg} = ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(bad, []);
});

test("the core brand red stays #E0363D / #C12229 (locked) while actions use a separate fill", () => {
  assert.equal(tokens.themes.dark.red.toUpperCase(), "#E0363D");
  assert.equal(tokens.themes.light.red.toUpperCase(), "#C12229");
  for (const theme of THEMES) assert.ok(tokens.themes[theme]["action-red"], `${theme} needs an action-red token`);
  assert.equal(tokens._generator.aliases.primary, "var(--action-red)");
});

test("form control boundaries (--input) reach 3:1 on every surface", () => {
  const bad = [];
  for (const theme of THEMES) {
    const line = resolve(theme, "input");
    for (const s of SURFACES) {
      const r = contrast(line, resolve(theme, s));
      if (r < 3) bad.push(`${theme}: --input ${line} on ${s} = ${r.toFixed(2)}:1`);
    }
  }
  assert.deepEqual(bad, []);
});

test("a published contrast contract exists and accepts no exceptions", () => {
  assert.ok(existsSync(CONTRACT), "packages/flow-theme/contrast.json is missing");
  const c = JSON.parse(readFileSync(CONTRACT, "utf8"));
  assert.deepEqual(c.exceptions, [], "brand exceptions are not accepted");
  assert.ok(c.nonTextOnly.includes("faint"), "faint must be declared non-text only");
  for (const entry of c.text) assert.notEqual(entry.token, "faint", "faint cannot be a text role");
});

test("every allowed pairing in the contract meets its threshold in both themes", () => {
  const c = JSON.parse(readFileSync(CONTRACT, "utf8"));
  failures.length = 0;
  for (const theme of THEMES) {
    for (const entry of c.text) {
      for (const tok of [entry.token, ...(entry.tokens ?? [])].filter(Boolean)) {
        for (const s of surfacesFor(entry, theme)) {
          check(`${theme} text ${tok} on ${s}`, contrast(resolve(theme, tok), resolve(theme, s)), entry.min ?? 4.5);
        }
      }
    }
    for (const p of c.pills) {
      for (const s of SURFACES) {
        check(`${theme} pill ${p.fg} on ${p.bg} over ${s}`, contrast(resolve(theme, p.fg), resolve(theme, p.bg), resolve(theme, s)), 4.5);
      }
    }
    for (const [hue, ink] of Object.entries(c.onFill[theme])) {
      check(`${theme} on-fill ${ink} on ${hue}`, contrast(ink.startsWith("#") ? ink : resolve(theme, ink), resolve(theme, hue)), 4.5);
    }
    for (const a of c.actions) {
      check(`${theme} action ${a.fg} on ${a.bg}`, contrast(resolve(theme, a.fg), resolve(theme, a.bg)), 4.5);
    }
    for (const n of c.nonText) {
      for (const s of surfacesFor(n, theme)) {
        check(`${theme} non-text ${n.token} on ${s}`, contrast(resolve(theme, n.token), resolve(theme, s)), 3);
      }
    }
    for (const m of c.moduleIcons) {
      const icon = m.icon?.[theme] ?? m.hue;
      for (const s of SURFACES) {
        check(`${theme} module icon ${icon} on ${m.hue}-soft over ${s}`, contrast(resolve(theme, icon), resolve(theme, `${m.hue}-soft`), resolve(theme, s)), 3);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test("Binder department hues are marks (3:1 on the page); department text is page ink (4.5:1)", () => {
  const ds = JSON.parse(readFileSync(path.join(REPO, "design-system/tokens.json"), "utf8"));
  const val = (n) => ds.color.tokens.find((t) => t.name === n).value;
  const c = JSON.parse(readFileSync(CONTRACT, "utf8"));
  const bad = [];
  for (const d of c.binder.marks) {
    const r = contrast(val(d), val("page"));
    if (r < 3) bad.push(`${d} on page ${r.toFixed(2)}`);
  }
  assert.equal(c.binder.text, "page-ink");
  const r = contrast(val("page-ink"), val("page"));
  assert.ok(r >= 4.5, `page-ink on page ${r}`);
  assert.deepEqual(bad, []);
});
