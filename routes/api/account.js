"use strict";
/* express is required to create a new route node */
const express = require("express");

const Services = {
    Logger: require("../../services/logger"),
    Account: require("../../services/account")
};

module.exports = {
    activate: function (apiRouter) {
        const accountRouter = new express.Router();

        accountRouter.route("/").get(
            function (req, res) {
                if (req.body.eventObjectResult.rows.length > 0) {
                    return res.status(200).json({
                        message: "found some events in this zip code",
                        data: {
                            events: req.body.eventObjectResult.rows
                        }
                    });
                } else {
                    return res.status(200).json({
                        message: "found no events in this zip code",
                        data: {
                            events: []
                        }
                    });
                }
            }
        );

        apiRouter.use("/account", accountRouter);
    }
};