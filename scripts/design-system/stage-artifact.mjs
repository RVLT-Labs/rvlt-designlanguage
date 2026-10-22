#!/usr/bin/env node
// Stages design-system/ as the claude.ai design-system artifact's project/ folder, ready to publish:
//
//   node scripts/design-system/bundle/build-registry.mjs      (the local Flow gallery, once)
//   node scripts/design-system/stage-artifact.mjs [outDir]     → <outDir>/project/…
//
// The artifact frame preloads one bundle.js and one bundle.css, so the Flow registry overlay the
// Pages site adds per card (build-site.mjs) is folded in here: project/components/bundle.js is the
// pinned Flow/Binder bundle followed by registry-bundle.js, and bundle.css likewise. Everything
// else is copied as is. Pictures under assets/ are asset-store uploads named by design-system.json,
// not files, so only their READMEs and licences are staged. No dependencies.
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const SRC = path.join(REPO, "design-system");
const OUT = path.join(path.resolve(REPO, process.argv[2] ?? "_artifact"), "project");
const gallery = path.resolve(REPO, process.env.RVLT_GALLERY_DIR ?? "packages/flow-theme/dist/gallery");

const UPLOADS = /\.(svg|png|jpe?g|gif|webp|mp4|webm|pdf)$/i;
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(SRC, OUT, {
  recursive: true,
  filter: (src) => !(src.startsWith(path.join(SRC, "assets") + path.sep) && UPLOADS.test(src)),
});

const read = (file) => readFileSync(file, "utf8");
const join = (base, overlay) => read(base).replace(/\n*$/, "\n") + read(overlay);
for (const file of ["registry-bundle.js", "registry-bundle.css"]) {
  if (!existsSync(path.join(gallery, file))) throw new Error("Build the local gallery first: node scripts/design-system/bundle/build-registry.mjs");
}
const js = join(path.join(SRC, "components/bundle.js"), path.join(gallery, "registry-bundle.js"));
const css = join(path.join(SRC, "components/bundle.css"), path.join(gallery, "registry-bundle.css"));
// The artifact inlines these into <script>/<style>; either sequence would end the element early.
if (/<\/script|<!--/i.test(js)) throw new Error("bundle.js contains </script or <!--");
if (/<\/style/i.test(css)) throw new Error("bundle.css contains </style");
writeFileSync(path.join(OUT, "components/bundle.js"), js);
writeFileSync(path.join(OUT, "components/bundle.css"), css);

console.log(`artifact staged → ${OUT}: bundle.js ${(js.length / 1024).toFixed(0)} KB, bundle.css ${(css.length / 1024).toFixed(0)} KB`);
