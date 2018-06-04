"use strict";

const TAG = `[ ADDRESS.SERVER.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Permission: require("../services/permission.service"),
    Logger: require("../services/logger.service"),
    Account: require("../services/account.service")
};

module.exports = {
    // untested
    parseAccount: function (req, res, next) {

        const accountDetails = {
            _id: new mongoose.ObjectID(),
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
    },
    // untested
    addDefaultPermission: async function (req, res, next) {
        req.body.accountDetails.permissions = await Services.Permission.getDefaultPermission("Hacker");
        next();
    }

}