"use strict";

const express = require("express");
const Services = {
    Logger: require("../../services/logger.service.js")
};
const Controllers = {
    Hacker: require("../../controllers/hacker.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Hacker: require("../../middlewares/validators/hacker.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Account: require("../../middlewares/account.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const hackerRouter = new express.Router();

        // gets a hacker by their email and changes their status
        hackerRouter.route("/adminChangeHacker").post(
            Middleware.Validator.Hacker.changeOneStatusValidator,

            Middleware.parseBody.middleware,

            // no parse account because will use req.body as information
            // because the number of fields will be variable
            Controllers.Account.adminChangeHacker
        );

        apiRouter.use("/account", hackerRouter);
    }
}