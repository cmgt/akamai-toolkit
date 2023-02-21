'use strict';

const {deobfuscate} = require('js-deobfuscator');
const fs = require('node:fs');
const path = require('node:path');

const file = 'akamai_sephora.com.js';
const source = fs.readFileSync(path.join(__dirname, 'in', file), {encoding:'utf8'});

const config = {
    verbose: true,
    arrays: {
        unpackArrays: true,
        removeArrays: true
    },
    proxyFunctions: {
        replaceProxyFunctions: true,
        removeProxyFunctions: true
    },
    expressions: {
        simplifyExpressions: true,
        removeDeadBranches: true
    },
    miscellaneous: {
        beautify: true,
        simplifyProperties: true,
        renameHexIdentifiers: true
    }
};

const dest = deobfuscate(source, config);

fs.writeFileSync(path.join(__dirname, 'out', file), dest, {encoding: 'utf8'});