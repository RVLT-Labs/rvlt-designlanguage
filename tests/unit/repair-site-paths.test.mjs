import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
// Importing the guard performs no deletion or builds. Never invoke unsafe legacy CLI paths.
test('site output guard rejects source overlap, ancestors and symlink aliases before deletion',async()=>{
 const {assertSafeOutput}=await import('../../scripts/site/output-path.mjs');
 const dir=mkdtempSync(path.join(tmpdir(),'rvlt-paths-'));
 try{
  const repo=path.join(dir,'repo');mkdirSync(repo);
  for(const name of ['examples','assets','scripts','packages','apps','design-system'])mkdirSync(path.join(repo,name));
  writeFileSync(path.join(repo,'index.html'),'preserved');
  const preview=path.join(dir,'preview');mkdirSync(preview);
  const registry=path.join(dir,'registry');mkdirSync(registry);
  symlinkSync(path.join(repo,'examples'),path.join(dir,'alias'));
  symlinkSync(repo,path.join(dir,'repo-alias'));
  for(const out of [repo,dir,path.dirname(dir),path.join(repo,'examples'),path.join(repo,'examples','out'),path.join(repo,'scripts','out'),preview,path.join(preview,'out'),registry,path.join(dir,'alias','new'),path.join(dir,'repo-alias','assets')]){
   assert.throws(()=>assertSafeOutput(out,{repo,inputs:[preview,registry]}),/overlap|unsafe/i,out);
  }
  for(const out of [path.join(repo,'_site'),path.join(dir,'site'),path.join(dir,'repo-neighbor')])assert.doesNotThrow(()=>assertSafeOutput(out,{repo,inputs:[preview,registry]}));
  assert.equal(readFileSync(path.join(repo,'index.html'),'utf8'),'preserved');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
