'use strict';

const {
    types,
    operator,
} = require('putout');

const {NumericLiteral} = types;

const {replaceWith} = operator;

module.exports.report = () => `evaluate expressions`;

module.exports.replace = () => ({
    BinaryExpression: (a, path) => {
        const leftPath = path.get('left');
        const rightPath = path.get('right');
        
        if (leftPath.isNumericLiteral() && rightPath.isNumericLiteral()) {
            return replaceWith(path, NumericLiteral(1));
        }
        
        return path.node;
    },
});

