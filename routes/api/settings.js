"use strict";

const express = require("express");
const Controllers = {};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
};
const Services = {};

const CONSTANTS = require("../../constants/general.constant");

module.exports = {
    activate: function (apiRouter) {
        const sponsorRouter = express.Router();
        apiRouter.use("/sponsor", sponsorRouter);
    }
};