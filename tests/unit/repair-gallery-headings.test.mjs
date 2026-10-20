import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
test('gallery README rendering starts at h2 and preserves subsequent hierarchy',()=>{
 const src=readFileSync('scripts/design-system/site/index.html','utf8');
 const renderer=src.slice(src.indexOf('  function renderMarkdown'),src.indexOf('  var REPO'));
 const context={esc:s=>s};vm.createContext(context);vm.runInContext(renderer,context);
 const readme=readFileSync('design-system/README.md','utf8');
 const output=context.renderMarkdown(readme);
 const headings=[...output.matchAll(/<h([2-6])>/g)].map(m=>Number(m[1]));
 assert.equal(headings[0],2);
 for(let i=1;i<headings.length;i++)assert.ok(headings[i]<=headings[i-1]+1);
 const card=context.renderMarkdown('# Card\n## Usage\n### Details');
 assert.match(card,/<h2>Card<\/h2>.*<h3>Usage<\/h3>.*<h4>Details<\/h4>/s);
});
