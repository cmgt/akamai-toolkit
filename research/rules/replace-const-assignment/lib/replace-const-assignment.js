'use strict';

const {
    types,
    operator,
} = require('putout');

const {NumericLiteral} = types;

const fixKeys = [
    'arguments',
    'right',
    'test',
    'elements',
];

const {replaceWith} = operator;

module.exports.report = () => `replace const assignment`;

module.exports.fix = ({path, leftPath, rightPath}) => {
    const rightNode = rightPath.node;
    const {name} = leftPath.node;
    
    const binding = path.scope.getBinding(name);
    
    if (!binding?.referenced)
        return;
    
    const {referencePaths} = binding;
    
    for (const rPath of referencePaths) {
        if (rPath.isIdentifier() && (rPath.parentPath.isBinaryExpression() && (rPath.key === 'right' || rPath.parent.operator in ['+', '*', '-']))
        //fixKeys.includes(rPath.inList ? rPath.listKey : rPath.key)
        ) {
            replaceWith(rPath, NumericLiteral(rightNode.value));
        }
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
    
    // VariableDeclarator: (path) => {
    //     const leftPath = path.get('id');
    //     const rightPath = path.get('init');
    
    //     if (leftPath.isIdentifier() && rightPath.isNumericLiteral()) {
    //         push({
    //             path,
    //             leftPath,
    //             rightPath,
    //         });
    //     }
    // },
});

