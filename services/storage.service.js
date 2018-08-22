"use strict";
// Imports the Google Cloud client library
import Storage from "@google-cloud/storage";

const Multer = require("multer");

class StorageService {
    constructor() {
        this.bucketName = process.env.BUCKET_NAME;
        const credentials = {
            /* jshint ignore:start */
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY
            /* jshint ignore:end */
        };
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT,
            credentials: credentials
        });
        this.bucket = this.storage.bucket(this.bucketName);
    }
    /**
     * Upload a file to storage. 
     * @param {Multer.File} file Multer file object
     * @returns {Promise<string>} the address of the file that was uploaded
     */
    upload(file, gcfilename) {
        const blob = this.bucket.file(gcfilename);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype
          },
          resumable: false
        });
        return new Promise(function(resolve, reject) {
            blobStream.on("finish", () => {
                resolve(this.getPublicUrl(gcfilename));
            });
            blobStream.on("error", reject);
            //write the file data into the stream, and end it.
            blobStream.end(file.buffer);
        });
    }
    /**
     * Get the public URL of the file
     * @param {string} filename the path of the file
     */
    getPublicUrl (filename) {
        return `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
    }
    /**
     * Download file from storage.
     * @param {string} filename path to file in bucket
     * @returns {Promise<[Buffer]>} the file data that was returned
     */
    download(filename) {
        const file = this.bucket.file(filename);
        return new Promise((resolve, reject) => {
            file.exists().then((doesExist) => {
                if(doesExist) {
                    file.download()
                    .then(resolve)
                    .catch(reject);
                } else {
                    reject("file does not exist");
                }
            });    
        });
    }
}

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

module.exports = {
    StorageService: new StorageService(),
    Multer: multer
};
