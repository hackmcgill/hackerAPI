"use strict";
const mongoose = require("mongoose");

function parseSponsor (req, res, next) {
    const sponsorDetails = {
        _id: mongoose.Types.ObjectId(),
        // TO DO: where will the id come from?
        accountId: 5,
        tier: req.body.tier,
        company: req.body.company,
        contractURL: req.body.contractURL,
        nominees: req.body.nominees,
    };

    // TODO: where does accountID come from?
    delete req.body.whereeverAccountIDCameFrome;
    delete req.body.tier;
    delete req.body.company;
    delete req.body.contractURL;
    delete req.body.nominees;

    req.body.sponsorDetails = sponsorDetails;

    next();
}

module.exports = {
    parseSponsor: parseSponsor,
};