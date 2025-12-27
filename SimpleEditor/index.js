const { app, ipcMain, BrowserWindow, Menu, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs').promises;
let window;
let currentFilePath;

function createWindow() {
  window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
  });
  const menu = Menu.buildFromTemplate([
    { role: 'copy' },
    { role: 'cut' },
    { role: 'paste' },
    { role: 'selectall' }
  ]);
  window.webContents.on('context-menu', (_event, params) => {
    if (params.isEditable) {
      menu.popup()
    }
  });
  window.loadFile('index.html');
}

async function openFile() {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: '文本文件', extensions: ['txt'] },
            { name: '所有文件', extensions: ['*'] }
        ]
    });
    if (canceled) {
        return;
    }
    const filePath = filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    currentFilePath = filePath; // 保存当前文件路径
    window.webContents.send('file-opened', { filePath, content });
}

async function saveFile() {
    if (!currentFilePath) {
        return;
    }
    const content = await window.webContents.executeJavaScript(`
        document.getElementById('text-editor').value
    `);
    await fs.writeFile(currentFilePath, content, 'utf-8');
}

const template = [
    {
    label: '文件',
    submenu: [
      { label: '打开文件', accelerator: 'Ctrl+O', click: () =>  openFile()},
      { label: '保存文件', accelerator: 'Ctrl+S', click: () => saveFile()},
      { type: 'separator' },
      { role: 'close', label: '关闭窗口' },
      { role: 'quit', label: '退出应用' }
    ]
  },
  {
    // 编辑菜单
    label: '编辑',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' }
    ]
  },
  {
    // 帮助菜单
    label: '调试',
    submenu: [
      { 
        role: 'toggleDevTools', 
        label: '开发者工具'

      }
    ]
  }
];

const appMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(appMenu);
app.on('ready', () => {
    createWindow();
});
