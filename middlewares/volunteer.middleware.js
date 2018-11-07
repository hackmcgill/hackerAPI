"use strict";
const mongoose = require("mongoose");
const Middleware = {
    Util: require("./util.middleware")
};
const Services = {
    Volunteer: require("../services/volunteer.service"),
    Account: require("../services/account.service"),
};
const Constants = require("../constants");

/**
 * @function parseVolunteer
 * @param {body: {accountId: ObjectId}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves accountId from req.body to req.body.volunteerDetails.
 * Adds _id to volunteerDetails.
 */
function parseVolunteer(req, res, next) {
    const volunteerDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
    };

    delete req.body.accountId;

    req.body.volunteerDetails = volunteerDetails;

    next();
}

/**
 * Checks that there are no other volunteers with the same account id as the one passed into req.body.accountId
 * @param {{body:{accountId: ObjectId}}} req 
 * @param {*} res 
 * @param {*} next
 */
async function checkDuplicateAccountLinks(req, res, next) {
    console.log("HIHI");
    const volunteer = await Services.Volunteer.findByAccountId(req.body.accountId);
    console.log(volunteer);
    if (!volunteer) {
        next();
    } else {
        next({
            status: 409,
            message: "Volunteer with same accountId link found",
            data: {
                id: req.body.accountId
            }
        });
    }
}

/**
 * Verifies that account is confirmed and of proper type from the account ID passed in req.body.accountId
 * @param {{body: {accountId: ObjectId}}} req 
 * @param {*} res 
 * @param {(err?) => void} next 
 */
async function validateConfirmedStatus(req, res, next) {
    console.log("HERE");
    const account = await Services.Account.findById(req.body.accountId);
    console.log(account.accountType);
    if (!account) {
        next({
            status: 404,
            message: "No account found",
            error: {}
        });
    } else if (!account.confirmed) {
        next({
            status: 403,
            message: "Account not verified",
            error: {}
        });
    } else if (account.accountType !== Constants.VOLUNTEER) {
        next({
            status: 409,
            message: "Wrong account type"
        });
    } else {
        next();
    }
}

module.exports = {
    parseVolunteer: parseVolunteer,
    checkDuplicateAccountLinks: Middleware.Util.asyncMiddleware(checkDuplicateAccountLinks),
    validateConfirmedStatus: Middleware.Util.asyncMiddleware(validateConfirmedStatus),
};