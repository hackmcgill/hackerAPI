"use strict";
const mongoose = require("mongoose");

const Services = {
    Hacker: require("../services/hacker.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

module.exports = {
    adminChangeOneHacker: Util.asyncMiddleware(async(req, res, next) => {
        const success = await Services.Hacker.adminChangeOneHacker(req.params.id, req.body);

        if (success) {
            return res.status(200).json({
                message: "Changed hacker",
                data: "Changed information to: " + req.body
            });
        } else {
            return res.status(400).json({
                message: "Issue with changing hacker information",
                data: {}
            });
        }
    }),
}