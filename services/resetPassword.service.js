"use strict";
const logger = require("./logger.service");
const PasswordReset = require("../models/passwordResetToken.model");
const jwt = require("jsonwebtoken");
const path = require("path");
const Services = {
    Email: require("./email.service")
};

function findByAccountId(accountId) {
    const TAG = `[ PasswordReset Service # findByAccountId ]`;
    return logger.logQuery(TAG, "passwordReset", "accountId", PasswordReset.findOne({
        accountId: accountId
    }));
}

function findById(id) {
    const TAG = `[ PasswordReset Service # findById ]`;
    return logger.logQuery(TAG, "passwordReset", "mongoId", PasswordReset.findById(id));
}

async function create(accountId) {
    const TAG = `[ PasswordReset Service # create]:`;
    //Create new instance of password reset token
    const newResetToken = PasswordReset({
        accountId: accountId,
        created: new Date()
    });

    //invalidate all of the previous reset tokens such that they do not work anymore
    await PasswordReset.updateOne(
        {
            accountId: accountId
        },
        {
            $set: {
                wasUsed: true
            }
        },
        {
            multi: true
        },
        (error) => {
            if (error) {
                logger.error(
                    `${TAG} could not invalidate all previous password reset tokens`,
                    error
                );
            } else {
                logger.info(
                    `${TAG} invalidated all previous password reset tokens ${accountId}`
                );
            }
        }
    );

    return newResetToken.save();
}

function deleteToken(id) {
    const TAG = `[ PasswordReset Service # deleteToken]:`;
    //Create new instance of password reset token
    return logger.logUpdate(TAG, `token id: ${id}`, PasswordReset.deleteOne({ _id: id }));
}

function generateToken(resetId, accountId) {
    const token = jwt.sign(
        {
            resetId: resetId,
            accountId: accountId
        },
        process.env.JWT_RESET_PWD_SECRET,
        {
            expiresIn: "1 day"
        }
    );
    return token;
}

/**
 * Generates the link that the user will use to access the reset password page
 * @param {'http'|'https'} httpOrHttps
 * @param {string} domain the domain of the current
 * @param {string} token the reset token
 * @returns {string} the string, of form: [http|https]://{domain}/password/reset?token={token}
 */
function generateTokenLink(httpOrHttps, domain, token) {
    const link = `${httpOrHttps}://${domain}/password/reset?token=${token}`;
    return link;
}

/**
 * Generates the mailData for the resetPassword Email.
 * @param {string} address The web address that the front-end service is running on
 * @param {string} receiverEmail The receiver of the email
 * @param {string} token The resetPassword token
 */
function generateResetPasswordEmail(address, receiverEmail, token) {
    const httpOrHttps = address.includes("localhost") ? "http" : "https";
    const tokenLink = generateTokenLink(httpOrHttps, address, token);
    if (token === undefined || tokenLink === undefined) {
        return undefined;
    }
    const handlebarPath = path.join(
        __dirname,
        `../assets/email/ResetPassword.hbs`
    );
    const mailData = {
        from: process.env.NO_REPLY_EMAIL,
        to: receiverEmail,
        subject: "Password Reset Instructions",
        html: Services.Email.renderEmail(handlebarPath, {
            link: tokenLink
        })
    };
    return mailData;
}

module.exports = {
    findByAccountId: findByAccountId,
    findById: findById,
    create: create,
    generateToken: generateToken,
    deleteToken: deleteToken,
    generateTokenLink: generateTokenLink,
    generateResetPasswordEmail: generateResetPasswordEmail
};
