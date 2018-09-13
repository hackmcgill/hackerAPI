"use strict";
const mongoose = require("mongoose");

const Services = {
    Team: require("../services/team.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function findById
 * @param {*} req 
 * @param {*} res 
 * @return {JSON} Success or error status
 * @description Finds a team by it's mongoId that's specified in req.param.id in route parameters.
 */
async function findById(req, res) {
    const team = await Services.Team.findById(req.params.id);

    if (team) {
        return res.status(200).json({
            message: "Successfully retrieved team information",
            data: team.toJSON()
        });
    } else {
        return res.status(404).json({
            message: "Issue with retrieving team information",
            data: {}
        });
    }
}

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
    createTeam: Util.asyncMiddleware(createTeam),
    findById: Util.asyncMiddleware(findById),
};