"use strict";

const express = require("express");

const Controllers = {
    Sponsor: require("../../controllers/sponsor.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Sponsor: require("../../middlewares/validators/sponsor.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Sponsor: require("../../middlewares/sponsor.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
};
const Services = {
    Sponsor: require("../../services/sponsor.service"),
};
const CONSTANTS = require("../../constants");

module.exports = {
    activate: function (apiRouter) {
        const sponsorRouter = new express.Router();

        /**
         * @api {get} /sponsor/:id get a sponsor's information
         * @apiName getSponsor
         * @apiGroup Sponsor
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {string} id a sponsor's unique mongoID
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved sponsor information", 
                    "data": {...}
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Issue with retrieving sponsor information", "data": {}}
         */
        sponsorRouter.route("/:id").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Sponsor.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,

            Controllers.Sponsor.findById
        );

        /**
         * @api {post} /sponsor/ create a new sponsor
         * @apiName createSponsor
         * @apiGroup Sponsor
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {MongoID} accountId ObjectID of the respective account.
         * @apiParam (body) {Number} tier Tier of the sponsor, from 0 to 5. 0 is lowest tier, and 5 is the custom tier.
         * @apiParam (body) {String} company Name of the company.
         * @apiParam (body) {String} contractURL URL link to the contract with the company.
         * @apiParam (body) {MongoID[]} nominees Array of accounts that the company wish to nominate as hackers.
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Sponsor creation successful", 
                    "data": {...}
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Issue with sponsor creation", "data": {}}
         */
        sponsorRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            // validation
            Middleware.Validator.Sponsor.newSponsorValidator,

            // parsing
            Middleware.parseBody.middleware,
            Middleware.Sponsor.parseSponsor,

            Middleware.Auth.addRoleBindings(CONSTANTS.SPONSOR),

            Controllers.Sponsor.createSponsor
        );

        apiRouter.use("/sponsor", sponsorRouter);
    }
};