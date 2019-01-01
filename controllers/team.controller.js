"use strict";
const mongoose = require("mongoose");

const Services = {
    Team: require("../services/team.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
};

/**
 * @function showTeam
 * @param {{body: {team: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and team object
 * @description Returns the JSON of team object located in req.body.team
 */
function showTeam(req, res) {
    return res.status(200).json({
        message: Constants.Success.TEAM_READ,
        data: req.body.team.toJSON()
    });
}

/**
 * @function createdTeam
 * @param {{body: {team: {_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Display team information and creation success status.
 */
function createdTeam(req, res) {
    return res.status(200).json({
        message: Constants.Success.TEAM_CREATE,
        data: req.body.team,
    });
}

module.exports = {
    createdTeam: createdTeam,
    showTeam: showTeam,
};