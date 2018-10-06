"use strict";
const mongoose = require("mongoose");

/**
 * @function parsePatch
 * @param {body: {id: ObjectId}} req 
 * @param {*} res 
 * @param {(err?) => void} next 
 * @return {void}
 * @description Delete the req.body.id that was added by the validation of route parameter.
 */
function parsePatch (req, res, next) {
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
function parseSponsor (req, res, next) {
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

module.exports = {
    parsePatch: parsePatch,
    parseSponsor: parseSponsor,
};