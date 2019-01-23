"use strict";

const Success = require("../constants/success.constant");

module.exports = {
    onSuccessfulLogin: function (req, res) {
        return res.status(200).json({
            message: Success.LOGIN,
            data: {}
        });
    },
    logout: function (req, res) {
        req.logout();
        return res.status(200).json({
            message: Success.LOGOUT,
            data: {}
        });
    },
    sentResetEmail: function (req, res) {
        return res.status(200).json({
            message: Success.AUTH_SEND_RESET_EMAIL,
            data: {}
        });
    },
    resetPassword: function (req, res) {
        return res.status(200).json({
            message: Success.AUTH_RESET_PASSWORD,
            data: {}
        });
    },
    confirmAccount: function (req, res) {
        return res.status(200).json({
            message: Success.AUTH_CONFIRM_ACCOUNT,
            data: {}
        });
    },
    retrieveRoleBindings: function (req, res) {
        return res.status(200).json({
            message: Success.AUTH_GET_ROLE_BINDINGS,
            data: req.roleBindings.toJSON()
        });
    },
    sentConfirmationEmail: function (req, res) {
        return res.status(200).json({
            message: Success.AUTH_SEND_CONFIRMATION_EMAIL,
            data: {}
        });
    },
    retrievedRoles: function (req, res) {
        return res.status(200).json({
            message: Success.AUTH_GET_ROLES,
            data: req.roles
        });
    }
};