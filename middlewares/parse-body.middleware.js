"use strict";
const {
    validationResult
} = require("express-validator/check");
const {
    matchedData
} = require("express-validator/filter");

module.exports = {
    middleware: middleware
};

/**
 * Moves matched data to req.body, and fails if any validation fails.
 * @param {*} req 
 * @param {*} res 
 * @param {(err?)=>void} next
 */
function middleware (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({
            status: 422,
            message: "Validation failed",
            data: errors.mapped()
        });
    }
    req.body = matchedData(req);
    next();
}