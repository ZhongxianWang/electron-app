const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
let window;
app.on('ready', () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    window.loadFile('index.html');
});
