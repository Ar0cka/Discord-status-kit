const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');

let mainWindow;
let pyProc = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        frame: false,
        transparent: true,
        resizable: false
    });

    let returned = mainWindow.loadFile('dist/win-unpacked/resources/app/src/renderer/index.html');

    if (returned == null){
        mainWindow.Close();
    }

    mainWindow.webContents.openDevTools();
    mainWindow.removeMenu();
}

function startPythonApi() {
    pyProc = require('child_process').spawn('./python-embed/python.exe', ['./src/python/api.py'])

    pyProc.stderr.on('data', (data) => {
        const errorMsg = data.toString();
        console.error('Python Error:', errorMsg);
        mainWindow?.webContents.send('python-error', errorMsg);
    });

    pyProc.on('close', (code) => {
        console.log('Python process exited with code', code);
    });

    pyProc.on('error', (err) => {
        console.error('Failed to start Python process:', err);
    });

    pyProc.stdout.on('change-status', (data) =>{
    try {
        const message = JSON.parse(data.toString().trim());
        mainWindow.webContents.send('update-status', message)
    }
    catch (e){
        console.error('Error parsing')
    }
});
}
app.whenReady().then(() => {
    createWindow();
    startPythonApi();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (pyProc) {
        pyProc.kill();
        pyProc = null;
    }
});

ipcMain.on('submit-form', (event, formData) => {
    if (!pyProc) {
        console.error('Python process is not running');
        return;
    }

    const command = {
        action: 'start',
        data: formData
    };

    console.log('Start sending data from main js');

    pyProc.stdin.write(JSON.stringify(command) + '\n');
});
ipcMain.on('end-connect', (event) => {
    if (!pyProc) {
        console.error('Python process is not running');
        event.sender.send('end-connect-response', false);
        return;
    }

    const command = {
        action: 'stop'
    };

    pyProc.stdin.write(JSON.stringify(command) + '\n');
});
