import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('Binder cue words use page ink while marks keep department colours',()=>{
 const s=read('design-system/components/CueTag/preview.html');
 assert.doesNotMatch(s,/<text[^>]*fill="var\(--dept-/);assert.match(s,/stroke="var\(--dept-lx\)"/);
});
test('published gallery overlays local Flow registry and does not require a CDN',()=>{
 const s=read('scripts/design-system/build-site.mjs');assert.match(s,/registry-bundle\.js/);assert.match(s,/registry-bundle\.css/);
 assert.doesNotMatch(read('scripts/design-system/site/index.html'),/<script src="https:/);
});
