"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newAccountValidator: [
        VALIDATOR.asciiValidator("body", "firstName", false),
        VALIDATOR.asciiValidator("body", "lastName", false),
        VALIDATOR.asciiValidator("body", "pronoun", false),
        VALIDATOR.regexValidator("body", "email", false, Constants.EMAIL_REGEX),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", false),
        VALIDATOR.enumValidator("body", "shirtSize", Constants.SHIRT_SIZES, false),
        VALIDATOR.passwordValidator("body", "password", false),
        VALIDATOR.jwtValidator("param", "token", process.env.JWT_CONFIRM_ACC_SECRET, true),
        VALIDATOR.dateValidator("body", "birthDate", false),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", false)
    ],
    updateAccountValidator: [
        VALIDATOR.asciiValidator("body", "firstName", true),
        VALIDATOR.asciiValidator("body", "lastName", true),
        VALIDATOR.asciiValidator("body", "pronoun", true),
        VALIDATOR.regexValidator("body", "email", true, Constants.EMAIL_REGEX),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", true),
        VALIDATOR.enumValidator("body", "shirtSize", Constants.SHIRT_SIZES, true),
        VALIDATOR.dateValidator("body", "birthDate", true),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", true)
    ],
    inviteAccountValidator: [
        VALIDATOR.regexValidator("body", "email", false, Constants.EMAIL_REGEX),
        VALIDATOR.enumValidator("body", "accountType", Constants.EXTENDED_USER_TYPES, false)
    ]
};