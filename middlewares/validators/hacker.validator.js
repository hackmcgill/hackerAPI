"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("body", "accountId", false),
        VALIDATOR.stringValidator("body", "application.general.school", false),
        VALIDATOR.stringValidator("body", "application.general.degree", false),
        VALIDATOR.alphaArrayValidator(
            "body",
            "application.general.fieldOfStudy",
            false
        ),
        VALIDATOR.integerValidator(
            "body",
            "application.general.graduationYear",
            false,
            2019,
            2030
        ),
        VALIDATOR.applicationValidator("body", "application", false),
        VALIDATOR.stringValidator("body", "application.other.gender", false),
        VALIDATOR.alphaArrayValidator(
            "body",
            "application.other.ethnicity",
            false
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.codeOfConduct_MLH",
            false,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.codeOfConduct_MCHACKS",
            false,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.accomodation.needsBus",
            true
        ),
        VALIDATOR.mongoIdValidator("body", "teamId", true)
    ],

    updateConfirmationValidator: [
        VALIDATOR.booleanValidator("body", "confirm", false)
    ],

    updateHackerValidator: [
        VALIDATOR.stringValidator("body", "application.general.school", true),
        VALIDATOR.stringValidator("body", "application.general.degree", true),
        VALIDATOR.alphaArrayValidator(
            "body",
            "application.general.fieldOfStudy",
            true
        ),
        VALIDATOR.integerValidator(
            "body",
            "application.general.graduationYear",
            true,
            2019,
            2030
        ),
        VALIDATOR.applicationValidator("body", "application", true),
        VALIDATOR.stringValidator("body", "application.other.gender", true),
        VALIDATOR.alphaArrayValidator(
            "body",
            "application.other.ethnicity",
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.codeOfConduct_MLH",
            true,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.codeOfConduct_MCHACKS",
            true,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.accomodation.needsBus",
            true
        )
    ],
    updateStatusValidator: [
        VALIDATOR.enumValidator(
            "body",
            "status",
            Constants.HACKER_STATUSES,
            false
        )
    ],
    checkInStatusValidator: [
        VALIDATOR.enumValidator(
            "body",
            "status",
            Constants.HACKER_STATUS_CHECKED_IN,
            false
        )
    ],
    uploadResumeValidator: [VALIDATOR.mongoIdValidator("param", "id", false)],
    downloadResumeValidator: [VALIDATOR.mongoIdValidator("param", "id", false)],
    statsValidator: [
        VALIDATOR.searchModelValidator("query", "model", false),
        VALIDATOR.searchValidator("query", "q")
    ]
};
