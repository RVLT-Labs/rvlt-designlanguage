import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const ui=n=>read('packages/flow-theme/registry/rvlt/ui/'+n+'.tsx');
test('combobox explicitly names its trigger with the visible selection',()=>{
 assert.ok(ui('combobox').includes('aria-label={triggerLabel}'));
});
test('scheduler accessible detail retains visible clash and unavailable instructions',()=>{
 const s=ui('crew-scheduler');
 const detail=s.slice(s.indexOf('function detail'),s.indexOf('return <section'));
 assert.ok(detail.includes('Clash. Review both assignments.'));
 assert.ok(detail.includes('Unavailable. Review assignment.'));
});
test('stepper uses natural stage and state naming without a numeric override',()=>{
 const s=ui('stepper');
 assert.doesNotMatch(s,/aria-label=\{`/);
 assert.ok(s.includes('<span className="sr-only">{stateText[s.state]}</span>'));
});
test('root overflowing code is a named keyboard scroll region',()=>{
 const blocks=[...read('index.html').matchAll(/<pre\b[^>]*>/g)];
 assert.ok(blocks.length);
 for(const [tag] of blocks){
  assert.match(tag,/tabindex="0"/);assert.match(tag,/role="region"/);
  assert.match(tag,/aria-label="[^"]+"/);
 }
});
test('marketing link uses readable underlined ink on paper-2',()=>{
 assert.ok(read('index.html').includes('.layers li.marketing a{color:var(--ink-2);text-decoration:underline}'));
});
test('legacy note and brand have a header landmark and promoted tab uses action red',()=>{
 const s=read('examples/static-catalogue/index.html');
 assert.match(s,/<body>\s*<header>\s*<p/);
 assert.ok(s.indexOf('</header>')>s.indexOf('class="brand"'));
 assert.match(s,/\.plan\.cream \.tab\{[^}]*background:var\(--action-red\)/);
});
