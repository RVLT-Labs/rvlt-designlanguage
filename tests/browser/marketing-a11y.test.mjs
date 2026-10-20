// Flow marketing mockups: reduced motion, landmarks and headings, decorative art hidden from
// assistive technology, the specified phone drawer, and the brand focus ring (F12, F13, F14).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, shot, record, axe } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

const PAGES = [
  { name: "dark", rel: "examples/flow-marketing/", ring: "rgb(224, 54, 61)" },
  { name: "light", rel: "examples/flow-marketing/light.html", ring: "rgb(193, 34, 41)" },
];

for (const p of PAGES) {
  for (const viewport of ["desktop", "390"]) {
    test(`${p.name} ${viewport}: reduced motion stops every animation and smooth scrolling (F12)`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport, reducedMotion: "reduce" });
      await page.waitForTimeout(300);
      const state = await page.evaluate(() => ({
        running: document.getAnimations().filter((a) => a.playState === "running").map((a) => a.animationName ?? a.constructor.name),
        scroll: getComputedStyle(document.documentElement).scrollBehavior,
        transitions: [...document.querySelectorAll(".btn, .feat, .faq summary .pm")].map((el) => getComputedStyle(el).transitionDuration).filter((d) => d.split(",").some((x) => parseFloat(x) > 0.01)),
      }));
      record(`marketing-${p.name}-${viewport}-reduced-motion`, state);
      await context.close();
      assert.deepEqual(state.running, []);
      assert.equal(state.scroll, "auto");
      assert.deepEqual(state.transitions, []);
    });
  }

  test(`${p.name}: one main landmark, a skip link, no heading skips, decoration hidden (F13)`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const s = await page.evaluate(() => {
      const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter((h) => !h.closest("[aria-hidden=true]")).map((h) => +h.tagName[1]);
      const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1);
      const deco = [...document.querySelectorAll(".stk, .doodle, .annot, .d-circle, .glow, .cta-stk")];
      return {
        mains: document.querySelectorAll("main").length,
        firstLink: (() => { const a = document.querySelector("a[href], button"); return a ? { text: a.textContent.trim(), href: a.getAttribute("href") } : null; })(),
        h1: levels.filter((l) => l === 1).length,
        skips,
        exposed: deco.filter((el) => !el.closest("[aria-hidden=true]")).map((el) => el.className),
        titled: deco.filter((el) => el.hasAttribute("title")).map((el) => el.getAttribute("title")),
      };
    });
    const violations = (await axe(page)).filter((v) => ["landmark-one-main", "region", "heading-order", "page-has-heading-one", "bypass", "landmark-unique"].includes(v.id));
    record(`marketing-${p.name}-semantics`, { ...s, violations });
    await context.close();
    assert.equal(s.mains, 1);
    assert.match(s.firstLink?.text ?? "", /skip/i);
    assert.equal(s.firstLink.href, "#main");
    assert.equal(s.h1, 1);
    assert.deepEqual(s.skips, []);
    assert.deepEqual(s.exposed, []);
    assert.deepEqual(s.titled, []);
    assert.deepEqual(violations, []);
  });

  test(`${p.name} 390: the phone nav is a real drawer: named, trapped, Esc closes, focus returns (F14)`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "390" });
    const menu = page.getByRole("button", { name: /menu/i });
    assert.equal(await menu.count(), 1, "no menu button on phone");
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    await menu.focus();
    await page.keyboard.press("Enter");
    const drawer = page.getByRole("dialog", { name: /menu|site navigation/i });
    await drawer.waitFor({ state: "visible" });
    assert.equal(await menu.getAttribute("aria-expanded"), "true");
    const inside = () => page.evaluate(() => !!document.activeElement?.closest("[role=dialog]"));
    assert.ok(await inside(), "focus did not move into the drawer");
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press("Tab");
      assert.ok(await inside(), `Tab ${i + 1} escaped the drawer`);
    }
    const rows = await drawer.locator("a").evaluateAll((as) => as.map((a) => ({ text: a.textContent.trim(), h: a.getBoundingClientRect().height })));
    const locked = await page.evaluate(() => getComputedStyle(document.body).overflow === "hidden" || getComputedStyle(document.documentElement).overflow === "hidden");
    await page.waitForTimeout(350); // let the slide-in settle before the evidence shot
    await shot(page, `marketing-${p.name}-390-drawer-open`);
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden" });
    const back = await page.evaluate(() => document.activeElement?.getAttribute("aria-expanded"));
    record(`marketing-${p.name}-390-drawer`, { rows, locked, focusReturned: back === "false" });
    await context.close();
    assert.ok(rows.length >= 5, "drawer should hold the four sections plus Book a demo");
    assert.deepEqual(rows.filter((r) => r.h < 48), [], "drawer rows must be 48px");
    assert.ok(locked, "page scroll not locked while the drawer is open");
    assert.equal(back, "false", "focus did not return to the menu button");
  });

  test(`${p.name}: keyboard focus shows the 2px red brand ring`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    let ring = null;
    for (let i = 0; i < 12 && !ring; i++) {
      await page.keyboard.press("Tab");
      ring = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || !/book a demo/i.test(el.textContent)) return null;
        const cs = getComputedStyle(el);
        return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor, offset: cs.outlineOffset };
      });
    }
    await context.close();
    assert.ok(ring, "Book a demo never received focus");
    assert.equal(ring.style, "solid");
    assert.equal(ring.width, "2px");
    assert.equal(ring.color, p.ring);
  });
}
