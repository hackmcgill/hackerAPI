"use strict";
const mongoose = require("mongoose");

const Services = {
    Account: require("../services/account.service"),
    Logger: require("../services/logger.service")
}

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    },
    // assumes all information in req.body
    // untested
    addUser: function (req, res) {
        const accountDetail = req.body.accountDetail;

        // validations - should be done already right??

        const success = Services.Account.addOneAccount(accountDetail);

        if (success) {
            return res.status(200).json({
                message: "Account creation successful",
                data: "Account creation successful"
            });
        } else {

            return res.status(404).json({
                message: "Issue with account creation",
                data: "Issue with accoutn creation"
            });
        }
    }
};