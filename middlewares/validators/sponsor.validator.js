"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    // mongo id will be added at parse middleware
    newSponsorValidator: [
        // the id of the base account
        VALIDATOR.mongoIdValidator("body", "accountId", false),
        // assuming that the tiers are between 0 and 5 (inclusive)
        // 5 is the custom class
        VALIDATOR.integerValidator("body", "tier", false, 0, 5),
        VALIDATOR.nameValidator("body", "company", false),
        VALIDATOR.urlValidator("body", "contractURL", false),
        VALIDATOR.mongoIdArrayValidator("body", "nominees", true),
    ],
};
