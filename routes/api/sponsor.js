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
const CONSTANTS = require("../../constants/general.constant");

module.exports = {
    activate: function (apiRouter) {
        const sponsorRouter = new express.Router();

        /**
         * @api {get} /sponsor/self get information about logged in sponsor
         * @apiName self
         * @apiGroup Hacker
         * @apiVersion 1.4.1
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved sponsor information", 
                    "data": {
                        "id": "5bff4d736f86be0a41badb91",
                        "accountId": "5bff4d736f86be0a41badb99",
                        "tier": 3,
                        "company": "companyName",
                        "contractURL": "https://www.contractHere.com",
                        "nominees": ["5bff4d736f86be0a41badb93","5bff4d736f86be0a41badb94"]
                    }
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Sponsor not found", "data": {}}
         * @apiPermission: Sponsor
         */
        sponsorRouter.route("/self").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Sponsor.findSelf,
            Controllers.Sponsor.showSponsor
        );

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
         *      {"message": "Sponsor not found", "data": {}}
         */
        sponsorRouter.route("/:id").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Sponsor.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,

            Middleware.Sponsor.findById,
            Controllers.Sponsor.showSponsor
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
         *      {"message": "Error while creating sponsor", "data": {}}
         */
        sponsorRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            // validation
            Middleware.Validator.Sponsor.newSponsorValidator,

            // parsing
            Middleware.parseBody.middleware,
            // middleware to ensure account is a sponsor type
            Middleware.Sponsor.validateConfirmedStatus,
            // middleware to ensure that there is not a duplicate sponsor with the same accountId
            Middleware.Sponsor.checkDuplicateAccountLinks,

            Middleware.Sponsor.parseSponsor,

            Middleware.Auth.addAccountTypeRoleBinding,

            Middleware.Sponsor.createSponsor,
            Controllers.Sponsor.createdSponsor
        );

        apiRouter.use("/sponsor", sponsorRouter);
    }
};