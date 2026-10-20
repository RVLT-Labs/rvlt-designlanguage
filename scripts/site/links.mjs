// Internal link and asset checker for the assembled Pages site. Walks every .html and .css file,
// collects href / src / srcset / poster / url(...) / meta-refresh targets, resolves them the way a
// browser would under the GitHub Pages base path, and reports any that do not resolve to a file.
// Same-page fragments (#id) must name an element id; a bare "#" (demo placeholder) is allowed.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i; // http:, https:, mailto:, data:, javascript:, //host

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|css)$/.test(name)) out.push(p);
  }
  return out;
}

function refsIn(file, text) {
  text = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const refs = [];
  const add = (v, kind) => {
    if (v === undefined) return;
    const t = v.trim().replace(/&amp;/g, "&");
    if (t) refs.push({ value: t, kind });
  };
  if (file.endsWith(".html")) {
    // strip inline scripts so code that builds URLs at runtime is not mistaken for markup
    const markup = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => (/\bsrc=/.test(m.slice(0, m.indexOf(">"))) ? m.slice(0, m.indexOf(">") + 1) : ""));
    for (const m of markup.matchAll(/\s(href|src|poster|data-src)\s*=\s*("([^"]*)"|'([^']*)')/gi)) add(m[3] ?? m[4], m[1].toLowerCase());
    for (const m of markup.matchAll(/\ssrcset\s*=\s*"([^"]*)"/gi)) for (const part of m[1].split(",")) add(part.trim().split(/\s+/)[0], "srcset");
    for (const m of markup.matchAll(/http-equiv="refresh"\s+content="\d+;\s*url=([^"]+)"/gi)) add(m[1], "refresh");
    for (const m of markup.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) for (const u of m[1].matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) add(u[2], "css-url");
    for (const m of markup.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) for (const u of m[1].matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) add(u[2], "css-url");
  } else {
    for (const u of text.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) add(u[2], "css-url");
    for (const u of text.matchAll(/@import\s+(['"])([^'"]+)\1/g)) add(u[2], "css-import");
  }
  return refs;
}

/**
 * @param {string} root assembled site directory (what Pages serves at `base`)
 * @param {{ base?: string, optionalMounts?: string[] }} opts optionalMounts: site-relative
 *   prefixes that may be absent in a partial build (for example preview-v2/ when it was not built)
 */
export function checkSite(root, { base = "/rvlt-designlanguage/", optionalMounts = [] } = {}) {
  const broken = [];
  let checked = 0;
  const idsCache = new Map();
  const idsOf = (file) => {
    if (!idsCache.has(file)) {
      const ids = new Set();
      for (const m of readFileSync(file, "utf8").matchAll(/\s(?:id|name)\s*=\s*"([^"]+)"/g)) ids.add(m[1]);
      idsCache.set(file, ids);
    }
    return idsCache.get(file);
  };
  const resolveTarget = (abs) => {
    if (existsSync(abs) && statSync(abs).isFile()) return abs;
    if (existsSync(abs) && statSync(abs).isDirectory() && existsSync(path.join(abs, "index.html"))) return path.join(abs, "index.html");
    return null;
  };
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    const rel = path.relative(root, file).split(path.sep).join("/");
    for (const ref of refsIn(file, text)) {
      const v = ref.value;
      if (EXTERNAL.test(v) || v === "#" || v.startsWith("{") || v.includes("${")) continue;
      checked++;
      const [pathPart, frag] = v.split("#");
      const clean = decodeURIComponent(pathPart.split("?")[0]);
      let siteRel;
      if (clean === "") siteRel = rel; // same document
      else if (clean.startsWith("/")) {
        if (!clean.startsWith(base)) {
          broken.push(`${rel}: ${ref.kind} ${v} escapes the ${base} base path`);
          continue;
        }
        siteRel = clean.slice(base.length);
      } else siteRel = path.posix.normalize(path.posix.join(path.posix.dirname(rel), clean));
      if (siteRel.startsWith("..")) {
        broken.push(`${rel}: ${ref.kind} ${v} climbs above the site root`);
        continue;
      }
      if (optionalMounts.some((m) => siteRel === m.replace(/\/$/, "") || siteRel.startsWith(m)) && !existsSync(path.join(root, siteRel.split("/")[0]))) continue;
      const target = resolveTarget(path.join(root, siteRel));
      if (!target) {
        broken.push(`${rel}: ${ref.kind} ${v} → ${siteRel} does not exist`);
        continue;
      }
      // "#/…" is a client-side route (the gallery's hash router), not an element id
      if (frag && !frag.startsWith("/") && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(frag))) {
        broken.push(`${rel}: ${ref.kind} ${v} → #${frag} is not an id in ${path.relative(root, target)}`);
      }
    }
  }
  return { broken, checked };
}
