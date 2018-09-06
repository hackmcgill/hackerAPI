"use strict";
const mongoose = require("mongoose");

const Services = {
    Auth: require("../services/account.service")
};

module.exports = {
    onSuccessfulLogin: function (req, res) {
        return res.status(200).json({
            message: "Successfully logged in",
            data: {}
        });
    },
    onSuccessfulLogout: function (req, res) {
        req.logout();
        return res.send({
            message: "Successfully logged out",
            data: {}
        });
    }
};
