// The Flow/Binder live-bundle generator imports code from other repositories. It may only write
// the files authority.json marks generated-external, only when asked to (--write), and the
// locally owned part of bundle.css (Part 2, from static.css) must survive a rebuild unchanged.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const POLICY = path.join(REPO, "scripts/design-system/bundle/write-policy.mjs");
const read = (p) => readFileSync(path.join(REPO, p), "utf8");

test("a write policy guards the generator", () => {
  assert.ok(existsSync(POLICY), "scripts/design-system/bundle/write-policy.mjs is missing");
});

test("the policy allows only generated-external targets", async () => {
  const { assertWritable } = await import(pathToFileURL(POLICY));
  assert.doesNotThrow(() => assertWritable(REPO, "design-system/components/bundle.js"));
  assert.doesNotThrow(() => assertWritable(REPO, "design-system/components/bundle.css"));
  for (const local of [
    "design-system/components/StatusIndicator/README.md",
    "design-system/components/Input/preview.html",
    "design-system/tokens.json",
    "design-system/README.md",
    "packages/flow-theme/registry/rvlt/ui/status-indicator.tsx",
    "DESIGN.md",
  ]) {
    assert.throws(() => assertWritable(REPO, local), /not generated-external/, `${local} must be refused`);
  }
});

test("build.mjs never writes directly and stages unless --write is given", () => {
  const src = read("scripts/design-system/bundle/build.mjs");
  assert.doesNotMatch(src, /\bwriteFileSync\(/, "build.mjs must write through the policy");
  assert.match(src, /--write/);
  assert.match(src, /write-policy\.mjs/);
});

test("bundle.css Part 2 is exactly the locally owned static.css", async () => {
  const { splitBundleCss } = await import(pathToFileURL(POLICY));
  const { part2 } = splitBundleCss(read("design-system/components/bundle.css"));
  assert.equal(part2, read("scripts/design-system/bundle/static.css"));
});

test("check.mjs enforces the Part 2 equality", () => {
  assert.match(read("scripts/design-system/check.mjs"), /static\.css/);
});
