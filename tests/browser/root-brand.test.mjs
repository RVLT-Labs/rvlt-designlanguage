import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serve, launch, open, axe, contrastFn, record, shot } from './harness.mjs';

const tokens = JSON.parse(readFileSync(new URL('../../packages/flow-theme/tokens.json', import.meta.url), 'utf8'));
let srv, browser;
before(async () => { srv = await serve(); browser = await launch(); });
after(async () => { await browser?.close(); await srv?.close(); });

for (const theme of ['dark', 'light']) {
  for (const viewport of ['320', '390', '768', 'desktop']) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      test(`root ${theme} ${viewport} ${reducedMotion}: painted brand, fonts, contrast and navigation`, async () => {
        const { page, context, failed, external, errors } = await open(browser, srv.url(`?theme=${theme}`), { viewport, reducedMotion, colorScheme: theme });
        try {
          const painted = await page.evaluate(({ expected, contrastSource }) => {
            const css = (el) => getComputedStyle(el);
            const body = css(document.body);
            const probe = document.createElement('span');
            probe.style.backgroundColor = expected;
            document.body.append(probe);
            const background = css(probe).backgroundColor;
            probe.remove();
            const measure = (0, eval)(contrastSource);
            const pairs = [...document.querySelectorAll('h1, .lead, .eyebrow, .toc a, .toggle, .btn, .layers li.marketing a, [data-pair] span')]
              .map(el => ({ text: el.textContent.trim().slice(0, 60), ...measure(el) }));
            return {
              background: body.backgroundColor, expectedBackground: background,
              bodyFont: body.fontFamily, headingFont: css(document.querySelector('h1')).fontFamily,
              loaded: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replaceAll('"', '')),
              overflow: document.documentElement.scrollWidth - innerWidth,
              nav: [...document.querySelectorAll('.toc a')].map(el => {
                const r = el.getBoundingClientRect();
                return { text: el.textContent, left: r.left, right: r.right, height: r.height, clipped: el.scrollWidth > el.clientWidth };
              }),
              width: innerWidth, pairs, scrollBehavior: css(document.documentElement).scrollBehavior,
            };
          }, { expected: tokens.themes[theme].paper, contrastSource: contrastFn });
          // Chromium reports the fonts used for glyphs, rather than just the declared stack.
          const cdp = await context.newCDPSession(page);
          await cdp.send('DOM.enable');
          await cdp.send('CSS.enable');
          const { root } = await cdp.send('DOM.getDocument');
          const used = {};
          for (const selector of ['h1', '.lead']) {
            const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
            used[selector] = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts;
          }
          await cdp.detach();
          const violations = (await axe(page)).filter(v => v.id === 'color-contrast');
          const name = `root-brand-${theme}-${viewport}-${reducedMotion}`;
          record(name, { painted, used, violations, failed, external, errors });
          await shot(page, name);
          assert.equal(painted.background, painted.expectedBackground);
          assert.match(painted.bodyFont, /^"?Hanken Grotesk/);
          assert.match(painted.headingFont, /^"?Archivo/);
          for (const family of ['Archivo', 'Hanken Grotesk']) assert.ok(painted.loaded.includes(family), `${family} not loaded`);
          for (const [selector, family] of [['h1', 'Archivo'], ['.lead', 'Hanken Grotesk']]) {
            assert.ok(used[selector].some(f => f.isCustomFont && f.familyName.includes(family) && f.glyphCount > 0), `${selector}: ${family} did not paint glyphs`);
          }
          assert.ok(painted.overflow <= 1, `document overflow: ${painted.overflow}`);
          assert.equal(painted.nav.length, 8);
          for (const link of painted.nav) {
            assert.ok(link.left >= 0 && link.right <= painted.width + 1 && link.height >= 44 && !link.clipped, `unreachable/clipped link: ${JSON.stringify(link)}`);
          }
          for (const pair of painted.pairs) {
            assert.equal(pair.image, false, pair.text);
            assert.ok(pair.ratio >= (pair.large ? 3 : 4.5), `computed contrast: ${JSON.stringify(pair)}`);
          }
          assert.deepEqual(violations, []);
          assert.deepEqual({ failed, external, errors }, { failed: [], external: [], errors: [] });
          if (reducedMotion === 'reduce') {
            assert.equal(painted.scrollBehavior, 'auto');
            await page.locator('.btn-primary').hover();
            const motion = await page.locator('.btn-primary').evaluate(el => {
              const s = getComputedStyle(el);
              return { transform: s.transform, animation: s.animationName, transition: s.transitionDuration };
            });
            assert.deepEqual(motion, { transform: 'none', animation: 'none', transition: '0s' });
          }
          // Keyboard focus and activation must reach the final navigation destination.
          await page.locator('.toc a').last().focus();
          await page.keyboard.press('Enter');
          // Same-document navigation can land after the keypress resolves; wait for it.
          await page.waitForURL(url => new URL(url).hash === '#using', { timeout: 2000 });
          assert.equal(new URL(page.url()).hash, '#using');
        } finally { await context.close(); }
      });
    }
  }
}
