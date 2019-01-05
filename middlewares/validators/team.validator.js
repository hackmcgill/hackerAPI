"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newTeamValidator: [
        VALIDATOR.asciiValidator("body", "name", false),
        VALIDATOR.regexValidator("body", "devpostURL", true, Constants.DEVPOST_REGEX),
        VALIDATOR.asciiValidator("body", "projectName", true)
    ],

    joinTeamValidator: [
        VALIDATOR.asciiValidator("body", "name", false),
    ]
};