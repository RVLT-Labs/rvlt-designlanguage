import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('overnight, adjacent and overlapping assignments have deterministic separate lanes',async()=>{
 const {layoutShifts,formatHour}=await import('../../packages/flow-theme/registry/rvlt/lib/scheduler.mjs');
 const r=layoutShifts([{id:'a',startHour:22,endHour:2},{id:'b',startHour:23,endHour:1},{id:'c',startHour:2,endHour:3}]);
 const a=r.find(s=>s.shift.id==='a'), b=r.find(s=>s.shift.id==='b');
 assert.equal(a.end,26); assert.equal(a.clash,true);assert.equal(b.clash,true);
 assert.notEqual(a.lane,b.lane);
 assert.equal(formatHour(24.25),'12:15am (+1 day)');
 const adjacent=layoutShifts([{id:'a',startHour:8,endHour:9},{id:'b',startHour:9,endHour:9.25}]);
 assert.deepEqual(adjacent.map(s=>[s.clash,s.lane]),[[false,0],[false,0]]);
});
test('scheduler includes phone agenda, day navigation, unavailable labels and full shift names',()=>{
 const s=readFileSync('packages/flow-theme/registry/rvlt/ui/crew-scheduler.tsx','utf8');
 for(const re of [/data-scheduler-agenda/,/onDayChange/,/unavailable/,/formatHour/,/layoutShifts/]) assert.match(s,re);
});
