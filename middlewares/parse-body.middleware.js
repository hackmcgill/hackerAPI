"use strict";
const {
    validationResult
} = require("express-validator/check");
const {
    matchedData
} = require("express-validator/filter");

module.exports = {
    middleware: function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next({
                status: 422,
                message: "Validation failed",
                error: errors.mapped()
            });
        }
        req.body = matchedData(req);
        next();
    }
};