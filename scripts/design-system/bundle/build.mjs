#!/usr/bin/env node
// Rebuilds design-system/components/bundle.js and bundle.css from the real component source in
// TwoToned/gearflow (the RVLT registry primitives as Flow ships them) and RVLT-Labs/binder.
//
//   GEARFLOW_DIR=../gearflow BINDER_DIR=../binder node scripts/design-system/bundle/build.mjs
//
// Both checkouts need their dependencies installed (pnpm install). esbuild, PostCSS and Tailwind
// are borrowed from gearflow's node_modules, so this repo stays dependency-free.
import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const OUT = path.join(REPO, "design-system/components");
const GEARFLOW = path.resolve(process.env.GEARFLOW_DIR ?? path.join(REPO, "../gearflow"));
const BINDER = path.resolve(process.env.BINDER_DIR ?? path.join(REPO, "../binder"));
const G = path.join(GEARFLOW, "src");
const B = path.join(BINDER, "apps/web/src");
for (const dir of [G, B]) {
  if (!existsSync(dir)) throw new Error(`missing ${dir} (set GEARFLOW_DIR / BINDER_DIR)`);
}

// Components the bundle exports as cards, in card order. Must match the live previews.
const COMPONENTS = [
  "Button", "Badge", "StatusIndicator", "Card", "Stat", "EmptyState", "Skeleton", "Input", "Checkbox",
  "Switch", "Tabs", "SectionHeader", "Table", "LifecycleStepper", "FeaturePatch", "PersonAvatar", "Kbd",
  "BinderButton", "Segmented", "BinderEmptyState",
];

// Source files Tailwind scans for class names (the components the entry imports, plus the previews).
const SOURCES = [
  ...["button", "badge", "status-indicator", "card", "stat", "flow-mascot", "empty-state", "skeleton",
    "input", "textarea", "label", "checkbox", "switch", "tabs", "table", "stepper", "feature-patch",
    "avatar", "kbd"].map((f) => path.join(G, `components/ui/${f}.tsx`)),
  path.join(G, "components/layout/page-layouts.tsx"),
  path.join(G, "components/layout/page-header.tsx"),
  path.join(G, "lib/status-colors.ts"),
  path.join(B, "components/ui/button.tsx"),
  path.join(B, "components/ui/segmented.tsx"),
  path.join(B, "components/EmptyState.tsx"),
  path.join(B, "components/icons.tsx"),
  path.join(OUT, "*/preview.html"),
];

// gearflow is a pnpm workspace: tools may sit only under node_modules/.pnpm.
const gRequire = createRequire(path.join(GEARFLOW, "package.json"));
function load(name) {
  try {
    return gRequire(name);
  } catch {
    const store = path.join(GEARFLOW, "node_modules/.pnpm");
    const prefix = name.replace("/", "+") + "@";
    const hit = readdirSync(store).filter((d) => d.startsWith(prefix)).sort().pop();
    if (!hit) throw new Error(`${name} not found under ${store}`);
    return gRequire(path.join(store, hit, "node_modules", name));
  }
}
const esbuild = load("esbuild");
const postcss = load("postcss");
const tailwind = load("@tailwindcss/postcss");

// ── bundle.js ────────────────────────────────────────────────────────────────
const shim = (f) => ({ path: path.join(HERE, "shims", f) });
const resolver = {
  name: "rvlt-resolve",
  setup(build) {
    build.onResolve({ filter: /^react$/ }, () => shim("react.js"));
    build.onResolve({ filter: /^react-dom(\/client)?$/ }, () => shim("react-dom.js"));
    build.onResolve({ filter: /^react\/jsx(-dev)?-runtime$/ }, () => shim("jsx-runtime.js"));
    build.onResolve({ filter: /^G\// }, (a) => build.resolve("./" + a.path.slice(2), { resolveDir: G, kind: a.kind }));
    build.onResolve({ filter: /^B\// }, (a) => build.resolve("./" + a.path.slice(2), { resolveDir: B, kind: a.kind }));
    build.onResolve({ filter: /^G-lucide$/ }, (a) => build.resolve("lucide-react", { resolveDir: G, kind: a.kind }));
    build.onResolve({ filter: /^@\// }, (a) => {
      const root = a.importer.startsWith(BINDER + path.sep) ? B : G;
      return build.resolve("./" + a.path.slice(2), { resolveDir: root, kind: a.kind });
    });
  },
};
const res = await esbuild.build({
  entryPoints: [path.join(HERE, "entry.tsx")], bundle: true, format: "iife", globalName: "Rvlt",
  platform: "browser", target: "es2019", minify: true, write: false, jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' }, plugins: [resolver], logLevel: "warning",
  legalComments: "none",
});
const header = "/* @ds-bundle: " + JSON.stringify({ format: 4, namespace: "Rvlt", components: COMPONENTS.map((name) => ({ name })) }) + " */\n";
// The design-system frame inlines bundle.js, so it must not contain these literals.
const js = header + res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--") + "\nwindow.Rvlt = Rvlt;\n";
writeFileSync(path.join(OUT, "bundle.js"), js);

// ── bundle.css ───────────────────────────────────────────────────────────────
// Flow's @theme inline mapping, base and component layers, plus Binder's extra colour/shadow
// utilities. No :root token values: tokens.css (from tokens.json) supplies every variable.
const globals = readFileSync(path.join(GEARFLOW, "src/app/globals.css"), "utf8");
const binderTokens = readFileSync(path.join(BINDER, "apps/web/src/styles/tokens.css"), "utf8");
const block = (css, start) => {
  const i = css.indexOf(start);
  if (i < 0) throw new Error(`block not found: ${start}`);
  let depth = 0;
  for (let j = css.indexOf("{", i); j < css.length; j++) {
    if (css[j] === "{") depth++;
    else if (css[j] === "}" && --depth === 0) return css.slice(i, j + 1);
  }
  throw new Error(`unclosed block: ${start}`);
};
const binderExtras = block(binderTokens, "@theme inline {").split("\n")
  .filter((l) => /--color-(muted-soft|scrim-strong|page|page-ink|stage|dept-[a-z]+):|--shadow-/.test(l));
const themeInline = block(globals, "@theme inline {").replace(/\}$/, "  /* Binder additions */\n" + binderExtras.join("\n") + "\n}");
const input = [
  '@import "tailwindcss" source(none);',
  '@import "tw-animate-css";',
  ...SOURCES.map((s) => `@source "${s}";`),
  "@custom-variant dark (&:is(.dark *));",
  themeInline,
  block(globals, "@keyframes accordion-down"),
  block(globals, "@keyframes accordion-up"),
  block(globals, "@media (prefers-reduced-motion: reduce) {"),
  block(globals, "@layer base {"),
  block(globals, "@layer components {"),
  block(globals, ".skeleton-shimmer {"),
  block(globals, "@keyframes shimmer {"),
].join("\n");
const compiled = await postcss([tailwind({ base: GEARFLOW, optimize: { minify: false } })])
  .process(input, { from: path.join(G, "app/rvlt-bundle.css") });
// Tailwind re-emits the fonts and radius it was given; tokens.css owns those.
const tw = compiled.css.replace(/^ {4}--(font-(sans|mono|display|hand|wordmark)|radius): .*\n/gm, "");
const css = `/* RVLT components — bundle.css
   Part 1: Tailwind v4 compiled from the real component source (TwoToned/gearflow src/components/ui,
   RVLT-Labs/binder apps/web/src/components) with Flow's @theme inline mapping plus Binder's additions.
   It maps utilities onto the tokens in tokens.css and re-declares none of them.
   Part 2: rf- rules for the cards that stay static renditions (Notice, SyncStatus, CueTag, Sticker,
   Albert). Every value reads a token. */
${tw}

/* ── Part 2: static renditions ───────────────────────── */
${readFileSync(path.join(HERE, "static.css"), "utf8")}`;
writeFileSync(path.join(OUT, "bundle.css"), css);

console.log(`bundle.js ${(js.length / 1024).toFixed(1)} KB · bundle.css ${(css.length / 1024).toFixed(1)} KB`);
