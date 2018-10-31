"use strict";

const TAG = `[ ADDRESS.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    RoleBinding: require("../services/roleBinding.service"),
    Logger: require("../services/logger.service"),
    Account: require("../services/account.service")
};

const Middleware = {
    Util: require("../middlewares/util.middleware")
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
    next();
}

/**
 * @function parseAccount
 * @param {{body: {firstName: string, lastName: string, email: string, password: string, dietaryRestrictions: string, shirtSize: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves firstName, lastName, email, password, dietaryRestrictions, shirtSize from req.body to req.body.accountDetails.
 * Hashes the password.
 * Adds _id to accountDetails.
 */
function parseAccount(req, res, next) {
    const accountDetails = {
        _id: mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: Services.Account.hashPassword(req.body.password),
        dietaryRestrictions: req.body.dietaryRestrictions,
        shirtSize: req.body.shirtSize
    };

    delete req.body.firstName;
    delete req.body.lastName;
    delete req.body.email;
    delete req.body.password;
    delete req.body.dietaryRestrictions;
    delete req.body.shirtSize;

    req.body.accountDetails = accountDetails;

    next();
}

/**
 * Middleware that updates the password for the current user
 * @param {{body: {password: string}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next
 */
async function updatePassword(req, res, next) {
    req.body.account = await Services.Account.updatePassword(req.body.decodedToken.accountId, req.body.password);
    next();
}

// TODO: fix when new permission system is created
async function addDefaultHackerPermissions(req, res, next) {
    // await Services.RoleBinding.createRoleBinding(req.);
    next();
}
async function createAccount(req, res, next) {
    const accountDetails = req.body.accountDetails;
    const success = await Services.Account.addOneAccount(accountDetails);
    if (!success) {
        next({
            message: "Issue with account creation",
            data: {}
        });
    } else {
        next();
    }
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
        var err = new Error("Account already exists");
        err.status = 409;
        next(err);
    }
    const account = await Services.Account.addOneAccount(accountDetails);
    req.body.account = account;
    next();
}

module.exports = {
    parsePatch: parsePatch,
    parseAccount: parseAccount,
    // untested
    addDefaultHackerPermissions: Middleware.Util.asyncMiddleware(addDefaultHackerPermissions),
    // untested
    updatePassword: Middleware.Util.asyncMiddleware(updatePassword),
    addAccount: Middleware.Util.asyncMiddleware(addAccount)
};