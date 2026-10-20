import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('Card installation declares every external import without preview dependencies',()=>{
 const registry=JSON.parse(readFileSync('packages/flow-theme/registry.json'));
 const card=registry.items.find(i=>i.name==='card');
 const dependencies=new Set(['react',...(card.dependencies??[])]);
 for(const f of card.files){
  const source=readFileSync(`packages/flow-theme/${f.path}`,'utf8');
  for(const [,specifier] of source.matchAll(/from "([^".][^"]*)"/g)){
   if(specifier.startsWith('@/'))continue;
   const pkg=specifier.startsWith('@')?specifier.split('/').slice(0,2).join('/'):specifier.split('/')[0];
   assert.ok(dependencies.has(pkg),`isolated Card missing dependency: ${pkg}`);
  }
 }
});
