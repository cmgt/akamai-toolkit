'use strict';

const {operator, types} = require('putout');

const {replaceWith} = operator;
const {NumericLiteral} = types;

module.exports.report = () => `evaluate expression`;

module.exports.replace = () => ({
    BinaryExpression: (path) => {
        const leftPath = path.get('left');
        const rightPath = path.get('right');

        if (leftPath.isNumericLiteral() && rightPath.isNumericLiteral()) {
            replaceWith(path, NumericLiteral(1));
            return '';
        } else {
            return path.node;
        }
    },
});