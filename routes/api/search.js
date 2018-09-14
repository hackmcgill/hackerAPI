"use strict";

const express = require("express");

const Controllers = {
    Search: require("../../controllers/search.controller")
};

const Middleware = {
    Validator: {
        Search: require("../../middlewares/validators/search.validator")
    },
    parseBody: require("../../middlewares/parse-body.middleware"),
    Search: require('../../middlewares/search.middleware')
};

module.exports = {
    /**
     * @api {get} /search/
     * @apiName search
     * @apiGroup Search
     * @apiVersion 0.0.8
     *
     * @apiParam (query) {String} model the model to be searched
     * @apiParam (query) {Array} q the query to be executed
     *
     * @apiSuccess {String} message Success message
     * @apiSuccess {Object} data Results
     * @apiSuccessExample {object} Success-Response:
     *      {
                    "message": "Successfully executed query, returning all results",
                    "data": {...}
                }
     *
     * @apiError {String} message Error message
     * @apiError {Object} data empty
     * @apiErrorExample {object} Error-Response:
     *      {"message": "Validation failed", "data": {}}
     */
    activate: function (apiRouter) {
        const searchRouter = new express.Router();

        searchRouter.route("/").get(
            Middleware.Validator.Search.searchQueryValidator,
            Middleware.parseBody.middleware,
            Middleware.Search.parseQuery,
            Controllers.Search.searchResults
        );

        apiRouter.use("/search", searchRouter);
    }
};