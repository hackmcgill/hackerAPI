"use strict";

const S3 = require("@aws-sdk/client-s3");
const Logger = require("./logger.service");

class StorageService {
    constructor() {
        this.bucketName = process.env.BUCKET_NAME;

        const region = process.env.AWS_REGION;

        const credentials = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        };

        try {
            this.client = new S3.S3Client({ region, credentials });
        } catch (error) {
            Logger.error(error);
        }
    }

    /**
     * Upload a file to storage.
     * @param {{mimetype:string,buffer:Buffer}} file Multer file object
     * @param {string} s3filename the location in the bucket that you want the file stored.
     * @returns {Promise<string>} the address of the file that was uploaded
     */
    upload(file, s3filename) {
        const command = new S3.PutObjectCommand({
            Bucket: this.bucketName,
            Key: s3filename,
            Body: file.buffer
        });

        return this.client
            .send(command)
            .then(() => this.getPublicUrl(s3filename));
    }

    /**
     * Download file from storage.
     * @param {string} filename path to file in bucket
     * @returns {Promise<[Buffer]>} the file data that was returned
     */
    download(filename) {
        const command = new S3.GetObjectCommand({
            Bucket: this.bucketName,
            Key: filename
        });

        return this.client
            .send(command)
            .then((response) => response.Body.transformToByteArray())
            .then((arr) => [Buffer.from(arr)]);
    }

    /**
     * Delete a file
     * @param {*} filename the file that you want to delete
     * @returns {Promise<[ApiResponse]>}
     */
    delete(filename) {
        const command = new S3.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: filename
        });

        return this.client.send(command);
    }

    /**
     *
     * @param {*} filename the file that you want to check exists
     * @returns {Promise<[Boolean]>}
     */
    exists(filename) {
        const command = new S3.HeadObjectCommand({
            Bucket: this.bucketName,
            Key: filename
        });

        return this.client
            .send(command)
            .then(() => [true])
            .catch((err) => {
                if (err.$metadata && err.$metadata.httpStatusCode == 404) {
                    return [false];
                }
                throw err;
            });
    }

    /**
     * Get the public URL of the file
     * @param {string} filename the path of the file
     */
    getPublicUrl(filename) {
        return `https://${this.bucketName}.s3.amazonaws.com/${filename}`;
    }
}

module.exports = new StorageService();
