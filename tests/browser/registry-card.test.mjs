// Registry Card: an interactive card is a real link (keyboard reachable, named by its title,
// Enter and pointer both open it, visible focus); static cards are not interactive (Codex 9).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, record, axNode, shotOf } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

test("the interactive card is reachable by keyboard, named by its title and opens with Enter", async () => {
  const { page, context } = await open(browser, srv.url("preview-v2/contracts/"), { viewport: "390" });
  const ex = page.locator('[data-example="card-interactive"]');
  const target = ex.getByRole("link", { name: "Riverside festival" });
  assert.equal(await target.count(), 1, "no link named by the card title");
  // reach it the way a keyboard user does: from the element before it
  await ex.locator("h2").first().evaluate((h) => { h.tabIndex = -1; h.focus(); });
  await page.keyboard.press("Tab");
  assert.ok(await target.evaluate((a) => a === document.activeElement), "Tab did not reach the card link");
  await page.waitForTimeout(300); // the ring eases in with the card shadow transition
  const ring = await target.evaluate((a) => {
    const card = a.closest("[data-slot=card]") ?? a.parentElement;
    const cs = getComputedStyle(card);
    return { shadow: cs.boxShadow, outline: cs.outlineStyle };
  });
  await shotOf(ex, "registry-card-interactive-focus-390");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(100);
  const hash = await page.evaluate(() => location.hash);
  const ax = await axNode(page, target);
  record("registry-card-keyboard", { ring, hash, ax });
  await context.close();
  assert.equal(hash, "#job-riverside");
  assert.match(ring.shadow, /rgb\(224, 54, 61\)/, "the card shows no red focus ring while its link has keyboard focus");
});

test("a pointer press anywhere on the card opens it, and static cards stay inert", async () => {
  const { page, context } = await open(browser, srv.url("preview-v2/contracts/"), { viewport: "desktop" });
  const ex = page.locator('[data-example="card-interactive"]');
  // a real pointer press on the description text: the stretched link above it must take it
  await ex.scrollIntoViewIfNeeded();
  const box = await ex.getByText("Quoted · Sat 12 Dec · 3 stages").boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(100);
  const hash = await page.evaluate(() => location.hash);
  const inert = await ex.evaluate((root) => [...root.querySelectorAll("*")]
    .filter((el) => getComputedStyle(el).cursor === "pointer" && !el.closest("a[href], button"))
    .map((el) => el.className.toString().slice(0, 40)));
  await context.close();
  assert.equal(hash, "#job-riverside");
  assert.deepEqual(inert, [], "pointer cursor on something that is not a link or button");
});
