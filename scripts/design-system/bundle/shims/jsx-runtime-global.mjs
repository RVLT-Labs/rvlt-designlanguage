// Gallery uses the existing React 18 global and its matching renderer.
export const Fragment=window.React.Fragment;
export function jsx(type,props,key) {
 const next={...props};if(key!==undefined)next.key=key;
 return window.React.createElement(type,next);
}
export const jsxs=jsx;
export const jsxDEV=jsx;
