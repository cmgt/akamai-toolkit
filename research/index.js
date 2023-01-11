"use strict";

const putout = require("putout");
const fs = require("node:fs");
const path = require("node:path");
var beautify = require("js-beautify").js;

let input = "test.js";
input = "akamai_sephora_2.js";
const output = "out.js";
const source = fs.readFileSync(path.join(__dirname, input), {
  encoding: "utf8",
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
    //['convert-string', require('./putout-plugins/putout-plugin-convert-string.js')],
    //['replace-const-assignment', require('./rules/replace-const-assignment/lib/replace-const-assignment')],
    //['evaluate-expression', require('./rules/putout-plugin-evaluate-expression')],
    //['replace-math-func', require('./rules/putout-plugin-replace-math-func')],
    ["replace-func-call", require("./rules/putout-plugin-replace-func-call")],

    //"remove-unused-variables",
    //"remove-unused-expressions",
    //  'remove-unreachable-code',
    // 'remove-nested-blocks',
    // 'remove-unreferenced-variables',
    //'remove-useless-escape',
    //"remove-useless-functions",
  ],
});

console.debug("stop");

fs.writeFileSync(
  path.join(__dirname, output),
  beautify(res.code, { indent_size: 2, space_in_empty_paren: true }),
  { encoding: "utf8" }
);
