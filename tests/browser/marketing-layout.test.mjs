// Flow marketing mockups: responsive layout at 320 / 390 / 768 / desktop (F15, F16, F19, §16.8).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, shot, record } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

const PAGES = [
  { name: "dark", rel: "examples/flow-marketing/" },
  { name: "light", rel: "examples/flow-marketing/light.html" },
];

for (const p of PAGES) {
  for (const viewport of ["320", "390", "768", "desktop"]) {
    test(`${p.name} ${viewport}: nothing escapes the viewport and every control is a real target`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport });
      const m = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const escaping = [...document.querySelectorAll("body *")].filter((el) => {
          if (el.closest("[aria-hidden=true], .drawer, .shot, .steps")) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > vw + 1 || r.left < -1);
        }).map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60));
        const small = [...document.querySelectorAll("a[href], button, summary")].filter((el) => {
          if (el.closest("[hidden], .drawer, footer")) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.height < 44 || r.width < 44);
        }).map((el) => ({ el: el.textContent.trim().slice(0, 30), h: Math.round(el.getBoundingClientRect().height), w: Math.round(el.getBoundingClientRect().width) }));
        const footSmall = [...document.querySelectorAll("footer a")].filter((el) => el.getBoundingClientRect().height < 24).map((el) => el.textContent.trim());
        return { scrollW: document.documentElement.scrollWidth, vw, escaping: [...new Set(escaping)], small, footSmall };
      });
      await shot(page, `marketing-${p.name}-${viewport}-viewport`);
      record(`marketing-${p.name}-${viewport}-layout`, m);
      await context.close();
      assert.equal(m.scrollW, m.vw, "horizontal scroll");
      assert.deepEqual(m.escaping, []);
      assert.deepEqual(m.small, [], "targets under 44px");
      assert.deepEqual(m.footSmall, [], "footer links under 24px");
    });
  }

  for (const viewport of ["320", "390"]) {
    test(`${p.name} ${viewport}: hero CTAs stack full width on one line each (F15)`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport });
      const ctas = await page.locator(".hero-cta a").evaluateAll((as) => {
        const box = as[0].parentElement.getBoundingClientRect();
        return as.map((a) => { const r = a.getBoundingClientRect(); const lh = parseFloat(getComputedStyle(a).lineHeight) || 20; return { text: a.textContent.trim(), h: r.height, lines: Math.round((a.clientHeight - parseFloat(getComputedStyle(a).paddingTop) - parseFloat(getComputedStyle(a).paddingBottom)) / lh), fill: r.width / box.width }; });
      });
      record(`marketing-${p.name}-${viewport}-ctas`, ctas);
      await context.close();
      assert.equal(ctas.length, 2);
      for (const c of ctas) {
        assert.equal(c.lines, 1, `${c.text} wraps`);
        assert.ok(c.fill > 0.95, `${c.text} is not full width`);
        assert.ok(c.h >= 48 && c.h <= 60, `${c.text} is ${c.h}px tall`);
      }
    });
  }

  test(`${p.name}: feature mini-UIs end on whole rows, nothing cut mid-row (F16)`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const cut = await page.evaluate(() => [...document.querySelectorAll(".mini")].flatMap((mini) => {
      const box = mini.getBoundingClientRect();
      const inner = mini.firstElementChild?.classList.contains("gantt") || mini.firstElementChild?.classList.contains("doc") ? [mini.firstElementChild] : [...mini.children];
      return inner.filter((c) => { const r = c.getBoundingClientRect(); return r.height > 0 && r.top < box.bottom && r.bottom > box.bottom - 2 + 0.5; })
        .map((c) => `${mini.closest(".feat").querySelector("h3").textContent.trim()}: ${c.textContent.trim().slice(0, 30)}`);
    }));
    await page.locator("#features").scrollIntoViewIfNeeded();
    await shot(page, `marketing-${p.name}-desktop-features`, { fullPage: false });
    await context.close();
    assert.deepEqual(cut, []);
  });

  for (const viewport of ["desktop", "768"]) {
    test(`${p.name} ${viewport}: hero stickers never collide with the headline, lead or CTAs (§16.6)`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport });
      const hits = await page.evaluate(() => {
        const rects = (sel) => [...document.querySelectorAll(sel)].flatMap((el) => [...el.getClientRects()].map((r) => ({ sel, r })));
        // text line boxes of the headline and lead, not their padded blocks
        const lines = [];
        for (const el of document.querySelectorAll(".hero h1, .hero .sub, .hero-cta a, .hero .kick")) {
          const range = document.createRange(); range.selectNodeContents(el);
          for (const r of range.getClientRects()) if (r.width > 2) lines.push({ sel: el.tagName.toLowerCase() + "." + el.className, r });
        }
        return rects(".hero .stk").filter(({ r }) => r.width > 0).flatMap(({ r: s }) => lines
          .filter(({ r }) => s.left < r.right && s.right > r.left && s.top < r.bottom && s.bottom > r.top)
          .map(({ sel }) => `sticker at ${Math.round(s.left)},${Math.round(s.top)} overlaps ${sel}`));
      });
      await context.close();
      assert.deepEqual([...new Set(hits)], []);
    });
  }

  test(`${p.name}: at 1440×900 the hero dashboard starts in the first viewport (F19)`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const top = await page.evaluate(() => document.querySelector(".shot").getBoundingClientRect().top);
    await shot(page, `marketing-${p.name}-desktop-first-viewport`);
    await context.close();
    assert.ok(top <= 900 - 220, `dashboard starts at ${Math.round(top)}px; at least 220px of it should show at 900px`);
  });
}
