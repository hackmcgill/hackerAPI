"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newTravelValidator: [
        VALIDATOR.integerValidator("body", "request", false, 0, 3000),
        VALIDATOR.jwtValidator(
            "header",
            "token",
            process.env.JWT_CONFIRM_ACC_SECRET,
            true
        )
    ],
    updateTravelValidator: [
        VALIDATOR.integerValidator("body", "request", false, 0, 3000)
    ],
    updateStatusValidator: [
        VALIDATOR.enumValidator(
            "body",
            "status",
            Constants.TRAVEL_STATUSES,
            false
        )
    ],
    updateOfferValidator: [
        VALIDATOR.integerValidator(
            "body",
            "offer",
            false,
            0,
            3000
        )
    ]
};
