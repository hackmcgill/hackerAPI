"use strict";
const mongoose = require("mongoose");

const Services = {
    Team: require("../services/team.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    },
};