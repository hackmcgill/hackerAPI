"use strict";
/* express is required to create a new route node */
const express = require("express");

const Services = {
    Logger: require("../../services/logger"),
    Account: require("../../services/account")
};
const Controllers = {
    Account: require("../../controllers/account.controller")
};

module.exports = {
    activate: function (apiRouter) {
        const accountRouter = new express.Router();

        accountRouter.route("/").get(
            Controllers.Account.defaultReturn
        );

        apiRouter.use("/account", accountRouter);
    }
};