'use strict';

const putout = require('putout');
const fs = require('node:fs');
const path = require('node:path');

let input = 'uL3wVCwk.js';
const source = fs.readFileSync(path.join(__dirname, input), {
    encoding: 'utf8',
});

const res = putout(source, {
    plugins: [
        [
            'putout-plugin-find-sensors-entry',
            require('./rules/putout-plugin-find-sensors-entry'),
        ],
    ],
});

console.debug('stop');
