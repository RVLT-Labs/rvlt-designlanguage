// @rvlt/flow-theme ships the brand font faces (F8): dist/fonts.css is generated from the
// design-system font list, exported from the package, and its files come from design-system/fonts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execNode = (file, args=[], options={}) => new Promise((resolve,reject)=>{
 const child=spawn(file,args,{...options,stdio:"inherit"});child.on("error",reject);
 child.on("exit",code=>code===0?resolve():reject(new Error(`child exited ${code}`)));
});
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PKG = path.join(REPO, "packages/flow-theme");
const read = (p) => readFileSync(path.join(REPO, p), "utf8");

test("the package exports a generated fonts.css", () => {
  const pkg = JSON.parse(read("packages/flow-theme/package.json"));
  assert.equal(pkg.exports["./fonts.css"], "./dist/fonts.css");
  assert.ok(existsSync(path.join(PKG, "dist/fonts.css")), "dist/fonts.css is missing");
});

test("fonts.css declares every face in design-system/tokens.json from ./fonts/", () => {
  const css = read("packages/flow-theme/dist/fonts.css");
  const ds = JSON.parse(read("design-system/tokens.json"));
  for (const f of ds.type.fonts) {
    const file = path.basename(f.file);
    assert.match(css, new RegExp(`font-family:\\s*"${f.family}"[^}]*url\\("\\./fonts/${file.replace(".", "\\.")}"\\)[^}]*font-weight:\\s*${f.weight}`), `${f.family} ${f.weight} missing`);
  }
  assert.doesNotMatch(css, /googleapis|typekit|Caveat|JetBrains/);
});

test("build-css copies the woff2 files and their licences next to fonts.css, and --check passes", async () => {
  await execNode(process.execPath, [path.join(PKG, "scripts/build-css.mjs")], { cwd: PKG, stdio: "pipe" });
  for (const f of ["Archivo-Variable.woff2", "HankenGrotesk-Variable.woff2", "GeistMono-Variable.woff2", "Kalam-Regular.woff2", "Kalam-Bold.woff2", "Baloo2-Variable.woff2", "licenses/Archivo-OFL.txt"]) {
    assert.ok(existsSync(path.join(PKG, "dist/fonts", f)), `dist/fonts/${f} missing`);
  }
  await execNode(process.execPath, [path.join(PKG, "scripts/build-css.mjs"), "--check"], { cwd: PKG, stdio: "pipe" });
});

test("preview-v2 loads the package font faces and its README install steps mention them", () => {
  assert.match(read("apps/preview-v2/src/app/globals.css"), /@import "@rvlt\/flow-theme\/fonts\.css";/);
  assert.match(read("packages/flow-theme/README.md"), /@import "@rvlt\/flow-theme\/fonts\.css";/);
});
