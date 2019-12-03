"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newAccountValidator: [
        VALIDATOR.stringValidator("body", "firstName", false),
        VALIDATOR.stringValidator("body", "lastName", false),
        VALIDATOR.stringValidator("body", "pronoun", false),
        VALIDATOR.regexValidator("body", "email", false, Constants.EMAIL_REGEX),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", false),
        VALIDATOR.enumValidator("body", "gender", false),
        VALIDATOR.passwordValidator("body", "password", false),
        VALIDATOR.jwtValidator("header", "token", process.env.JWT_CONFIRM_ACC_SECRET, true),
        VALIDATOR.dateValidator("body", "birthDate", false),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", false)
    ],
    updateAccountValidator: [
        VALIDATOR.stringValidator("body", "firstName", true),
        VALIDATOR.stringValidator("body", "lastName", true),
        VALIDATOR.stringValidator("body", "pronoun", true),
        VALIDATOR.regexValidator("body", "email", true, Constants.EMAIL_REGEX),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", true),
        VALIDATOR.enumValidator("body", "gender", true),
        VALIDATOR.dateValidator("body", "birthDate", true),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", true)
    ],
    inviteAccountValidator: [
        VALIDATOR.regexValidator("body", "email", false, Constants.EMAIL_REGEX),
        VALIDATOR.enumValidator("body", "accountType", Constants.EXTENDED_USER_TYPES, false)
    ]
};