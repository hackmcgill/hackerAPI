"use strict";

const TAG = `[ ADDRESS.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    RoleBinding: require("../services/roleBinding.service"),
    Logger: require("../services/logger.service"),
    Account: require("../services/account.service"),
    AccountConfirmation: require("../services/accountConfirmation.service"),
    Email: require("../services/email.service"),
    Env: require("../services/env.service")
};

const Middleware = {
    Util: require("../middlewares/util.middleware")
};

const Constants = {
    Error: require("../constants/error.constant"),
    General: require("../constants/general.constant")
};

/**
 * @function parsePatch
 * @param {body: {id: ObjectId}} req
 * @param {*} res
 * @param {(err?) => void} next
 * @return {void}
 * @description Delete the req.body.id that was added by the validation of route parameter.
 */
function parsePatch(req, res, next) {
    delete req.body.id;
    return next();
}

/**
 * @function parseAccount
 * @param {{body: {firstName: string, lastName: string, email: string, password: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Moves firstName, lastName, email, password from req.body to req.body.accountDetails.
 * Hashes the password.
 * Adds _id to accountDetails.
 */
function parseAccount(req, res, next) {
    const accountDetails = {
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        pronoun: req.body.pronoun,
        gender: req.body.gender,
        email: req.body.email,
        password: Services.Account.hashPassword(req.body.password),
        dietaryRestrictions: req.body.dietaryRestrictions,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        phoneNumber: req.body.phoneNumber
    };

    delete req.body.firstName;
    delete req.body.lastName;
    delete req.body.pronoun;
    delete req.body.gender;
    delete req.body.email;
    delete req.body.password;
    delete req.body.dietaryRestrictions;
    delete req.body.gender;
    delete req.body.birthDate;
    delete req.body.phoneNumber;

    req.body.accountDetails = accountDetails;
    return next();
}

/**
 * Middleware that updates the password for the current user
 * @param {{body: {password: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function updatePassword(req, res, next) {
    req.body.account = await Services.Account.updatePassword(
        req.body.decodedToken.accountId,
        req.body.password
    );
    return next();
}

/**
 * @async
 * @function getById
 * @param {{body: {id: string}}} req
 * @param {*} res
 * @description Retrieves an account's information from mongoId specified in req.body.id, and places it in req.body.account
 */
async function getById(req, res, next) {
    const acc = await Services.Account.findById(req.body.id);

    if (!acc) {
        return next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE
        });
    }

    req.body.account = acc;
    return next();
}

/**
 * @async
 * @function getByEmail
 * @param {{user: {email: string}}} req
 * @param {*} res
 * @description Gets an account by user email, and sets req.body.acc to the retrived account object if successful.
 */
async function getByEmail(req, res, next) {
    const acc = await Services.Account.findByEmail(req.user.email);

    if (!acc) {
        return next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE
        });
    }

    req.body.account = acc;
    next();
}

/**
 * @function addAccount
 * @param {{body: {accountDetails: object}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Creates account document after checking if it exists first
 */
async function addAccount(req, res, next) {
    const accountDetails = req.body.accountDetails;
    //Check duplicate
    const exists = await Services.Account.findByEmail(accountDetails.email);
    if (exists) {
        return next({
            status: 422,
            message: Constants.Error.ACCOUNT_DUPLICATE_422_MESSAGE,
            error: {
                route: req.path
            }
        });
    }
    const account = await Services.Account.addOneAccount(accountDetails);
    req.body.account = account;
    return next();
}

/**
 * Updates an account that is specified by req.params.id
 * @param {{params:{id: string}, body: *}} req
 * @param {*} res
 * @param {*} next
 */
async function updateAccount(req, res, next) {
    var account = await Services.Account.findById(req.params.id);

    // If we are changing the email, and there is a difference between the two, set back to unconfirmed status.
    // TODO: When pull request for parse patch refactor #546 hits, req.body.email will not be present.
    if (req.body.email && account.email != req.body.email) {
        const existingAccount = await Services.Account.findByEmail(
            req.body.email
        );
        if (existingAccount) {
            return next({
                status: 409,
                message: Constants.Error.ACCOUNT_EMAIL_409_MESSAGE
            });
        } else {
            req.body.confirmed = false;
        }
    }

    req.body.account = await Services.Account.updateOne(
        req.params.id,
        req.body
    );

    if (req.body.account) {
        return next();
    } else {
        return next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE,
            data: {
                id: req.params.id
            }
        });
    }
}

/**
 * @function inviteAccount
 * @param {{body: {email: string, accountType: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * Creates email to provide a link for the user to create an account
 */
async function inviteAccount(req, res, next) {
    const email = req.body.email;
    const accountType = req.body.accountType;
    const confirmationObj = await Services.AccountConfirmation.create(
        accountType,
        email,
        Constants.General.CONFIRMATION_TYPE_INVITE
    );
    const confirmationToken = Services.AccountConfirmation.generateToken(
        confirmationObj.id
    );
    const address = Services.Env.isProduction()
        ? process.env.FRONTEND_ADDRESS_DEPLOY
        : process.env.FRONTEND_ADDRESS_DEV;

    const mailData = Services.AccountConfirmation.generateAccountInvitationEmail(
        address,
        email,
        accountType,
        confirmationToken
    );
    if (mailData !== undefined) {
        Services.Email.send(mailData, (err) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    } else {
        return next({
            message: Constants.Error.EMAIL_500_MESSAGE
        });
    }
}
/**
 * Gets all of the invites in the database and adds it to req.body.
 * @param {{}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function getInvites(req, res, next) {
    const invites = await Services.AccountConfirmation.find({
        confirmationType: Constants.General.CONFIRMATION_TYPE_INVITE
    });
    req.body.invites = invites;
    next();
}

module.exports = {
    parsePatch: parsePatch,
    parseAccount: parseAccount,
    // untested
    getInvites: Middleware.Util.asyncMiddleware(getInvites),
    getByEmail: Middleware.Util.asyncMiddleware(getByEmail),
    getById: Middleware.Util.asyncMiddleware(getById),
    // untested
    updatePassword: Middleware.Util.asyncMiddleware(updatePassword),
    addAccount: Middleware.Util.asyncMiddleware(addAccount),
    updateAccount: Middleware.Util.asyncMiddleware(updateAccount),
    inviteAccount: Middleware.Util.asyncMiddleware(inviteAccount)
};
