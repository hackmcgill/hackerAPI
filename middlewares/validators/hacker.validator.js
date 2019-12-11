"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("body", "accountId", false),
        // validate that application is a valid object
        VALIDATOR.applicationValidator("body", "application", false),
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
        VALIDATOR.enumValidator(
            "body",
            "application.accommodation.shirtSize",
            Constants.SHIRT_SIZES,
            false
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.accommodation.impairments",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.accommodation.barriers",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.resume",
            false
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.github",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.dribbble",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.linkedin",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.other",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.personal",
            true
        ),
        VALIDATOR.enumValidator(
            "body",
            "application.general.jobInterest",
            Constants.JOB_INTERESTS,
            false
        ),
        VALIDATOR.alphaArrayValidator(
            "body",
            "application.shortAnswer.skills",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.shortAnswer.comments",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.shortAnswer.question1",
            false
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.shortAnswer.question2",
            false
        ),

        VALIDATOR.alphaArrayValidator(
            "body",
            "application.other.ethnicity",
            false
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.privacyPolicy",
            false,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.codeOfConduct",
            false,
            true
        ),
        VALIDATOR.integerValidator(
            "body",
            "application.accommodation.travel",
            true,
            0,
            100
        ),
        VALIDATOR.mongoIdValidator("body", "application.team", true),
        VALIDATOR.mongoIdValidator("body", "teamId", true)
    ],

    updateConfirmationValidator: [
        VALIDATOR.booleanValidator("body", "confirm", false)
    ],

    updateHackerValidator: [
        // validate that application is a valid object
        VALIDATOR.applicationValidator("body", "application", false),
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
        VALIDATOR.enumValidator(
            "body",
            "application.accommodation.shirtSize",
            Constants.SHIRT_SIZES,
            false
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.accommodation.impairments",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.accommodation.barriers",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.resume",
            false
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.github",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.dribbble",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.linkedin",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.other",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.general.URL.personal",
            true
        ),
        VALIDATOR.enumValidator(
            "body",
            "application.general.jobInterest",
            Constants.JOB_INTERESTS,
            false
        ),
        VALIDATOR.alphaArrayValidator(
            "body",
            "application.shortAnswer.skills",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.shortAnswer.comments",
            true
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.shortAnswer.question1",
            false
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.shortAnswer.question2",
            false
        ),

        VALIDATOR.alphaArrayValidator(
            "body",
            "application.other.ethnicity",
            false
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.privacyPolicy",
            false,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.codeOfConduct",
            false,
            true
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.accommodation.travel",
            true,
            0,
            100
        ),
        VALIDATOR.mongoIdValidator("body", "application.team", true)
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
