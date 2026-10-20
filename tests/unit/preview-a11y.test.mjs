import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('preview navigation has a phone section menu and named icon actions',()=>{
 const s=read('apps/preview-v2/src/components/preview-page.tsx');
 for(const re of [/aria-label="Preview sections"/,/aria-label="Equipment tools"/,/aria-label="More actions"/,/aria-label="Notifications"/,/aria-label="Search example"/,/size-11 items-center/,/<h2 className="font-display font-extrabold text-\[22px\]/]) assert.match(s,re);
 assert.doesNotMatch(s,/cursor-pointer/);
});
test('unavailable or overlapping destinations cannot be assigned a call',async()=>{
 const {canAssign}=await import('../../packages/flow-theme/registry/rvlt/lib/scheduler.mjs');
 const shift={id:'a',startHour:22,endHour:2};
 assert.equal(canAssign({unavailable:true,shifts:[]},shift),false);
 assert.equal(canAssign({shifts:[{id:'b',startHour:23,endHour:24}]},shift),false);
 assert.equal(canAssign({shifts:[{id:'b',startHour:8,endHour:10}]},shift),true);
});
