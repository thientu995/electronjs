module.exports = class AppConfig {
    constructor() {
        this.glob = require('glob');
        this.path = require('path');
        this.setConfigValueCommon();
        this.setPath();
        try {
            this.setModuleElectron();
            this.setModule();
            if (this.remote) {
                this.setConfigValueRender();
                this.setModuleRenderer();
            }
            else {
                this.setConfigValueMain();
            }
        } catch{ }
    }

    setConfigValueCommon() {
        this.IsDebug = /--debug/.test(process.argv[2]);
        this.HomePageUpdate = 'http://electron-template-empty-442dazr6l.now.sh';
        this.NameMainWindow = 'MainWindow';
    }

    setConfigValueMain() {
        global['ShowConfirmCloseApp'] = true;
    }

    setConfigValueRender() {
    }

    setPath() {
        this.pathHome = __dirname;
        this.pathMain = this.path.join(this.pathHome, './main');
        this.pathEventIPCMain = this.path.join(this.pathMain, './eventIPCMain');
        this.pathInitWindow = this.path.join(this.pathHome, './window');
        this.pathRenderers = this.path.join(this.pathHome, './renderers');
        this.pathHtml = this.path.join(this.pathHome, './views');
        this.pathAssets = this.path.join(this.pathHome, './assets');
        this.pathModule = this.path.join(this.pathHome, './modules');
        this.package = require(this.path.join(this.pathHome, './package.json'));
    }

    setModuleElectron() {
        this.electron = require('electron');
        this.app = this.electron.app || this.electron.remote.app;
        this.remote = this.electron.remote;
        if (this.remote) {//Render
            this.appGlobal = this.remote.getGlobal('appGlobal');
            this.ipcRenderer = this.electron.ipcRenderer;
        }
        else {//Main
            this.BrowserWindow = this.electron.BrowserWindow;
            this.Tray = this.electron.Tray;
            this.Menu = this.electron.Menu;
            this.ipcMain = this.electron.ipcMain;
        }
    }

    setModule() {
        const files = this.glob.sync(this.path.join(this.pathModule, '**/*.js'), { "ignore": ['!**/index.js'] });
        files.forEach((file) => {
            let key = this.path.basename(this.path.dirname(file));
            this[key] = require(file);
        });
    }

    setModuleRenderer() {
        // Import module render (jquery, angualrjs,...)
    }
}