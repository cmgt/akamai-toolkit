"use strict";

const putout = require("putout");
const fs = require("node:fs");
const path = require("node:path");
var beautify = require("js-beautify").js;

let input = "test.js";
//input = "akamai_sephora_2.js";
input = "out.js";
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
    ['replace-const-assignment', require('./rules/putout-plugin-replace-const-assignment')],
    // [
    //   "evaluate-expression",
    //   require("./rules/putout-plugin-evaluate-expression"),
    // ],
    //['replace-math-func', require('./rules/putout-plugin-replace-math-func')],
    //["replace-func-call", require("./rules/putout-plugin-replace-func-call")],

    //"remove-unused-variables",
    //"remove-unused-expressions",
    //  'remove-unreachable-code',
    // 'remove-nested-blocks',
    // 'remove-unreferenced-variables',
    //'remove-useless-escape',
    //"remove-useless-functions",
  ],
});

const code = beautify(res.code, { indent_size: 2, space_in_empty_paren: true });

if (input !== "test.js") {
  fs.writeFileSync(path.join(__dirname, "out", Date.now() + output), code, {
    encoding: "utf8",
  });
}

fs.writeFileSync(path.join(__dirname, output), code, { encoding: "utf8" });

console.debug("stop");
