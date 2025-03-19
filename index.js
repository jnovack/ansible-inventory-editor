const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        darkTheme: true
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.webContents.once('did-finish-load', () => {
        loadYAML();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

async function loadYAML() {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'YAML Files', extensions: ['yml', 'yaml'] }],
    });

    if (result.canceled) {
        return null;
    }

    try {
        const fileContents = fs.readFileSync(result.filePaths[0], 'utf8');
        const data = yaml.parse(fileContents);
        mainWindow.webContents.send('yaml-data', data);
    } catch (error) {
        console.error('Error loading YAML file:', error);
    }
}
