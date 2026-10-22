#!/usr/bin/env node
// Rebuilds design-system/components/pulse-bundle.js and pulse-bundle.css from the real component
// source in qubered/a2-monitor (Pulse's Live app and @rvlt/pulse-ui). Same pattern as the Flow and
// Binder bundle (bundle/build.mjs) but a separate bundle, so regenerating Pulse never moves a Flow
// or Binder card.
//
//   PULSE_DIR=../a2-monitor node scripts/design-system/pulse/build.mjs [--write]
//
// PULSE_DIR needs its dependencies installed (npm ci); Vite is borrowed from it, so this repo stays
// dependency-free. The commit built is recorded in the bundle header. Without --write the result is
// staged in a temp folder; with --write it replaces the two files, and nothing else: the write
// policy refuses any path authority.json does not mark generated-external.
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeOutputs } from "../bundle/write-policy.mjs";

const WRITE = process.argv.includes("--write");
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../..");
const OUT = path.join(REPO, "design-system/components");
const PULSE = path.resolve(process.env.PULSE_DIR ?? path.join(REPO, "../a2-monitor"));
const LIVE = path.join(PULSE, "apps/live/src");
const UI = path.join(PULSE, "packages/ui");
for (const dir of [LIVE, UI]) if (!existsSync(dir)) throw new Error(`missing ${dir} (set PULSE_DIR)`);

// Cards the bundle serves, in card order. Each needs components/<name>/preview.html mounting RvltPulse.
const CARDS = ["PulseLockup", "PulseChannelCard", "PulseRunOfShow"];

const git = (...args) => execFileSync("git", ["-C", PULSE, ...args], { encoding: "utf8" }).trim();
const commit = git("rev-parse", "HEAD");
if (git("status", "--porcelain", "--", "apps/live", "packages/ui")) {
  throw new Error("PULSE_DIR has uncommitted changes under apps/live or packages/ui; the bundle must come from a commit");
}

const req = createRequire(path.join(PULSE, "package.json"));
const { build } = await import(pathToFileURL(req.resolve("vite")).href);
const shim = (f) => path.join(HERE, "../bundle/shims", f);
const out = await build({
  configFile: false,
  root: PULSE,
  logLevel: "warn",
  define: { "process.env.NODE_ENV": '"production"' },
  resolve: {
    alias: [
      { find: /^react$/, replacement: shim("react.js") },
      { find: /^react-dom(\/client)?$/, replacement: shim("react-dom.js") },
      { find: /^react\/jsx(-dev)?-runtime$/, replacement: shim("jsx-runtime.js") },
      { find: /^P\//, replacement: LIVE + "/" },
      { find: /^U\//, replacement: UI + "/" },
    ],
  },
  build: {
    write: false,
    minify: true,
    target: "es2019",
    lib: { entry: path.join(HERE, "entry.tsx"), name: "RvltPulse", formats: ["iife"], fileName: () => "pulse-bundle.js" },
  },
});
const chunk = (Array.isArray(out) ? out[0] : out).output.find((o) => o.type === "chunk");
const header = "/* @pulse-bundle: " + JSON.stringify({ format: 1, namespace: "RvltPulse", source: "qubered/a2-monitor", commit, components: CARDS.map((name) => ({ name })) }) + " */\n";
// The design-system frame inlines bundle scripts, so they must not contain these literals.
const js = header + chunk.code.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--") + "\nwindow.RvltPulse = RvltPulse;\n";

// Pulse's own stylesheets, as the apps load them. Pulse is dark only, so these cards stay dark in
// either gallery theme.
const read = (p) => readFileSync(p, "utf8");
const css = `/* Pulse components — pulse-bundle.css
   Generated from qubered/a2-monitor @ ${commit}: packages/ui tokens, brand and visualization CSS,
   then apps/live/src/styles.css, unchanged. Regenerate with scripts/design-system/pulse/build.mjs. */
${["tokens.css", "brand/brand.css", "visualization/visualization.css"].map((f) => read(path.join(UI, f))).join("\n")}
${read(path.join(LIVE, "styles.css"))}`;

const rel = (f) => path.relative(REPO, path.join(OUT, f)).split(path.sep).join("/");
const stageDir = WRITE ? undefined : mkdtempSync(path.join(process.env.RVLT_WORK_DIR ?? os.tmpdir(), "rvlt-pulse-"));
const written = writeOutputs(REPO, { [rel("pulse-bundle.js")]: js, [rel("pulse-bundle.css")]: css }, { write: WRITE, stageDir });
for (const w of written) console.log(`${w.changed ? "changed  " : "unchanged"} ${w.path} (${(w.bytes / 1024).toFixed(1)} KB) → ${w.dest}`);
console.log(`built from qubered/a2-monitor @ ${commit.slice(0, 7)}`);
if (!WRITE) console.log("staged only; re-run with --write to replace the repo files");
