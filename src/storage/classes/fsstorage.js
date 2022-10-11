import { Notification } from 'electron';
import { Storage } from './storage.js'
const settings = require('electron-settings');
var csvWriter = require('csv-write-stream')
const fs = require('fs')
const path = require('path')
const csvtojson = require("csvtojson");
const AWS = require('aws-sdk');


/**
 * Class FSStorage - Stores the stopwatches in a CSV file in the local filesystem.
 *                   Optionally also saves a backup of the file to S3.
 *
 * @class FSStorage
 * @extends {Storage}
 */
 class FSStorage extends Storage {

    async init() {
        const settings = await this.getSettings()
        this.storage_location = settings.storage_location;
        this.bucket_name = settings.bucket_name;
        this.aws_access_key_id = settings.aws_access_key_id;
        this.aws_secret_access_key = settings.aws_secret_access_key;
        this.backup_to_s3 = settings.backup_to_s3;
        if (this.storage_location) {
          this.outputPath = path.join(this.storage_location, "stopwatches.csv");
        }
    }

    shouldBackupToS3() {
      // Checks if the stopwatch should also be saved to S3
      if (this.bucket_name && this.aws_access_key_id && this.aws_secret_access_key && this.backup_to_s3 === true) {
          return true
      } else {
          return false
      }
    }

    async getSettings() {
      const storage_location = await settings.get('storage_location');
      const bucket_name = await settings.get('bucket_name')
      const aws_access_key_id = await settings.get('aws_access_key_id')
      const aws_secret_access_key = await settings.get('aws_secret_access_key')
      const backup_to_s3 = await settings.get('backup_to_s3')

      return {
          storage_location,
          bucket_name,
          aws_access_key_id,
          aws_secret_access_key,
          backup_to_s3
      }
    }

    async loadData() {
      if (this.storage_location === undefined) {
        new Notification({ title: "Can't load calendar data.", body: "Please set a valid storage location." }).show();
        return []
      }

      const data = await csvtojson().fromFile(this.outputPath);

      return data
    }
  
    async saveStopwatch(stopwatchData) {
      if (this.storage_location === undefined) {
        new Notification({ title: "Failed to save stopwatch to file.", body: "Please set a valid storage location." }).show();
        return false
      }
      const obj = JSON.parse(stopwatchData);
      
      // If file doesn't exist, write header
      if (!fs.existsSync(this.outputPath)) {
        var writer = csvWriter();
      // Else just append the data
      } else {
        var writer = csvWriter({sendHeaders: false});
      }
      writer.pipe(fs.createWriteStream(this.outputPath, {flags: 'a'}));
      writer.write(obj);
      writer.end();


      let shouldBackupToS3 = this.shouldBackupToS3();
      let notifMessage = `Stopwatch saved at ${this.outputPath}`
      if (shouldBackupToS3) {
        let key = this.backupToS3(stopwatchData)
        notifMessage += ` (also backed up to S3 at ${key})`;
      };

      new Notification({ title: "Stopwatched saved succesfully.", body: notifMessage}).show()
      return true
    }

    async connectToS3() {
      const s3 = new AWS.S3({
          accessKeyId: this.aws_access_key_id,
          secretAccessKey: this.aws_secret_access_key
      });
      return s3
  }

    async backupToS3(stopwatchData) {
        // Saves a stopwatch to S3
        const s3 = await this.connectToS3();
        let timeStr = new Date().toISOString();
        let key = `stopwatch-${timeStr}`;
        const params = {
            Bucket: this.bucket_name,
            Key: key,
            Body: stopwatchData
        };
        s3.upload(params, function(err, data) {
            console.log(err, data);
        });     

        return key
    }
}

export { FSStorage }