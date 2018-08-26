"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const logger = require("../../services/logger.service");
const TAG = `[ EVENT.SERVER.VALIDATOR.js ]`;
const VALIDATOR = require("./validator.helper");

module.exports = {
    // untested
    changeOneStatusValidator: [
        VALIDATOR.hackerStatusValidator("post", "status", true),
        VALIDATOR.nameValidator("post", "school", true),
        VALIDATOR.nameValidator("post", "gender", true),
        VALIDATOR.booleanValidator("post", "needsBus", true),  
    ],
    uploadResumeValidator: [
        VALIDATOR.idValidator("param", "id", false)
    ],
    downloadResumeValidator: [
        VALIDATOR.idValidator("param", "id", false)
    ]
};