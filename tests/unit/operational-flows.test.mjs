import {test} from 'node:test';import assert from 'node:assert/strict';
test('partial returns preserve outstanding quantity and block expired-ticket loading',async()=>{
 const {initial,reduce}=await import('../../packages/flow-theme/examples/operational-state.mjs');
 let s=reduce(initial,{type:'return',quantity:1});assert.equal(s.returned,1);assert.equal(s.quantity-s.returned,1);
 s=reduce(s,{type:'return',quantity:4});assert.equal(s.returned,1);
 s=reduce(s,{type:'load'});assert.equal(s.loaded,false);assert.match(s.message,/expired/i);
 s=reduce(s,{type:'damage'});assert.equal(s.substituted,false);
 s=reduce(s,{type:'substitute'});assert.equal(s.substituted,true);assert.equal(s.quantity,2);
 s=reduce(s,{type:'resolve',choice:'local'});assert.equal(s.conflict,false);assert.equal(s.synced,false);assert.equal(s.returned,1);
 s=reduce(s,{type:'undo'});assert.equal(s.returned,0);
});
test('Binder calling protects Go and distinguishes current, next and offline edits',async()=>{
 const {initial,reduce}=await import('../../packages/flow-theme/examples/calling-state.mjs');
 let s=reduce(initial,{type:'go'});assert.equal(s.current,0);
 s=reduce(s,{type:'enter'});s=reduce(s,{type:'arm'});assert.equal(s.current,0);
 s=reduce(s,{type:'go'});assert.equal(s.current,1);assert.equal(s.armed,false);
 s=reduce(s,{type:'offline'});s=reduce(s,{type:'edit',note:'Stand by at bell'});assert.equal(s.pending,true);
 s=reduce(s,{type:'exit'});assert.equal(s.calling,false);assert.equal(s.note,'Stand by at bell');
});

import {readFileSync} from 'node:fs';
test('Binder reference copies fixed page and department tokens exactly',()=>{
 const canonical=JSON.parse(readFileSync('design-system/tokens.json','utf8')).color.tokens;
 const actual=JSON.parse(readFileSync('packages/flow-theme/examples/binder-tokens.json','utf8'));
 for(const [name,value] of Object.entries(actual))assert.equal(value,canonical.find(t=>t.name===name).value);
});
