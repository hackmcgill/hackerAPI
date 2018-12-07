"use strict";

const express = require("express");
const Controllers = {
    Account: require("../../controllers/account.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Account: require("../../middlewares/validators/account.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator"),
        Auth: require("../../middlewares/validators/auth.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Account: require("../../middlewares/account.middleware"),
    Auth: require("../../middlewares/auth.middleware")
};
const Services = {
    Account: require("../../services/account.service"),
};

module.exports = {
    activate: function (apiRouter) {
        const accountRouter = express.Router();

        /**
         * @api {get} /account/self get information about own account
         * @apiName self
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Account found by user email", 
                    "data": {
                        	"id": ObjectId("5bff8b9f3274cf001bc71048"),
                        	"firstName": "Theo",
                            "lastName":"Klein",
                            "pronoun":"he/him",
                            "email":"theo@klein.com",
                            "dietaryRestrictions":["Halal"],
                            "phoneNumber":1234567890,
                        	"shirtSize":"S",
                            "birthDate":Date("10/30/1997")
                    }
                }
         * @apiError {string} message Error message
         * @apiError {object} data empty object
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Account not found", "data": {}}
         */
        accountRouter.route("/self").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Controllers.Account.getUserByEmail
        );

        /**
         * @api {post} /account/ create a new account
         * @apiName create
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {String} firstName First name of the account creator.
         * @apiParam (body) {String} lastName Last name of the account creator.
         * @apiParam (body) {String} pronoun the pronoun of the account creator.
         * @apiParam (body) {String} email Email of the account.
         * @apiParam (body) {String} dietaryRestrictions Any dietary restrictions for the user. 'None' if there are no restrictions
         * @apiParam (body) {String} shirtSize Size of the shirt that the user will receive.
         * @apiParam (body) {String} password The password of the account.
         * @apiParam (body) {String} birthDate a Date parsable string.
         * @apiParam (body) {Number} phoneNumber the user's phone number, represented as a string.
         * 
         * @apiParamExample {json} Request-Example:
         *      { 
                    "firstName": "Theo",
                    "lastName":"Klein",
                    "pronoun":"he/him",
                    "email":"theo@klein.com",
                    "password":"hunter2",
                    "dietaryRestrictions":["Halal"],
                    "phoneNumber":1234567890,
                    "shirtSize":"S",
                    "birthDate":"10/30/1997"
         *      }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Account creation successful", 
                    "data": {
                            "id": ObjectId("5bff8b9f3274cf001bc71048"),
                        	"firstName": "Theo",
                            "lastName":"Klein",
                            "pronoun":"he/him",
                            "email":"theo@klein.com",
                            "dietaryRestrictions":["Halal"],
                            "phoneNumber":1234567890,
                        	"shirtSize":"S",
                            "birthDate":Date("10/30/1997")
                    }
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {
         *         "message": "Account already exists", 
         *          "data": {
         *              "route": "/"
         *          }
         *      }
         */
        accountRouter.route("/").post(
            // validators
            Middleware.Validator.Account.newAccountValidator,

            Middleware.parseBody.middleware,

            // middlewares to parse body/organize body
            Middleware.Account.parseAccount,

            // Parses account token if it exists
            Middleware.Auth.parseAccountConfirmationToken,
            Middleware.Auth.validateConfirmationTokenWithoutAccount,

            // middleware to create hacker object in database
            Middleware.Account.addAccount,
            Middleware.Auth.addCreationRoleBindings,

            // middleware to create a hacker token 
            // and send a confirmation message
            Middleware.Auth.sendConfirmAccountEmailMiddleware,
            // should return status in this function
            Controllers.Account.addUser
        );

        /**
         * @api {patch} /account/:id update an account's information
         * @apiName updateOneUser
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {String} [firstName] First name of the account creator.
         * @apiParam (body) {String} [lastName] Last name of the account creator.
         * @apiParam (body) {String} [pronoun] the pronoun of the account creator.
         * @apiParam (body) {String} [email] Email of the account.
         * @apiParam (body) {String} [dietaryRestrictions] Any dietary restrictions for the user. 'None' if there are no restrictions
         * @apiParam (body) {String} [shirtSize] Size of the shirt that the user will receive.
         * @apiParam (body) {String} [birthDate] a Date parsable string.
         * @apiParam (body) {Number} [phoneNumber] the user's phone number, represented as a string.

         * @apiParamExample {json} Request-Example:
         *      { "shirtSize": "M" }
         * 

         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Changed account information", 
                    "data": {
                            "id": ObjectId("5bff8b9f3274cf001bc71048"),
                        	"firstName": "Theo",
                            "lastName":"Klein",
                            "pronoun":"he/him",
                            "email":"theo@klein.com",
                            "dietaryRestrictions":["Halal"],
                            "phoneNumber":1234567890,
                        	"shirtSize":"M",
                            "birthDate":Date("10/30/1997")
                    }
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while updating account", "data": {}}
         */
        accountRouter.route("/:id").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Account.findById]),
            // validators
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Validator.Account.updateAccountValidator,

            Middleware.parseBody.middleware,
            Middleware.Account.parsePatch,

            Middleware.Account.updateAccount,
            // no parse account because will use req.body as information
            // because the number of fields will be variable
            Controllers.Account.updatedAccount
        );

        /**
         * @api {get} /account/:id gets information from an account with mongoid ':id'
         * @apiName getAccount
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {ObjectId} id MongoId of an account
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Account found by user id", 
                    "data": {
                        "id": ObjectId("5bff8b9f3274cf001bc71048"),
                        "firstName": "Theo",
                        "lastName":"Klein",
                        "pronoun":"he/him",
                        "email":"theo@klein.com",
                        "dietaryRestrictions":["Halal"],
                        "phoneNumber":1234567890,
                        "shirtSize":"S",
                        "birthDate":Date("10/30/1997")
                    }
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Account not found", "data": {}}
         */
        accountRouter.route("/:id").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Account.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,

            Controllers.Account.getUserById
        );

        /**
         * @api {post} /account/invite invites a user to create an account with the specified accountType
         * @apiName inviteAccount
         * @apiGroup Account
         * @apiVersion 0.0.8
         * @apiDescription sends link with token to be used with the account/create route
         * 
         * @apiParam (body) {String} [email] email of the account to be created and where to send the link
         * @apiParam (body) {String} [accountType] the type of the account which the user can create, for sponsor this should specify tier as well
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully invited user", 
                    "data": {}
                }
         * @apiError {string} message Error message
         * @apiError {object} data Error object
         * @apiErrorExample {object} Error-Response:
         * {
                "message": "Invalid Authentication",
                "data": {
                    "route": "/invite"
                }
            }
         */
        accountRouter.route("/invite").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            Middleware.Validator.Account.inviteAccountValidator,
            Middleware.parseBody.middleware,
            Middleware.Account.inviteAccount,
            Controllers.Account.invitedAccount
        );

        apiRouter.use("/account", accountRouter);
    }
};