"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    searchQueryValidator: [
        VALIDATOR.alphaValidator("param", "model"),
        VALIDATOR.searchValidator("query", "q")
    ],
};