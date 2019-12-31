"use strict";

const TAG = `[ TRAVEL.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Travel: require("../services/travel.service"),
    Hacker: require("../services/hacker.service"),
    //Storage: require("../services/storage.service"),
    //Email: require("../services/email.service"),
    //Account: require("../services/account.service"),
    //Env: require("../services/env.service")
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant")
};

/**
 * @function parseTravel
 * @param {{body: {accountId: ObjectId, hackerId: ObjectId, request: number, authorization: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Moves accountId, hackerId & request from req.body to req.body.travelId.
 * Adds _id to hackerDetails.
 */
function parseTravel(req, res, next) {
    const travelDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
        hackerId: req.body.hackerId,
        request: req.body.request
    };
    req.body.token = req.body.authorization;

    delete req.body.accountId;
    delete req.body.hackerId;
    delete req.body.request;

    req.body.travelDetails = travelDetails;

    return next();
}

/**
 * @function addDefaultStatusAndOffer
 * @param {{body: {travelDetails: {status: String, offer: Number}}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description Adds default status and offer to travelDetails.
 */
function addDefaultStatusAndOffer(req, res, next) {
    req.body.travelDetails.status = "None";
    req.body.travelDetails.offer = 0;
    return next();
}

/**
 * @function createTravel
 * @param {{body: {hackerTravel: object}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description
 * Creates travel document after making sure there is no other hacker with the same linked accountId or hackerId
 */
async function createTravel(req, res, next) {
    const travelDetails = req.body.travelDetails;

    const exists = await Services.Hacker.findByAccountId(
        travelDetails.accountId
    ) || Services.Hacker.findById(
        travelDetails.hackerId
    );

    if (exists) {
        return next({
            status: 422,
            message: Constants.Error.ACCOUNT_DUPLICATE_422_MESSAGE,
            data: {
                id: travelDetails.accountId
            }
        });
    }
    const travel = await Services.Travel.createTravel(travelDetails);
    if (!!hacker) {
        req.body.travel = travel;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.TRAVEL_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

/**
 * Finds the travel information of the logged in user
 * and places that information in req.body.travel
 * @param {{user: {id: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function findSelf(req, res, next) {
    if (
        req.user.accountType != Constants.General.HACKER ||
        !req.user.confirmed
    ) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }

    const travel = await Services.Travel.findByAccountId(req.user.id);

    if (!!travel) {
        req.body.travel = travel;
        return next();
    } else {
        return next({
            status: 409,
            message: Constants.Error.TRAVEL_404_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }
}

module.exports = {
    parseTravel: parseTravel,
    addDefaultStatusAndOffer: addDefaultStatusAndOffer,
    createTravel: Middleware.Util.asyncMiddleware(createTravel),
    findSelf: Middleware.Util.asyncMiddleware(findSelf)
};
