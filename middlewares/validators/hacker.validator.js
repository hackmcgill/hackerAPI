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
        VALIDATOR.enumValidator(
            "body",
            "application.accommodation.attendancePreference",
            Constants.ATTENDANCE_PREFERENCES,
            false
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
        VALIDATOR.enumValidator(
            "body",
            "application.shortAnswer.previousHackathons",
            Constants.PREVIOUS_HACKATHONS,
            false
        ),

        VALIDATOR.alphaArrayValidator(
            "body",
            "application.other.ethnicity",
            false
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.sendEmail",
            true
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
            "application.accommodation.travel.amount",
            true,
            0
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.accommodation.travel.reason",
            true
        ),
        VALIDATOR.mongoIdValidator("body", "application.team", true),
        VALIDATOR.stringValidator(
            "body",
            "application.location.timeZone",
            true
        ),
        VALIDATOR.stringValidator("body", "application.location.country", true),
        VALIDATOR.stringValidator("body", "application.location.city", true),
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
        VALIDATOR.enumValidator(
            "body",
            "application.shortAnswer.previousHackathons",
            Constants.PREVIOUS_HACKATHONS,
            false
        ),

        VALIDATOR.alphaArrayValidator(
            "body",
            "application.other.ethnicity",
            false
        ),
        VALIDATOR.stringValidator(
            "body", 
            "application.other.country", 
            false
        ),
        VALIDATOR.booleanValidator(
            "body",
            "application.other.sendEmail",
            true
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
            "application.accommodation.travel.amount",
            true,
            0
        ),
        VALIDATOR.stringValidator(
            "body",
            "application.accommodation.travel.reason",
            true
        ),
        VALIDATOR.mongoIdValidator("body", "application.team", true),
        VALIDATOR.stringValidator(
            "body",
            "application.location.timeZone",
            true
        ),
        VALIDATOR.stringValidator("body", "application.location.country", true),
        VALIDATOR.stringValidator("body", "application.location.city", true)
    ],
    updateStatusValidator: [
        VALIDATOR.enumValidator(
            "body",
            "status",
            Constants.HACKER_STATUSES,
            false
        )
    ],
    updateReviewerStatusValidator: [
        VALIDATOR.enumValidator(
            "body",
            "reviewerStatus",
            Constants.HACKER_REVIEWER_STATUSES,
            false
        )
    ],
    updateReviewerStatus2Validator: [
        VALIDATOR.enumValidator(
            "body",
            "reviewerStatus2",
            Constants.HACKER_REVIEWER_STATUSES,
            false
        )
    ],
    updateReviewerNameValidator: [
        VALIDATOR.stringValidator(
            "body",
            "reviewerName",
            false
        )
    ],
    updateReviewerName2Validator: [
        VALIDATOR.stringValidator(
            "body",
            "reviewerName2",
            false
        )
    ],
    updateReviewerCommentsValidator: [
        VALIDATOR.stringValidator(
            "body",
            "reviewerComments",
            false
        )
    ],
    updateReviewerComments2Validator: [
        VALIDATOR.stringValidator(
            "body",
            "reviewerComments2",
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
    ],
    batchUpdateValidator: [
        VALIDATOR.mongoIdArrayValidator("body", "ids", false)
    ]
};
