'use strict';

const {createTest} = require('@putout/test');
const plugin = require('..');
const test = createTest(__dirname, {
    'evaluate-expression': plugin,
});

test('evaluate-expression: report', (t) => {
    t.reportCode('debugger', `Unexpected 'debugger' statement`);
    t.end();
});

test('remove debugger: transformCode', (t) => {
    t.transformCode(`evaluate-expression`, '');
    t.end();
});

