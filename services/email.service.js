"use strict";
const logger = require("./logger.service");
const client = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
const TAG = `[ EMAIL.SERVICE ]`;
const env = require("../services/env.service");
const Constants = require("../constants");

class EmailService {
    constructor(apiKey) {
        client.setApiKey(apiKey);
    }

    /**
     * Send one email
     * @param {*} mailData 
     * @param {(err?)=>void} callback
     */
    send(mailData, callback = () => {}) {
        if (env.isTest()) {
            //Silence all actual emails if we're testing
            mailData.mailSettings = {
                sandboxMode: {
                    enable: true
                }
            };
        }
        return client.send(mailData, false, (error) => {
            if (error) {
                logger.error(`${TAG} ` + JSON.stringify(error));
                callback(error);
            } else {
                callback();
            }
        });
    }
    /**
     * Send separate emails to the list of users in mailData
     * @param {*} mailData 
     * @param {(err?)=>void} callback
     */
    sendMultiple(mailData, callback = () => {}) {
        return client.sendMultiple(mailData, (error) => {
            if (error) {
                logger.error(`${TAG} ` + JSON.stringify(error));
                callback(error);
            } else {
                callback();
            }
        });
    }

    sendStatusUpdate(recipient, status, callback) {
        const mailData = {
            to: recipient,
            from: process.env.NO_REPLY_EMAIL,
            subject: Constants.EMAIL_SUBJECTS[status],
            html: fs.readFileSync(path.join(__dirname, `../assets/email/statusEmail/${status}.html`)).toString()
        };
        this.send(mailData).then(
            (response) => {
                if (response[0].statusCode >= 200 && response[0].statusCode < 300) {
                    callback();
                } else {
                    callback(response[0]);
                }
            }, callback);
    }
}

module.exports = new EmailService(process.env.SENDGRID_API_KEY);