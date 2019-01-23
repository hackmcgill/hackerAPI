"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    newRoleValidator: [
        VALIDATOR.alphaValidator("body", "name", false),
        VALIDATOR.routesValidator("body", "routes", false),
    ],



};