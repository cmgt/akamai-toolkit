"use strict";

const { types, operator } = require("putout");
const operators = ["+", "*", "-", "/"];

const { replaceWith } = operator;
const { valueToNode, isUpdateExpression, isAssignmentExpression } = types;

module.exports.report = () => `replace const assignment`;

module.exports.fix = ({ path, leftPath, rightPath }) => {
  const rightNode = rightPath.node;
  const { name } = leftPath.node;

  const binding = path.scope.getBinding(name);

  if (!binding?.referenced) return;

  const { referencePaths } = binding;

  const targetNodes = [];

  for (const rPath of referencePaths) {
    if (
      rPath.isIdentifier() &&
      ((rPath.parentPath.isBinaryExpression() &&
        (rPath.key === "right" || operators.includes(rPath.parent.operator))) ||
        rPath.parentPath.isArrayExpression() ||
        rPath.parentPath.isMemberExpression() ||
        rPath.parentPath.isCallExpression() ||
        rPath.parentPath.isVariableDeclarator() ||
        rPath.parentPath.isSwitchCase() ||
        rPath.parentPath.isReturnStatement() ||
        (isAssignmentExpression(rPath.parent) && rPath.key === "right"))
    ) {
      targetNodes.push(rPath);
    } else if (
      rPath.parentPath.isUnaryExpression() &&
      rPath.parent.operator === "-"
    ) {
      targetNodes.push(rPath.parent.argument);
    } else if (
      isUpdateExpression(rPath.parent) ||
      (isAssignmentExpression(rPath.parent) && rPath.key === "left")
    ) {
      return;
    }
  }

  const sourceNode = valueToNode(rightNode.value);
  targetNodes.forEach((node) => replaceWith(node, sourceNode));
};

module.exports.traverse = ({ push }) => ({
  AssignmentExpression: (path) => {
    const leftPath = path.get("left");
    const rightPath = path.get("right");

    if (leftPath.isIdentifier() && rightPath.isNumericLiteral()) {
      push({
        path,
        leftPath,
        rightPath,
      });
    }
  },

  VariableDeclarator: (path) => {
    const leftPath = path.get("id");
    const rightPath = path.get("init");

    if (leftPath.isIdentifier() && rightPath.isNumericLiteral()) {
      push({
        path,
        leftPath,
        rightPath,
      });
    }
  },
});
