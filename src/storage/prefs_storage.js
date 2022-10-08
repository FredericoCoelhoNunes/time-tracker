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
        new Notification({ title: "Failed to set preferences", body: "Please set a storage type!" }).show()
        return
    }

    settings.set(prefs);
    
    // settings.get('key.data').then(value => {
    //     console.log('Persisted Value - ' + value);
    // })
    
    // settings.has('key1.data').then(bool => {
    //     console.log('Checking if key1.data Exists - ' + bool)
    // });

    // Should update the storage
    // console.log(props.storage.saveStopwatch());
}

export { handleSavePrefs }