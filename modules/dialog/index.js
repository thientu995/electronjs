console.warn(`> Import Module: ${__filename}`);
const { remote, dialog, BrowserWindow } = require('electron');
const title = require('../../package.json').displayName;
let currentDialog = null;
let currentWindow = null;

class Dialog {
    constructor(){

    }
    static message(option) {
        init();
        return currentDialog.showMessageBox(currentWindow, option);
    }
    static save(option) {
        init();
        return currentDialog.showSaveDialog(currentWindow, option);
    }
    static open(option) {
        init();
        return currentDialog.showOpenDialog(currentWindow, option);
    }
    // dialog confirm
    static confirm(content, funcSuccess, funcCancel) {
        init();
        const buttons = ["Ok", "Cancel"];
        return currentDialog.showMessageBox(currentWindow, {
            type: 'question',
            buttons: buttons,
            defaultId: 0,
            title: title,
            message: content,
        }).then(response => {
            if (buttons[response.response] == buttons[0]) {
                if (funcSuccess != null) {
                    funcSuccess();
                }
            }
            else {
                if (funcCancel != null) {
                    funcCancel();
                }
            }
        });
    }
    // dialog error
    static error(content) {
        init();
        return currentDialog.showErrorBox(title, content);
    }
    // dialog aler
    static alert(content) {
        init();
        let showDialog = currentDialog.showMessageBox(currentWindow, {
            title: title,
            message: content
        });
        showDialog.CurrentWindow = currentWindow;
        return showDialog;
    }
}


function init() {
    if (remote) {
        currentDialog = remote.dialog;
        currentWindow = remote.BrowserWindow.getFocusedWindow();
    }
    else if (BrowserWindow) {
        currentDialog = dialog;
        currentWindow = BrowserWindow.getFocusedWindow();
        if (!currentWindow && BrowserWindow.getAllWindows().length > 0) {
            currentWindow = BrowserWindow.getAllWindows()[0];
        }
    }
}

module.exports = Dialog;