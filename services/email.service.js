"use strict";
const logger = require("./logger.service");
const client = require("@sendgrid/mail");
const TAG = `[ EMAIL.SERVICE ]`;
const env = require("../services/env.service");

class EmailService {
    constructor(apiKey) {
        client.setApiKey(apiKey);
    }
    /**
     * Send one email
     * @param {*} mailData 
     * @param {(err?)=>void} callback
     */
    send(mailData, callback = ()=>{}) {
        if(env.isTest()) {
            //Silence all actual emails if we're testing
            mailData.mailSettings = {
                sandboxMode: {
                    enable: true
                }
            };
        }
        return client.send(mailData, false, (error) => {
            if(error) {
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
    sendMultiple(mailData, callback = ()=>{}) {
        return client.sendMultiple(mailData, (error) => {
            if(error) {
                logger.error(`${TAG} ` + JSON.stringify(error));
                callback(error);
            } else {
                callback();
            }
        });
    }
}

module.exports = new EmailService(process.env.SENDGRID_API_KEY);
