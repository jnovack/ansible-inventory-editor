const { app, BrowserWindow, ipcMain, dialog, remote, webFrame  } = require('electron');
const fs = require('fs');
const yaml = require('yaml');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');
});

// Handle file open dialog and parsing
ipcMain.handle('select-hosts-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'YAML Files', extensions: ['yml', 'yaml'] }],
  });

  if (result.canceled) {
    return null;
  }

  const filePath = result.filePaths[0];
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(fileContents);
});
