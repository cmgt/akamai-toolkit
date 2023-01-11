"use strict";

const { types, operator } = require("putout");
const { valueToNode, isLiteral, isIdentifier } = types;

const { replaceWith, compute } = operator;

module.exports.report = () => `evaluate expressions`;

module.exports.fix = ({ path, actualVal }) => {
  replaceWith(path, actualVal);
};

module.exports.traverse = ({ push }) => ({
  "BinaryExpression|UnaryExpression": (path) => {
    const [result, value] = compute(path);
    if (!result) {
      return;
    }
    const actualVal = valueToNode(value);
    if (isLiteral(actualVal) || isIdentifier(actualVal)) {
      push({ path, actualVal });
    }
  },
});
