"use strict";
const mongoose = require("mongoose");

const Services = {
    Team: require("../services/team.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Constants = {
    Error: require("../constants/error.constant"),
};

/**
 * @async
 * @function findById
 * @param {{body: {id: ObjectId}}} req 
 * @param {*} res 
 * @return {JSON} Success or error status
 * @description Finds a team by it's mongoId that's specified in req.param.id in route parameters. The id is moved to req.body.id from req.params.id by validation.
 */
async function findById(req, res) {
    const team = await Services.Team.findById(req.body.id);

    if (team) {
        return res.status(200).json({
            message: "Successfully retrieved team information",
            data: team.toJSON()
        });
    } else {
        return res.status(404).json({
            message: Constants.Error.TEAM_ERROR404_MESSAGE,
            data: {}
        });
    }
}

/**
 * @async
 * @function createTeam
 * @param {{body: {teamDetails: {_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}}}} req
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
        return res.status(500).json({
            message: Constants.Error.TEAM_CREATE_ERROR500_MESSAGE,
            data: {}
        });
    }
}

module.exports = {
    createTeam: Util.asyncMiddleware(createTeam),
    findById: Util.asyncMiddleware(findById),
};