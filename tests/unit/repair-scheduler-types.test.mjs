import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
// Only the compiler is needed; no React, Next, or preview tsconfig participates.
const tsc=process.env.RVLT_TSC ?? path.resolve('apps/preview-v2/node_modules/typescript/bin/tsc');
test('scheduler installs into a strict TS consumer with allowJs disabled',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'rvlt-scheduler-'));
 try{
  const registry=JSON.parse(readFileSync('packages/flow-theme/registry.json','utf8'));
  for(const f of registry.items.find(i=>i.name==='crew-scheduler').files.filter(f=>f.path.includes('/lib/scheduler')))
   cpSync(`packages/flow-theme/${f.path}`,path.join(dir,path.basename(f.path)));
  writeFileSync(path.join(dir,'consumer.ts'),`import {layoutShifts,canAssign,formatHour} from './scheduler';
const shifts=[{id:'a',startHour:8,endHour:9,title:'Call'}];
const title:string=layoutShifts(shifts)[0].shift.title;
const allowed:boolean=canAssign({shifts},shifts[0]);
const label:string=formatHour(8);
// @ts-expect-error invalid hours must fail
layoutShifts([{id:'bad',startHour:'8',endHour:9}]);`);
  const r=spawnSync(process.execPath,[tsc,'--strict','--noEmit','--allowJs','false','--moduleResolution','bundler','--module','esnext','--target','es2020',path.join(dir,'consumer.ts')],{encoding:'utf8'});
  assert.equal(r.status,0,r.stdout+r.stderr);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
import {readFileSync} from 'node:fs';
