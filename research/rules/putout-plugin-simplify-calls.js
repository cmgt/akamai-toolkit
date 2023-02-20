"use strict";

const { operator, types } = require("putout");
const { callExpression } = types;
const { replaceWith } = operator;

module.exports.report = () =>
  `Remove unnecessary usage of '.call(this' or '.apply(this' when calling a function`;

module.exports.fix = ({ path }) => {
  const { node: c } = path;
  const args =
    (c.callee.property?.name || c.callee.property?.value) === "apply"
      ? c.arguments[1].elements
      : c.arguments.slice(1);

  replaceWith(
    path,
    callExpression(
      c.callee.object,
      Array.isArray(args) ? args : args ? [args] : []
    )
  );
};

module.exports.traverse = ({ push }) => ({
  CallExpression: (path) => {
    const { node: n } = path;
    if (
      n.arguments.length &&
      (n.arguments[0].type === "ThisExpression" ||
        n.arguments[0].type === "NullLiteral") &&
      n.callee.type === "MemberExpression" &&
      ["apply", "call"].includes(
        n.callee.property?.name || n.callee.property?.value
      ) &&
      (n.callee.object?.name || n.callee?.value) !== "Function" &&
      !/function/i.test(n.callee.object.type)
    ) {
      push({ path });
    }
  },
});
