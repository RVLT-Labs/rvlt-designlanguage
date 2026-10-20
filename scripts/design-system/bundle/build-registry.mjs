#!/usr/bin/env node
// Build locally owned gallery primitives. Uses only the preview's locked dependencies.
// node scripts/design-system/bundle/build-registry.mjs [previewDir] [outputDir]
import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url)), ROOT=path.resolve(HERE,'../../..');
const app=path.resolve(process.argv[2]??path.join(ROOT,'apps/preview-v2'));
const out=path.resolve(process.argv[3]??path.join(ROOT,'packages/flow-theme/dist/gallery'));
const req=createRequire(path.join(app,'package.json'));
const nextWebpack=req('next/dist/compiled/webpack/webpack'); nextWebpack.init();
mkdirSync(out,{recursive:true});
await new Promise((resolve,reject)=>nextWebpack.webpack({
 mode:'production',devtool:false,entry:path.join(HERE,'registry-entry.tsx'),
 output:{path:out,filename:'registry-bundle.js'},
 resolve:{extensions:['.tsx','.ts','.mjs','.js'],alias:{'react/jsx-runtime':path.join(HERE,'shims/jsx-runtime-global.mjs'),'react/jsx-dev-runtime':path.join(HERE,'shims/jsx-runtime-global.mjs'),'@/components/ui':path.join(ROOT,'packages/flow-theme/registry/rvlt/ui'),'@/lib':path.join(ROOT,'packages/flow-theme/registry/rvlt/lib')},modules:[path.join(app,'node_modules'),'node_modules']},
 externals:{react:'React','react-dom':'ReactDOM','react-dom/client':'ReactDOM'},
 module:{rules:[{test:/\.tsx?$/,use:{loader:path.join(HERE,'ts-loader.cjs'),options:{typescript:req.resolve('typescript')}}}]},
 optimization:{minimize:false},
},(error,stats)=>{if(error||stats.hasErrors())reject(error??new Error(stats.toString({all:false,errors:true})));else resolve();}));
const postcss=req('postcss'),tw=req('@tailwindcss/postcss');
const globals=readFileSync(path.join(ROOT,'packages/flow-theme/dist/globals.css'),'utf8');
// Globals supplies the complete theme mapping, target roles, motion contract and typography.
const input=`@import "tailwindcss";\n@import "tw-animate-css";\n@source "${path.join(ROOT,'packages/flow-theme/registry/rvlt')}";\n@source "${path.join(ROOT,'design-system/components')}";\n${globals}`;
const result=await postcss([tw({base:app})]).process(input,{from:path.join(app,'registry-gallery.css')});
writeFileSync(path.join(out,'registry-bundle.css'),result.css);
console.log(`Local registry gallery bundle built: ${out}`);
