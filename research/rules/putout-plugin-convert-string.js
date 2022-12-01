'use strict';

module.exports.report = () => `string convert`;

module.exports.replace = () => ({   
    '"__a"': ({__a}, path) => {                       
        path.node.raw = __a;
        return path.node;
    },  
});
