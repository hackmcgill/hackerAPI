const logger = require("./logger.service");
import PasswordReset from "../models/passwordResetToken.model";
const jwt = require("jsonwebtoken");
const path = require("path");
const Services = {
    Email: require("./email.service"),
    Account: require("./account.service")
};

async function findByAccountId(
    identifier: number
): Promise<PasswordReset | undefined> {
    const TAG = `[ PasswordReset Service # findByAccountId ]`;
    return await PasswordReset.findOne({ where: { account: identifier } }).then(
        (account) => {
            logger.queryCallbackFactory(TAG, "passwordReset", "accountId");
            return account;
        }
    );
}

function findById(identifier: number): Promise<PasswordReset | undefined> {
    const TAG = `[ PasswordReset Service # findById ]`;

    return PasswordReset.findOne(identifier).then(
        (passwordReset: PasswordReset) => {
            logger.queryCallbackFactory(TAG, "passwordReset", "identifier");
            return passwordReset;
        }
    );
}

async function create(accountId: number) {
    const TAG = `[ PasswordReset Service # create]:`;
    //Create new instance of password reset token
    const newResetToken = PasswordReset.create({
        account: await Services.Account.findOne(accountId),
        createdAt: new Date()
    });

    // TODO - Previous behaviour was to mark reset tokens as used in "wasUsed" field.

    //invalidate all of the previous reset tokens such that they do not work anymore
    await PasswordReset.delete({
        account: await Services.Account.findOne(accountId)
    })
        .then(() => {
            logger.info(
                `${TAG} invalidated all previous password reset tokens ${accountId}`
            );
        })
        .catch((error: Object) => {
            logger.error(
                `${TAG} could not invalidate all previous password reset tokens`,
                error
            );
        });

    return newResetToken.save();
}

function deleteToken(identifier: number) {
    const TAG = `[ PasswordReset Service # deleteToken]:`;

    //Create new instance of password reset token
    return PasswordReset.delete(identifier).catch((error: Object) => {
        logger.error(`${TAG} could not delete token id: ${identifier}`);
    });
}

function generateToken(resetId: number, accountId: number) {
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
function generateTokenLink(httpOrHttps: string, domain: string, token: string) {
    const link = `${httpOrHttps}://${domain}/password/reset?token=${token}`;
    return link;
}

/**
 * Generates the mailData for the resetPassword Email.
 * @param {string} address The web address that the front-end service is running on
 * @param {string} receiverEmail The receiver of the email
 * @param {string} token The resetPassword token
 */
function generateResetPasswordEmail(
    address: string,
    receiverEmail: string,
    token: string
) {
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
