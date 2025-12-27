const {ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('fileApi', {
    onFileOpened: (callback) => {
        ipcRenderer.on("file-opened", (_event, data) => {
            callback(data);
        });
    }
});