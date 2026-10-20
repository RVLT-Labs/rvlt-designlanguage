// Project-local TypeScript compiler, supplied by the preview application's locked dependencies.
module.exports=function(source) {
 const ts=require(this.getOptions().typescript);
 return ts.transpileModule(source,{fileName:this.resourcePath,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2019,module:ts.ModuleKind.ESNext}}).outputText;
};
