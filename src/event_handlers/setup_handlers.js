import { ipcMain } from 'electron'
import { handleSavePrefs } from '../preferences/prefs_storage.js'
import { createPrefsWindow } from '../menu/preferences_menu/prefs_window.js'
import { createCalendarWindow } from '../calendar/calendar_window.js'

// Handler to save preferences and update the storage
function setSavePreferencesHandlers() {
    /* Sets the handler for saving preferences.
       Since this creates a new instance of the storage, the storage related event handlers
       need to be re-registered. 
    */
    ipcMain.handle('save-prefs', (event, prefs) => {
        let storage = handleSavePrefs(prefs);
        ipcMain.removeHandler('save-stopwatch');
        ipcMain.removeHandler('load-stopwatches');
        // setStorageHandlers(storage);
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

function setStorageHandlers(storage) {
    /* Sets the event handlers related to the storage.
       These need to be deregistered and registered again when storage changes.
    */
    // Handler to save stopwatch data
    ipcMain.handle('save-stopwatch', (event, stopwatchData) => storage.saveStopwatch(stopwatchData));
    // Handles loading the stopwatch data
    ipcMain.handle('load-stopwatches', (event) => storage.loadData());
}

export {
    setSavePreferencesHandlers,
    setMainWindowHandlers,
    setStorageHandlers
}