"use strict";

const { types, operator } = require("putout");
const { valueToNode, isLiteral, isMemberExpression } = types;

const { replaceWith, extract } = operator;

module.exports.report = () => `array unpack`;

function isSimpleArrayAccess(node) {
  return (
    isMemberExpression(node) &&
    node.computed &&
    node.object.type == "Identifier" &&
    node.property.type == "NumericLiteral"
  );
}

module.exports.fix = ({ path, name, array }) => {
  const binding = path.scope.getBinding(name);
  if (!binding?.referenced) return;

  const { referencePaths } = binding;

  referencePaths.forEach((rPath) => {
    const node = rPath.parent;
    if (isSimpleArrayAccess(node)) {
      const index = node.property.value;
      const replacement = array.elements[index];

      try {
        replaceWith(rPath.parentPath, replacement);
      } catch (e) {
        console.log(e, path, name);
      }
    }
  });
};

module.exports.traverse = ({ push }) => ({
  VariableDeclarator: (path) => {
    const { node } = path;
    if (      
      node.init?.type === "ArrayExpression" &&
      node.init.elements.length > 0 &&
      node.init.elements.find((e) => e && !e.type.includes("Literal")) ===
        undefined
    ) {
      push({ path, name: extract(path.get("id")), array: node.init });
    }
  },

  AssignmentExpression: (path) => {
    const { node } = path;
    if (
      node.left?.type === 'Identifier' &&      
      node.right?.type === "ArrayExpression" &&
      node.right.elements.length > 0 &&
      node.right.elements.find((e) => e && !e.type.includes("Literal")) ===
        undefined
    ) {
      push({ path, name: extract(path.get("left")), array: node.right });
    }
  },
});
