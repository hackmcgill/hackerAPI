"use strict";
const mongoose = require("mongoose");

/**
 * @function parseSponsor
 * @param {{body:{accountId:String, tier:String, company: String, contractURL: String, nominees: String[]}}} req
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
    parseSponsor: parseSponsor,
};