const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pyProc = null;

const projectRoot = path.resolve(__dirname, '../../');

function getPythonPath() {
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return path.join(projectRoot, 'python-embed', 'python.exe'); // 🔧 тут убрал "app"
  }
  return path.join(process.resourcesPath, 'python-embed', 'python.exe');
}

function getScriptPath() {
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return path.join(__dirname, '../python/api.py'); // тут ок
  }
  return path.join(process.resourcesPath, 'src', 'python', 'api.py');
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        transparent: true,
        resizable: false
    });

    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
    mainWindow.removeMenu();
}

function startPythonApi() {
    const pythonPath = getPythonPath();
    const scriptPath = getScriptPath();

    console.log('Starting Python process with:');
    console.log('Python path:', pythonPath);
    console.log('Script path:', scriptPath);

    pyProc = spawn(pythonPath, [scriptPath]);

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

    pyProc.stdin.write(JSON.stringify(command) + '\n');

    const handleResponse = (data) => {
        try {
            const response = JSON.parse(data.toString());
            console.log('Python start response:', response);
            event.sender.send('submit-form-response', response.success);
            pyProc.stdout.off('data', handleResponse);
        } catch (err) {
            console.error('Error parsing Python response:', err);
            console.log('Raw output:', data.toString());
        }
    };

    pyProc.stdout.on('data', handleResponse);
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

    const handleResponse = (data) => {
        try {
            const response = JSON.parse(data.toString());
            console.log('Python stop response:', response);
            event.sender.send('end-connect-response', response.success);
            pyProc.stdout.off('data', handleResponse);
        } catch (err) {
            console.error('Error parsing Python response:', err);
            console.log('Raw output:', data.toString());
        }
    };

    pyProc.stdout.on('data', handleResponse);
});
