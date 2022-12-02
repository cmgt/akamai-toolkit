'use strict';

const {
    types,
    operator,
} = require('putout');

const {replaceWith} = operator;
const {BlockStatement} = types;

module.exports.report = () => `replace const assignment`;

module.exports.fix = ({path, leftPath, rightPath}) => {
    const rightNode = rightPath.node;
    const {name} = leftPath.node;
    
    const binding = path.scope.getBinding(name);
    
    if (!binding?.referenced)
        return;
    
    const {referencePaths} = binding;
    
    for (const rPath of referencePaths) {
        replaceWith(rPath.parentPath, rightNode.body);
    }
};

module.exports.traverse = ({push}) => ({ 
    VariableDeclarator: (path) => {
        const leftPath = path.get('id');
        const rightPath = path.get('init');
        
        if (leftPath.isIdentifier() && rightPath.isFunctionExpression()) {
            push({
                path,
                leftPath,
                rightPath,
            });
        }
    },
});

