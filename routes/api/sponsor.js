"use strict";

const express = require("express");

const Controllers = {
    Sponsor: require("../../controllers/sponsor.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Sponsor: require("../../middlewares/validators/sponsor.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Sponsor: require("../../middlewares/sponsor.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const sponsorRouter = new express.Router();

        /**
         * @api {get} /sponsor/:id get a sponsor's information
         * @apiName getSponsor
         * @apiGroup Sponsor
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved sponsor information", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Issue with retrieving sponsor information", "data": {}}
         */
        sponsorRouter.route("/:id").get(
            Controllers.Sponsor.findById
        );

        /**
         * @api {post} /sponsor/ create a new sponsor
         * @apiName createSponsor
         * @apiGroup Sponsor
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Sponsor creation successful", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Issue with sponsor creation", "data": {}}
         */
        sponsorRouter.route("/").post(
            // validation
            Middleware.Validator.Sponsor.newSponsorValidator,

            // parsing
            Middleware.parseBody.middleware,
            Middleware.Sponsor.parseSponsor,

            Controllers.Sponsor.createSponsor
        );

        apiRouter.use("/sponsor", sponsorRouter);
    }
};