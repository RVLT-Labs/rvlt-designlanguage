import {existsSync,realpathSync,readdirSync} from 'node:fs';
import path from 'node:path';

// Resolve existing ancestors too: a nonexistent output below a symlink still aliases inputs.
function canonical(p) {
 p=path.resolve(p);
 if(existsSync(p))return realpathSync(p);
 const parent=path.dirname(p);
 return path.join(canonical(parent),path.basename(p));
}
const contains=(parent,child)=>{
 const rel=path.relative(parent,child);
 return rel===''||(!rel.startsWith(`..${path.sep}`)&&rel!=='..'&&!path.isAbsolute(rel));
};
export function assertSafeOutput(output,{repo,inputs=[]}) {
 const out=canonical(output),root=canonical(repo);
 // _site is the conventional generated destination; every other existing repository
 // entry is protected, including hidden configuration and optional build inputs.
 const protectedPaths=readdirSync(root).filter(name=>name!=='_site').map(name=>canonical(path.join(root,name)));
 if(contains(out,root)||[...protectedPaths,...inputs.filter(Boolean).map(canonical)].some(input=>contains(out,input)||contains(input,out)))
  throw new Error(`Unsafe site output overlaps repository or build inputs: ${output}`);
}
