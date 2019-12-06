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
    Search: require("../../middlewares/search.middleware"),
    Auth: require("../../middlewares/auth.middleware")
};

module.exports = {
    activate: function(apiRouter) {
        const searchRouter = new express.Router();

        /**
         * @api {get} /search/ provide a specific query for any defined model
         * @apiName search
         * @apiGroup Search
         * @apiVersion 0.0.8
         *
         * @apiParam (query) {String} model the model to be searched
         * @apiParam (query) {Array} q the query to be executed. For more information on how to format this, please see https://docs.mchacks.ca/architecture/
         * @apiParam (query) {String} model the model to be searched
         * @apiParam (query) {String} sort either "asc" or "desc"
         * @apiParam (query) {number} page the page number that you would like
         * @apiParam (query) {number} limit the maximum number of results that you would like returned
         * @apiParam (query) {any} sort_by any parameter you want to sort the results by
         * @apiParam (query) {boolean} expand whether you want to expand sub documents within the results
         *
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Results
         * @apiSuccessExample {object} Success-Response:
         *      {
                    "message": "Successfully executed query, returning all results",
                    "data": [
                        {...}
                    ]
                }
         *
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Empty object
         * @apiSuccessExample {object} Success-Response:
         *      {
                    "message": "No results found.",
                    "data": {}
                }
         *
         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response:
         *      {"message": "Validation failed", "data": {}}
         */
        searchRouter
            .route("/")
            .get(
                Middleware.Auth.ensureAuthenticated(),
                Middleware.Auth.ensureAuthorized(),
                Middleware.Validator.Search.searchQueryValidator,
                Middleware.parseBody.middleware,
                Middleware.Search.parseQuery,
                Middleware.Search.executeQuery,
                Controllers.Search.searchResults
            );

        apiRouter.use("/search", searchRouter);
    }
};
