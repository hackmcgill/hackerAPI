"use strict";
const mongoose = require("mongoose");
const Services = {
    Sponsor: require("../services/sponsor.service"),
    Account: require("../services/account.service"),
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = {
    General: require("../constants/general.constant"),
    Error: require("../constants/error.constant"),
};
const Sponsor = require("../models/sponsor.model");

/**
 * @function parsePatch
 * @param {body: {id: ObjectId}} req 
 * @param {*} res 
 * @param {(err?) => void} next 
 * @return {void}
 * @description Put relevent sponsor attributes into sponsorDetails
 */
function parsePatch(req, res, next) {
    let sponsorDetails = {};

    for (const val in req.body) {
        // use .hasOwnProperty instead of 'in' to get rid of inherited properties such as 'should'
        if (Sponsor.schema.paths.hasOwnProperty(val)) {
            sponsorDetails[val] = req.body[val];
            delete req.body[val];
        }
    }

    req.body.sponsorDetails = sponsorDetails;

    return next();
}

/**
 * @function parseSponsor
 * @param {{body: {accountId: ObjectId, tier: String, company: String, contractURL: String, nominees: ObjectId[]}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves accountId, tier, company, contractURL, nominees from req.body to req.body.sponsorDetails.
 * Adds _id to sponsorDetails.
 */
function parseSponsor(req, res, next) {
    const sponsorDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
        tier: req.body.tier,
        company: req.body.company,
        contractURL: req.body.contractURL,
        nominees: req.body.nominees,
    };

    delete req.body.tier;
    delete req.body.company;
    delete req.body.contractURL;
    delete req.body.nominees;
    delete req.body.accountId;

    req.body.sponsorDetails = sponsorDetails;

    return next();
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
    } else if (!account.isSponsor()) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE,
        });
    } else {
        return next();
    }
}

/**
 * Finds the sponsor information of the logged in user
 * @param {{user: {id: string, accountType: string}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next 
 */
async function findSelf(req, res, next) {
    if (!Constants.General.SPONSOR_TIERS.includes(req.user.accountType)) {
        return next({
            status: 409,
            message: Constants.Error.ACCOUNT_TYPE_409_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }

    const sponsor = await Services.Sponsor.findByAccountId(req.user.id);

    if (sponsor) {
        req.body.sponsor = sponsor;
        return next();
    } else {
        return next({
            status: 404,
            message: Constants.Error.SPONSOR_404_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }
}

/**
 * @async
 * @function findById
 * @param {{body: {id: ObjectId}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Retrieves a sponsor by req.body.id, placing it in req.body.sponsor if successful.
 */
async function findById(req, res, next) {
    const sponsor = await Services.Sponsor.findById(req.body.id);

    if (!sponsor) {
        return next({
            status: 404,
            message: Constants.Error.SPONSOR_404_MESSAGE,
            error: {
                id: req.user.id
            }
        });
    }

    req.body.sponsor = sponsor;
    next();
}

/**
 * @async
 * @function createSponsor
 * @param {{body: {sponsorDetails: {_id: ObjectId, accountId: ObjectId, tier: number, company: string, contractURL: string, nominees: ObjectId[]}}}} req
 * @param {*} res
 * @description Create a sponsor from information in req.body.sponsorDetails, place it in req.body.sponsor.
 */
async function createSponsor(req, res, next) {
    const sponsorDetails = req.body.sponsorDetails;

    const sponsor = await Services.Sponsor.createSponsor(sponsorDetails);

    if (sponsor) {
        req.body.sponsor = sponsor;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.SPONSOR_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

/**
 * @async
 * @function updateSponsor
 * @param {{body: {id: ObjectId, sponsorDetails: {company?: string, contractURL?: string, nominees?: ObjectId[]}}}}  req 
 * @param {*} res 
 * @param {(err?)=>void} next 
 * @description Updates a sponsor specified by req.body.id with information specified in req.body.sponsorDetails.
 */
async function updateSponsor(req, res, next) {
    const sponsorDetails = req.body.sponsorDetails;

    const sponsor = await Services.Sponsor.updateOne(req.body.id, sponsorDetails);

    if (sponsor) {
        req.body.sponsor = sponsor;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.SPONSOR_UPDATE_500_MESSAGE,
            data: {}
        });
    }
}

/**
 * Checks that there are no other sponsor with the same account id as the one passed into req.body.accountId
 * @param {{body:{accountId: ObjectId}}} req 
 * @param {*} res 
 * @param {*} next
 */
async function checkDuplicateAccountLinks(req, res, next) {
    const sponsor = await Services.Sponsor.findByAccountId(req.body.accountId);
    if (!sponsor) {
        return next();
    } else {
        return next({
            status: 409,
            message: Constants.Error.SPONSOR_ID_409_MESSAGE,
            data: {
                id: req.body.accountId
            }
        });
    }
}

module.exports = {
    parsePatch: parsePatch,
    parseSponsor: parseSponsor,
    findSelf: Middleware.Util.asyncMiddleware(findSelf),
    findById: Middleware.Util.asyncMiddleware(findById),
    createSponsor: Middleware.Util.asyncMiddleware(createSponsor),
    checkDuplicateAccountLinks: Middleware.Util.asyncMiddleware(checkDuplicateAccountLinks),
    validateConfirmedStatus: Middleware.Util.asyncMiddleware(validateConfirmedStatus),
    updateSponsor: Middleware.Util.asyncMiddleware(updateSponsor),
};