// Defines a new Window to be used for the user preferences
import { BrowserWindow, ipcMain, dialog } from 'electron'
const path = require('path')


function createPrefsWindow(parentWindow) { 
    // Creates a Window for user preferences.
    const prefsWindow = new BrowserWindow(
        {
            width: 500,
            height: 400,
            show: true,
            parent: parentWindow,
            modal: true,
            // process, so they are saved. 
            webPreferences: {
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
                // preload.js exposes the electron API to allow sending preferences to the main
                preload: path.join(__dirname, '..', 'src', 'preload.js')
            }
        },
    )
    // prefsWindow.webContents.openDevTools()
    prefsWindow.loadURL('file://' + __dirname + '/../src/menu/preferences_menu/prefs.html')
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

