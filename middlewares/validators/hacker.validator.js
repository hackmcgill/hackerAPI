"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("body", "accountId", false),
        VALIDATOR.asciiValidator("body", "school", false),
        VALIDATOR.asciiValidator("body", "degree", false),
        VALIDATOR.asciiValidator("body", "gender", false),
        VALIDATOR.booleanValidator("body", "needsBus", false),
        VALIDATOR.applicationValidator("body", "application", false),
        VALIDATOR.alphaArrayValidator("body", "ethnicity", false),
        VALIDATOR.asciiValidator("body", "major", false),
        VALIDATOR.integerValidator("body", "graduationYear", false, 2019, 2030),
        VALIDATOR.booleanValidator("body", "codeOfConduct", false, true),
        VALIDATOR.mongoIdValidator("body", "teamId", true)
    ],

    updateConfirmationValidator: [
        VALIDATOR.booleanValidator("body", "confirm", false),
    ],

    // untested
    updateHackerValidator: [
        VALIDATOR.asciiValidator("body", "school", true),
        VALIDATOR.asciiValidator("body", "degree", true),
        VALIDATOR.asciiValidator("body", "gender", true),
        VALIDATOR.applicationValidator("body", "application", true),
        VALIDATOR.booleanValidator("body", "needsBus", true)
    ],
    updateStatusValidator: [
        VALIDATOR.hackerStatusValidator("body", "status", false)
    ],
    checkInStatusValidator: [
        VALIDATOR.hackerCheckInStatusValidator("body", "status", false)
    ],
    uploadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
    downloadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
};