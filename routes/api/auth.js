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
        Auth: require("../../middlewares/validators/auth.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator")
    },
    parseBody: require("../../middlewares/parse-body.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
    Account: require("../../middlewares/account.middleware")
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
         *      {"message": "Invalid Authentication", "data": {}}
         * 
         * @apiPermission: public
         */
        authRouter.route("/login").post(
            Middleware.Auth.login,
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
        authRouter.route("/password/forgot").post(
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

        /**
         * @api {post} /auth/password/change change password for logged in user
         * @apiName changePassword
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         * 
         * @apiParam {String} oldPassword The current password of the user
         * @apiParam {String} newPassword The new password of the user
         * 
         * @apiParamExample {json} Request-Example:
         *      { 
         *          "oldPassword": "password12345",
         *          "newPassword": "password123456"
         *      }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {json} Success-Response: 
         *      {"message": "Successfully reset password", "data": {}}
         * 
         * @apiPermission: Must be logged in
         */
        authRouter.route("/password/change").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            Middleware.Validator.Auth.ChangePasswordValidator,
            Middleware.parseBody.middleware,

            Middleware.Auth.changePassword,
            Controllers.Auth.resetPassword,
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
         *       "X-Reset-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
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
        authRouter.route("/password/reset").post(
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

        /**
         * @api {post} /auth/confirm/:token confirm account using the JWT in :token
         * @apiName confirmAccount
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         *
         * @apiParam {String} JWT for confirming the account
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {json} Success-Response:
         *      {"message": "Successfully confirmed account", "data": {}}
         * 
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Invalid token for confirming account, "data": {}}
         * 
         */
        authRouter.route("/confirm/:token").post(
            Middleware.Validator.Auth.accountConfirmationValidator,
            Middleware.parseBody.middleware,
            Middleware.Auth.parseAccountConfirmationToken,
            Middleware.Auth.validateConfirmationToken,
            Controllers.Auth.confirmAccount
        );

        /**
         * @api {get} /auth/rolebindings/:id retrieve rolebindings for a user given by their user id :id
         * @apiName getRoleBindings
         * @apiGroup Auth
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {ObjectId} id MongoId of an account
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Rolebindings object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved role bindings",
                    "data": {
                        accountId:"5beca4ab2e069a34f91697b2"
                        id:"5beca4ae2e069a34f91698b1"
                        roles: [
                            {
                                _id:"5beca4ab2e069a34f91697d9",
                                name:"hacker",
                                routes: [
                                    0:Object {_id: "5beca4ae2e069a34f9169852", requestType: "POST", uri: "/api/auth/login"},
                                    1:Object {_id: "5beca4ae2e069a34f9169851", requestType: "POST", uri: "/api/auth/logout"},
                                    2:Object {_id: "5beca4ae2e069a34f9169850", requestType: "GET", uri: "/api/auth/rolebindings/:self"},
                                    3:Object {_id: "5beca4ae2e069a34f916984f", requestType: "GET", uri: "/api/account/self"},
                                    4:Object {_id: "5beca4ae2e069a34f916984e", requestType: "GET", uri: "/api/account/:self"},
                                    5:Object {_id: "5beca4ae2e069a34f916984d", requestType: "PATCH", uri: "/api/account/:self"},
                                    6:Object {_id: "5beca4ae2e069a34f916984c", requestType: "POST", uri: "/api/hacker/"},
                                    7:Object {_id: "5beca4ae2e069a34f916984b", requestType: "GET", uri: "/api/hacker/:self"},
                                    8:Object {_id: "5beca4ae2e069a34f916984a", requestType: "GET", uri: "/api/hacker/:self/resume"},
                                    9:Object {_id: "5beca4ae2e069a34f9169849", requestType: "PATCH", uri: "/api/hacker/:self"}
                                ]
                            }
                        ]
                    }
                }
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Role Bindings not found", "data": {}}
         * 
         */
        authRouter.route("/rolebindings/:id").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Account.findById]),
            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,
            Middleware.Auth.retrieveRoleBindings,
            Controllers.Auth.retrieveRoleBindings
        );

        /**
         * @api {get} /auth/confirm/resend resend confirmation token
         * @apiName resendConfirmAccount
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {json} Success-Response:
         *      {"message": "Successfully resent confirmation email", "data": {}}
         * 
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {json} Error-Response:
         *       HTTP/1.1 422
         *      {"message": "Account already confirmed, "data": {}}
         * 
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {json} Error-Response:
         *       HTTP/1.1 428
         *      {"message": "Account already confirmed, "data": {}}
         * 
         */
        authRouter.route("/confirm/resend").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.resendConfirmAccountEmail,
            Controllers.Auth.sentConfirmationEmail
        );

        /**
         * @api {get} /auth/roles get roles
         * @apiName getRoles
         * @apiDescription get all roles that exist in the database
         * @apiGroup Authentication
         * @apiVersion 0.0.8
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {json} Success-Response:
         *      {"message": "Sucessfully retrieved all roles", "data":
         *      [{name: "GodStaff", routes: Array(27), id: "5bee20ef3ca9dd4754382880"},
         *       {name: "Hacker", routes: Array(10), id: "5bee20ef3ca9dd4754382881"},
         *       {name: "Volunteer", routes: Array(4), id: "5bee20ef3ca9dd4754382882"}]
         * 
         */
        authRouter.route("/roles").get(
            Middleware.Auth.retrieveRoles,
            Controllers.Auth.retrievedRoles
        );

        apiRouter.use("/auth", authRouter);
    }
};