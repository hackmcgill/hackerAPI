"use strict";

const express = require("express");

const Services = {
    Logger: require("../../services/logger.service.js")
};
const Controllers = {
    Account: require("../../controllers/account.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Account: require("../../middlewares/validators/account.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Account: require("../../middlewares/account.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const accountRouter = new express.Router();

        /**
         * @api {get} /account/self get information about own account
         * @apiName self
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {json} Success-Response: 
         *      {
                    "message": "Account found by user email", 
                    "data": 
                        { 
                            "permissions": [ 5b7f890bbeff3a13b8f5cedc, 5b7f890bbeff3a13b8f5cee1 ],
                            "dietaryRestrictions": [ 'none' ],
                            "firstName": 'ABC',
                            "lastName": 'DEF',
                            "email": 'abc.def1@blahblah.com',
                            "shirtSize": 'S',
                            "id": 5b7f890bbeff3a13b8f5cee8 
                        }
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {json} Error-Response: 
         *      {"message": "User email not found", "data": {}}
         */
        accountRouter.route("/self").get(
            Controllers.Account.getUserByEmail
        );

        /**
         * @api {post} /account/create create a new account
         * @apiName create
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {json} Success-Response: 
         *      {
                    "message": "Account creation successful", 
                    "data": 
                        { 
                            _id: 5b7f8a4be73e2614a380095e,
                            firstName: 'NEW',
                            lastName: 'Account',
                            email: 'newexist@blahblah.com',
                            password: 'some_hashed_password',
                            dietaryRestrictions: [ 'none' ],
                            shirtSize: 'S',
                            permissions: { permissions: [ 5b7f8a48e73e2614a38008d6, 5b7f8a48e73e2614a38008d7 ],
                                _id: 5b7f8a4ae73e2614a3800945 }
                        }
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {json} Error-Response: 
         *      {"message": "Issue with account creation", "data": {}}
         */
        accountRouter.route("/create").post(
            // validators
            Middleware.Validator.Account.postNewAccountValidator,

            Middleware.parseBody.middleware,

            // middlewares to parse body/organize body
            // adds default hacker permissions here
            Middleware.Account.parseAccount,
            Middleware.Account.addDefaultPermission,

            // should return status in this function
            Controllers.Account.addUser
        );

        /**
         * @api {post} /account/updateOneUser update an account's information
         * @apiName updateOneUser
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Account object
         * @apiSuccessExample {json} Success-Response: 
         *      {
                    "message": "Changed account information", 
                    "data": 
                        { 
                            "firstName": 'ABC',
                            "lastName": 'DEF',
                            "email": 'abc.def1@blahblah.com',
                            "shirtSize": 'S',
                        }
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {json} Error-Response: 
         *      {"message": "Issue with changing account information", "data": {}}
         */
        accountRouter.route("/updateOneUser").post(
            // validators
            Middleware.Validator.Account.postChangeAccountValidator,

            Middleware.parseBody.middleware,

            // no parse account because will use req.body as information
            // because the number of fields will be variable
            Controllers.Account.changeUserInfo
        );

        apiRouter.use("/account", accountRouter);
    }
};