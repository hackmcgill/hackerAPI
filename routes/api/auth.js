"use strict";
const express = require("express");
const passport = require("passport");
const Services = {
    Account: require("../../services/account.service"),
    Auth: require("../../services/auth.service")
};
const Controllers = {
    Auth: require("../../controllers/auth.controller")
};

module.exports = {
    activate: function (apiRouter) {
        passport.serializeUser(Services.Auth.serializeUser);
        passport.deserializeUser(Services.Auth.deserializeUser);
        const authRouter = express.Router();
        /**
         * @api {post} /auth/login login to the service
         * @apiName login
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         * 
         * @apiParam {string} email Account email
         * @apiParam {string} password Account password
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {object} Success-Response: 
         *      {"message": "Successfully logged in", "data": {}}

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Invalid email or password", "data": {}}
         */
        authRouter.route("/login").post(
            passport.authenticate("emailAndPass"),
            Controllers.Auth.onSuccessfulLogin
        );
        
        /**
         * @api {get} /auth/logout logout of service
         * @apiName logout
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {object} Success-Response: 
         *      {"message": "Successfully logged out", "data": {}}
         */
        authRouter.route("/logout").get(
            Controllers.Auth.onSuccessfulLogout
        );
        //do this
        authRouter.route("/password/forgot").post(
            //post email address
        );

        //do this
        authRouter.route("/password/reset/:token").post(
            //post new password, validate token also
        );
        apiRouter.use("/auth", authRouter);
    }
};
