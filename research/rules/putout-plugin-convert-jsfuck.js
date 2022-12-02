'use strict';

module.exports.report = () => `JSFuck convert`;

module.exports.replace = () => ({
    '[] + [][[]]':"'undefined'",
    "'' + [][[]]":"'undefined'",
    '+!+[]': '1',
    '+!![]': '1',
    '+[]': '0',
    '[1]+[0]':"'10'",
    '!!0': '0',
    '!!1': '1',
    '!!{}': 'true',
    '!{}': 'false',
    '!0': '1',
    '!1': '0',
    '![]': 'false',
    '!true': 'false',
    '!false': 'true'
});

