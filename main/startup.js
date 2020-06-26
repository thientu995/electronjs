const main = new (require('./'))();
if (!main.checkSecondInstance()) {
    console.error('Application running');
    return;
}
/**
 * Run app
 */
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
main.app.whenReady().then(() => {
    main.init();
    main.app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (main.BrowserWindow.getAllWindows().length === 0) main.init();
    })
});
main.registerEventApp();
