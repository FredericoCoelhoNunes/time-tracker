// Code that is injected before a web page loads in the renderer
// In this case, we will use it to augment the renderer with the capabilities we
// need for it to send information to the main process
// "By default, the renderer process has no Node.js or Electron module access.
//  As an app developer, you need to choose which APIs to expose from your preload script
//  using the contextBridge API."
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    savePrefs: (prefs) => ipcRenderer.send('save-prefs', prefs),
    saveStopwatch: (stopwatchData) => ipcRenderer.invoke('save-stopwatch', stopwatchData),
    selectFile: (method, config) => ipcRenderer.invoke('select-file', method, config),
    openPreferences: () => ipcRenderer.send('open-preferences'),
    openCalendar: () => ipcRenderer.send('open-calendar'),
    closeApp: () => ipcRenderer.send('close-app')
})