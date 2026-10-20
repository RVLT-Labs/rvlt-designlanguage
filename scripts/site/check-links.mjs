#!/usr/bin/env node
// CLI for links.mjs: node scripts/site/check-links.mjs <siteDir> [--optional preview-v2/,r/]
import path from "node:path";
import { checkSite } from "./links.mjs";

const [dir, flag, list] = process.argv.slice(2);
if (!dir) throw new Error("usage: check-links.mjs <siteDir> [--optional a/,b/]");
const optionalMounts = flag === "--optional" ? list.split(",") : [];
const { broken, checked } = checkSite(path.resolve(dir), { base: "/rvlt-designlanguage/", optionalMounts });
if (broken.length) {
  console.error(`${broken.length} broken of ${checked} internal references:\n- ` + broken.join("\n- "));
  process.exit(1);
}
console.log(`links ok: ${checked} internal references resolve`);
