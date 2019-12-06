"use strict";
const mongoose = require("mongoose");
const Middleware = {
    Util: require("./util.middleware")
};
const Services = {
    Volunteer: require("../services/volunteer.service"),

    Account: require("../services/account.service"),
    ParsePatch: require("../services/parsePatch.service")


};
const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant")
};

const Model = {
    Volunteer: require("../models/volunteer.model")
}

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
    let parseVolunteerDetails = Services.ParsePatch.parsePatch(Model.Volunteer, "volunteerDetails");
    return parseVolunteerDetails(req, res, next);
}


function addId(res, req, next) {
    req.body.volunteerDetails._id = mongoose.Types.ObjectId();
    return next();
}

/**
 * Checks that there are no other volunteers with the same account id as the one passed into req.body.accountId
 * @param {{body:{accountId: ObjectId}}} req
 * @param {*} res
 * @param {*} next
 */
async function checkDuplicateAccountLinks(req, res, next) {
    const volunteer = await Services.Volunteer.findByAccountId(
        req.body.accountId
    );
    if (!volunteer) {
        return next();
    } else {
        return next({
            status: 409,
            message: Constants.Error.VOLUNTEER_ID_409_MESSAGE,
            data: {
                id: req.body.accountId
            }
        });
    }
}

/**
 * @async
 * @function createdVolunteer
 * @param {{body: {volunteerDetails: {_id: ObjectId, accountId: ObjectId}}}} req
 * @param {*} res
 * @description create a volunteer from information in req.body.volunteerDetails
 */
async function createVolunteer(req, res, next) {
    const volunteerDetails = req.body.volunteerDetails;

    const volunteer = await Services.Volunteer.createVolunteer(
        volunteerDetails
    );

    if (!volunteer) {
        return next({
            status: 500,
            message: Constants.Error.VOLUNTEER_CREATE_500_MESSAGE,
            data: {}
        });
    }

    req.body.volunteer = volunteer;
    next();
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
        return next({
            status: 404,
            message: Constants.Error.ACCOUNT_404_MESSAGE,
            error: {}
        });
    } else if (!account.confirmed) {
        return next({
            status: 403,
            message: Constants.Error.ACCOUNT_403_MESSAGE,
            error: {}
        });
    } else if (account.accountType !== Constants.General.VOLUNTEER) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE
        });
    } else {
        return next();
    }
}

/**
 * @async
 * @function findById
 * @param {{body: {id: ObjectId}}} req
 * @param {*} res
 * @description Retrieves a volunteer's information via req.body.id, moving result to req.body.volunteer if succesful.
 */
async function findById(req, res, next) {
    const volunteer = await Services.Volunteer.findById(req.body.id);

    if (!volunteer) {
        return next({
            status: 404,
            message: Constants.Error.VOLUNTEER_404_MESSAGE,
            data: {
                id: req.body.id
            }
        });
    }

    req.body.volunteer = volunteer;
    next();
}

module.exports = {
    parseVolunteer: parseVolunteer,
    addId: addId,
    createVolunteer: Middleware.Util.asyncMiddleware(createVolunteer),
    checkDuplicateAccountLinks: Middleware.Util.asyncMiddleware(
        checkDuplicateAccountLinks
    ),
    validateConfirmedStatus: Middleware.Util.asyncMiddleware(
        validateConfirmedStatus
    ),
    findById: Middleware.Util.asyncMiddleware(findById)
};
