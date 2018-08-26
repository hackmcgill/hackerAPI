"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    // does not include permissions, as those are added later
    postNewAccountValidator: [
        VALIDATOR.nameValidator("body", "firstName", false),
        VALIDATOR.nameValidator("body", "lastName", false),
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.alphaValidator("body", "dietaryRestrictions", false),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", false),
        VALIDATOR.passwordValidator("body", "password", false),
    ],
    postChangeAccountValidator: [
        VALIDATOR.mongoIdValidator("body", "_id", true),
        VALIDATOR.nameValidator("body", "firstName", true),
        VALIDATOR.nameValidator("body", "lastName", true),
        VALIDATOR.emailValidator("body", "email", true),
        VALIDATOR.alphaValidator("body", "dietaryRestrictions", true),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", true),
    ] 
};
