"use strict";
const express = require("express");
const Controllers = {
    Travel: require("../../controllers/travel.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Travel: require("../../middlewares/validators/travel.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Util: require("../../middlewares/util.middleware"),
    Travel: require("../../middlewares/travel.middleware"),
    Hacker: require("../../middlewares/hacker.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
    //Search: require("../../middlewares/search.middleware")
};
const Services = {
    Travel: require('../../services/travel.service'),
    Hacker: require("../../services/hacker.service"),
    Account: require("../../services/account.service")
};
const CONSTANTS = require("../../constants/general.constant");

module.exports = {
    activate: function (apiRouter) {
        const travelRouter = express.Router();


        travelRouter.route("/").get(
            Controllers.Travel.okay
        )

        /**
         * @api {get} /travel/self get information about own hacker's travel
         * @apiName self
         * @apiGroup Travel
         * @apiVersion 2.0.1
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Travel object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Travel found by logged in account id", 
                    "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Claimed"
                        "request": 90,
                        "offer": 80
                    }  
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Travel not found", "data": {}}
         */
        travelRouter.route("/self").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Travel.findSelf,
            Controllers.Travel.showTravel
        );

        /**
         * @api {get} /travel/:id get a traveler's information
         * @apiName getTravel
         * @apiGroup Travel
         * @apiVersion 2.0.1
         * 
         * @apiParam (param) {String} id a travel's unique mongoID
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Travel object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved travel information", 
                    "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Valid",
                        "request": 100,
                        "offer": 50
                    }
                }

        * @apiError {String} message Error message
        * @apiError {Object} data empty
        * @apiErrorExample {object} Error-Response: 
        *      {"message": "Travel not found", "data": {}}
        */
        travelRouter.route("/:id").get(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findByAccountId]),

            Middleware.parseBody.middleware,

            Middleware.Travel.findById,
            Controllers.Travel.showTravel
        );

        /**
         * @api {get} /travel/email/:email get a travel's information
         * @apiName getTravel
         * @apiGroup Travel
         * @apiVersion 2.0.1
         * 
         * @apiParam (param) {String} email a travel's unique email
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Travel object
         * @apiSuccessExample {object} Success-Response: 
         *     {
                    "message": "Successfully retrieved travel information", 
                    "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Valid",
                        "request": 100,
                        "offer": 50
                    }
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Travel not found", "data": {}}
         */
        travelRouter.route("/email/:email").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Account.findByEmail]),

            Middleware.Validator.RouteParam.emailValidator,
            Middleware.parseBody.middleware,

            Middleware.Travel.findByEmail,
            Controllers.Travel.showTravel
        );

        /**
         * @api {post} /travel/ create a new travel
         * @apiName createTravel
         * @apiGroup Travel
         * @apiVersion 2.0.1
         * 
         * @apiParam (body) {MongoID} accountId ObjectID of the respective account
         * @apiParam (body) {MongoID} hackerId ObjectID of the respective hacker
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Travel object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Travel creation successful", 
         *          "data": {
         *               "id":"5bff4d736f86be0a41badb91",
         *              "status": "None",
         *              "request": 50,
         *              "offer": 0
         *          }
         *      }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating travel", "data": {}}
         */
        travelRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            Middleware.Validator.Travel.newTravelValidator,

            Middleware.parseBody.middleware,
            // validate type
            Middleware.Hacker.validateConfirmedStatusFromAccountId,

            Middleware.Travel.parseTravel,

            Middleware.Travel.addRequestFromHacker,
            Middleware.Travel.addDefaultStatusAndOffer,
            Middleware.Travel.createTravel,

            Controllers.Travel.createdTravel
        );

        /**
         * @api {patch} /travel/status/:id update a traveler's status
         * @apiName patchTravelStatus
         * @apiGroup Travel
         * @apiVersion 2.0.1
         *
         * @apiParam (body) {string} [status] Status of the travel's reimbursement ("None"|"Bus"|"Offered"|"Valid"|"Invalid"|"Claimed")
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Travel object
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Changed travel information",
         *          "data": {
         *              "status": "Accepted"
         *          }
         *      }
         * @apiPermission Administrator
         */
        travelRouter.route("/status/:id").patch(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Travel.findById]),
            Middleware.Validator.Travel.updateStatusValidator,
            Middleware.parseBody.middleware,
            Middleware.Travel.parsePatch,

            Middleware.Travel.updateTravel,
            Controllers.Travel.updatedTravel
        );

        /**
         * @api {patch} /travel/offer/:id update a traveler's offer
         * @apiName patchTravelOffer
         * @apiGroup Travel
         * @apiVersion 2.0.1
         *
         * @apiParam (body) {number} [offer] Amount of money offered for travel
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Travel object
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Changed travel information",
         *          "data": {
         *              "offer": 75
         *          }
         *      }
         * @apiPermission Administrator
         */
        travelRouter.route("/offer/:id").patch(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Travel.findById]),
            Middleware.Validator.Travel.updateOfferValidator,
            Middleware.parseBody.middleware,
            Middleware.Travel.parsePatch,

            Middleware.Travel.updateTravel,
            Controllers.Travel.updatedTravel
        );

        apiRouter.use("/travel", travelRouter);
    }
};
