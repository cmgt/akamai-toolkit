'use strict';

const { types } = require('putout');

const { isArrayExpression, isIdentifier } = types;

module.exports.report = () => `Find fill sensot entry point`;

module.exports.fix = ({ path }) => {
    console.info('sensor_data:\n', path.toString());
};

module.exports.traverse = ({ push }) => ({
    AssignmentExpression: (path) => {
        const { node } = path;
        const { left, right, operator } = node;

        if (
            isIdentifier(left) &&
            isArrayExpression(right) &&
            operator === '=' &&
            right.elements.length === 56
        ) {
            push({ path });
        }
    },
});
