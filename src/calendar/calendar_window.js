// Defines a new Window to be used for the user preferences
import { BrowserWindow, ipcMain, dialog } from 'electron'
const path = require('path')


function createCalendarWindow(parentWindow) { 
    // Creates a Window for the calendar.
    const calendarWindow = new BrowserWindow(
        {
            width: 800,
            height: 800,
            show: true,
            parent: parentWindow,
            modal: true,
            webPreferences: {
                nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
                contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
                preload: path.join(__dirname, 'preload.js')
            },
        },
    )

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        calendarWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'calendar')
    } else {
        calendarWindow.loadURL('app://./calendar.html')
    }
    calendarWindow.removeMenu();
    if (!process.env.IS_TEST) calendarWindow.webContents.openDevTools();

    return calendarWindow
}

export { createCalendarWindow }

