const stringDecode = (source, key) => {
    let result = '';
    for (let index = 0; index < source.length; index++) {
        const a = source.charCodeAt(index);
        const b = key.charCodeAt(index % key.length);
        result += String.fromCharCode(a ^ b);
    }

    return result;
};

module.exports = { stringDecode };
