"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const logger = require("../../services/logger.service");
const TAG = `[ EVENT.SERVER.VALIDATOR.js ]`;
const VALIDATOR = require("./validator.helper");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("post", "accountId", false),
        VALIDATOR.nameValidator("post", "school", false),
        VALIDATOR.nameValidator("post", "gender", false),
        VALIDATOR.booleanValidator("post", "needsBus", false),
        VALIDATOR.applicationValidator("post", "application", false),
    ],

    // untested
    updateHackerValidator: [
        VALIDATOR.mongoIdArrayValidator("post", "accountId", true),
        VALIDATOR.hackerStatusValidator("post", "status", true),
        VALIDATOR.nameValidator("post", "school", true),
        VALIDATOR.nameValidator("post", "gender", true),
        VALIDATOR.booleanValidator("post", "needsBus", true),
        VALIDATOR.applicationValidator("post", "application", true),
    ],
};