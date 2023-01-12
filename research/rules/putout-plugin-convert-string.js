"use strict";

const { types, operator } = require("putout");
const { valueToNode } = types;
const { replaceWith } = operator;

module.exports.report = () => `convert string`;

module.exports.fix = ({ path }) => {
  replaceWith(path, valueToNode(path.node.value));
};

module.exports.traverse = ({ push }) => ({
  StringLiteral: (path) => {
    const value = path.node.raw;
    if (value && value.includes("\\")) {
      push({ path });
    }
  },
});
