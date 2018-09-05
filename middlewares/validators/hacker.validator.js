"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    // untested
    updateHackerValidator: [
        VALIDATOR.hackerStatusValidator("body", "status", true),
        VALIDATOR.nameValidator("body", "school", true),
        VALIDATOR.nameValidator("body", "gender", true),
        VALIDATOR.booleanValidator("body", "needsBus", true),  
    ],
    uploadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ],
    downloadResumeValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false)
    ]
};