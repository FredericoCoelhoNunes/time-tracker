// This is the Electron "main.process" - it handles creating the Windows and interacting with the local filesystem, for example.
'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  ipcMain,
} from 'electron'
import {
  setSavePreferencesHandler,
  setMainWindowHandlers,
  setDataHandlers
} from './event_handlers/setup_handlers.js'
import { createStorage } from './storage/stopwatch_storage.js'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'

const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// Storage
let storage_wrapper = {
  storage: null
};

async function createWindow() {
  // Create the browser window and the menu + submenu handlers.
  const win = new BrowserWindow({
    // WSL doesn't support these properties
    ...(
      process.env.IS_WSL != 'true' 
      && 
      {
        transparent: true,
        hasShadow: false,
        frame: false,
      }
    ), 
    width: 350,
    height: 600,
    maximizable: false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      // Enables communicating with the main process (to save data)
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
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

  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol('app')
  }

  createWindow().then(async (win) => {

    // Instantiating the initial storage
    let st = await createStorage();
    storage_wrapper.storage = st;

    function changeToNewStorage(newStorage) {
      storage_wrapper.storage = newStorage;
    }

    setDataHandlers(storage_wrapper);
    setSavePreferencesHandler(changeToNewStorage);
    setMainWindowHandlers(win);
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
