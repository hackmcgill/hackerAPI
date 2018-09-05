"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    newTeamValidator: [
        VALIDATOR.nameValidator("post", "name", "false"),
        // members by mongoID if the team creator is able to provide
        VALIDATOR.mongoIdArrayValidator("post", "members", "true"),
        VALIDATOR.devpostValidator("post", "devpostURL", "true"),
        VALIDATOR.nameValidator("post", "projectName", "false")
    ],
};