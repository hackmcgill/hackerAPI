"use strict";
const mongoose = require("mongoose");
const Services = {
    Sponsor: require("../services/sponsor.service"),
    Account: require("../services/account.service"),
};
const Middleware = {
    Util: require("./util.middleware")
};
const Constants = require("../constants");

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

    if (account && account.confirmed && account.accountType === Constants.SPONSOR) {
        next();
    } else {
        next({
            status: 401,
            message: "Unauthorized",
            error: {}
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
    const sponsors = await Services.Sponsor.findByAccountId(req.body.accountId);
    if (!sponsors || sponsors.length === 0) {
        next();
    } else {
        next({
            status: 404,
            message: "Hacker with same accountId link found",
            data: {
                id: req.body.accountId
            }
        });
    }
}

module.exports = {
    parsePatch: parsePatch,
    parseSponsor: parseSponsor,
    checkDuplicateAccountLinks: Middleware.Util.asyncMiddleware(checkDuplicateAccountLinks),
    validateConfirmedStatus: Middleware.Util.asyncMiddleware(validateConfirmedStatus),
};