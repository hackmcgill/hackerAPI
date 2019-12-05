"use strict";
const logger = require("./logger.service");
const client = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
const TAG = `[ EMAIL.SERVICE ]`;
const env = require("../services/env.service");
const Constants = require("../constants/general.constant");
const Handlebars = require("handlebars");

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
     * Send email with ticket.
     * @param {string} firstName the recipient's first name
     * @param {string} recipient the recipient's email address
     * @param {string} ticket the ticket image (must be base-64 string)
     * @param {(err?)=>void} callback
     */
    sendWeekOfEmail(firstName, recipient, ticket, callback) {
        const handlebarsPath = path.join(
            __dirname,
            `../assets/email/Ticket.hbs`
        );
        const html = this.renderEmail(handlebarsPath, {
            firstName: firstName,
            ticket: ticket
        });
        const mailData = {
            to: recipient,
            from: process.env.NO_REPLY_EMAIL,
            subject: Constants.EMAIL_SUBJECTS[Constants.WEEK_OF],
            html: html
        };
        this.send(mailData).then((response) => {
            if (response[0].statusCode >= 200 && response[0].statusCode < 300) {
                callback();
            } else {
                callback(response[0]);
            }
        }, callback);
    }
    /**
     * Send email with ticket.
     * @param {string} firstName the recipient's first name
     * @param {string} recipient the recipient's email address
     * @param {(err?)=>void} callback
     */
    sendDayOfEmail(firstName, recipient, callback) {
        const handlebarsPath = path.join(
            __dirname,
            `../assets/email/Welcome.hbs`
        );
        const html = this.renderEmail(handlebarsPath, {
            firstName: firstName
        });
        const mailData = {
            to: recipient,
            from: process.env.NO_REPLY_EMAIL,
            subject: Constants.EMAIL_SUBJECTS[Constants.WEEK_OF],
            html: html
        };
        this.send(mailData).then((response) => {
            if (response[0].statusCode >= 200 && response[0].statusCode < 300) {
                callback();
            } else {
                callback(response[0]);
            }
        }, callback);
    }

    sendStatusUpdate(firstName, recipient, status, callback) {
        const handlebarsPath = path.join(
            __dirname,
            `../assets/email/statusEmail/${status}.hbs`
        );
        const mailData = {
            to: recipient,
            from: process.env.NO_REPLY_EMAIL,
            subject: Constants.EMAIL_SUBJECTS[status],
            html: this.renderEmail(handlebarsPath, {
                firstName: firstName
            })
        };
        this.send(mailData).then((response) => {
            if (response[0].statusCode >= 200 && response[0].statusCode < 300) {
                callback();
            } else {
                callback(response[0]);
            }
        }, callback);
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
