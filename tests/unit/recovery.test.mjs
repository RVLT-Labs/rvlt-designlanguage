import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('recovery reference models duplicate scans, undo, pending sync, rejection and explicit retry',async()=>{
 const {initial,reduce}=await import('../../packages/flow-theme/examples/recovery-state.mjs');
 let s=reduce(initial,{type:'scan',tag:'RF-00412'});assert.equal(s.items.length,1);
 s=reduce(s,{type:'scan',tag:'RF-00412'});assert.equal(s.items.length,1);assert.match(s.message,/already/);
 s=reduce(s,{type:'offline'});assert.equal(s.connection,'offline');
 s=reduce(s,{type:'sync'});assert.equal(s.synced,false);
 s=reduce(s,{type:'reconnect'});assert.equal(s.synced,false);
 s=reduce(s,{type:'sync'});assert.equal(s.synced,true);
 s=reduce(s,{type:'return'});assert.equal(s.returned,true);
 s=reduce(s,{type:'undo'});assert.equal(s.returned,false);
 s=reduce(s,{type:'reject'});assert.equal(s.synced,false);assert.match(s.message,/rejected/i);
 s=reduce(s,{type:'scan',tag:'UNKNOWN'});assert.equal(s.items.length,1);assert.match(s.message,/not recognised/);
});
test('scheduler recovery lists both jobs and requires explicit reassign confirmation',()=>{
 const s=readFileSync('packages/flow-theme/examples/scheduler-recovery.tsx','utf8');
 for(const re of [/DialogTitle/,/Review assignments/,/Reassign selected call/,/unavailable:true/,/startHour:22/,/endHour:2/,/9.25/,/onDayChange/])assert.match(s,re);
});
