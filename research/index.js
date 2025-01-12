'use strict';

const putout = require('putout');
const fs = require('node:fs');
const path = require('node:path');
var beautify = require('js-beautify').js;

let input = 'test.js';
//input = "akamai_sephora_2.js";
input = 'out.js';
input = 's0.js';
const output = 'out.js';
const source = fs.readFileSync(path.join(__dirname, input), {
    encoding: 'utf8',
});

const res = putout(source, {
    //rulesdir: 'rules',
    plugins: [
        //'convert-apply-to-spread',
        //'convert-arguments-to-rest',
        //'convert-to-arrow-function',
        //'convert-quotes-to-backticks',
        //'math/apply-exponentiation',
        //'math/apply-numeric-separators'

        //['convert-jsfuck', require('./rules/putout-plugin-convert-jsfuck.js')],
        //['convert-string', require('./rules/putout-plugin-convert-string.js')],
        [
            'replace-const-assignment',
            require('./rules/putout-plugin-replace-const-assignment'),
        ],
        [
            'evaluate-expression',
            require('./rules/putout-plugin-evaluate-expression'),
        ],
        //['replace-math-func', require('./rules/putout-plugin-replace-math-func')],
        //["replace-func-call", require("./rules/putout-plugin-replace-func-call")],
        ['array-unpack', require('./rules/putout-plugin-array-unpacker')],
        //["putout-plugin-replace-proxy-func", require("./rules/putout-plugin-replace-proxy-func")],
        //["putout-plugin-bracket-to-dot", require("./rules/putout-plugin-bracket-to-dot")],
        // [
        //     'putout-plugin-replace-func-variable-call',
        //     require('./rules/putout-plugin-replace-func-variable-call'),
        // ],
        [
            'putout-plugin-simplify-calls',
            require('./rules/putout-plugin-simplify-calls'),
        ],

        // "remove-unused-variables",
        // "remove-unused-expressions",
        // "remove-unreachable-code",
        // "remove-nested-blocks",
        // "remove-unreferenced-variables",
        // 'remove-useless-escape',
        // "remove-useless-functions",
    ],
});

const code = beautify(res.code, { indent_size: 2, space_in_empty_paren: true });

if (input === 'out.js') {
    fs.writeFileSync(
        path.join(__dirname, 'out', Date.now() + '.' + output),
        code,
        {
            encoding: 'utf8',
        }
    );

    fs.writeFileSync(path.join(__dirname, output), code, { encoding: 'utf8' });
} else {
    fs.writeFileSync(path.join(__dirname, input), code, {
        encoding: 'utf8',
    });
}

console.debug('stop');
