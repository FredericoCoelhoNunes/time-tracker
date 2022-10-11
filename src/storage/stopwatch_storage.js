import { FSStorage } from './classes/fsstorage.js'
// import { S3Storage } from './classes/s3storage.js'
const settings = require('electron-settings');

async function createStorage() {
    // CreateStorage creates an instance of a subclass of Storage
    // based on the user's preferences
    // A bit pointless for now since it only supports one type of storage!
    let storageType = await settings.get('storage_type')

    if (storageType === undefined) {
        storageType = 'fs_storage'
    };

    switch(storageType) {
        case "fs_storage":
            let st = new FSStorage();
            await st.init();
            return st;
        // Removed this type of storage! It's now an additional option to FSStorage
        // case "s3_storage":  
        //     return new S3Storage();
    };
}

export { createStorage }