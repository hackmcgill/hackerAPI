"use strict";
const express = require("express");
const passport = require("passport");
const Services = {
    Account: require("../../services/account.service"),
    Auth: require("../../services/auth.service"),
    ResetPasswordToken: require("../../services/resetPassword.service")
};
const Middleware = {
    Validator: {
        Auth: require("../../middlewares/validators/auth.validator")
    },
    parseBody: require("../../middlewares/parse-body.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
    Account: require("../../middlewares/account.middleware")
}
const Controllers = {
    Auth: require("../../controllers/auth.controller")
};

const AuthRoutes = {
    login: "/login",
    logout: "/logout",
    forgotPassword: "/password/forgot",
    resetPassword: "/password/reset"
}

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
         * 
         * @apiPermission: public
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
         * 
         * @apiPermission: public
         */
        authRouter.route("/logout").get(
            Controllers.Auth.logout
        );

        /**
         * @api {post} /auth/password/forgot forgot password route
         * @apiName forgotPassword
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         * 
         * @apiParam {String} email the email address of the account
         * 
         * @apiParamExample {json} Request-Example:
         *      { "email": "myemail@mchacks.ca" }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {json} Success-Response: 
         *      {"message": "Sent reset email", "data": {}}
         * 
         * @apiPermission: public
         */
        authRouter.route(AuthRoutes.forgotPassword).post(
            Middleware.Validator.Auth.ForgotPasswordValidator,
            Middleware.parseBody.middleware,
            //create resetPassword jwt
            //send user an email to reset the password
            //create new entity in reset model
            //create reset token with entity id
            //send email to reset password route
            Middleware.Auth.sendResetPasswordEmailMiddleware,
            Controllers.Auth.sentResetEmail
        );

        //untested
        /**
         * @api {post} /auth/password/reset reset password
         * @apiName resetPassword
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         * 
         * @apiParam {String} password the password of the account
         * @apiHeader {String} Authentication the token that was provided in the reset password email
         * @apiHeaderExample {json} Header-Example:
         *     {
         *       "Authentication": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
         *     }
         * 
         * @apiParamExample {json} Request-Example:
         *      { "password": "hunter2" }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {json} Success-Response: 
         *      {"message": "Successfully reset password", "data": {}}
         * 
         * @apiPermission: must have authentication token
         */
        authRouter.route(AuthRoutes.resetPassword).post(
            //post new password, validate token also
            Middleware.Validator.Auth.ResetPasswordValidator,
            Middleware.parseBody.middleware,
            Middleware.Auth.parseResetToken,
            /**
             * Check to make sure that the token:
             *  1) exists in the db
             *  2) not expired
             */
            Middleware.Auth.validateResetToken,
            //update the password in the db
            Middleware.Account.updatePassword,
            //delete the token that was used
            Middleware.Auth.deleteResetToken,
            //send the response
            Controllers.Auth.resetPassword
        );
        apiRouter.use("/auth", authRouter);
    }
};
