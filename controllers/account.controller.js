"use strict";
const Services = {
    Account: require("../services/account.service"),
    Logger: require("../services/logger.service")
};

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    },

    // untested
    getUserByEmail: function (req, res) {
        const acc = Services.Account.findByEmail(req.user.email);

        if (acc) {
            return res.status(200).json({
                message: "Account found by user email",
                data: acc.toStrippedJSON()
            });
        } else {
            // tentative error code
            return res.status(400).json({
                message: "User email not found",
                data: {}
            });
        }
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
                data: {}
            });
        } else {

            return res.status(400).json({
                message: "Issue with account creation",
                data: {}
            });
        }
    },

    // untested
    changeOwnInfo: function (req, res) {
        const id = req.user.id;

        const success = Services.Account.changeOneAccount(id, req.body);

        if (success) {
            return res.status(200).json({
                message: "Changed account",
                data: "Changed information to: " + req.body
            });
        } else {
            return res.status(400).json({
                message: "Issue with changing account information",
                data: {}
            });
        }
    }
};