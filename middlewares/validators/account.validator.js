"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newAccountValidator: [
        VALIDATOR.nameValidator("body", "firstName", false),
        VALIDATOR.nameValidator("body", "lastName", false),
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", false),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", false),
        VALIDATOR.passwordValidator("body", "password", false),
        VALIDATOR.jwtValidator("param","token", process.env.JWT_CONFIRM_ACC_SECRET, true)
    ],
    updateAccountValidator: [
        VALIDATOR.mongoIdValidator("body", "_id", true),
        VALIDATOR.nameValidator("body", "firstName", true),
        VALIDATOR.nameValidator("body", "lastName", true),
        VALIDATOR.emailValidator("body", "email", true),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", true),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", true),
    ] 
};
