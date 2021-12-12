import client from "@sendgrid/mail";
import { readFileSync } from "fs";
import { join } from "path";
const Constants = require("../constants/general.constant");
import * as Handlebars from "handlebars";
import { autoInjectable } from "tsyringe";
import { EnvService } from "./env.service";

@autoInjectable()
export class EmailService {
    constructor(private readonly envService: EnvService) {
        client.setApiKey(this.envService.get("SENDGRID_API_KEY") ?? "");
    }

    /**
     * Send one email
     * @param {*} mailData
     * @param {(err?)=>void} callback
     */
    send(mailData: any, callback = (error?: Object) => {}) {
        if (this.envService.isTest()) {
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
        const handlebarsPath = join(__dirname, `../assets/email/Ticket.hbs`);
        const html = this.renderEmail(handlebarsPath, {
            firstName: firstName,
            ticket: ticket
        });
        const mailData = {
            to: recipient,
            from: this.envService.get("NO_REPLY_EMAIL"),
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
        const handlebarsPath = join(__dirname, `../assets/email/Welcome.hbs`);
        const html = this.renderEmail(handlebarsPath, {
            firstName: firstName
        });
        const mailData = {
            to: recipient,
            from: this.envService.get("NO_REPLY_EMAIL"),
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
        const handlebarsPath = join(
            __dirname,
            `../assets/email/statusEmail/${status}.hbs`
        );
        const mailData = {
            to: recipient,
            from: this.envService.get("NO_REPLY_EMAIL"),
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
        const templateStr = readFileSync(path).toString();
        const template = Handlebars.compile(templateStr);
        return template(context);
    }
}
