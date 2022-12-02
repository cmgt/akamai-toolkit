'use strict';

const {createTest} = require('@putout/test');
const plugin = require('..');
const test = createTest(__dirname, {
    'replace-const-assignment': plugin,
});

test('replace-const-assignment: report', (t) => {
    t.reportCode('debugger', `Unexpected 'debugger' statement`);
    t.end();
});

test('remove debugger: transformCode', (t) => {
    t.transformCode(`replace-const-assignment`, '');
    t.end();
});

