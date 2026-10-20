// Registry Button: a loading button keeps its accessible name, asChild children receive the
// disabled/loading semantics, and the primary fill is the accessible action red (Codex 9, F6).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, record, contrastFn, axNode } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

test("a loading button is still named by its label, busy, disabled and the same width", async () => {
  const { page, context } = await open(browser, srv.url("preview-v2/contracts/"), { viewport: "desktop" });
  const ex = page.locator('[data-example="button-states"]');
  const loading = ex.locator('[data-testid="send-loading"]');
  const ax = await axNode(page, loading);
  record("registry-button-loading-ax", ax);
  assert.equal(ax.role, "button");
  assert.equal(ax.name, "Sending quote", "Chromium's accessibility tree has no name for the loading button");
  assert.ok(ax.props.busy, "not exposed as busy");
  assert.equal(ax.props.disabled, true, "not exposed as disabled");
  // Chromium names it either way; accname excludes visibility:hidden content, and other engines
  // follow that, so the label itself must stay rendered (hidden by opacity, not visibility)
  const label = await loading.evaluate((b) => {
    const el = [...b.querySelectorAll("*")].find((n) => n.textContent.trim() === "Sending quote" && !n.children.length) ?? b;
    const cs = getComputedStyle(el);
    return { visibility: cs.visibility, display: cs.display, hiddenAttr: el.closest("[aria-hidden=true]") !== null };
  });
  record("registry-button-loading-label", label);
  assert.equal(label.visibility, "visible", "the label is visibility:hidden while loading");
  assert.notEqual(label.display, "none");
  assert.equal(label.hiddenAttr, false, "the label is aria-hidden while loading");
  const widths = await ex.evaluate((root) => {
    const a = root.querySelector('[data-testid="send-idle"]').getBoundingClientRect().width;
    const b = root.querySelector('[data-testid="send-loading"]').getBoundingClientRect().width;
    return { a, b };
  });
  await context.close();
  assert.ok(Math.abs(widths.a - widths.b) < 1, `width shifted ${widths.a} → ${widths.b}`);
});

test("asChild links take the disabled and loading semantics: not focusable, not followed, announced", async () => {
  const { page, context } = await open(browser, srv.url("preview-v2/contracts/"), { viewport: "desktop" });
  const ex = page.locator('[data-example="button-aschild"]');
  const disabled = ex.getByRole("link", { name: "Open the quote" });
  const busy = ex.getByRole("link", { name: "Export the run sheet" });
  const attrs = async (l) => ({ ariaDisabled: await l.getAttribute("aria-disabled"), tabindex: await l.getAttribute("tabindex"), busy: await l.getAttribute("aria-busy") });
  const d = await attrs(disabled);
  const b = await attrs(busy);
  const before = page.url();
  await disabled.click({ force: true });
  await page.waitForTimeout(150);
  const after = page.url();
  // keyboard: Tab from the plain link before them must skip both
  await ex.getByRole("link", { name: "Open the job" }).focus();
  await page.keyboard.press("Tab");
  const next = await page.evaluate(() => { const a = document.activeElement; return a && a !== document.body ? a.textContent.trim() : "(nothing after; focus left the page content)"; });
  record("registry-button-aschild", { d, b, before, after, next });
  await context.close();
  assert.equal(d.ariaDisabled, "true");
  assert.equal(d.tabindex, "-1");
  assert.equal(after, before, "a disabled asChild link navigated");
  assert.equal(b.busy, "true");
  assert.equal(b.ariaDisabled, "true");
  assert.ok(!/Open the quote|Export the run sheet/.test(next ?? ""), `focus landed on ${next}`);
});

for (const theme of ["dark", "light"]) {
  test(`${theme}: the primary button fills with action red and its label reads at 4.5:1`, async () => {
    const { page, context } = await open(browser, srv.url("preview-v2/contracts/"), { viewport: "desktop" });
    if (theme === "light") await page.evaluate(() => document.documentElement.classList.add("light"));
    await page.waitForTimeout(400); // the theme switch animates colours; sample after it settles
    const r = await page.locator('[data-testid="send-idle"]').evaluate((el, fn) => {
      const c = eval(fn);
      return { bg: getComputedStyle(el).backgroundColor, ratio: c(el.querySelector("span") ?? el).ratio, token: getComputedStyle(document.documentElement).getPropertyValue("--action-red").trim() };
    }, contrastFn);
    await context.close();
    const hex = (rgb) => "#" + rgb.match(/\d+/g).slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("").toUpperCase();
    assert.equal(hex(r.bg), r.token.toUpperCase());
    assert.ok(r.ratio >= 4.5, `label ${r.ratio.toFixed(2)}:1`);
  });
}
