"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newTeamValidator: [
        VALIDATOR.stringValidator("body", "name", false),
        VALIDATOR.regexValidator("body", "devpostURL", true, Constants.DEVPOST_REGEX),
        VALIDATOR.stringValidator("body", "projectName", true)
    ],

    joinTeamValidator: [
        VALIDATOR.stringValidator("body", "name", false),
    ],

    patchTeamValidator: [
        VALIDATOR.stringValidator("body", "name", true),
        VALIDATOR.regexValidator("body", "devpostURL", true, Constants.DEVPOST_REGEX),
        VALIDATOR.stringValidator("body", "projectName", true)
    ],
};