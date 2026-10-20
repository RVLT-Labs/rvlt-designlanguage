// Site structure guard: the Pages root is the RVLT brand reference, the marketing mockups live in
// examples/flow-marketing, old URLs redirect, every internal link and asset in the assembled site
// resolves under the /rvlt-designlanguage/ base path, and the workflow assembles it the same way.
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const execNode = (file, args=[], options={}) => new Promise((resolve,reject)=>{
 const child=spawn(file,args,{...options,stdio:"inherit"});child.on("error",reject);
 child.on("exit",code=>code===0?resolve():reject(new Error(`child exited ${code}`)));
});
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (p) => readFileSync(path.join(REPO, p), "utf8");
let OUT;
let buildError = null;

before(async () => {
  const work = process.env.RVLT_WORK_DIR ?? os.tmpdir(); // set RVLT_WORK_DIR to keep scratch builds out of /tmp
  mkdirSync(work, { recursive: true });
  const dir = mkdtempSync(path.join(work, "rvlt-site-"));
  try {
    await execNode(process.execPath, [path.join(REPO, "scripts/site/build.mjs"), dir], { cwd: REPO, stdio: "pipe" });
    OUT = dir;
  } catch (e) {
    buildError = String(e.stderr || e.message).split("\n").find((l) => /Error/.test(l)) ?? e.message;
  }
});
const site = () => {
  assert.ok(OUT, `site build failed: ${buildError}`);
  return OUT;
};

test("the marketing mockups and the static catalogue moved out of the root", () => {
  for (const f of ["examples/flow-marketing/index.html", "examples/flow-marketing/light.html", "examples/static-catalogue/index.html"]) {
    assert.ok(existsSync(path.join(REPO, f)), `${f} is missing`);
  }
  for (const f of ["light.html", "preview.html"]) assert.ok(!existsSync(path.join(REPO, f)), `${f} should no longer sit at the root`);
});

test("old URLs keep working through compatibility redirects", () => {
  const cases = { "light.html": "examples/flow-marketing/light.html", "preview.html": "examples/static-catalogue/" };
  for (const [from, to] of Object.entries(cases)) {
    const html = readFileSync(path.join(site(), from), "utf8");
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=${to.replace(/[./]/g, "\\$&")}"`), `${from} does not redirect to ${to}`);
    assert.match(html, new RegExp(`<a href="${to.replace(/[./]/g, "\\$&")}">`), `${from} has no visible fallback link`);
  }
});

test("the Pages root is the RVLT-wide brand reference", () => {
  const html = readFileSync(path.join(site(), "index.html"), "utf8");
  for (const id of ["authority", "foundations", "tokens", "typography", "identity", "components", "product-layers", "using"]) {
    assert.match(html, new RegExp(`<section[^>]*id="${id}"`), `landing needs a #${id} section`);
  }
  for (const href of ["examples/flow-marketing/", "design-system/", "examples/flows/", "examples/static-catalogue/"]) {
    assert.ok(html.includes(`href="${href}`), `landing does not link ${href}`);
  }
  assert.match(html, /DESIGN\.md/);
  assert.match(html, /<main[\s>]/);
  assert.match(html, /class="skip"/);
});

test("the landing's generated token tables match tokens.json", async () => {
  await execNode(process.execPath, [path.join(REPO, "scripts/site/landing.mjs"), "--check"], { cwd: REPO, stdio: "pipe" });
});

test("every internal link, image, script, stylesheet and font in the site resolves", async () => {
  const out = site();
  const { checkSite } = await import(pathToFileURL(path.join(REPO, "scripts/site/links.mjs")));
  const { broken, checked } = checkSite(out, { base: "/rvlt-designlanguage/", optionalMounts: ["preview-v2/", "r/", "registry.json"] });
  assert.ok(checked > 200, `only ${checked} references checked`);
  assert.deepEqual(broken, []);
});

test("the Pages workflow assembles the site with the same script", () => {
  const yml = read(".github/workflows/pages.yml");
  assert.match(yml, /node scripts\/site\/build\.mjs _site/);
  assert.doesNotMatch(yml, /cp index\.html light\.html preview\.html/);
});
