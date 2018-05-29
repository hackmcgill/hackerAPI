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
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Account: require("../../middlewares/validators/account.server.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.server.middleware"),
    Account: require("../../middlewares/account.server.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const accountRouter = new express.Router();

        accountRouter.route("/").get(
            Controllers.Account.defaultReturn
        );

        // untested
        accountRouter.route("/getOneUser").get(
            Controllers.Account.getUserByEmail
        );

        // untested
        accountRouter.route("/createOneUser").post(
            // validators
            Middleware.Validator.Account.postNewAccountValidator,

            Middleware.parseBody.middleware,

            // middlewares to parse body/organize body
            // adds default hacker permissions here
            Middleware.Account.parseAccount,
            Middleware.Account.addDefaultPermission,

            // should return status in this function
            Controllers.Account.addUser
        );

        // untested
        // is not able to update permissions
        accountRouter.rout("/updateOneUser").post(
            // validators
            Middleware.Validator.Account.changeNewAccountValidator,

            Middleware.parseBody.middleware,

            // middlewares
            Middleware.Account.parseAccount,

            Controllers.Account.changeUserInfo
        );

        apiRouter.use("/account", accountRouter);
    }
};