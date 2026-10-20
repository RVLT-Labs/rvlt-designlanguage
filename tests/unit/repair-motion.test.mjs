import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('generated reduced motion disables transitions and smooth scrolling',()=>{
 const css=readFileSync('packages/flow-theme/dist/globals.css','utf8').split('@media (prefers-reduced-motion: reduce)')[1];
 assert.match(css,/transition:\s*none\s*!important/);
 assert.match(css,/scroll-behavior:\s*auto\s*!important/);
});
