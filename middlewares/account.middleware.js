"use strict";

const TAG = `[ ADDRESS.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Permission: require("../services/permission.service"),
    Logger: require("../services/logger.service"),
    Account: require("../services/account.service")
};

const Middleware = {
    Util: require("../middlewares/util.middleware")
}

module.exports = {
    // untested
    parseAccount: parseAccount,
    // untested
    addDefaultHackerPermissions: Middleware.Util.asyncMiddleware(addDefaultHackerPermissions),
    // untested
    updatePassword: Middleware.Util.asyncMiddleware(updatePassword)
};

/**
 * Takes all of the different items from req.body and places them into an object called accountDetails.
 * This also hashes the account password.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
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

async function updatePassword(req, res, next) {
    req.body.accountDetails.permissions = await Services.Account.updatePassword(req.body.password);
    next();
}

async function addDefaultHackerPermissions (req, res, next) {
    req.body.accountDetails.permissions = await Services.Permission.getDefaultPermission("Hacker");
    next();
}