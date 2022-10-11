// Module to handle the storage of user preferences
import { Notification } from 'electron';
import { createStorage } from '../storage/stopwatch_storage.js'
const settings = require('electron-settings');


async function handleSavePrefs(prefs) {
    /* Handles the user saving new preferences.
       Stores the new prefences on the preferences file.
       Then replaces the storage object by the new type of storage,
       so the user can start saving to the new storage without restarting the app.
    */
    console.log('File used for Persisting Data - ' + settings.file());

    if (!prefs.storage_type) {
        new Notification({ title: "Failed to set preferences.", body: "Please set a storage type!" }).show()
        return
    } else {
        new Notification({ title: "Preferences saved succesfully!", body: "Preferences saved in " + settings.file() + '.'}).show()
    }

    // setting the preferences
    settings.set(prefs);

    // recreating the storage
    let storage = await createStorage();
    
    return storage
}

export { handleSavePrefs }