"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    searchQueryValidator: [
        VALIDATOR.searchModelValidator("param", "model", false),
        VALIDATOR.alphaValidator("query", "sort", true),
        VALIDATOR.integerValidator("query", "page", true, 0),
        VALIDATOR.integerValidator("query", "limit", true, 0, 1000),
        VALIDATOR.searchSortValidator("query", "sort_by"),
        VALIDATOR.searchValidator("query", "q")
    ],
};