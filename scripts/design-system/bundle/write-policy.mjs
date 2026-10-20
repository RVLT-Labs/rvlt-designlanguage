// Write policy for the Flow/Binder live-bundle generator (build.mjs) and the Part 2 splice
// (splice-static.mjs). The generator imports code from other repositories, so it may only write
// files that authority.json marks `"sync": "generated-external"`; every other file in this repo is
// a local contract and is refused. See docs/AUTHORITY.md.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export const PART2_MARKER = "/* ── Part 2: static renditions ───────────────────────── */";

export function generatedExternal(repo) {
  const map = JSON.parse(readFileSync(path.join(repo, "authority.json"), "utf8"));
  return new Set(map.surfaces.filter((s) => s.sync === "generated-external").map((s) => s.path));
}

/** Throws unless `rel` (repo-relative) is a generated-external file in authority.json. */
export function assertWritable(repo, rel) {
  const norm = path.posix.normalize(rel.split(path.sep).join("/"));
  if (!generatedExternal(repo).has(norm)) {
    throw new Error(`${norm} is not generated-external in authority.json; the bundle generator may not write it`);
  }
  return norm;
}

/**
 * Write generated outputs. Without `write`, files go to `stageDir` (mirroring their repo paths)
 * so the result can be reviewed; with `write`, they replace the repo files, policy permitting.
 * @param {string} repo @param {Record<string,string>} outputs repo-relative path → contents
 */
export function writeOutputs(repo, outputs, { write = false, stageDir } = {}) {
  const done = [];
  for (const [rel, contents] of Object.entries(outputs)) {
    const target = assertWritable(repo, rel);
    const dest = write ? path.join(repo, target) : path.join(stageDir, target);
    mkdirSync(path.dirname(dest), { recursive: true });
    const before = (() => { try { return readFileSync(path.join(repo, target), "utf8"); } catch { return null; } })();
    writeFileSync(dest, contents);
    done.push({ path: target, dest, changed: before !== contents, bytes: contents.length });
  }
  return done;
}

/** Splits bundle.css into the generated Part 1 and the locally owned Part 2 (static.css). */
export function splitBundleCss(css) {
  const i = css.indexOf(PART2_MARKER);
  if (i < 0) throw new Error("bundle.css has no Part 2 marker");
  return { part1: css.slice(0, i), part2: css.slice(i + PART2_MARKER.length + 1) };
}
