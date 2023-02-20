"use strict";

const { operator } = require("putout");
const { types } = require("putout");

const { replaceWith, getBinding, remove } = operator;

module.exports.report = () => `replace func variable call`;

module.exports.fix = ({ path, id, funcExpression }) => {  
  const binding = getBinding(path, id.node);

  if (!binding?.referenced || !binding.constant) return;

  const { referencePaths } = binding;
  const newId = funcExpression.get("id");

  for (const rPath of referencePaths) {
    try {
      if (rPath.parentPath.isCallExpression()) {
        replaceWith(rPath, newId);
      }
    } catch (e) {
      console.log({ e, rPath });
    }
  }
};

module.exports.traverse = ({ push }) => ({
  VariableDeclarator: (path) => {
    const id = path.get("id");
    const funcExpression = path.get("init");

    if (id.isIdentifier() && funcExpression.isFunctionExpression()) {
      push({
        path,
        id,
        funcExpression,
      });
    }
  },
});
