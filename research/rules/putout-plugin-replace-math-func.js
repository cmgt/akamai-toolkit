'use strict';

module.exports.report = () => `replace math funcs`;

module.exports.replace = () => ({
    'sum(__a, __b)':'__a + __b',
    'subtract(__a, __b)':'__a - __b',
    'equal(__a, __b)':'__a == __b',
    'notEqual(__a, __b)':'__a !== __b',
    'notEqual1(__a, __b)':'__a != __b',
    'lessOrEqual(__a, __b)':'__a <= __b',
    'div(__a, __b)':'__a / __b',
    'bitwiseXOR(__a, __b)':'__a ^ __b',
    'and(__a, __b)':'__a & __b',
    'or(__a, __b)':'__a | __b',
    'shiftRight(__a, __b)':'__a >> __b',
    'shiftLeft(__a, __b)':'__a << __b',
    'great(__a, __b)':'__a > __b',
    'less(__a, __b)':'__a < __b',
    'in_op(__a, __b)':'__a in __b',

    'bitwiseNOT(__a)':'~__a',    
    'not(__a)':'!__a',    

    'toString(__a)':'__a.toString()',
    //'self(__a)':'+__a',
    'neg(__a)':'-__a',
});