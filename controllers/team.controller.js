"use strict";
const mongoose = require("mongoose");

const Services = {
    Team: require("../services/team.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function createTeam
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description create a team from information in req.body.teamDetails
 */
async function createTeam(req, res) {
    const teamDetails = req.body.teamDetails;

    const success = await Services.Team.createTeam(teamDetails);

    if (success) {
        return res.status(200).json({
            message: "Team creation successful",
            data: teamDetails
        });
    } else {
        return res.status(400).json({
            message: "Issue with team creation",
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

    createTeam: Util.asyncMiddleware(createTeam)
};