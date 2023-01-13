"use strict";

const { operator } = require("putout");
const { types } = require("putout");

const { replaceWith } = operator;
const { isBlockStatement, isReturnStatement } = types;

module.exports.report = () => `replace proxy func`;

module.exports.fix = ({ path, id, body }) => {
  const { name } = id.node;
  const binding = path.scope.getBinding(name);

  if (!binding?.referenced) return;

  const statements = body.get("body");
  let target = body;
  if (statements.length === 1) {
    if (isReturnStatement(statements[0])) {
        target = statements[0].get('argument');
    } else {
      target = statements[0];
    }
  }

  const { referencePaths } = binding;

  for (const rPath of referencePaths) {
    try {
      if (rPath.key === "callee") {
        replaceWith(rPath.parentPath, target);
      }
    } catch (e) {
      console.log({ e, rPath, name });
    }
  }
};

module.exports.traverse = ({ push }) => ({
  FunctionDeclaration: (path) => {
    const id = path.get("id");
    const body = path.get("body");
    const params = path.get("params");

    if (params.length === 0) {
      push({
        path,
        id,
        body,
      });
    }
  },
  VariableDeclarator: (path) => {
    const id = path.get("id");
    const rightPath = path.get("init");

    if (
      id.isIdentifier() &&
      rightPath.isFunctionExpression() &&
      rightPath.get("params").length === 0
    ) {
      push({
        path,
        id,
        body: rightPath.get("body"),
      });
    }
  },
});
