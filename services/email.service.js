"use strict";
const logger = require("./logger.service");
const client = require("@sendgrid/mail");
const TAG = `[ EMAIL.SERVICE ]`;
const env = require("../services/env.service");
const Handlebars = require("handlebars");
const fs = require("fs");

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
    /**
     * Generates the HTML from the handlebars template file found at the given path.
     * @param {string} path the absolute path to the handlebars template file
     * @param {*} context any variables that need to be replaced in the template file
     */
    renderEmail(path, context) {
        const templateStr = fs.readFileSync(path).toString();
        const template = Handlebars.compile(templateStr);
        return template(context);
    }
}

module.exports = new EmailService(process.env.SENDGRID_API_KEY);