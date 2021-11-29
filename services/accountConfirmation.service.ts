const logger = require("./logger.service");
import AccountConfirmation from "../models/accountConfirmationToken.model";
import { findById as findByIdAccountService } from "./account.service";
const Constants = require("../constants/general.constant");
const jwt = require("jsonwebtoken");
const path = require("path");
const Services = {
    Email: require("./email.service")
};

/**
 * @function findByAccountId
 * @param {number} identifier
 * @return {Promise<AccountConfirmation | undefined>} The document query will resolve to either account confirmation or null.
 * @description Finds an account confirmation document by accountId.
 */
async function findByAccountId(
    identifier: number
): Promise<AccountConfirmation | undefined> {
    const TAG = `[ AccountConfirmation Reset Service # findByAccountId ]`;

    return await AccountConfirmation.findOne({
        where: { account: identifier }
    }).then((accountConfirmation) => {
        logger.queryCallbackFactory(TAG, "AccountConfirmation", "accountId");
        return accountConfirmation;
    });
}

/**
 * @function findById
 * @param {number} identifier
 * @return {Promise<AccountConfirmation | undefined>} The document query will resolve to either account confirmation or null.
 * @description Finds an account by mongoID.
 */
async function findById(
    identifier: number
): Promise<AccountConfirmation | undefined> {
    const TAG = `[ AccountConfirmation Service # findById ]`;
    return await AccountConfirmation.findOne({
        where: { identifier: identifier }
    }).then((accountConfirmation) => {
        logger.queryCallbackFactory(TAG, "AccountConfirmation", "identifier");
        return accountConfirmation;
    });
}

/**
 * @function find
 * @param {*} query the query to search the database by.
 * @return {Promise<any[]>} The document query will resolve to either account confirmations or null.
 * @description Finds an account by query.
 */
async function find(query: Object): Promise<any[]> {
    const TAG = `[ AccountConfirmation Service # find ]`;

    return await AccountConfirmation.find(query).then((accountConfirmation) => {
        logger.queryCallbackFactory(TAG, "AccountConfirmation", query);
        return accountConfirmation;
    });
}

/**
 * Creates Account Confirmation document in the database
 * @param {String} type the type of user which to create the token for
 * @param {String} email
 * @param {"Invite"|"Organic"} confirmationType whether this confirmation token is for an organic acct creation, or an invited account
 * @param {number} accountId optional accountId parameter to link to account, optional when token is being made for not a hacker
 * @returns {Promise.<*>}
 */
async function create(
    type: string,
    email: string,
    confirmationType: string,
    accountId: number
): Promise<AccountConfirmation> {
    const newAccountToken = await AccountConfirmation.create({
        accountType: type,
        email: email,
        confirmationType: confirmationType,
        account: await findByIdAccountService(accountId)
    });
    return newAccountToken.save();
}

/**
 * Generates JWT for Confirming account
 * @param {number} accountConfirmationId
 * @param {number} accountId
 * @returns {string} JWT Token containing accountId and accountConfirmationId
 */
function generateToken(accountConfirmationId: number, accountId = null) {
    const token = jwt.sign(
        {
            accountConfirmationId: accountConfirmationId,
            accountId: accountId
        },
        process.env.JWT_CONFIRM_ACC_SECRET,
        {
            expiresIn: "7 day"
        }
    );
    return token;
}

/**
 * Generates the link that the user will use to access the page to begin account creationg
 * @param {'http'|'https'} httpOrHttps
 * @param {string} domain the domain of the current
 * @param {string} type the model that the
 * @param {string} token the reset token
 * @returns {string} the string, of form: [http|https]://{domain}/{model}/create?token={token}
 */
function generateCreateAccountTokenLink(
    httpOrHttps: string,
    domain: string,
    type: string,
    token: string
): string {
    const link = `${httpOrHttps}://${domain}/account/create?token=${token}&accountType=${type}`;
    return link;
}

/**
 * Generates the link that the user will use to confirm account and proceed with account creationg
 * @param {'http'|'https'} httpOrHttps
 * @param {string} domain the domain of the current
 * @param {string} type the model that the
 * @param {string} token the reset token
 * @returns {string} the string, of form: [http|https]://{domain}/{model}/create?token={token}
 */
function generateConfirmTokenLink(
    httpOrHttps: string,
    domain: string,
    token: string
): string {
    const link = `${httpOrHttps}://${domain}/account/confirm?token=${token}`;
    return link;
}
/**
 * Generates the mailData for the account confirmation Email. This really only applies to
 * hackers as all other accounts are intrinsically confirmed via the email they recieve to invite them
 * @param {string} address The hostname that this service is running on
 * @param {string} receiverEmail The receiver of the email
 * @param {string} type the user type
 * @param {string} token The account confirmation token
 */
function generateAccountConfirmationEmail(
    address: string,
    receiverEmail: string,
    type: string,
    token: string
): Object | undefined {
    const httpOrHttps = address.includes("localhost") ? "http" : "https";
    const tokenLink = generateConfirmTokenLink(httpOrHttps, address, token);
    var emailSubject = "";
    if (token === undefined || tokenLink === undefined) {
        return undefined;
    }
    if (type === Constants.HACKER) {
        emailSubject = Constants.CONFIRM_ACC_EMAIL_SUBJECT;
    }
    const handlebarPath = path.join(
        __dirname,
        `../assets/email/AccountConfirmation.hbs`
    );

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

/*
 * Generates the mailData for the account invitation Email.
 * @param {string} address The hostname that this service is running on
 * @param {string} receiverEmail The receiver of the email
 * @param {string} type The user type
 * @param {string} token The account confirmation token
 */
function generateAccountInvitationEmail(
    address: string,
    receiverEmail: string,
    type: string,
    token: string
) {
    const httpOrHttps = address.includes("localhost") ? "http" : "https";
    const tokenLink = generateCreateAccountTokenLink(
        httpOrHttps,
        address,
        type,
        token
    );
    var emailSubject = "";
    if (token === undefined || tokenLink === undefined) {
        return undefined;
    }
    if (type === Constants.HACKER) {
        emailSubject = Constants.CREATE_ACC_EMAIL_SUBJECTS[Constants.HACKER];
    } else if (type === Constants.VOLUNTEER) {
        emailSubject = Constants.CREATE_ACC_EMAIL_SUBJECTS[Constants.VOLUNTEER];
    } else if (Constants.SPONSOR_TIERS.includes(type)) {
        emailSubject = Constants.CREATE_ACC_EMAIL_SUBJECTS[Constants.SPONSOR];
    } else if (type === Constants.STAFF) {
        emailSubject = Constants.CREATE_ACC_EMAIL_SUBJECTS[Constants.STAFF];
    }
    const handlebarPath = path.join(
        __dirname,
        `../assets/email/AccountInvitation.hbs`
    );
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

export {
    find,
    findById,
    findByAccountId,
    create,
    generateToken,
    generateAccountConfirmationEmail,
    generateAccountInvitationEmail
};
