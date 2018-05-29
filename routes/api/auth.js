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

        authRouter.route("/login").post(
            passport.authenticate("emailAndPass"),
            Controllers.Auth.onSuccessfulLogin
        );
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
