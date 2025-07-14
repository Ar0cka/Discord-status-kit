const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronApi', {
    sendData: (data) => ipcRenderer.send('submit-form', data),
    sendDisconnect: () => ipcRenderer.send('end-connect'),

    updateStatus: (callback) => ipcRenderer.on("update-status", (event, message) => {
        callback(message)
    })
    }
)