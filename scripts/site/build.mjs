#!/usr/bin/env node
// Assembles the GitHub Pages site (served at /rvlt-designlanguage/) from the repository:
//
//   node scripts/site/build.mjs <outDir> [--preview-v2 <apps/preview-v2/out>] [--registry <packages/flow-theme/dist>]
//
//   /                         index.html, the RVLT brand reference (generated blocks checked first)
//   /authority.json, /tokens/ the authority map and the canonical tokens + contrast contract
//   /examples/                reference compositions, static catalogue, Flow marketing mockups
//   /assets/                  sticker and Albert packs
//   /design-system/           the design-system gallery (scripts/design-system/build-site.mjs)
//   /preview-v2/              the registry showcase, when --preview-v2 is given
//   /r/, /registry.json       the shadcn registry, when --registry is given
//   /light.html, /preview.html  compatibility redirects to the moved pages
//
// No dependencies. Writes only inside <outDir>.
import { assertSafeOutput } from "./output-path.mjs";
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const outArg = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!outArg) throw new Error("usage: build.mjs <outDir> [--preview-v2 dir] [--registry dir]");
const OUT = path.resolve(REPO, outArg);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? path.resolve(REPO, args[i + 1]) : null;
};
const PREVIEW = opt("--preview-v2");
const REGISTRY = opt("--registry");

assertSafeOutput(OUT, { repo: REPO, inputs: [PREVIEW, REGISTRY] });

// Pages that moved; the old URLs keep working.
const REDIRECTS = {
  "light.html": "examples/flow-marketing/light.html",
  "preview.html": "examples/static-catalogue/",
};

const run = (script, ...a) => new Promise((resolve,reject) => {
  const child=spawn(process.execPath,[path.join(REPO,script),...a],{cwd:REPO,stdio:"inherit"});
  child.on("error",reject);child.on("exit",code=>code===0?resolve():reject(new Error(`${script} exited ${code}`)));
});
const copy = (from, to) => cpSync(path.join(REPO, from), path.join(OUT, to ?? from), { recursive: true });

// 0. the landing's generated blocks must match tokens.json before anything is published
await run("scripts/site/landing.mjs", "--check");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// 1. root, machine-readable contracts, examples and artwork
copy("index.html");
copy("authority.json");
mkdirSync(path.join(OUT, "tokens"), { recursive: true });
copy("packages/flow-theme/tokens.json", "tokens/tokens.json");
copy("packages/flow-theme/contrast.json", "tokens/contrast.json");
copy("packages/flow-theme/dist/globals.css", "tokens/globals.css");
if (existsSync(path.join(REPO, "packages/flow-theme/dist/fonts.css"))) {
 copy("packages/flow-theme/dist/fonts.css", "tokens/fonts.css");
 copy("packages/flow-theme/dist/fonts", "tokens/fonts");
}
copy("examples");
copy("assets");
writeFileSync(path.join(OUT, ".nojekyll"), "");

// 2. the design-system gallery
await run("scripts/design-system/build-site.mjs", OUT);

// 3. optional build products
if (PREVIEW) {
  if (!existsSync(path.join(PREVIEW, "index.html"))) throw new Error(`--preview-v2 ${PREVIEW} has no index.html (run next build first)`);
  cpSync(PREVIEW, path.join(OUT, "preview-v2"), { recursive: true });
}
if (REGISTRY) {
  cpSync(path.join(REGISTRY, "r"), path.join(OUT, "r"), { recursive: true });
  cpSync(path.join(REGISTRY, "registry.json"), path.join(OUT, "registry.json"));
}

// 4. compatibility redirects for moved pages
const redirect = (to, title) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title} has moved</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${to}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
<style>body{margin:0;padding:40px 24px;background:#141210;color:#F5EFE2;font:16px/1.5 "Hanken Grotesk",system-ui,sans-serif}a{color:#5B8DEF}</style>
</head>
<body>
<main><p>${title} has moved to <a href="${to}">${to}</a>.</p></main>
</body>
</html>
`;
for (const [from, to] of Object.entries(REDIRECTS)) {
  if (existsSync(path.join(OUT, from))) throw new Error(`${from} exists in the site; refusing to overwrite it with a redirect`);
  writeFileSync(path.join(OUT, from), redirect(to, from));
}

// 5. the raw design-system previews reference the artifact's asset store (/_blob/…); the
//    published copy points them at the wrapped view.html, which resolves every asset.
const comps = path.join(OUT, "design-system/components");
for (const name of readdirSync(comps)) {
  const p = path.join(comps, name, "preview.html");
  if (statSync(path.join(comps, name)).isDirectory() && existsSync(p) && existsSync(path.join(comps, name, "view.html"))) {
    writeFileSync(p, redirect("view.html", `${name} preview`));
  }
}

const count = (dir) => readdirSync(dir).reduce((n, f) => n + (statSync(path.join(dir, f)).isDirectory() ? count(path.join(dir, f)) : 1), 0);
console.log(`site → ${path.relative(REPO, OUT) || OUT}: ${count(OUT)} files${PREVIEW ? ", preview-v2" : ""}${REGISTRY ? ", registry" : ""}; redirects: ${Object.keys(REDIRECTS).join(", ")}`);
