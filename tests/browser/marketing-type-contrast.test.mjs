// Flow marketing mockups: real, self-hosted brand fonts with no stale faces; every text on the
// page passes axe colour contrast in both themes and at phone width (F6, F17, F18, faint text);
// the hero figures are labelled as illustrative.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, axe, record } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

const PAGES = [
  { name: "dark", rel: "examples/flow-marketing/" },
  { name: "light", rel: "examples/flow-marketing/light.html" },
];

for (const p of PAGES) {
  test(`${p.name}: brand fonts load from the repository, no network fonts, no stale faces`, async () => {
    const { page, context, external, failed } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const f = await page.evaluate(() => {
      const loaded = [...document.fonts].filter((x) => x.status === "loaded").map((x) => `${x.family.replace(/"/g, "")} ${x.weight}`);
      const fam = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el).fontFamily : null; };
      const html = document.documentElement.outerHTML;
      return { loaded, h1: fam("h1"), kicker: fam(".kicker"), body: fam("body"), stale: ["Caveat", "bc-alphapipe", "fonts.googleapis.com", "typekit"].filter((w) => html.includes(w)) };
    });
    record(`marketing-${p.name}-fonts`, { ...f, external, failed });
    await context.close();
    assert.deepEqual(external, [], "requests left the site");
    assert.deepEqual(failed, []);
    assert.deepEqual(f.stale, []);
    assert.match(f.h1, /^"?Archivo/);
    assert.match(f.kicker, /^"?Kalam/);
    assert.match(f.body, /^"?Hanken Grotesk/);
    for (const fam of ["Archivo", "Hanken Grotesk", "Kalam"]) assert.ok(f.loaded.some((l) => l.startsWith(fam)), `${fam} did not load`);
  });

  for (const viewport of ["desktop", "390"]) {
    test(`${p.name} ${viewport}: axe finds no colour-contrast failures anywhere on the page`, async () => {
      const { page, context } = await open(browser, srv.url(p.rel), { viewport });
      const v = (await axe(page)).filter((x) => x.id === "color-contrast");
      record(`marketing-${p.name}-${viewport}-axe-contrast`, v);
      await context.close();
      assert.deepEqual(v, []);
    });
  }

  test(`${p.name}: hero and showcase figures say they are illustrative`, async () => {
    const { page, context } = await open(browser, srv.url(p.rel), { viewport: "desktop" });
    const figs = await page.evaluate(() => [...document.querySelectorAll(".stats, .sc-metric")].map((el) => {
      const ids = (el.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean);
      const notes = ids.map((id) => document.getElementById(id)).filter(Boolean);
      return { text: el.textContent.trim().slice(0, 40), note: notes.map((n) => n.textContent.trim()).join(" "), visible: notes.every((n) => n.getBoundingClientRect().height > 0) };
    }));
    await context.close();
    // the Espresso mockup carries hero and showcase figures; the Paper one only positioning copy
    if (p.name === "dark") assert.ok(figs.length >= 2, "hero stats and showcase metric not found");
    for (const f of figs) {
      assert.match(f.note, /illustrative/i, `${f.text} is not labelled illustrative`);
      assert.ok(f.visible, `${f.text}: the illustrative note is not visible`);
    }
  });
}
