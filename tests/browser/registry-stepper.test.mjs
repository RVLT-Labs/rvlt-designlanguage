// Lifecycle stepper: the list is named, and every step (clickable or not) announces its stage and
// state, not a bare number or a check icon (Codex 3 and 9).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, open, record, axNode, axe, waitForAXName } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

const EXPECT = ["Enquiry done", "Quote done", "Confirmed current stage", "Prep not started", "On site not started", "Return not started"];

test("clickable steps are buttons named by stage and state; the list has a name", async () => {
  const { page, context } = await open(browser, srv.url("preview-v2/contracts/"), { viewport: "390" });
  const ol = page.locator('[data-example="touch-targets"] ol');
  const list = await axNode(page, ol);
  const names = [];
  const buttons = ol.locator("button");
  for (let i = 0; i < (await buttons.count()); i++) names.push((await waitForAXName(page, buttons.nth(i), EXPECT[i])).name);
  assert.equal(await buttons.count(), EXPECT.length);
  assert.equal(await buttons.locator(':scope > span[aria-hidden]').count(), EXPECT.length);
  assert.equal(await ol.locator('button[aria-label]').count(), 0);
  const violations = await axe(page);
  assert.deepEqual(violations, []);
  const current = await ol.locator('[aria-current="step"]').count();
  record("registry-stepper-clickable", { list, names, current });
  await context.close();
  assert.equal(list.name, "Riverside festival lifecycle", "the stepper list has no accessible name");
  assert.deepEqual(names, EXPECT);
  assert.equal(current, 1);
});

test("a read-only stepper still announces each stage's state", async () => {
  const { page, context } = await open(browser, srv.url("preview-v2/"), { viewport: "desktop" });
  const ol = page.locator("#stepper ol");
  const items = await ol.locator("li").evaluateAll((lis) => lis.map((li) => li.textContent.replace(/\s+/g, " ").trim()));
  const list = await axNode(page, ol);
  record("registry-stepper-readonly", { items, list });
  await context.close();
  assert.ok(list.name, "the stepper list has no accessible name");
  assert.deepEqual(items.map((t) => t.replace(/^\d\s*/, "")), EXPECT);
});
