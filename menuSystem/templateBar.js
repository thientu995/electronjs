module.exports = function (main) {
    return [
        {
            label: 'Menu',
            submenu: [
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
                            label: 'Cut',
                            accelerator: 'CmdOrCtrl+X',
                            role: 'cut'
                        },
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
                            label: 'Select All',
                            accelerator: 'CmdOrCtrl+A',
                            role: 'selectall'
                        }
                    ]
                }
            ]
        },
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
    ];
}