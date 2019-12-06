"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    idValidator: [VALIDATOR.mongoIdValidator("param", "id", false)],

    hackeridValidator: [VALIDATOR.mongoIdValidator("param", "hackerId", false)],

    emailValidator: [
        VALIDATOR.regexValidator("param", "email", false, Constants.EMAIL_REGEX)
    ]
};
