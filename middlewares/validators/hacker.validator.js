"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newHackerValidator: [
        // status will be added automatically
        VALIDATOR.mongoIdValidator("post", "accountId", false),
        VALIDATOR.nameValidator("post", "school", false),
        VALIDATOR.nameValidator("post", "gender", false),
        VALIDATOR.booleanValidator("post", "needsBus", false),
        VALIDATOR.applicationValidator("post", "application", false),
    ],

    // untested
    updateHackerValidator: [
        VALIDATOR.mongoIdArrayValidator("body", "accountId", true),
        VALIDATOR.hackerStatusValidator("body", "status", true),
        VALIDATOR.nameValidator("body", "school", true),
        VALIDATOR.nameValidator("body", "gender", true),
        VALIDATOR.applicationValidator("body", "application", true),
        VALIDATOR.booleanValidator("body", "needsBus", true),  
    ],
    uploadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
    downloadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ]
};