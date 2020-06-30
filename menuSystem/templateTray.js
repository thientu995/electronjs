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
            label: 'Language',
            icon: main.path.join(main.pathAssets, './icon/icon_16.png'),
            submenu: [
                {
                    label: 'Tiếng Việt',
                    icon: main.path.join(main.pathAssets, './img/lang_vi.png'),
                },
                {
                    label: 'English',
                    icon: main.path.join(main.pathAssets, './img/lang_en.png'),
                },
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