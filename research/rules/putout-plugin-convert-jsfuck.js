'use strict';

module.exports.report = () => `JSFuck convert`;

module.exports.replace = () => ({
    '[] + [][[]]':"'undefined'",
    "'' + [][[]]":"'undefined'",
    '[] + []':"''",
});

