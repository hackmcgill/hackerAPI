"use strict";
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../services/account.service");
const logger = require("./logger.service");

module.exports = {
    emailAndPassStrategy: new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async function (email, password, done) {
        email = email.toLowerCase();
        const account = await Account.getAccountIfValid(email, password);
        if (!!account) {
            return done(null, account);
        } else {
            return done("Invalid email or password", false);
        }
    }),
    deserializeUser: function (id, done) {
        Account.findById(id).then(
            (user) => {
                done(null, user);
            }
        )
    },
    serializeUser: function (user, done) {
        done(null, user.id);
    },
    ensureAuthenticated: function (req, routePermissionId) {
        if (req.isUnauthenticated()) {
            return false;
        }
        return req.user.permissions.contains(routePermissionId);
    }
};