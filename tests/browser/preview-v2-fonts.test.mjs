// preview-v2 renders in the brand faces, in sentence case, in both themes (F8).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, shot, record } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

for (const theme of ["dark", "light"]) {
  test(`preview-v2 ${theme}: Archivo, Hanken Grotesk and Geist Mono load from the package; no uppercase labels`, async () => {
    const { page, context, external, failed } = await open(browser, srv.url("preview-v2/"), { viewport: "desktop" });
    if (theme === "light") {
      await page.evaluate(() => document.documentElement.classList.add("light"));
      await page.waitForTimeout(250);
    }
    const r = await page.evaluate(() => {
      const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, ""));
      const h1 = document.querySelector("h1");
      const upper = [...document.querySelectorAll("body *")].filter((el) => getComputedStyle(el).textTransform === "uppercase" && el.textContent.trim() && el.getBoundingClientRect().height > 0).map((el) => el.textContent.trim().slice(0, 30));
      const mono = document.querySelector(".font-mono");
      return { loaded: [...new Set(loaded)], h1: h1 && getComputedStyle(h1).fontFamily, body: getComputedStyle(document.body).fontFamily, mono: mono && getComputedStyle(mono).fontFamily, upper: [...new Set(upper)] };
    });
    await shot(page, `preview-v2-${theme}-desktop-viewport`);
    record(`preview-v2-${theme}-fonts`, { ...r, external, failed });
    await context.close();
    assert.deepEqual(external, []);
    assert.deepEqual(failed, []);
    for (const fam of ["Archivo", "Hanken Grotesk", "Geist Mono"]) assert.ok(r.loaded.includes(fam), `${fam} not loaded (${r.loaded.join(", ")})`);
    assert.match(r.h1, /^"?Archivo/);
    assert.match(r.body, /^"?Hanken Grotesk/);
    assert.deepEqual(r.upper, []);
  });
}
