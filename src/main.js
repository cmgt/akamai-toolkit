const fs = require('fs');
const chalk = require('chalk');
const beautify = require('js-beautify')
const path = require('path');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const { deobfuscate } = require('./deobfuscate');
const { fetchAkamaiScript, getVersionFromFile, getAkamaiVersion, printColoredVersion } = require('./akamai-script');
const { toIf } = require('./ternary2if');
const { parse_sensor } = require('./parse-sensor');
const { startPuppeteer, getPuppetteerConfigFromFile } = require('./browser');

const config = require('../config.json');

async function saveDeofbfuscatedFile({target, source}) {

    if (!target.includes("http")) target = "https://" + target;

    const script_obf = source ? {script: fs.readFileSync(path.join(__dirname, '/../in', source), 'utf8'), endpoint: target} : (await fetchAkamaiScript(target));

    if (!script_obf) {
        console.log(chalk.red.underline("Could not fetch Akamai script on target"));
        process.exit(0);
    }
    
    const ver = getVersionFromFile(script_obf.script);
    const script = deobfuscate(script_obf.script);

    console.log("Script version is: " + printColoredVersion(ver));
    console.log("Script location is: " + script_obf.endpoint);

    const filename = "akamai-" + ver + "-" + ((target.match(/\./g) || []).length == 1 ? target.split('.')[0] : target.split('.')[1]).replace("https://", "").replace("http://", "") + ".js";

    try {
        if(!fs.existsSync(__dirname + '/../scripts')) {
            fs.mkdirSync(__dirname + '/../scripts');
        }
    } catch {
        console.log(chalk.red.underline("Could not create ../scripts/ directory"));
        process.exit(0);
    }

    fs.writeFile(__dirname + '/../scripts/' + filename, script, function (err) {
        if (err) { console.log(chalk.red.underline("Could not create ../scripts/" + filename + " file") + "\n" + err); process.exit(0); }

        console.log(chalk.whiteBright.underline(filename) + " successfully created in `scripts` folder");
        process.exit(0);
    });
}

async function checkVersion(target) {

    if (!target.includes("http")) target = "https://" + target;

    return getAkamaiVersion(target, log=true);
}

async function checkVersions() {
    await Promise.all(config.sites.map(async (site) => {
        await getAkamaiVersion(site, log = true);
    }))
}

async function ternary2if() {
    rl.question('Ternary to convert: ', (ternary) => {
        if (ternary == "") { rl.close(); process.exit(0); }

        let js_raw = "";
        try { js_raw = toIf(ternary); }
        catch { console.log(chalk.red.underline("Malformed ternary expression")); rl.close(); process.exit(0); }

        console.log(chalk.whiteBright.bold("\n-------------------------"));
        console.log(chalk.whiteBright.bold(beautify(js_raw, { indent_size: 2, space_in_empty_paren: true })));
        console.log(chalk.whiteBright.bold("-------------------------\n"));

        rl.close();
    });
}

async function sensorParsing(sensor) {
    if (sensor === true) {
        rl.question('Paste sensor_data here: ', (sensor) => {
            if (sensor == "") { rl.close(); return; }

            sensorParsingImp(sensor);

                rl.close();
            });        
    } else if (sensor) {
        sensorParsingImp(sensor);
    }
}

function sensorParsingImp(sensor) {
    try {
        const missing_values = parse_sensor(sensor)
        
        if (missing_values.length) console.log(chalk.red.bold("\nMalformed sensor_data"));
        missing_values.forEach(missing_value => {
            console.log(chalk.red.underline("Missing value: " + missing_value));
        });
    }
    catch { console.log(chalk.red.underline("Malformed sensor_data")); }
}

async function runPuppetter(config_file) {
    if (!config_file.length) { console.log(chalk.whiteBright("You must provide a config file name")); process.exit(0); }

    config_file = __dirname + "/../puppeteer_configs/" + config_file + ".yaml";
    let puppeteerParams = getPuppetteerConfigFromFile(config_file);
    
    startPuppeteer(puppeteerParams);

}

module.exports = { saveDeofbfuscatedFile, checkVersion, checkVersions, ternary2if, sensorParsing, runPuppetter }