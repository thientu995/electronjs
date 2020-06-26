console.warn(`> Import module: ${__filename}`);
const electron = require('electron')
const autoUpdater = electron.autoUpdater
const os = require('os')

module.exports = class AutoUpdate extends require('../../appConfig') {
    constructor(mainWindow) {
        super();
        this.mainWindow = mainWindow;
        this.platform = `${os.platform()}_${os.arch()}`;
        this.registerEvent();
        const updateFeed = `${this.HomePageUpdate}/update/${os.platform()}/${this.package.version}`;
        autoUpdater.setFeedURL(updateFeed);
    }

    registerEvent() {
        const self = this;
        autoUpdater.on('error', function (ev, err) {
            self.mainWindow.webContents.send('console', `Error: ${err}`);
        });

        autoUpdater.on('checking-for-update', function (ev) {
            self.mainWindow.webContents.send('console', 'Checking for update');
        });

        autoUpdater.on('update-available', function (ev, info) {
            self.mainWindow.webContents.send('console', 'Update available');
        });

        autoUpdater.on('update-not-available', function (ev) {
            self.mainWindow.webContents.send('console', 'Update not available');
        });

        autoUpdater.on('update-downloaded', function (ev) {
            setImmediate(() => {
                self.mainWindow.webContents.send('console', 'Update downloaded');
                global['ShowConfirmCloseApp'] = false;
                autoUpdater.quitAndInstall();
            });
        });

        autoUpdater.on('before-quit-for-update', function () {
            self.mainWindow.webContents.send('console', 'Before quit for update');
        });
    }

    checkUpdate() {
        try {
            autoUpdater.checkForUpdates();
        } catch (ex) {
            this.mainWindow.webContents.send('console', ex)
            console.error(ex)
        }
    }
}
