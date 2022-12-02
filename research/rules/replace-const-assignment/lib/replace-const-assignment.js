'use strict';

const { forInStatement } = require('@babel/types');
const {
    types,
    operator,
} = require('putout');

const {NumericLiteral} = types;

const {replaceWith} = operator;

module.exports.report = () => `replace const assignment`;

module.exports.fix = ({path, leftPath, rightPath}) => {
    const leftNode = leftPath.node;
    const rightNode = rightPath.node;
    const {name} = leftNode;
    
    const binding = path.scope.getBinding(name);

    if (!binding.referenced) return;

    const {referencePaths} = binding;

    for (const rPath of referencePaths) {
        
    }
};

module.exports.traverse = ({push}) => ({
    AssignmentExpression: (path) => {
        const leftPath = path.get('left');
        const rightPath = path.get('right');        
        
        if (leftPath.isIdentifier() && rightPath.isNumericLiteral()) {
            push({
                path,                
                leftPath,
                rightPath,
            });
        }
    },
});

