import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('local gallery overlays getter-only legacy exports while preserving Binder exports',()=>{
 const legacy={};const BinderButton=()=>{};const oldButton=()=>{};const localButton=()=>{};
 Object.defineProperties(legacy,{Button:{enumerable:true,get:()=>oldButton},BinderButton:{enumerable:true,get:()=>BinderButton}});
 const source=readFileSync('scripts/design-system/bundle/registry-entry.tsx','utf8').replace(/^import .*;\n/gm,'');
 const context={window:{Rvlt:legacy}};
 for(const name of ['Button','Badge','Status','Card','Stat','Empty','Skeleton','Input','Textarea','Label','Checkbox','Switch','Tabs','Table','Stepper','Avatar','Kbd','Patch','Header'])context[name]={};
 context.Button={Button:localButton};
 vm.runInNewContext(source,context);
 assert.equal(context.window.Rvlt.Button,localButton);
 assert.equal(context.window.Rvlt.BinderButton,BinderButton);
 assert.equal(legacy.Button,oldButton);
});
