"use strict";

const mongoose = require("mongoose");
const logger = require("./logger.service");

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    }
};