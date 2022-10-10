// Defines a new Window to be used for the user preferences
import { BrowserWindow, ipcMain, dialog } from 'electron'
const path = require('path')


function createPrefsWindow(parentWindow) { 
    // Creates a Window for user preferences.
    const prefsWindow = new BrowserWindow(
        {
            ...(
                process.env.IS_WSL != 'true' && {
                transparent: true,
                hasShadow: false,
            }),
            width: 300,
            height: 300,
            show: true,
            parent: parentWindow,
            modal: true,
            // process, so they are saved. 
            webPreferences: {
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
                // preload.js exposes the electron API to allow sending preferences to the main
                preload: path.join(__dirname, 'preload.js')
            }
        },
    )

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        prefsWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'preferences')
    } else {
        prefsWindow.loadURL('app://./preferences.html')
    }
    prefsWindow.removeMenu();
        
    // Handler to select file (registered here since we want the dialog to open as a modal to this window)
    ipcMain.handle('select-file', (event, method, params) => {       
        return dialog[method](prefsWindow, params);
    });

    // We also need to deregister this handler everytime we close the window, or else it would throw an
    // error if we tried opening the preferences again 
    prefsWindow.on('closed', () => ipcMain.removeHandler('select-file'));

    return prefsWindow
}

export { createPrefsWindow }

