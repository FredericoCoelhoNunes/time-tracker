// Module to handle the storage of user preferences
import { Notification } from 'electron';
const settings = require('electron-settings');
  
function handleSavePrefs(prefs, storage) {
    /* Handles the user saving new preferences.
       Stores the new prefences on the preferences file.
       Then replaces the storage object by the new type of storage,
       so the user can start saving to the new storage without restarting the app.
    */
    console.log(prefs);

    console.log('File used for Persisting Data - ' + settings.file());

    if (!prefs.storage_type) {
        new Notification({ title: "Failed to set preferences.", body: "Please set a storage type!" }).show()
        return
    } else {
        new Notification({ title: "Preferences saved succesfully!", body: "Preferences saved in " + settings.file() + '.'}).show()

    }

    settings.set(prefs);
}

export { handleSavePrefs }