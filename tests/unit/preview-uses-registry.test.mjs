// preview-v2 is a verified example only if it renders the distributed registry source, not
// hand-kept copies that drift (audit: README/registry/preview disagreement; Codex priority 5).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const UI = path.join(REPO, "apps/preview-v2/src/components/ui");
const REG = path.join(REPO, "packages/flow-theme/registry/rvlt/ui");
const tsx = (dir) => readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort();

test("every preview-v2 ui module re-exports the registry file of the same name", () => {
  const bad = [];
  for (const f of tsx(UI)) {
    const src = readFileSync(path.join(UI, f), "utf8").trim();
    const want = `export * from "@registry/ui/${f.replace(/\.tsx$/, "")}";`;
    if (!src.split("\n").includes(want)) bad.push(f);
  }
  assert.deepEqual(bad, []);
});

test("every registry component is reachable from preview-v2, so its typecheck covers all of them", () => {
  assert.deepEqual(tsx(REG).filter((f) => !tsx(UI).includes(f)), []);
});

test("@registry/* is the registry source, synced (never hand-copied) before dev, typecheck and build", () => {
  const app = (p) => readFileSync(path.join(REPO, "apps/preview-v2", p), "utf8");
  const ts = JSON.parse(app("tsconfig.json"));
  assert.deepEqual(ts.compilerOptions.paths["@registry/*"], ["./src/registry/*"]);
  const pkg = JSON.parse(app("package.json"));
  for (const hook of ["predev", "prebuild", "pretypecheck"]) assert.equal(pkg.scripts[hook], "node scripts/sync-registry.mjs", `${hook} must sync the registry`);
  assert.match(app("scripts/sync-registry.mjs"), /packages\/flow-theme\/registry\/rvlt/);
  assert.match(app(".gitignore"), /^src\/registry\/$/m, "the synced copy must stay out of git");
  // Tailwind skips git-ignored paths during auto-detection, so the synced sources are named
  assert.match(app("src/app/globals.css"), /@source "\.\.\/registry";/);
  assert.match(app("src/app/globals.css"), /@source "\.\.\/examples";/);
});
