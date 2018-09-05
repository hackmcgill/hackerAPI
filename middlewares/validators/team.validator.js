"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newTeamValidator: [
        VALIDATOR.nameValidator("body", "name", "false"),
        // members by mongoID if the team creator is able to provide
        VALIDATOR.mongoIdArrayValidator("body", "members", "true"),
        VALIDATOR.devpostValidator("body", "devpostURL", "true"),
        VALIDATOR.nameValidator("body", "projectName", "false")
    ],
};