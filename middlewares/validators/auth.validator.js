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
        //The json web token is provided via the header with param "Authentication".
        VALIDATOR.jwtValidator("header","Authentication", process.env.JWT_RESET_PWD_SECRET, false)       
    ]
};
