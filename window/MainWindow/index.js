module.exports = class MainWindow {
    constructor(main) {
        this.main = main;
        // this code

        return this.init();
    }

    init() {
        if (this[this.constructor.name]) {
            return this[this.constructor.name];
        }
        const BrowserWindow = this.main.BrowserWindow;
        let autoUpdate = this.main.autoUpdate;
        let window = new BrowserWindow({
            width: 800,
            height: 600,
            maximizable: true,
            resizable: true,
            alwaysOnTop: false,
            frame: true,
            webPreferences: {
                devTools: this.main.IsDebug,// Relase change value false
                nodeIntegration: true,
                enableRemoteModule: true,
                nodeIntegrationInWorker: true
            }
        });

        // and load the index.html of the app.
        window.loadFile(this.main.path.join(__dirname, './index.html'));

        // Event close windows
        window.on('close', event => {
            this.main.registerConfirmCloseApp(event);
        });
        window.webContents.openDevTools();

        window.on('closed', () => {
            this[this.constructor.name] = null;
        });

        window.webContents.on('did-finish-load', () => {
            let initUpdate = new autoUpdate(window);
            initUpdate.checkUpdate();
        });

        return this[this.constructor.name] = window;
    }
}