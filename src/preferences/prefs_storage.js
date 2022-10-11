// Module to handle the storage of user preferences
import { Notification } from 'electron';
import { createStorage } from '../storage/stopwatch_storage.js'
const settings = require('electron-settings');


async function handleSavePrefs(prefs) {
    /* Handles the user saving new preferences.
       Stores the new prefences on the preferences file.
    */
    console.log('File used for Persisting Data - ' + settings.file());

    if (!prefs.storage_type) {
        new Notification({ title: "Failed to set preferences.", body: "Please set a storage type!" }).show()
        return
    } else {
        new Notification({ title: "Preferences saved succesfully!", body: "Preferences saved in " + settings.file() + '.'}).show()
    }

    // setting the preferences
    await settings.set(prefs);
}

export { handleSavePrefs }