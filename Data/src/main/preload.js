const {contextBridge, ipcRenderer, dialog} = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
    sendData: (data) => ipcRenderer.send('submit-form', data),
    sendDisconnect: () => ipcRenderer.send('end-connect'),
    updateStatus: (callback) => ipcRenderer.on("update-status", (event, message) => {
        callback(message);
    }),
    updateData: (data) => ipcRenderer.send('update-data', data),
    loadDataFromJson: (data) => ipcRenderer.send('load-json-data'), //Переделать под Dialog or NodeJS (work with file system);
    initInputData: (callback) => ipcRenderer.on("load-data", (event, data) => {
        callback(data);
    })
    }
)