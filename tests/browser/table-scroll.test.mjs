import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {serve,launch,open,axNode} from './harness.mjs';
let server,browser;
before(async()=>{server=await serve();browser=await launch();});
after(async()=>{await browser?.close();await server?.close();});
test('320px roster overflow is a named keyboard-scrollable region',async()=>{
 const {page,context}=await open(browser,server.url('preview-v2/'),{viewport:'320'});
 const region=page.locator('#data table').first().locator('..');
 assert.equal(await region.getAttribute('tabindex'),'0');
 const node=await axNode(page,region);assert.equal(node.role,'region');assert.ok(node.name);
 await region.focus();assert.ok(await region.evaluate(el=>el===document.activeElement));
 const start=await region.evaluate(el=>el.scrollLeft);
 await page.keyboard.press('ArrowRight');
 await page.waitForFunction(({start})=>document.querySelector('#data table').parentElement.scrollLeft>start,{start});
 await context.close();
});
