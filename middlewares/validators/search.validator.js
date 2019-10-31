"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    searchQueryValidator: [
        VALIDATOR.searchModelValidator("query", "model", false),
        VALIDATOR.alphaValidator("query", "sort", true),
        VALIDATOR.integerValidator("query", "page", true, 0),
        VALIDATOR.integerValidator("query", "limit", true, 0, 1000),
        VALIDATOR.searchSortValidator("query", "sort_by"),
        VALIDATOR.booleanValidator("query", "expand", true),
        VALIDATOR.searchValidator("query", "q")
    ],
    statusValidator: [
        VALIDATOR.searchModelValidator("query", "model", false),
        VALIDATOR.alphaValidator("query", "sort", true),
        VALIDATOR.integerValidator("query", "page", true, 0),
        VALIDATOR.integerValidator("query", "limit", true, 0, 1000),
        VALIDATOR.searchSortValidator("query", "sort_by"),
        VALIDATOR.booleanValidator("query", "expand", true),
        VALIDATOR.searchValidator("query", "q"),
        VALIDATOR.updateObjectValidator("query", "update")
    ],
    emailValidator: [
        VALIDATOR.searchModelValidator("query", "model", false),
        VALIDATOR.alphaValidator("query", "sort", true),
        VALIDATOR.integerValidator("query", "page", true, 0),
        VALIDATOR.integerValidator("query", "limit", true, 0, 1000),
        VALIDATOR.searchSortValidator("query", "sort_by"),
        VALIDATOR.booleanValidator("query", "expand", true),
        VALIDATOR.searchValidator("query", "q"),
        VALIDATOR.statusValidator("query", "status")
    ]
};