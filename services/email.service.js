"use strict";
const logger = require("./logger.service");
const client = require("@sendgrid/mail");
const TAG = `[ MAILGUN.MIDDLEWARE ]`;

class EmailService {
    constructor(apiKey) {
        client.setApiKey(apiKey);
    }
    /**
     * 
     * @param {*} mailData 
     * @param {(err?)=>void} callback
     */
    send(mailData, callback) {
        return client.send(mailData, false, (error) => {
            if(error) {
                callback(error);
            } else {
                callback();
            }
        });
    }
    /**
     * Send separate emails to the list of users 
     * @param {*} mailData 
     * @param {(err?)=>void} callback
     */
    sendMultiple(mailData, callback) {
        return client.sendMultiple(mailData, (error) => {
            if(error) {
                callback(error);
            } else {
                callback();
            }
        });
    }
}

module.exports = new EmailService(process.env.SENDGRID_API_KEY);
