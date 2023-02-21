const { stringDecode } = require('./decoder');
const data = require('./input_str.json');

for (const key in data) {
    console.log(stringDecode(data[key], key));
}
