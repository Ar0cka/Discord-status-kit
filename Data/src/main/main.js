const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');

let mainWindow;
let pyProc = null;

function loadPythonExe(){
    if (app.isPackaged)
        return './resources/app/python-embed/python.exe';
    else
        return './python-embed/python.exe'
}

function loadPythonApi(){
    if (app.isPackaged)
        return './resources/app/src/python/api.py';
    else
        return './src/python/api.py';
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
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

    let returned = mainWindow.loadFile('./src/renderer/index.html');

    if (returned == null){
        mainWindow.Close();
    }

    mainWindow.removeMenu();
}

let buffer = ''

function startPythonApi() {
    const pythonExePath = loadPythonExe();
    const pythonApiPath = loadPythonApi();

    console.log("python path = ", pythonExePath);
    console.log("python api path = ", pythonApiPath);

    pyProc = spawn(pythonExePath, [pythonApiPath])

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

    pyProc.stdout.on('data', (data) =>{
        buffer += data.toString();

        let lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines){
            if (!line.trim()) continue;
            try {
                const message = JSON.parse(line.trim());
                console.log("message = ", message);
                mainWindow.webContents.send('update-status', message);
            }
            catch (e){
                console.error('Error parsing')
            }
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
    if (!CheckPython) {
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
    if (!CheckPython){
        event.sender.send('end-connect-response', false);
        return;
    }

    const command = {
        action: 'stop'
    };

    pyProc.stdin.write(JSON.stringify(command) + '\n');
});

ipcMain.on('update-data', (event, data) => {
    if (!CheckPython){
        event.sender.send('end-connect-response', false);
        return;
    }

    const command = {
        action: 'update',
        data: data
    }

    pyProc.stdin.write(JSON.stringify(command) + '\n');
})

ipcMain.on('load-json-data', (event, data) => {
    //Логика выбора данных + проверки.
})

ipcMain.on('Send-data-to-renderer', (event, data) => {
    //отправка данных в renderer (возможно стоит перенести в ipcMain.on('load-json-data');
})

function CheckPython(){
    if (!pyProc) {
        console.error('Python process is not running');
        return false;
    }
}

