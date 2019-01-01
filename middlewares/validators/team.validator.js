"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newTeamValidator: [
        VALIDATOR.nameValidator("body", "name", false),
        VALIDATOR.devpostValidator("body", "devpostURL", true),
        VALIDATOR.nameValidator("body", "projectName", false)
    ],
};