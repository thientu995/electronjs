module.exports = function (main) {
    return [
        {
            label: 'Text disabled',
            enabled: false
        },
        {
            label: 'Click here',
            click: () => {
                main.dialog.alert('Click OK');
            }
        },
        { type: 'separator' },
        {
            label: 'Edit',
            icon: main.path.join(main.pathAssets, './icon/icon_16.png'),
            submenu: [
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                }
            ]
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                main.app.quit();
            }
        },
        {
            label: 'Exit',
            click: () => {
                main.app.exit();
            }
        },
        {
            label: 'Restart',
            click: () => {
                main.app.relaunch();
                main.app.exit();
            }
        }
    ]
}