"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("body", "accountId", false),
        VALIDATOR.nameValidator("body", "school", false),
        VALIDATOR.nameValidator("body", "degree", false),
        VALIDATOR.nameValidator("body", "gender", false),
        VALIDATOR.booleanValidator("body", "needsBus", false),
        VALIDATOR.applicationValidator("body", "application", false),
        VALIDATOR.alphaArrayValidator("body", "ethnicity", false),
        VALIDATOR.nameValidator("body", "major", false),
        VALIDATOR.integerValidator("body", "graduationYear", false, 2019, 2030),
        VALIDATOR.booleanValidator("body", "codeOfConduct", false, true),
    ],

    updateConfirmationValidator: [
        VALIDATOR.booleanValidator("body", "confirm", false),
    ],

    updateHackerValidator: [
        VALIDATOR.nameValidator("body", "school", true),
        VALIDATOR.nameValidator("body", "degree", true),
        VALIDATOR.nameValidator("body", "gender", true),
        VALIDATOR.booleanValidator("body", "needsBus", true),
        VALIDATOR.applicationValidator("body", "application", true),
        VALIDATOR.alphaArrayValidator("body", "ethnicity", true),
        VALIDATOR.nameValidator("body", "major", true),
        VALIDATOR.integerValidator("body", "graduationYear", true, 2019, 2030),
    ],
    updateStatusValidator: [
        VALIDATOR.enumValidator("body", "status", Constants.HACKER_STATUSES, false),
    ],
    checkInStatusValidator: [
        VALIDATOR.enumValidator("body", "status", Constants.HACKER_STATUS_CHECKED_IN, false)
    ],
    uploadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
    downloadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
};