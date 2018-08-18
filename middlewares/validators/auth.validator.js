"use strict";
const {
    body,
    query,
} = require('express-validator/check');
const VALIDATOR = require("./validator.helper");

module.exports = {
    ForgotPasswordValidator: [
        VALIDATOR.emailValidator("query", "email", false)
    ],
    ResetPasswordValidator: [
        VALIDATOR.passwordValidator("body","password", false),
        VALIDATOR.jwtValidator("query","token", process.env.JWT_RESET_PWD_SECRET)       
    ]
};
