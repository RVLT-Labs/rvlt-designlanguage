// Registry controls keep a 44px hit area on touch (DESIGN.md §16.8, audit F5, Codex 3). The hit
// area is probed the way a finger meets it: points around the control's centre must land on the
// control (elementFromPoint), not on whatever sits beside it.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { serve, launch, record, shotOf, VIEWPORTS } from "./harness.mjs";

let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

// Probe a disc of diameter `size` centred on the element (8 points, 1px inside its edge): a 44px
// circle must fit in the hit area, which a 44×44 square or a 44px round button both satisfy.
async function hitArea(page, locator, size = 44) {
  // elementFromPoint only sees the viewport, so bring the control into it first
  await locator.first().evaluate((el) => el.scrollIntoView({ block: "center" }));
  return locator.first().evaluate((el, size) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2, h = size / 2 - 1;
    const pts = Array.from({ length: 8 }, (_, k) => [Math.cos((k * Math.PI) / 4) * h, Math.sin((k * Math.PI) / 4) * h]);
    const miss = pts.filter(([dx, dy]) => { const hit = document.elementFromPoint(cx + dx, cy + dy); return !(hit && (hit === el || el.contains(hit))); });
    return { w: Math.round(r.width), h: Math.round(r.height), miss: miss.length };
  }, size);
}

async function touchPage(width = "390") {
  const context = await browser.newContext({ viewport: VIEWPORTS[width], hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto(srv.url("preview-v2/contracts/"));
  await page.evaluate(() => document.fonts.ready);
  return { page, context };
}

test("390 touch: checkbox, switch, tab, small button and combobox clear all take a 44px press", async () => {
  const { page, context } = await touchPage();
  const ex = page.locator('[data-example="touch-targets"]');
  await ex.scrollIntoViewIfNeeded();
  const out = {
    checkbox: await hitArea(page, ex.locator('[data-testid="tt-checkbox"]')),
    switch: await hitArea(page, ex.locator('[data-testid="tt-switch"]')),
    tab: await hitArea(page, ex.locator('[data-testid="tt-tab"]')),
    buttonSm: await hitArea(page, ex.locator('[data-testid="tt-button-sm"]')),
    comboboxClear: await hitArea(page, ex.getByRole("button", { name: "Clear selection" })),
  };
  await shotOf(ex, "registry-touch-targets-390");
  record("registry-touch-390", out);
  await context.close();
  for (const [k, v] of Object.entries(out)) assert.equal(v.miss, 0, `${k}: ${v.miss} of 8 probe points around a ${v.w}×${v.h} control miss it`);
});

test("390 touch: every lifecycle stepper ring takes a 44px press", async () => {
  const { page, context } = await touchPage();
  const rings = page.locator('[data-example="touch-targets"] ol button');
  const n = await rings.count();
  const out = [];
  for (let i = 0; i < n; i++) out.push(await hitArea(page, rings.nth(i)));
  record("registry-touch-stepper-390", out);
  await context.close();
  assert.equal(n, 6);
  assert.deepEqual(out.filter((o) => o.miss), []);
});

test("390 touch: the dialog's close control is 44px and a full-width dismiss button is offered", async () => {
  const { page, context } = await touchPage();
  await page.getByRole("button", { name: "Pull the kit" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await page.waitForTimeout(350); // the dialog zooms in from 95%; measure it at rest
  const close = dialog.getByRole("button", { name: "Close" });
  const out = { close: await hitArea(page, close), keep: await dialog.getByRole("button", { name: "Keep it booked" }).evaluate((b) => ({ w: b.getBoundingClientRect().width, dw: b.closest("[role=dialog]").clientWidth })) };
  await shotOf(dialog, "registry-dialog-390");
  record("registry-touch-dialog-390", out);
  await page.keyboard.press("Escape");
  await context.close();
  assert.equal(out.close.miss, 0, `close ${out.close.w}×${out.close.h} misses ${out.close.miss} probes`);
  assert.ok(out.keep.w > out.keep.dw * 0.7, "no full-width dismiss on a phone");
});
