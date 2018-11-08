"use strict";

module.exports = {
    onSuccessfulLogin: function (req, res) {
        return res.status(200).json({
            message: "Successfully logged in",
            data: {}
        });
    },
    logout: function (req, res) {
        req.logout();
        return res.status(200).json({
            message: "Successfully logged out",
            data: {}
        });
    },
    sentResetEmail: function(req, res) {
        return res.status(200).json({
            message: "Sent reset email",
            data: {}
        });
    },
    resetPassword: function(req, res) {
        return res.status(200).json({
            message: "Successfully reset password",
            data: {}
        });
    },
    confirmAccount: function(req, res) {
        return res.status(200).json({
            message: "Successfully confirmed account",
            data: {}
        })
    },
    sentConfirmationEmail: function(req, res){
        return res.status(200).json({
            message: "Successfully resent account email",
            data: {}
        })
    }
};
