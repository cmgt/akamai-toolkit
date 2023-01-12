"use strict";

const { types, operator } = require("putout");
const { valueToNode, isLiteral, isIdentifier } = types;

const { replaceWith, compute } = operator;

module.exports.report = () => `evaluate expressions`;

function isSimpleArrayAccess(node) {
  return (
    node.isMemberExpression() &&
    node.computed &&
    node.object.type == "Identifier" &&
    node.property.type == "NumericLiteral"
  );
}

module.exports.fix = ({ path }) => {
  const { node } = path;
  if (isSimpleArrayAccess(node)) {
    //replaceWith(path, actualVal);
  }
};

module.exports.traverse = ({ push }) => ({
  VariableDeclarator: (path) => {
    const { node } = path;
    if (
      node.type === "VariableDeclarator" &&
      node.binding.type === "BindingIdentifier" &&
      node.init != null &&
      node.init.type === "ArrayExpression" &&
      node.init.elements.find((e) => e && !e.type.includes("Literal")) ===
        undefined
    ) {
      push(path);
    }
  },
});
