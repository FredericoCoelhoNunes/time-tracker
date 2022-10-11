import { ipcMain } from 'electron'
import { handleSavePrefs } from '../preferences/prefs_storage.js'
import { createPrefsWindow } from '../menu/preferences_menu/prefs_window.js'
import { createCalendarWindow } from '../calendar/calendar_window.js'
import { createStorage } from '../storage/stopwatch_storage.js'

// Handler to save preferences and update the storage
function setSavePreferencesHandler(changeToNewStorageCallback) {
    /* Sets the handler for saving preferences.
    */
    ipcMain.on('save-prefs', async (event, prefs) => {
        handleSavePrefs(prefs);
        let newStorage = createStorage();
        changeToNewStorageCallback(newStorage);
    });
}

function setMainWindowHandlers(mainWindow) {
    /* Sets the event handlers related to the main window.
    */
   // Handler to open the preferences window
   ipcMain.on('open-preferences', (event) => createPrefsWindow(mainWindow));
   // Handler to open the calendar
   ipcMain.on('open-calendar', (event) => createCalendarWindow(mainWindow));
   // Handler to close the app
   ipcMain.on('close-app', (event) => mainWindow.close());
}

function setDataHandlers(storage) {
    /* Sets the event handlers related to the storage.
    */
    // Handler to save stopwatch data
    ipcMain.handle('save-stopwatch', (event, stopwatchData) => storage.saveStopwatch(stopwatchData));
    // Handles loading the stopwatch data
    ipcMain.handle('load-stopwatches', (event) => storage.loadData());
}

export {
    setSavePreferencesHandler,
    setMainWindowHandlers,
    setDataHandlers
}