console.warn(`> Run module: ${__filename}`);
const { css, html, js } = require('js-beautify');
const fs = require('fs');
module.exports = class CreateWindow extends require('../appConfig') {
    constructor(fileName) {
        super();
        this.fileView = 'index.html';
        this.fileMain = 'index.js';
        this.fileRenderder = 'index.render.js';
        this.fileName = fileName;
        this.pathWindow = this.path.join(this.pathInitWindow, this.fileName);

        this.createFolder();

    }

    createFolder() {
        fs.mkdir(this.pathWindow, { recursive: false }, (err) => {
            if (err)
                throw err;
            else {
                this.createFileView();
                this.createFileMain();
                this.createFileRenderer();
            }
        });
    }

    createFileMain() {
        const content = `
module.exports = class ${this.fileName} {
    constructor(main) {
        this.main = main;
        return this[this.constructor.name];
    }
}`;
        this.createFile(this.path.join(this.pathWindow, this.fileMain), js(content));
    }

    createFileRenderer() {
        const content = `
class ${this.fileName} extends require('../../renderers') {
    constructor(render) {
        super();
    }
}
module.exports = new ${this.fileName}();
`;
        this.createFile(this.path.join(this.pathWindow, this.fileRenderder), js(content));
    }

    createFileView() {
        const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${this.fileName}</title>
        </head>
        <body>
            <h1>Hello ${this.fileName}</h1>
        </body>
        </html>`;
        this.createFile(this.path.join(this.pathWindow, this.fileView), html(content));
    }

    createFile(pathFile, content) {
        fs.writeFile(pathFile, content, function () { });
    }
}