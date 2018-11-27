"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newAccountValidator: [
        VALIDATOR.nameValidator("body", "firstName", false),
        VALIDATOR.nameValidator("body", "lastName", false),
        VALIDATOR.pronounValidator("body", "pronoun", false),
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", false),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", false),
        VALIDATOR.passwordValidator("body", "password", false),
        VALIDATOR.jwtValidator("param", "token", process.env.JWT_CONFIRM_ACC_SECRET, true),
        VALIDATOR.dateValidator("body", "birthDate", false),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", false)
    ],
    updateAccountValidator: [
        VALIDATOR.nameValidator("body", "firstName", true),
        VALIDATOR.nameValidator("body", "lastName", true),
        VALIDATOR.pronounValidator("body", "pronoun", true),
        VALIDATOR.emailValidator("body", "email", true),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", true),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", true),
        VALIDATOR.dateValidator("body", "birthDate", true),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", true)
    ],
    updateConfirmationValidator: [
        VALIDATOR.booleanValidator("body", "confirmed", false),
    ],
};