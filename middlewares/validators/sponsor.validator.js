"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    // mongo id will be added at parse middleware
    newSponsorValidator: [
        // the id of the base account
        VALIDATOR.mongoIdValidator("post", "accountId", false),
        // assuming that the tiers are between 0 and 5 (inclusive)
        // 5 is the custom class
        VALIDATOR.integerValidator("post", "tier", false, 0, 5),
        VALIDATOR.nameValidator("post", "company", false),
        VALIDATOR.urlValidator("post", "contractURL", false),
        VALIDATOR.mongoIdArrayValidator("post", "nominees", true),
    ],
};
