class MainWindow extends require('../../renderers') {
    constructor(render) {
        super();
        const electron = require('electron');
        const ipcRenderer = electron.ipcRenderer;

        ipcRenderer.on('console', (evt, Msg) => {
            document.getElementById('msg').innerHTML += '<br>' + Msg;
        });

        document.getElementById('openEmpty').addEventListener('click', () => {
            
        })


        window.addEventListener('DOMContentLoaded', () => {
            const replaceText = (selector, text) => {
                const element = document.getElementById(selector)
                if (element) element.innerText = text
            }

            for (const type of ['chrome', 'node', 'electron']) {
                replaceText(`${type}-version`, process.versions[type])
            }
        });
    }
}
module.exports = new MainWindow();