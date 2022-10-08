// aka main process
'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  ipcMain,
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { handleSavePrefs } from './storage/prefs_storage.js'
import { createStorage } from './storage/stopwatch_storage.js'
import { createPrefsWindow } from './menu/preferences_menu/prefs_window.js'


const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window and the menu + submenu handlers.
  const win = new BrowserWindow({
    width: 350,
    // width: 800,
    // maxWidth: 420,
    height: 600,
    hasShadow: false,
    frame: false,
    transparent: true, 
    maximizable: false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // Enables communicating with the main process (to save data)
      preload: path.join(__dirname, '..', 'src', 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createWindow().then((win) => {
    // Instantiating the storage
    let storage = createStorage();
    // Handler to save preferences
    ipcMain.on('save-prefs', (event, prefs) => handleSavePrefs(prefs, storage));
    // Handler to save stopwatch data
    ipcMain.on('save-stopwatch', (event, stopwatchData) => storage.saveStopwatch());
    // Handler to open the preferences window
    ipcMain.on('open-preferences', (event) => createPrefsWindow(win));
    // Handler to close the app
    ipcMain.on('close-app', (event) => win.close());
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
