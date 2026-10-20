// Flow marketing mockups: the data-bearing pieces (hero dashboard, crew board, feature patches)
// follow the rules the spec states for them (audit F1, F2, F7, F10).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, shot, shotOf, record, contrastFn } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

const PAGES = [
  { name: "dark", rel: "examples/flow-marketing/" },
  { name: "light", rel: "examples/flow-marketing/light.html" },
];

for (const p of PAGES) {
  for (const viewport of ["desktop", "390"]) {
    test(`${p.name} ${viewport}: every text in the hero dashboard reads at 4.5:1 (F1)`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport });
      const rows = await page.evaluate(`(() => {
        const c = ${contrastFn};
        const shot = document.querySelector(".shot");
        const out = [];
        const walk = document.createTreeWalker(shot, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          if (!n.textContent.trim()) continue;
          const el = n.parentElement; const r = el.getBoundingClientRect();
          if (!r.width || !r.height || getComputedStyle(el).visibility === "hidden") continue;
          const m = c(el);
          out.push({ text: n.textContent.trim().slice(0, 40), ratio: +m.ratio.toFixed(2), large: m.large, color: m.color, background: m.background });
        }
        return out;
      })()`);
      await shotOf(page.locator(".shot"), `marketing-${p.name}-${viewport}-dashboard`);
      record(`marketing-${p.name}-${viewport}-dashboard-contrast`, rows);
      const bad = rows.filter((r) => r.ratio < (r.large ? 3 : 4.5));
      await context.close();
      assert.ok(rows.length >= 10, "dashboard text not found");
      assert.deepEqual(bad, []);
    });

    test(`${p.name} ${viewport}: crew avatars and shift labels follow the on-fill rule and red is never a person (F2)`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport });
      const found = await page.evaluate(`(() => {
        const c = ${contrastFn};
        return [...document.querySelectorAll(".av, .shift")].filter((el) => el.textContent.trim()).map((el) => {
          const m = c(el); const bg = getComputedStyle(el).backgroundColor;
          return { cls: el.className, text: el.textContent.trim(), ratio: +m.ratio.toFixed(2), bg };
        });
      })()`);
      const reds = await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        return ["--red", "--action-red", "--red-700"].map((v) => cs.getPropertyValue(v).trim()).filter(Boolean);
      });
      const toRgb = (hex) => { const n = parseInt(hex.slice(1), 16); return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`; };
      const redRgb = reds.filter((h) => /^#[0-9a-f]{6}$/i.test(h)).map(toRgb);
      await shotOf(page.locator(".sc-vis"), `marketing-${p.name}-${viewport}-crew`);
      record(`marketing-${p.name}-${viewport}-crew`, found);
      await context.close();
      assert.ok(found.length >= 8, "crew board not found");
      assert.deepEqual(found.filter((f) => f.ratio < 4.5), [], "on-fill text below 4.5:1");
      assert.deepEqual(found.filter((f) => redRgb.includes(f.bg)), [], "red used as a person or shift colour");
    });
  }

  test(`${p.name}: hand-drawn annotations sit beside the dashboard, never over it, and are not clipped (F7)`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const geo = await page.evaluate(() => {
      const box = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; };
      const frame = box(document.querySelector(".shot"));
      const hero = box(document.querySelector(".hero"));
      const vw = document.documentElement.clientWidth;
      return [...document.querySelectorAll(".stage .doodle, .stage .annot, .stage .d-circle")].filter((el) => getComputedStyle(el).display !== "none").map((el) => {
        const d = box(el);
        const overlaps = d.l < frame.r && d.r > frame.l && d.t < frame.b && d.b > frame.t;
        const clipped = d.l < Math.max(0, hero.l) - 0.5 || d.r > Math.min(vw, hero.r) + 0.5;
        return { text: el.textContent.trim(), overlaps, clipped, d, frame };
      });
    });
    await shot(page, `marketing-${p.name}-desktop-hero`);
    record(`marketing-${p.name}-desktop-doodles`, geo);
    await context.close();
    assert.deepEqual(geo.filter((g) => g.overlaps || g.clipped), []);
  });

  test(`${p.name}: feature patches use the module colour map, never red (F10)`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const patches = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      const tok = (n) => { const h = cs.getPropertyValue(n).trim(); const v = parseInt(h.slice(1), 16); return `rgb(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255})`; };
      return [...document.querySelectorAll(".feat")].map((f) => ({
        title: f.querySelector("h3, h4").textContent.trim(),
        module: f.dataset.module,
        bg: getComputedStyle(f.querySelector(".patch")).backgroundColor,
        expected: f.dataset.module ? tok(`--${{ projects: "blue", gear: "amber", crew: "purple", availability: "green", compliance: "teal", maintenance: "coral" }[f.dataset.module]}`) : null,
      }));
    });
    record(`marketing-${p.name}-patches`, patches);
    await context.close();
    assert.equal(patches.length, 6);
    assert.deepEqual(patches.filter((x) => !x.module || x.bg !== x.expected), []);
  });
}
