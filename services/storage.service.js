"use strict";
// Imports the Google Cloud client library
const GStorage = require("@google-cloud/storage");

class StorageService {
    constructor() {
        this.bucketName = process.env.BUCKET_NAME;
        const credentials = {
            /* jshint ignore:start */
            client_email: process.env.CLIENT_EMAIL,
            private_key: process.env.PRIVATE_KEY
            /* jshint ignore:end */
        };
        this.storage = new GStorage({
            projectId: process.env.GCLOUD_PROJECT,
            keyFilename: __dirname + "/../gcp_creds.json"
        });
        this.bucket = this.storage.bucket(this.bucketName);
    }
    /**
     * Upload a file to storage. 
     * @param {{mimetype:string,buffer:Buffer}} file Multer file object
     * @param {string} gcfilename the location in the bucket that you want the file stored.
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
        const _this = this;
        return new Promise(function(resolve, reject) {
            blobStream.on("finish", () => {
                resolve(_this.getPublicUrl(gcfilename));
            });
            blobStream.on("error", reject);
            //write the file data into the stream, and end it.
            blobStream.end(file.buffer);
        });
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
    /**
     * Delete a file
     * @param {*} filename the file that you want to delete
     * @returns {Promise<[ApiResponse]>} 
     */
    delete(filename) {
        const file = this.bucket.file(filename);
        return file.delete();
    }

    /**
     * 
     * @param {*} filename the file that you want to check exists
     * @returns {Promise<[Boolean]>} 
     */
    exists(filename) {
        const file = this.bucket.file(filename);
        return file.exists();
    }
    /**
     * Get the public URL of the file
     * @param {string} filename the path of the file
     */
    getPublicUrl (filename) {
        return `https://storage.googleapis.com/${this.bucket.name}/${filename}`;
    }
}

module.exports = new StorageService();
