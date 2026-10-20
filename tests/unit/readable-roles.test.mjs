import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
test('registry readable labels and placeholders never use decorative faint',()=>{
 const dir='packages/flow-theme/registry/rvlt/ui';
 const bad=readdirSync(dir).filter(f=>/text-faint/.test(readFileSync(`${dir}/${f}`,'utf8')));
 assert.deepEqual(bad,[]);
});
