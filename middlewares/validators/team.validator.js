"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    newTeamValidator: [
        VALIDATOR.nameValidator("post", "name", "false"),
        // validate members via email, or ask specifically for ID already? 
        // If ask for id need some pre-processing because otherwise don't see way for users to give IDs

        VALIDATOR.booleanValidator("post", "hackSubmitted", "true"),

        // use url validator for dev post

        VALIDATOR.nameValidator("post", "projectName", "false")
    ],
};