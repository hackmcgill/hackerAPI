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
        authRouter.route(AuthRoutes.login).post(
            passport.authenticate("emailAndPass"),
            Controllers.Auth.onSuccessfulLogin
        );
        authRouter.route(AuthRoutes.logout).get(
            Controllers.Auth.logout
        );

        //not tested
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
