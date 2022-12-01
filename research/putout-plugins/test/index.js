const evalExpr = require('../putout-plugin-evaluate-expression');
const test = require('@putout/test')(__dirname, {
    'evaluate-expression': evalExpr,
});

// this is how we test that messages is correct
test('evaluate-expression: report', (t) => {
    t.reportCode('evaluate-expression', 'evaluate expression');
    t.end();
});

// statement should be removed so result is empty
test('evaluate-expression: transformCode', (t) => {
    t.transform('../../out.js');
    t.end();
});