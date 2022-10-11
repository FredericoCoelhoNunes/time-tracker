import { Notification } from 'electron';
import { Storage } from './storage.js'
const settings = require('electron-settings');
const AWS = require('aws-sdk');


/**
 * Class S3Storage - stores the stopwatches in an S3 bucket.
 * DEPRECATED: Ended up not implementing this because it didn't really make sense to
 *             keep pulling data from S3 to display on the calendar.
 *             Saving to S3 is now an optional parameter on the FSStorage.
 *
 * @class S3Storage
 * @extends {Storage}
 */
 class S3Storage extends Storage {

    constructor() {
        super();
        this.getSettings().then((settings) => {
            this.bucket_name = settings.bucket_name;
            this.aws_access_key_id = settings.aws_access_key_id;
            this.aws_secret_access_key = settings.aws_secret_access_key;
        })
      }

    async connect() {
        const s3 = new AWS.S3({
            accessKeyId: this.aws_access_key_id,
            secretAccessKey: this.aws_secret_access_key
        });
        return s3
    }

    async getSettings() {
        let bucket_name = await settings.get('bucket_name')
        let aws_access_key_id = await settings.get('aws_access_key_id')
        let aws_secret_access_key = await settings.get('aws_secret_access_key')
        return {
            bucket_name,
            aws_access_key_id,
            aws_secret_access_key
        }
    }
  
    isMissingSettings() {
        // Raises a notification if a bucket is not set
        if (!this.bucket_name || !this.aws_access_key_id || !this.aws_secret_access_key) {
            new Notification({ title: "Failed to save stopwatch to S3.", body: "Please make sure your settings are correctly configured." }).show();
            return true
        } else {
            return false
        }
    }

    async loadData() {    
        if (this.isMissingSettings()) {
            return []
        };
        
        const s3 = await this.connect();
        const params = {
            Bucket: this.bucket_name,
            MaxKeys: 2
        };
        let response = s3.listObjectsV2(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else     console.log(data); 
        });

        console.log(response);

        return data
    }
    
    async saveStopwatch(stopwatchData) {
        // Saves a stopwatch to S3
        if (this.isMissingSettings()) {
            return false
        }
        const s3 = await this.connect();
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

        new Notification({ title: "Stopwatched saved succesfully.", body: `Stopwatch saved at ${key}.` }).show()
        return true
    }
}

export { S3Storage }