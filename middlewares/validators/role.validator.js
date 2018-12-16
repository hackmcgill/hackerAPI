"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newRoleValidator: [
        VALIDATOR.alphaValidator("body", "name", false),
        VALIDATOR.enumValidator("body", "requestType", Constants.REQUEST_TYPES, false),
    ],



};