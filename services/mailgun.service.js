"use strict";
const logger = require("../services/logger.service"); 
const mailgun = require("mailgun-js")({ 
    apiKey: process.env.MAILGUN_API_KEY, 
    domain: process.env.MAILGUN_DOMAIN 
});

const MailComposer = require("nodemailer/lib/mail-composer");

const TAG = `[ MAILGUN.MIDDLEWARE ]`;

module.exports = { 
    send: (mailData, callback) => { 
        mailgun.messages().send(mailData, function (error, body) { 
            if(error){ 
                callback(error); 
            } 
            else { 
                logger.debug(`${TAG} Sent email with this data: ${body}`);
                callback(); 
            } 
        }); 
    }, 
    sendMime: (mailData, callback) => { 
        const mail = new MailComposer(mailData);
        mail.compile().build((err, message) => {
            if(err){
                logger.error(`${TAG} Error while building mime message`);
                callback(err);
                return;
            }
            else {
                const dataToSend = {
                    to: mailData.to,
                    message: message.toString("ascii")
                };
                mailgun.messages().sendMime(dataToSend, (sendError) => {
                    if (sendError) {
                        logger.error(`${TAG} Error while sending mime message`);
                        callback(sendError); 
                        return;
                    }
                    else {
                        logger.debug(`${TAG} Sent a MIME email to: ${mailData.to}, from: ${mailData.from}`);
                        callback(); 
                    }
                });
            }
        });
    }
} 
