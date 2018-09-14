"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    searchQueryValidator: [
        VALIDATOR.searchValidator("query", "q")
    ],
};