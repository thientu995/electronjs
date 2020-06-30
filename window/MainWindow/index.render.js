class MainWindow extends require('../../renderers') {
    constructor() {
        super();
        const electron = this.electron;
        const ipcRenderer = electron.ipcRenderer;

        ipcRenderer.on('console', (evt, Msg) => {
            document.getElementById('msg').innerHTML += '<br>' + Msg;
        });

        document.getElementById('openEmpty').addEventListener('click', () => {
            capture.Stop();
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

        let capture = new this.mediaRecord.Capture();

        setInterval(() => {
            capture.CurrentScreen().then(stream => {
                capture.toTagCanvas(stream).then(canvas => {
                    document.getElementById('capture').appendChild(canvas);
                })
            });
        }, 1000)


        // let capture = new this.mediaRecord.Record();
        // setTimeout(function () {
        //     capture.Pause();
        //     setTimeout(function () {
        //         capture.Resume();
        //         setTimeout(function () {
        //             capture.Stop()
        //         }, 5000);
        //     }, 2000);
        // }, 3000);
    }
}
module.exports = new MainWindow();