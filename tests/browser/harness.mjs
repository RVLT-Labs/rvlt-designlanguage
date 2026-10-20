// Browser test harness: serves the assembled Pages site under the real GitHub Pages base path,
// launches Chromium through Playwright and loads axe-core.
//
//   RVLT_SITE_DIR       assembled site (node scripts/site/build.mjs <dir> --preview-v2 … --registry …)
//   RVLT_PLAYWRIGHT_DIR optional folder whose node_modules hold playwright + axe-core (otherwise
//                       they resolve from tests/browser/node_modules, as in CI)
//   RVLT_EVIDENCE_DIR   optional: screenshots and JSON results are written here
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const BASE = "/rvlt-designlanguage/";
export const SITE = process.env.RVLT_SITE_DIR ? path.resolve(process.env.RVLT_SITE_DIR) : null;
export const EVIDENCE = process.env.RVLT_EVIDENCE_DIR ? path.resolve(process.env.RVLT_EVIDENCE_DIR) : null;
export const VIEWPORTS = {
  "320": { width: 320, height: 640 },
  "390": { width: 390, height: 844 },
  "768": { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

const req = createRequire(path.resolve(process.env.RVLT_PLAYWRIGHT_DIR ?? HERE, "package.json"));
export const { chromium } = req("playwright");
const AXE = readFileSync(req.resolve("axe-core/axe.min.js"), "utf8");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2",
  ".txt": "text/plain", ".md": "text/markdown; charset=utf-8", ".ico": "image/x-icon", ".map": "application/json",
};

/** Static server with GitHub Pages semantics: /rvlt-designlanguage/ prefix, dir → index.html. */
export async function serve() {
  if (!SITE || !existsSync(path.join(SITE, "index.html"))) throw new Error("RVLT_SITE_DIR must point at an assembled site");
  const server = createServer((rq, rs) => {
    const url = new URL(rq.url, "http://x");
    if (!url.pathname.startsWith(BASE)) { rs.writeHead(404).end("outside base path"); return; }
    let p = path.join(SITE, decodeURIComponent(url.pathname.slice(BASE.length)));
    if (!p.startsWith(SITE)) { rs.writeHead(403).end(); return; }
    if (existsSync(p) && statSync(p).isDirectory()) {
      if (!url.pathname.endsWith("/")) { rs.writeHead(301, { Location: url.pathname + "/" + url.search }).end(); return; }
      p = path.join(p, "index.html");
    }
    if (!existsSync(p)) { rs.writeHead(404, { "content-type": "text/plain" }).end("not found"); return; }
    rs.writeHead(200, { "content-type": TYPES[path.extname(p)] ?? "application/octet-stream" });
    rs.end(readFileSync(p));
  });
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return { origin, url: (rel = "") => origin + BASE + rel, close: () => new Promise((r) => server.close(r)) };
}

export async function launch() {
  return chromium.launch();
}

/** New page with viewport, theme preference and motion preference. */
export async function open(browser, url, { viewport = "desktop", reducedMotion = "no-preference", colorScheme = "dark" } = {}) {
  const context = await browser.newContext({ viewport: VIEWPORTS[viewport] ?? viewport, reducedMotion, colorScheme });
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("request", (r) => { if (!r.url().startsWith("http://127.0.0.1")) external.push(r.url()); });
  const failed = [];
  page.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith("http://127.0.0.1")) failed.push(`${r.status()} ${r.url()}`); });
  await page.route(/^https?:\/\/(?!127\.0\.0\.1)/, (route) => route.abort());
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  return { page, context, errors, external, failed };
}

export async function axe(page, options = {}) {
  await page.addScriptTag({ content: AXE });
  return page.evaluate(async (opts) => {
    // eslint-disable-next-line no-undef
    const r = await axe.run(opts.context ?? document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
      ...(opts.rules ? { rules: opts.rules } : {}),
    });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 40).map((n) => n.target.join(" ") + (v.id === "color-contrast" ? " [" + ((n.any[0] && n.any[0].data) ? [n.any[0].data.contrastRatio, n.any[0].data.fgColor, n.any[0].data.bgColor].join(" ") : "") + "]" : "")), summary: v.nodes[0]?.failureSummary?.split("\n").slice(0, 3).join(" ") }));
  }, options);
}

export async function shot(page, name, opts = {}) {
  if (!EVIDENCE) return null;
  const dir = path.join(EVIDENCE, "screenshots");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  await page.screenshot({ path: file, ...opts });
  return file;
}

/** Chromium's own accessibility node for an element (role, computed name, properties). */
export async function axNode(page, locator) {
  const cdp = await page.context().newCDPSession(page);
  // tag the element, find it through the DOM domain, then ask the accessibility domain about it
  await locator.first().evaluate((el) => el.setAttribute("data-ax-probe", "1"));
  const { root } = await cdp.send("DOM.getDocument", { depth: -1, pierce: true });
  const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: "[data-ax-probe]" });
  const { backendNodeId } = (await cdp.send("DOM.describeNode", { nodeId })).node;
  await locator.first().evaluate((el) => el.removeAttribute("data-ax-probe"));
  const { nodes } = await cdp.send("Accessibility.getPartialAXTree", { backendNodeId, fetchRelatives: false });
  await cdp.detach();
  const n = nodes[0];
  const props = Object.fromEntries((n.properties ?? []).map((p) => [p.name, p.value?.value]));
  return { role: n.role?.value, name: n.name?.value ?? "", ignored: n.ignored, props };
}

/** Screenshot of one element (scrolled into view first). */
export async function shotOf(locator, name) {
  if (!EVIDENCE) return null;
  const dir = path.join(EVIDENCE, "screenshots");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  await locator.first().scrollIntoViewIfNeeded();
  await locator.first().screenshot({ path: file });
  return file;
}

export function record(name, data) {
  if (!EVIDENCE) return;
  const dir = path.join(EVIDENCE, "results");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(data, null, 2));
}

/**
 * In-page WCAG contrast of the text in `el` against the backdrop actually painted behind it:
 * ancestors' background colours are composited from the root down (opacity included).
 * Returns null where a background image or gradient sits behind the text.
 */
export const contrastFn = `(() => {
  const parse = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const over = (t, b) => ({ r: t.a * t.r + (1 - t.a) * b.r, g: t.a * t.g + (1 - t.a) * b.g, b: t.a * t.b + (1 - t.a) * b.b, a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  return (el) => {
    const chain = []; for (let n = el; n && n.nodeType === 1; n = n.parentElement) chain.unshift(n);
    let bg = { r: 255, g: 255, b: 255, a: 1 }; let opacity = 1; let image = false;
    for (const n of chain) {
      const cs = getComputedStyle(n);
      opacity *= Number(cs.opacity);
      if (cs.backgroundImage && cs.backgroundImage !== "none") image = true;
      const c = parse(cs.backgroundColor); if (c && c.a > 0) { bg = over({ ...c, a: c.a * opacity }, bg); image = false; }
    }
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); if (!fg) return null;
    const text = over({ ...fg, a: fg.a * opacity }, bg);
    const size = parseFloat(cs.fontSize); const bold = Number(cs.fontWeight) >= 700;
    return { ratio: ratio(text, bg), size, bold, large: size >= 24 || (bold && size >= 18.66), image, color: cs.color, background: "rgb(" + [bg.r, bg.g, bg.b].map(Math.round).join(",") + ")" };
  };
})()`;

/** Wait for the browser accessibility tree, including hydration and queued focus updates. */
export async function waitForAXName(page, locator, expected) {
  await locator.waitFor({state:'visible'});
  const deadline = Date.now() + 5000;
  let node;
  do {
    node = await axNode(page, locator);
    if (typeof expected === 'string' ? node.name === expected : expected.test(node.name)) return node;
    await page.waitForTimeout(50);
  } while (Date.now() < deadline);
  throw new Error(`Accessible name did not settle: expected ${expected}, got ${node?.name}`);
}
