"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    idValidator: [
        VALIDATOR.mongoIdValidator("param", "id", false),
    ],

    hackeridValidator: [
        VALIDATOR.mongoIdValidator("param", "hackerId", false),
    ]
};