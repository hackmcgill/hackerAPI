"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
  newHackerValidator: [
    // status will be added automatically
    VALIDATOR.mongoIdValidator("body", "accountId", false),
    VALIDATOR.applicationValidator("body", "application", false),
    VALIDATOR.mongoIdValidator("body", "teamId", true)
  ],

  updateConfirmationValidator: [
    VALIDATOR.booleanValidator("body", "confirm", false)
  ],

  updateHackerValidator: [
    VALIDATOR.applicationValidator("body", "application", false)
  ],
  updateStatusValidator: [
    VALIDATOR.enumValidator("body", "status", Constants.HACKER_STATUSES, false)
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
