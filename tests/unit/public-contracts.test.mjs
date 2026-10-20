import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = p => readFileSync(p,'utf8');
test('Input exports SearchInput and the form example carries required, types and error associations',()=>{
 assert.match(read('packages/flow-theme/registry/rvlt/ui/input.tsx'),/export \{ Input, SearchInput \}/);
 const s=read('packages/flow-theme/examples/form-field.tsx');
 for(const re of [/required/,/type="email"/,/aria-describedby="email-error"/,/htmlFor="email"/,/role="alert"/,/grid-cols-1/]) assert.match(s,re);
});
test('Status card and table use the distributed status vocabulary',()=>{
 for(const p of ['StatusIndicator','Table']) {
 const s=read(`design-system/components/${p}/preview.html`);
 assert.doesNotMatch(s,/category:|value: 'CONFIRMED'|\['success'|\['primary'/);
 }
 const s=read('design-system/components/StatusIndicator/README.md');
 assert.match(s,/connection freshness/); assert.doesNotMatch(s,/category.*value/);
});
