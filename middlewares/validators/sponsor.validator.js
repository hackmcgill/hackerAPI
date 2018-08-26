"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    postNewSponsorValidator: [
        // assuming that the tiers are between 0 and 5 (inclusive)
        // there should be a way to generalize this, but can't find good way to do so
        body("tier", "invalid tier")
            .exists().withMessage("tier must exist")
            .isInt().withMessage("tier must be an integer.")
            .custom((value) => {
                return value >= 0 && value <= 5;
            }).withMessage("tier must be between 0 and 5"),

        VALIDATOR.mongoIdValidator("post", "_id", false),
        VALIDATOR.alphaValidator("post", "company", false),
        VALIDATOR.urlValidator("post", "contractURL", false),
        // TODO: Create validator for nominees
    ],
};
