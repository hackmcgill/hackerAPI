"use strict";
const mongoose = require("mongoose");
const Middleware = {
    Util: require("./util.middleware")
};
const Services = {
    Volunteer: require("../services/volunteer.service"),
    Account: require("../services/account.service"),
};
const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant"),
};

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
    const volunteer = await Services.Volunteer.findByAccountId(req.body.accountId);
    if (!volunteer) {
        next();
    } else {
        next({
            status: 409,
            message: Constants.Error.VOLUNTEER_ID_409_MESSAGE,
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
    const account = await Services.Account.findById(req.body.accountId);
    if (!account) {
        next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE,
            error: {}
        });
    } else if (!account.confirmed) {
        next({
            status: 403,
            message: Constants.Error.ACCOUNT_403_MESSAGE,
            error: {}
        });
    } else if (account.accountType !== Constants.General.VOLUNTEER) {
        next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE,
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