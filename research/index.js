'use strict';

const putout = require('putout');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'akamai.js'), {encoding:'utf-8'});

const res = putout(source, {
    plugins: [
        // 'remove-unused-variables',
        // 'remove-unused-expressions',
        // 'remove-unreachable-code',
        // 'remove-nested-blocks'
        'remove-useless-escape',
        'convert-apply-to-spread',
        'convert-arguments-to-rest',
        'convert-to-arrow-function',
        'convert-quotes-to-backticks',
        //'math/apply-exponentiation',
        //'math/apply-numeric-separators'
    ],
});

fs.writeFileSync(path.join(__dirname, 'out.js'), res.code, {encoding: 'utf-8'});