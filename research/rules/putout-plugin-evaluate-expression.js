"use strict";

const { types, operator } = require("putout");
const { valueToNode } = types;

const { replaceWith } = operator;

module.exports.report = () => `evaluate expressions`;

module.exports.fix = ({ path, actualVal }) => {
    replaceWith(path, actualVal);
};

module.exports.traverse = ({ push }) => ({
  'BinaryExpression|UnaryExpression': (path) => {
    const { confident, value } = path.evaluate();
    if (!confident) {
      return;
    }
    const actualVal = valueToNode(value);
    push({ path, actualVal });
  },
});
