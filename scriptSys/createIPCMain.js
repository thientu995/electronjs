console.warn(`> Run module: ${__filename}`);
const { css, html, js } = require('js-beautify');
const fs = require('fs');
module.exports = class CreateWindow extends require('../appConfig') {
    constructor(fileName) {
        super();
        let pathFile = this.path.join(this.pathEventIPCMain, fileName + '.js');

        fs.writeFile(pathFile, js(`module.exports = function (event, args) { 
            // This code 
        }`), function () { });
    }
}