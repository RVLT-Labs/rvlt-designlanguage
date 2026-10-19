// react/jsx-runtime over React.createElement (React 18 global).
var React = window.React;
function jsx(type, props, key) {
  var p = {};
  var children;
  for (var k in props) {
    if (k === "children") children = props[k];
    else p[k] = props[k];
  }
  if (key !== undefined) p.key = key;
  if (children === undefined) return React.createElement(type, p);
  return Array.isArray(children)
    ? React.createElement.apply(null, [type, p].concat(children))
    : React.createElement(type, p, children);
}
module.exports = { jsx: jsx, jsxs: jsx, jsxDEV: jsx, Fragment: React.Fragment };
