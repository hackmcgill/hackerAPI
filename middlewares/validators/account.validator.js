"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newAccountValidator: [
        VALIDATOR.nameValidator("body", "firstName", false),
        VALIDATOR.nameValidator("body", "lastName", false),
        VALIDATOR.pronounValidator("body", "pronoun", false),
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.alphaArrayValidator("body", "dietaryRestrictions", false),
        VALIDATOR.enumValidator("body", "shirtSize", Constants.SHIRT_SIZES, false),
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
        VALIDATOR.enumValidator("body", "shirtSize", Constants.SHIRT_SIZES, true),
        VALIDATOR.dateValidator("body", "birthDate", true),
        VALIDATOR.phoneNumberValidator("body", "phoneNumber", true)
    ],
    inviteAccountValidator: [
        VALIDATOR.emailValidator("body", "email", false),
        VALIDATOR.enumValidator("body", "accountType", Constants.EXTENDED_USER_TYPES, false)
    ]
};