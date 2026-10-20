#!/usr/bin/env node
// Re-splices Part 2 of design-system/components/bundle.css (the static renditions: Notice,
// SyncStatus, CueTag, Sticker, Albert) from this repo's static.css, leaving the generated Part 1
// untouched. Part 2 is a local contract, so it can change without the Flow and Binder checkouts.
//
//   node scripts/design-system/bundle/splice-static.mjs [--check]
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PART2_MARKER, splitBundleCss, writeOutputs } from "./write-policy.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const REL = "design-system/components/bundle.css";
const css = readFileSync(path.join(REPO, REL), "utf8");
const local = readFileSync(path.join(HERE, "static.css"), "utf8");
const { part1, part2 } = splitBundleCss(css);
if (part2 === local) {
  console.log("bundle.css Part 2 matches static.css");
  process.exit(0);
}
if (process.argv.includes("--check")) {
  console.error("bundle.css Part 2 differs from static.css; run node scripts/design-system/bundle/splice-static.mjs");
  process.exit(1);
}
writeOutputs(REPO, { [REL]: `${part1}${PART2_MARKER}\n${local}` }, { write: true });
console.log("bundle.css Part 2 re-spliced from static.css");
