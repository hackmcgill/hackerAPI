"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    // mongo id will be added at parse middleware
    postNewSponsorValidator: [
        // the id of the base account
        VALIDATOR.mongoIdValidator("post", "accountId", false),
        // assuming that the tiers are between 0 and 5 (inclusive)
        // 5 is the custom class
        body("tier", "invalid tier")
            .exists().withMessage("tier must exist")
            .isInt().withMessage("tier must be an integer.")
            .custom((value) => {
                return value >= 0 && value <= 5;
            }).withMessage("tier must be between 0 and 5"),
        VALIDATOR.nameValidator("post", "company", false),
        VALIDATOR.urlValidator("post", "contractURL", false),
        VALIDATOR.mongoIdArrayValidator("post", "nominees", true),
    ],
};
