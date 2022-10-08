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

    create() {
        // Creates the file
        console.log('creating storage file')
    }
  
    saveStopwatch(event, stopwatchData) {
      console.log("Saving stopwatch to file")
    }
  }

// createStorage creates an instance of a subclass of Storage
// based on the user's preferences
function createStorage() {
    let storageType = "file";

    switch(storageType) {
        case "file":
            return new FSStorage();
    }
}

export { createStorage }