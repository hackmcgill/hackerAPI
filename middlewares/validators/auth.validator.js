"use strict";
const VALIDATOR = require("./validator.helper");

module.exports = {
    ForgotPasswordValidator: [
        VALIDATOR.emailValidator("body", "email", false)
    ],
    ChangePasswordValidator: [
        VALIDATOR.passwordValidator("body", "oldPassword", false),
        VALIDATOR.passwordValidator("body", "newPassword", false)
    ],
    ResetPasswordValidator: [
        VALIDATOR.passwordValidator("body", "password", false),
        //The json web token is provided via the header with param "Authentication".
        VALIDATOR.jwtValidator("header", "X-Reset-Token", process.env.JWT_RESET_PWD_SECRET, false)
    ],
    accountConfirmationValidator: [
        VALIDATOR.jwtValidator("param", "token", process.env.JWT_CONFIRM_ACC_SECRET, false)
    ]
};