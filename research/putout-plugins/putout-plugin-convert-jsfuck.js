'use strict';

module.exports.report = () => `JSFuck convert`;

module.exports.replace = () => ({
    '+!+[]': '1',
    '+[]': '0',
    '[1]+[0]':'10',
    '!0': '1',
    '!1': '0',
});

