/**
 * Resolves registry.json into individual /r/<name>.json files with file contents
 * inlined — the format shadcn CLI expects for custom registries.
 *
 * Outputs:
 *   dist/r/<name>.json   — one per item, registryDependencies → full URLs
 *   dist/registry.json   — full resolved registry (for tooling / --registry flag)
 *
 * Run AFTER build-css.mjs (the theme item needs dist/globals.css).
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const PKG = join(__dir, "..");
const OUT = join(PKG, "dist", "r");
const BASE = "https://rvlt-labs.github.io/rvlt-designlanguage";

mkdirSync(OUT, { recursive: true });

const registry = JSON.parse(readFileSync(join(PKG, "registry.json"), "utf8"));
const ownNames = new Set(registry.items.map((i) => i.name));

function resolveFile(f) {
  const content = readFileSync(join(PKG, f.path), "utf8");
  // Strip registry/rvlt/ prefix to get the install-relative path
  const path = f.target ?? f.path.replace(/^registry\/rvlt\//, "");
  const out = { path, type: f.type, content };
  if (f.target) out.target = f.target;
  return out;
}

function resolveRegistryDeps(deps) {
  if (!deps?.length) return undefined;
  // Own registry items become full URLs so the CLI can fetch them without
  // needing the consumer to configure a registry in components.json.
  return deps.map((dep) =>
    ownNames.has(dep) ? `${BASE}/r/${dep}.json` : dep
  );
}

for (const item of registry.items) {
  const out = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
  };
  if (item.dependencies?.length) out.dependencies = item.dependencies;
  if (item.devDependencies?.length) out.devDependencies = item.devDependencies;
  const deps = resolveRegistryDeps(item.registryDependencies);
  if (deps) out.registryDependencies = deps;
  out.files = item.files.map(resolveFile);

  writeFileSync(join(OUT, `${item.name}.json`), JSON.stringify(out, null, 2) + "\n");
  process.stdout.write(`  ✓  r/${item.name}.json\n`);
}

// Full resolved registry for --registry flag / future tooling
const resolvedRegistry = {
  ...registry,
  items: registry.items.map((item) => ({
    ...item,
    ...(item.registryDependencies
      ? { registryDependencies: resolveRegistryDeps(item.registryDependencies) }
      : {}),
    files: item.files.map(resolveFile),
  })),
};
writeFileSync(
  join(PKG, "dist", "registry.json"),
  JSON.stringify(resolvedRegistry, null, 2) + "\n"
);
process.stdout.write("  ✓  dist/registry.json\n");
