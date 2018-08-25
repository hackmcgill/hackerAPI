"use strict";
const mongoose = require("mongoose");

const Services = {
    Hacker: require("../services/hacker.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function updateOne
 * @param req
 * @param res
 * @return {JSON} Success or error status
 * @description 
 *      Change a hacker's information based on the hacker's mongoID specified in req.params.id.
 *      The new information is located in req.body.
 */
async function updateOne(req, res) {
    const success = await Services.Hacker.updateOne(req.params.id, req.body);

    if (success) {
        return res.status(200).json({
            message: "Changed hacker information",
            data: req.body
        });
    } else {
        return res.status(400).json({
            message: "Issue with changing hacker information",
            data: {}
        });
    }
}

module.exports = {
    updateOne: Util.asyncMiddleware(updateOne),
};