'use strict';

const {
    types,
    operator,
} = require('putout');

const {NumericLiteral} = types;

const {replaceWith} = operator;

module.exports.report = () => `evaluate expressions`;

module.exports.fix = ({path, leftPath, rightPath, operator}) => {
    const leftNode = leftPath.node;
    const rightNode = rightPath.node;
    
    switch(operator) {
    case '+':
        replaceWith(path, NumericLiteral(leftNode.value + rightNode.value));
        break;
    
    case '*':
        replaceWith(path, NumericLiteral(leftNode.value * rightNode.value));
        break;
    
    case '-':
        replaceWith(path, NumericLiteral(leftNode.value - rightNode.value));
        break;
    
    case '/':
        replaceWith(path, NumericLiteral(leftNode.value / rightNode.value));
        break;
    }
};

module.exports.traverse = ({push}) => ({
    BinaryExpression: (path) => {
        const leftPath = path.get('left');
        const rightPath = path.get('right');
        const {operator} = path.node;
        
        if (leftPath.isNumericLiteral() && rightPath.isNumericLiteral()) {
            push({
                path,
                operator,
                leftPath,
                rightPath,
            });
        }
    },
});

