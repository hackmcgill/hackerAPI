"use strict";
const mongoose = require("mongoose");

const Services = {
    Account: require("../services/account.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

async function getUserByEmail(req, res, next) {
    const acc = await Services.Account.findByEmail("abc.def1@blahblah.com");

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
}

async function addUser(req, res, next) {
    const accountDetails = req.body.accountDetails;

    // validations - should be done already right??

    const success = await Services.Account.addOneAccount(accountDetails);

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
}

async function changeUserInfo(req, res, next) {
    const id = req.user.id;

    const success = await Services.Account.changeOneAccount(id, req.body);

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

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    },

    getUserByEmail: Util.asyncMiddleware(getUserByEmail),

    // assumes all information in req.body
    addUser: Util.asyncMiddleware(addUser),

    changeUserInfo: Util.asyncMiddleware(changeUserInfo),
};