"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const logger = require("../../services/logger.service");
const VALIDATOR = require("./validator.helper");

module.exports = {
    // untested
    changeOneStatusValidator: [
        VALIDATOR.nameValidator("body", "email", true),
        VALIDATOR.hackerStatusValidator("body", "status", true),
        VALIDATOR.nameValidator("body", "school", true),
        VALIDATOR.nameValidator("body", "gender", true),
        VALIDATOR.booleanValidator("body", "needsBus", true),
    ],
};