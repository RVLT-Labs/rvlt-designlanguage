import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { render } from '../../scripts/site/landing.mjs';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const tokens = JSON.parse(readFileSync(new URL('../../packages/flow-theme/tokens.json', import.meta.url), 'utf8'));
const markers = ['css', 'version', 'tokens', 'contrast', 'ramp'];
const marker = (name, close = false) => name === 'css'
  ? `/* ${close ? '/' : ''}generated:${name} */`
  : `<!-- ${close ? '/' : ''}generated:${name} -->`;

test('an empty CSS block generates canonical colours and fonts, independent of whitespace', () => {
  for (const gap of ['', '\n', '\r\n', '\n\n']) {
    const empty = html.replace(/\/\* generated:css \*\/[\s\S]*?\/\* \/generated:css \*\//,
      `${marker('css')}${gap}${marker('css', true)}`);
    const output = render(empty);
    const css = output.split(marker('css'))[1].split(marker('css', true))[0];
    for (const theme of ['dark', 'light']) assert.ok(css.includes(`--paper:${tokens.themes[theme].paper};`));
    assert.ok(css.includes(`--font-display:${tokens.fonts.display};`));
    assert.ok(css.includes(`--font-sans:${tokens.fonts.sans};`));
    assert.equal(render(output), output, 'regeneration must be stable');
  }
});

for (const name of markers) {
  for (const close of [false, true]) {
    test(`${name}: rejects missing ${close ? 'closing' : 'opening'} marker`, () => {
      assert.throws(() => render(html.replace(marker(name, close), '')), /generated:/);
    });
    test(`${name}: rejects duplicate ${close ? 'closing' : 'opening'} marker`, () => {
      assert.throws(() => render(html + marker(name, close)), /generated:/);
    });
  }
  test(`${name}: rejects reversed markers`, () => {
    const open = marker(name), end = marker(name, true);
    assert.throws(() => render(html.replace(open, '__OPEN__').replace(end, open).replace('__OPEN__', end)), /generated:/);
  });
}
