const evalExpr = require('../putout-plugin-evaluate-expression');
const {createTest} = require('@putout/test');

const test = createTest(__dirname, {
    'evaluate-expression': evalExpr,
});

// this is how we test that messages is correct
test('evaluate-expression: report', (t) => {
    t.reportCode('evaluate-expression', 'evaluate expression');
    t.end();
});

// statement should be removed so result is empty
test('evaluate-expression: transformCode', (t) => {
    t.transformCode(`
    function IfT() {
        wJ = 4 + 10 + 6 * 10 * 10,
        jx = 1 + 8 * 10 + 6 * 10 * 10;
}
    `);
    t.end();
});