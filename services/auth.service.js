"use strict";
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../models/account.model");
const logger = require("./logger.service");

module.exports = {
    emailAndPassStrategy: new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function (email, password, done) {
        email = email.toLowerCase();
        
    })
};


new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
function (email, password, done) {
    const obj = {
        email: email.toLowerCase()
    }
    const user = getUser(obj).then(
        //returned a user via fulfilled
        (user) => {
            var success = !!(user);
            if (!success) {
                logger.error(`${TAG} ${email} is not a valid user email`);
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            } else if (!user.comparePassword(password)) {
                logger.error(`${TAG} ${email} inputted invalid password`);
                return done(null, false, {
                    message: 'Incorrect password.'
                })
            }
            return done(null, user);
        },
        (reason) => {
            logger.error(`${TAG} Internal error 1`)
            return done(null, false, {
                message: 'Internal error.'
            })
        }
    ).catch((reason) => {
        return done(null, false, {
            message: reason
        })
    })

}
);