"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const logger = require("../../services/logger.service");
const TAG = `[ EVENT.SERVER.VALIDATOR.js ]`;
const VALIDATOR = require("./validator.helper");

module.exports = {
    // does not include permissions, as those are added later
    newAccountValidator: [
        VALIDATOR.nameValidator("post", "firstName", false),
        VALIDATOR.nameValidator("post", "lastName", false),
        VALIDATOR.emailValidator("post", "email", false),
        VALIDATOR.alphaValidator("post", "dietaryRestrictions", false),
        VALIDATOR.shirtSizeValidator("post", "shirtSize", false),
        VALIDATOR.passwordValidator("post", "password", false),
    ],
    updateAccountValidator: [
        VALIDATOR.nameValidator("post", "firstName", true),
        VALIDATOR.nameValidator("post", "lastName", true),
        VALIDATOR.emailValidator("post", "email", true),
        VALIDATOR.alphaValidator("post", "dietaryRestrictions", true),
        VALIDATOR.shirtSizeValidator("post", "shirtSize", true),
        VALIDATOR.passwordValidator("post", "password", true),
    ] 
};
