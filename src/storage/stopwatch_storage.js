// Module to handle the storage of user preferences
import { Notification } from 'electron';
import { resolve } from 'path';
const settings = require('electron-settings');
var csvWriter = require('csv-write-stream')
const fs = require('fs')
const path = require('path')

/**
 * Abstract Class Storage.
 *
 * @class Storage
 */
 class Storage {

    constructor() {
      if (this.constructor == Storage) {
        throw new Error("Abstract classes can't be instantiated.");
      }
    }
  
    saveStopwatch() {
      throw new Error("Method 'saveStopwatch()' must be implemented.");
    }
  }

/**
 * Class FSStorage - stores the stopwatches in a CSV file in the local filesystem.
 *
 * @class FSStorage
 * @extends {Storage}
 */
 class FSStorage {

    loadData() {
      // Creates the .CSV file for storage if it doesn't exist.
      return
    }
  
    async saveStopwatch(stopwatchData) {
      console.log(stopwatchData);
      let storage_location = await settings.get('storage_location')
      // If storage location is not set, notify
      if (storage_location === undefined) {
        new Notification({ title: "Failed to save stopwatch to file.", body: "Please set a valid storage location." }).show()
        return false
      }
      else {
        const outputPath = path.join(storage_location, "stopwatches.csv")
        const obj = JSON.parse(stopwatchData);
        
        // If file doesn't exist, write header
        if (!fs.existsSync(outputPath)) {
          var writer = csvWriter();
        // Else just append the data
        } else {
          var writer = csvWriter({sendHeaders: false});
        }
        writer.pipe(fs.createWriteStream(outputPath, {flags: 'a'}));
        writer.write(obj);
        writer.end();

        new Notification({ title: "Stopwatched saved succesfully.", body: `Stopwatch saved at ${outputPath}.` }).show()
        return true
      }
    }
}

// createStorage creates an instance of a subclass of Storage
// based on the user's preferences
function createStorage(storageType) {
    if (storageType === undefined) {
      storageType = 'fs_storage'
    }

    switch(storageType) {
        case "fs_storage":
            return new FSStorage();
        case "s3_storage":
            return false
    }
}

export { createStorage }