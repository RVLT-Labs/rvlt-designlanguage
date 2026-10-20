import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const req=createRequire(path.resolve(process.env.RVLT_PREVIEW_DIR ?? 'apps/preview-v2','package.json'));
const ts=req('typescript'),React=req('react');
function loadButton(){
 const source=ts.transpileModule(readFileSync('packages/flow-theme/registry/rvlt/ui/button.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React}}).outputText;
 const exports={};
 vm.runInNewContext(source,{exports,require:(id)=>id==='@/lib/utils'?{cn:(...s)=>s.filter(Boolean).join(' ')}:req(id)});
 return exports.Button;
}
// Render through React and real Radix Slot; Probe records the final child props.
const {renderToStaticMarkup}=req('react-dom/server');
function renderButton(Button,props,childProps){
 let received;
 function Probe(p){received=p;return React.createElement('a',p);}
 renderToStaticMarkup(React.createElement(Button,{...props,children:React.createElement(Probe,childProps,'Save')}));
 return {props:received};
}
for(const state of ['disabled','loading'])test(`${state} asChild blocks child handlers and overrides child state`,()=>{
 const Button=loadButton();let childCalls=0,parentCalls=0;
 const el=renderButton(Button,{asChild:true,[state]:true,onClick:()=>parentCalls++},{href:'#saved',tabIndex:0,'aria-disabled':false,'aria-busy':false,onClick:()=>childCalls++,onKeyDown:()=>childCalls++});
 assert.equal(el.props.tabIndex,-1);assert.equal(el.props['aria-disabled'],true);
 if(state==='loading')assert.equal(el.props['aria-busy'],true);
 const event={key:'Enter',preventDefault(){this.defaultPrevented=true;},stopPropagation(){}};
 el.props.onClick(event);el.props.onKeyDown?.(event);
 assert.equal(childCalls,0);assert.equal(parentCalls,0);assert.equal(event.defaultPrevented,true);
});
test('active asChild preserves child-first composition and child tabIndex',()=>{
 const Button=loadButton(),calls=[];
 const el=renderButton(Button,{asChild:true,onClick:()=>calls.push('parent')},{tabIndex:2,onClick:()=>calls.push('child')});
 el.props.onClick({});assert.deepEqual(calls,['child','parent']);assert.equal(el.props.tabIndex,2);
});
