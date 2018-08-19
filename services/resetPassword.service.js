"use strict";
const logger = require("./logger.service");
const PasswordReset = require("../models/passwordResetToken.model");
const jwt = require("jsonwebtoken");

function findByAccountId (accountId) {
    const TAG = `[ PasswordReset Service # findByAccountId ]`;
    return PasswordReset.findOne({
        accountId: accountId
    }).exec(function (error, result) {
        if (error) {
            logger.error(`${TAG} Failed to find passwordReset by accountId`, error);
            return;
        } else {
            logger.info(`${TAG} ${result}`)
        }
    });
}
function findById (id) {
    const TAG = `[ PasswordReset Service # findById ]`;
    return PasswordReset.findById(id, function (error, result) {
        if (error) {
            logger.error(`${TAG} Failed to find passwordReset by Id`, error);
            return;
        }
    }).exec();
}

async function create (accountId) {
    const TAG = `[ PasswordReset Service # create]:`;
    //Create new instance of password reset token
    const newResetToken = PasswordReset({
        accountId: accountId
    });

    //invalidate all of the previous reset tokens such that they do not work anymore
    await PasswordReset.update({
        accountId: accountId
    }, {
        $set: {
            wasUsed: true
        }
    }, {
        multi: true
    }, (error) => {
        if (error) {
            logger.error(`${TAG} could not invalidate all previous password reset tokens`, error);
        } else {
            logger.info(`${TAG} invalidated all previous password reset tokens ${accountId}`);
        }
    });

    const success = await newResetToken.save(function (error) {
        if (error) {
            logger.error(`${TAG} new password reset token storage failed`, error);
        } else {
            logger.info(`${TAG} stored new password reset token for account ${accountId}`);
        }
    });
    return !!(success);
}

function deleteToken (id) {
    const TAG = `[ PasswordReset Service # deleteToken]:`;
    //Create new instance of password reset token
    return PasswordReset.deleteOne({_id: id}, (err) => {
        if(err) {
            logger.erro(`${TAG} could not delete token id: ${id}`);
        }
    });
}


function generateToken (resetId, accountId) {
    const token = jwt.sign({
        resetId: resetId,
        accountId: accountId
    }, process.env.JWT_RESET_PWD_SECRET, {
        expiresIn: "1 day"
    });
    return token;
}

function generateTokenLink (httpOrHttps, address, token) {
    const link = `${httpOrHttps}://${address}/auth/password/reset?token=${token}`;
    return link;
}

function generateResetPasswordEmail (hostname, receiverEmail, token) {
    const httpOrHttps = (hostname === "localhost") ? "http" : "https";
    const address = (hostname === "localhost") ? `localhost:${process.env.PORT}` : hostname;
    const tokenLink = generateTokenLink(httpOrHttps, address, token);
    if (token === undefined || tokenLink === undefined) {
        return undefined;
    }
    const mailData = {
        from: process.env.NO_REPLY_EMAIL,
        to: receiverEmail,
        subject: "Request to reset password",
        html: generateMailBody(tokenLink, receiverEmail)
    };
    return mailData;
}

function generateMailBody(link) {
    return `<b>Reset password: 
            <a href="${link}" class="button button--green" target="_blank" style="-webkit-text-size-adjust: none; background: #22BC66; border-color: #22bc66; border-radius: 3px; border-style: solid; border-width: 10px 18px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); box-sizing: border-box; color: #FFF; display: inline-block; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; text-decoration: none;">here</a>
        </b>`;
}


module.exports = {
    findByAccountId: findByAccountId,
    findById: findById,
    create: create,
    generateToken: generateToken,
    deleteToken: deleteToken,
    generateTokenLink: generateTokenLink,
    generateResetPasswordEmail: generateResetPasswordEmail,
    generateMailBody: generateMailBody
}