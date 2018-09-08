"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    ForgotPasswordValidator: [
        VALIDATOR.emailValidator("body", "email", false)
    ],
    ResetPasswordValidator: [
        VALIDATOR.passwordValidator("body","password", false),
        //The json web token is provided via the header with param "Authentication".
        VALIDATOR.jwtValidator("header","Authentication", process.env.JWT_RESET_PWD_SECRET, false)       
    ]
};
