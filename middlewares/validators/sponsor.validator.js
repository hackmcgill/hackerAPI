"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    postNewSponsorValidator: [
        // TODO: Put in mongoID validator after previous PR goes through
        // TODO: Create validator for tiers -> what's the max level of tiers?

        VALIDATOR.alphaValidator("post", "company", false),

        // TODO: Create url validator for contractURL
        // TODO: Create validator for nominees
    ],
};
