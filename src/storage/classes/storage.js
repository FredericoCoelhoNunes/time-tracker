/**
 * Abstract Class representing a Storage type for our stopwatches.
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

export { Storage }