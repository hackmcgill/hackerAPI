"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newAccountValidator: [
        VALIDATOR.asciiValidator("body", "firstName", false),
        VALIDATOR.asciiValidator("body", "lastName", false),
        VALIDATOR.asciiValidator("body", "pronoun", false),
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", false),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", false),
        VALIDATOR.passwordValidator("body", "password", false),
        VALIDATOR.jwtValidator("param", "token", process.env.JWT_CONFIRM_ACC_SECRET, true),
        VALIDATOR.dateValidator("body", "birthDate", false),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", false)
    ],
    updateAccountValidator: [
        VALIDATOR.asciiValidator("body", "firstName", true),
        VALIDATOR.asciiValidator("body", "lastName", true),
        VALIDATOR.asciiValidator("body", "pronoun", true),
        VALIDATOR.emailValidator("body", "email", true),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", true),
        VALIDATOR.shirtSizeValidator("body", "shirtSize", true),
        VALIDATOR.dateValidator("body", "birthDate", true),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", true)
    ],
    inviteAccountValidator: [
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.accountTypeValidator("body", "accountType", false)
    ]
};