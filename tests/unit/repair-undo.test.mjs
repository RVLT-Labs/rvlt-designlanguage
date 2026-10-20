import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,reduce} from '../../packages/flow-theme/examples/operational-state.mjs';
test('server resolution discards return undo history',()=>{
 let s=reduce(reduce(initial,{type:'return',quantity:1}),{type:'return',quantity:1});
 s=reduce(s,{type:'resolve',choice:'server'});
 assert.equal(s.returned,0);
 assert.equal(reduce(s,{type:'undo'}).returned,0);
});
