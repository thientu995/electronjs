module.exports = class Main extends require('../appConfig') {
    constructor() {
        super();
    }

    /**
     * Initialize the application after activation
     */
    init() {
        // Run install
        this.runInstall();

        // Create Window, 
        this.createWindow(this.NameMainWindow);

        // Register event ipcMain
        this.registerEventIPCMain();

        // Create System Menu
        this.createMenuBar();
        this.createMenuTray();
    }

    /**
     * Create all window using in app
     */
    createWindow(name) {
        const requireWin = require(this.path.join(this.pathInitWindow, name));
        this[requireWin.name] = new requireWin(this);
        if (this[requireWin.name]) {
            this[requireWin.name].focus();
            return this[requireWin.name];
        }
        else {
            throw 'Main Window not found';
        }
    }

    /**
     * Create menu bar app
     */
    createMenuBar() {
        const menuValue = (require('./menuSystem/templateBar'))(this);
        this.Menu.setApplicationMenu(this.Menu.buildFromTemplate(menuValue));
    }

    /**
     * Create menu tray app (show app taskbar)
     */
    createMenuTray() {
        this.menuTray = this.menuTray || new this.Tray(this.path.join(this.pathAssets, './icon/icon_16.png'));// file icon 16x16 is the best
        this.menuTray.setToolTip(this.package.displayName || '');
        const menuValue = (require('./menuSystem/templateTray'))(this);
        this.menuTray.setContextMenu(this.Menu.buildFromTemplate(menuValue));
    }

    /**
     * Register event for app
     */
    registerEventApp() {
        // Quit when all windows are closed.
        this.app.on('window-all-closed', () => {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') this.app.quit();
        });
    }

    /**
     * Register event for app
     */
    registerEventIPCMain() {
        const files = this.glob.sync(this.path.join(this.pathEventIPCMain, './*.js'), { "ignore": ['**/index.js'] })
        files.forEach((file) => {
            let requireFile = require(file);
            this.ipcMain.on(this.path.basename(file).replace(this.path.extname(file),''), (event, args) => {
                requireFile.call(this, event, args);
            });
        });
    }

    /**
    * Register event confirm close app
    */
    registerConfirmCloseApp(event) {
        if (global['ShowConfirmCloseApp']) {
            event.preventDefault();
            this.dialog.confirm('Do you want to close the application?', () => {
                global['ShowConfirmCloseApp'] = false;
                this.app.quit();
            });
        }
    }

    /**
     * Run script register install, clear config before intall
     */
    runInstall() {
        // install/uninstall add shortcut desktop, startup, start menu for WINDOWS
        this.NameMainWindow = require(this.path.join(this.pathModule, './scriptsInstall/win/squirrel_install'))(this);

        // clean folder obfuscator (if exists)
        require(this.path.join(this.pathModule, './scriptsInstall/obfuscator')).clean();
    }

    /**
     * Not run app if started
     */
    checkSecondInstance() {
        if (process.mas) return false;
        if (!this.app.requestSingleInstanceLock()) {
            this.app.quit();
        }
        else {
            this.app.on('second-instance', (event, commandLine, workingDirectory) => {
                // Someone tried to run a second instance, we should focus our window.
                if (this.MainWindow) {
                    if (this.MainWindow.isMinimized())
                        this.MainWindow.restore()
                    this.MainWindow.focus();
                }
            });
            return true;
        }
        return false;
    }
}