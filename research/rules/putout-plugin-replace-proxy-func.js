"use strict";

const { operator, types, parse, generate } = require("putout");

const { replaceWith, replaceWithMultiple, traverse, getBinding, remove } =
  operator;
const {
  isBinaryExpression,
  isReturnStatement,
  isUnaryExpression,
  isCallExpression,
} = types;

module.exports.report = () => `replace proxy func`;

module.exports.fix = ({ path, id, body, proxyExpression, params }) => {
  // This will become false if the function is referenced, but not within a CallExpression. In that case, we can't remove the original function, but we can still simplify all calls to it
  let shouldDelete = true;

  const binding = getBinding(path, id);

  if (!binding) {
    return;
  }

  const { constant, referencePaths } = binding;
  // If function is redefined somewhere, don't
  if (!constant) return;

  for (let referencePath of referencePaths) {
    // referencePath will be a path to an Identifier. To check if it's contained in a CallExpression, we should check it's parentPath.
    let { parentPath } = referencePath;

    // Don't delete if referenced, but not in a call expression.
    // This is implemented for sake of generality. Perhaps your obfuscated file has a self-integrity check somewhere idk lol
    if (
      !isCallExpression(parentPath) ||
      (isCallExpression(parentPath) &&
        parentPath.node.callee !== referencePath.node)
    ) {
      shouldDelete = false;
      continue;
    }

    // Clone the expression into it's own AST so we can modify it
    const proxyExpressionCopyAst = parse(generate(proxyExpression).code);

    // This visitor replaces the variables in the proxy expression with the actual arguments. Correct ordering of the arguments is maintained.
    const replaceVarsInExpressionWithArguments = {
      Identifier(_path) {
        for (let i = 0; i < params.length; i++) {
          if (params[i].name == _path.node.name) {
            if (i < parentPath.node.arguments.length) {
              replaceWith(_path, parentPath.node.arguments[i]);
            } else {
              remove(_path);
            }
            return;
          }
        }
      },
    };

    // Execute the visitor
    traverse(proxyExpressionCopyAst, replaceVarsInExpressionWithArguments);

    // Replace the CallExpression with the modified proxy expression
    replaceWithMultiple(parentPath, proxyExpressionCopyAst.program.body);
  }
  if (shouldDelete) {
    remove(path);
  }
};

const checkFunctionBody = (body) => {
  // Check that function has a one-line body, and returns immediately.
  if (!isReturnStatement(body)) return false;

  //const proxyExpression = body.argument;
  // Handle only BinaryExpressions or UnaryExpressions.
  // if (
  //   !isBinaryExpression(proxyExpression) &&
  //   !isUnaryExpression(proxyExpression)
  // )
  //   return false;

  return true;
};

module.exports.traverse = ({ push }) => ({
  FunctionDeclaration: (path) => {
    const { node } = path;
    const { id, body, params } = node;
    if (!checkFunctionBody(body.body[0])) return;

    const proxyExpression = body.body[0].argument;
    push({ path, id, body, proxyExpression, params });
  },

  VariableDeclarator: (path) => {
    const id = path.get("id");
    const rightPath = path.get("init");

    if (!id.isIdentifier() || !rightPath.isFunctionExpression()) {
      return;
    }

    const { body, params } = rightPath.node;
    if (!checkFunctionBody(body.body[0])) return;

    const proxyExpression = body.body[0].argument;
    push({ path, id, body, proxyExpression, params });
  },
});
