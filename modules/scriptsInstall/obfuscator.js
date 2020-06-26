const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const rimraf = require('rimraf');
const asar = require('asar');
const javaScriptObfuscator = require('javascript-obfuscator');
const folderExtract = 'obfuscator';
const fileApp = 'app.asar';
const miniCSS = require("mini-css");

let resourcesFolder = '';
module.exports.default = async function (context) {
    const APP_NAME = context.packager.appInfo.productFilename;
    const APP_OUT_DIR = context.appOutDir;
    const PLATFORM = context.packager.platform.name;
    resourcesFolder = path.join(APP_OUT_DIR, 'resources');
    if (PLATFORM == 'mac') {
        resourcesFolder = path.join(APP_OUT_DIR, `${APP_NAME}.app`, 'Contents', 'Resources');
    }

    console.log('\t> Asar package javascript obfuscator: ' + resourcesFolder);

    console.log('\t\t>> Unpacking asar archive');
    asar.extractAll(path.join(resourcesFolder, fileApp), path.join(resourcesFolder, folderExtract));


    // Process javascript obfuscator
    recursive(path.join(resourcesFolder, folderExtract), ['node_modules', 'app'], function (err, files) {
        files.forEach(file => {
            if (path.extname(file) === '.js') {
                console.log('\t\t\t>>> Protecting JS:\t' + file);
                let contents = fs.readFileSync(file, 'utf8');

                let ret = javaScriptObfuscator.obfuscate(contents, {
                    compact: true,
                    controlFlowFlattening: true,
                    controlFlowFlatteningThreshold: 0.75,
                    deadCodeInjection: true,
                    deadCodeInjectionThreshold: 0.4,
                    debugProtection: false,
                    debugProtectionInterval: true,
                    disableConsoleOutput: true,
                    identifierNamesGenerator: 'hexadecimal',
                    log: false,
                    renameGlobals: false,
                    rotateStringArray: true,
                    selfDefending: true,
                    shuffleStringArray: true,
                    splitStrings: true,
                    splitStringsChunkLength: 10,
                    stringArray: true,
                    stringArrayEncoding: 'rc4',
                    stringArrayThreshold: 0.75,
                    transformObjectKeys: true,
                    unicodeEscapeSequence: true
                });
                fs.writeFileSync(file, ret);
            }
            else if (path.extname(file) === '.css') {
                console.log('\t\t\t>>> Minifying CSS:\t' + file);
                miniCSS(null, file, true);
            }
        });
        console.log('\t\t>> Packing asar archive');
        asar.createPackageWithOptions(path.join(resourcesFolder, folderExtract), path.join(resourcesFolder, fileApp), {}, (callback) => {
            console.log('\t\t>> Created secure asar archive');
            rimraf(path.join(resourcesFolder, folderExtract), function () {
                console.log('\t Done! javascript obfuscator.');
            });
        });
    });
}

module.exports.clean = function () {
    resourcesFolder = path.join(__dirname, '../../../');
    if (fs.existsSync(path.join(resourcesFolder, folderExtract))) {
        rimraf(path.join(resourcesFolder, folderExtract), function () {
            console.log('> Done! javascript obfuscator.');
        });
    }
}