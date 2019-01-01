"use strict";
const VALIDATOR = require("./validator.helper");
const Constants = require("../../constants/general.constant");

module.exports = {
    newRoleValidator: [
        VALIDATOR.alphaValidator("body", "name", false),
        VALIDATOR.routesValidator("body", "routes", false),
    ],



};