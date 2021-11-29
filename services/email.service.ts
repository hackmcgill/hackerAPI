"use strict";
const logger = require("./logger.service");
import client from "@sendgrid/mail";
import * as fs from "fs";
import * as path from "path";
const TAG = `[ EMAIL.SERVICE ]`;
const env = require("../services/env.service");
const Constants = require("../constants/general.constant");
import * as Handlebars from "handlebars";

class EmailService {
    constructor(apiKey: string = "") {
        client.setApiKey(apiKey);
    }

    /**
     * Send one email
     * @param {*} mailData
     * @param {(err?)=>void} callback
     */
    send(mailData: any, callback = (error?: Object) => {}) {
        if (env.isTest()) {
            //Silence all actual emails if we're testing
            mailData.mailSettings = {
                sandboxMode: {
                    enable: true
                }
            };
        }
        return client
            .send(mailData, false)
            .then((response) => {
                callback();
                return response;
            })
            .catch((error) => {
                callback(error);
            });
    }
    /**
     * Send separate emails to the list of users in mailData
     * @param {*} mailData
     * @param {(err?)=>void} callback
     */
    sendMultiple(mailData: any, callback = (error?: Object) => {}) {
        return client
            .sendMultiple(mailData)
            .then((response) => {
                callback();
                return response;
            })
            .catch((error) => {
                callback(error);
            });
    }
    /**
     * Send email with ticket.
     * @param {string} firstName the recipient's first name
     * @param {string} recipient the recipient's email address
     * @param {string} ticket the ticket image (must be base-64 string)
     * @param {(err?)=>void} callback
     */
    sendWeekOfEmail(
        firstName: string,
        recipient: string,
        ticket: string,
        callback = (error?: Object) => {}
    ) {
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
            if (
                !response ||
                (response[0].statusCode >= 200 && response[0].statusCode < 300)
            ) {
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
    sendDayOfEmail(
        firstName: string,
        recipient: string,
        callback = (error?: Object) => {}
    ) {
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
            if (
                !response ||
                (response[0].statusCode >= 200 && response[0].statusCode < 300)
            ) {
                callback();
            } else {
                callback(response[0]);
            }
        }, callback);
    }

    sendStatusUpdate(
        firstName: string,
        recipient: string,
        status: string,
        callback = (error?: Object) => {}
    ) {
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
            if (
                !response ||
                (response[0].statusCode >= 200 && response[0].statusCode < 300)
            ) {
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
    renderEmail(path: string, context: Object) {
        const templateStr = fs.readFileSync(path).toString();
        const template = Handlebars.compile(templateStr);
        return template(context);
    }
}

module.exports = new EmailService(process.env.SENDGRID_API_KEY);
