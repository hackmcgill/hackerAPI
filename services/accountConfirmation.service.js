"use strict";
const logger = require("./logger.service");
const AccountConfirmation = require("../models/accountConfirmationToken.model");
const Constants = require("../constants");
const jwt = require("jsonwebtoken");
const path = require("path");
const Services = {
    Email: require("./email.service")
};

/**
 * @function findByAccountId
 * @param {ObjectId} accountId
 * @return {DocumentQuery} The document query will resolve to either account confirmation or null.
 * @description Finds an account confirmation document by accountId.
 */
function findByAccountId(accountId) {
    const TAG = `[ AccountConfirmation Reset Service # findByAccountId ]`;
    return AccountConfirmation.findOne({
        accountId: accountId
    }, logger.queryCallbackFactory(TAG, "AccountConfirmation", "accountId"));
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to either account confirmation or null.
 * @description Finds an account by mongoID.
 */
function findById(id) {
    const TAG = `[ AccountConfirmation Service # findById ]`;
    return AccountConfirmation.findById(id, logger.queryCallbackFactory(TAG, "AccountConfirmation", "mongoId"));
}

/**
 * Creates Account Confirmation document in the database
 * @param {String} type the type of user which to create the token for
 * @param {String} email
 * @param {ObjectId} accountId optional accountId parameter to link to account, optional when token is being made for not a hacker
 * @returns {Promise.<*>}
 */
async function create(type, email, accountId) {
    //Create new instance of account confirmation
    const newAccountToken = AccountConfirmation({
        accountType: type,
        email: email
    });
    if (accountId !== undefined) {
        newAccountToken.accountId = accountId;
    }
    return newAccountToken.save();
}

/**
 * Generates JWT for Confirming account
 * @param {ObjectId} accountConfirmationId
 * @param {ObjectId} accountId
 * @returns {string} JWT Token containing accountId and accountConfirmationId
 */
function generateToken(accountConfirmationId, accountId) {
    const token = jwt.sign({
        accountConfirmationId: accountConfirmationId,
        accountId: accountId
    }, process.env.JWT_CONFIRM_ACC_SECRET, {
        expiresIn: "7 day"
    });
    return token;
}

/**
 * Generates the link that the user will use to access the page to finish account creation
 * @param {'http'|'https'} httpOrHttps 
 * @param {string} domain the domain of the current
 * @param {string} type the model that the 
 * @param {string} token the reset token
 * @returns {string} the string, of form: [http|https]://{domain}/{model}/create?token={token}
 */
function generateTokenLink(httpOrHttps, domain, type, token) {
    const link = `${httpOrHttps}://${domain}/${type}/create?token=${token}`;
    return link;
}

/**
 * Generates the mailData for the account confirmation Email.
 * @param {string} hostname The hostname that this service is running on
 * @param {string} receiverEmail The receiver of the email
 * @param {string} token The account confirmation token
 */
function generateAccountConfirmationEmail(hostname, receiverEmail, type, token) {
    const httpOrHttps = (hostname === "localhost") ? "http" : "https";
    const address = (hostname === "localhost") ? `localhost:${process.env.PORT}` : hostname;
    const tokenLink = generateTokenLink(httpOrHttps, address, type, token);
    var emailSubject = "";
    if (token === undefined || tokenLink === undefined) {
        return undefined;
    }
    if (type === Constants.HACKER) {
        emailSubject = Constants.CONFIRM_ACC_EMAIL_SUBJECTS[Constants.HACKER];
    }
    const handlebarPath = path.join(__dirname, `../assets/email/AccountConfirmation.hbs`);

    const mailData = {
        from: process.env.NO_REPLY_EMAIL,
        to: receiverEmail,
        subject: emailSubject,
        html: Services.Email.renderEmail(handlebarPath, {
            link: tokenLink
        })
    };
    return mailData;
}
module.exports = {
    findById: findById,
    findByAccountId: findByAccountId,
    create: create,
    generateToken: generateToken,
    generateAccountConfirmationEmail: generateAccountConfirmationEmail,
}