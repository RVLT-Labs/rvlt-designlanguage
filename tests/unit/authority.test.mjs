// Authority guard: one map decides which source wins, every top-level surface is classified,
// and no document still crowns the marketing mockup or carries a stale version or exception.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(path.join(REPO, p), "utf8");
const LAYERS = ["rules", "product-contracts", "tokens", "implementation", "verified-examples", "marketing-expression"];

test("docs/AUTHORITY.md states one ordered authority map in which marketing never wins", () => {
  assert.ok(existsSync(path.join(REPO, "docs/AUTHORITY.md")), "docs/AUTHORITY.md is missing");
  const md = read("docs/AUTHORITY.md");
  const order = [
    /1\.\s+\*\*Normative RVLT rules\*\*/,
    /2\.\s+\*\*Product contracts\*\*/,
    /3\.\s+\*\*Canonical machine tokens\*\*/,
    /4\.\s+\*\*Implementation\*\*/,
    /5\.\s+\*\*Verified examples\*\*/,
    /6\.\s+\*\*Marketing expression\*\*/,
  ].map((re) => md.search(re));
  assert.ok(order.every((i) => i >= 0), `missing a layer: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "layers are out of order");
  assert.match(md, /marketing (mockups? )?never wins?/i);
});

test("authority.json classifies every top-level surface, and every path it names exists", () => {
  assert.ok(existsSync(path.join(REPO, "authority.json")), "authority.json is missing");
  const map = JSON.parse(read("authority.json"));
  assert.deepEqual(map.layers.map((l) => l.id), LAYERS);
  const covered = new Set();
  for (const s of map.surfaces) {
    assert.ok(LAYERS.includes(s.layer) || s.layer === "tooling", `${s.path}: unknown layer ${s.layer}`);
    assert.ok(s.owner, `${s.path}: no owner`);
    assert.ok(existsSync(path.join(REPO, s.path)), `${s.path} does not exist`);
    covered.add(s.path.split("/")[0]);
  }
  const top = readdirSync(REPO).filter((n) => !n.startsWith(".") && n !== "node_modules" && n !== "_site");
  const unclassified = top.filter((n) => !covered.has(n));
  assert.deepEqual(unclassified, [], "top-level entries missing from authority.json");
});

test("DESIGN.md defers to the authority map instead of crowning index.html", () => {
  const md = read("DESIGN.md");
  assert.doesNotMatch(md, /`index\.html`[^.]{0,40}\*\*canonical\*\*[\s\S]{0,40}it wins/i, "§0.1 still says index.html wins");
  assert.doesNotMatch(md, /index\.html`? — \*\*THE reference\*\*/, "§18 still calls index.html THE reference");
  assert.doesNotMatch(md, /^reference_impl: "index\.html/m, "front matter still names index.html the reference implementation");
  assert.doesNotMatch(md, /\*\*Canonical reference implementation:\*\* \[`index\.html`\]/);
  assert.match(md, /docs\/AUTHORITY\.md/);
});

test("versions agree: DESIGN.md front matter, Appendix A, tokens.json and the design-system README", () => {
  const md = read("DESIGN.md");
  const fm = md.match(/^version: "([\d.]+)"/m)[1];
  const blocks = [...md.matchAll(/```json\n([\s\S]*?)\n```/g)];
  const appendix = JSON.parse(blocks[blocks.length - 1][1]);
  const tokens = JSON.parse(read("packages/flow-theme/tokens.json"));
  assert.equal(appendix.version, fm);
  assert.equal(tokens.version, fm);
  assert.match(md, new RegExp(`\\*\\*${fm.replace(/\./g, "\\.")}\\*\\* \\(\\d{4}-\\d{2}-\\d{2}\\)`), "no changelog entry for the current version");
  assert.match(read("design-system/README.md"), new RegExp(`v${fm.replace(/\./g, "\\.")}`));
});

test("no document accepts a contrast exception or tells readers faint is fine for text", () => {
  const files = ["README.md", "DESIGN.md", "design-system/README.md", "design-system/tokens.json", "packages/flow-theme/README.md"];
  for (const f of files) {
    const s = read(f);
    assert.doesNotMatch(s, /(is an|pair is an) accepted brand exception/i, `${f} still accepts the 4.41:1 exception`);
    assert.doesNotMatch(s, /`faint` is still 3\.3:1/, `${f} still treats faint as a dark text colour`);
  }
});

test("the root README is the RVLT-wide entry point and keeps DESIGN.md discoverable", () => {
  const md = read("README.md");
  for (const heading of ["Foundations", "Tokens", "Typography", "Identity and assets", "Components", "Product layers", "Using and building", "Authority"]) {
    assert.match(md, new RegExp(`^## ${heading}`, "m"), `README needs a "${heading}" section`);
  }
  assert.match(md, /\]\(DESIGN\.md\)/);
  assert.match(md, /\]\(docs\/AUTHORITY\.md\)/);
  assert.match(md, /\]\(examples\/flow-marketing\/?\)/);
  assert.doesNotMatch(md, /Canonical homepage mockup/);
});
