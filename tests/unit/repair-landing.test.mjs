import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('landing tables can be scrolled with the keyboard, including generated tables',()=>{
 const source=readFileSync('index.html','utf8');
 const wrappers=[...source.matchAll(/<div class="table-wrap"[^>]*>/g)];
 assert.ok(wrappers.length>=10);
 for(const [tag] of wrappers)assert.match(tag,/tabindex="0"/);
 const generator=readFileSync('scripts/site/landing.mjs','utf8');
 for(const [tag] of generator.matchAll(/<div class="table-wrap"[^>]*>/g))assert.match(tag,/tabindex="0"/);
});
