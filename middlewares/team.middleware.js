"use strict";

const TAG = `[ TEAM.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Logger: require("../services/logger.service"),
    Team: require("../services/team.service")
};
const Util = require("./util.middleware");
const Constants = {
    Error: require("../constants/error.constant"),
};

/**
 * @async
 * @function ensureUniqueHackerId
 * @param {{body: {teamDetails: {members: ObjectId[]}}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description Checks to see that the members in a team are not in another team, and that members are not duplicate
 */
async function ensureUniqueHackerId(req, res, next) {
    let idSet = [];

    for (const member of req.body.teamDetails.members) {
        // check to see if a member is entered twice in the application
        if (!!idSet[member]) {
            return next({
                status: 422,
                message: Constants.Error.TEAM_MEMBER_422_MESSAGE,
                error: member
            });
        } else {
            idSet[member] = true;
        }

        // check to see if member is part of a another team
        const team = await Services.Team.findTeamByHackerId(member);

        if (!!team) {
            return next({
                status: 409,
                message: Constants.Error.TEAM_MEMBER_409_MESSAGE,
                error: member
            });
        }
    }

    return next();
}

/**
 * @async
 * @function createTeam
 * @param {{body: {teamDetails: {_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}}}} req
 * @param {*} res
 * @description create a team from information in req.body.teamDetails.
 */
async function createTeam(req, res, next) {
    const teamDetails = req.body.teamDetails;

    const team = await Services.Team.createTeam(teamDetails);

    if (!team) {
        return res.status(500).json({
            message: Constants.Error.TEAM_CREATE_500_MESSAGE,
            data: {}
        });
    } else {
        req.body.team = team;
        return next();
    }
}

/**
 * @async
 * @function findById
 * @param {{body: {id: ObjectId}}} req 
 * @param {*} res 
 * @return {JSON} Success or error status
 * @description Finds a team by it's mongoId that's specified in req.param.id in route parameters. The id is moved to req.body.id from req.params.id by validation.
 */
async function findById(req, res, next) {
    const team = await Services.Team.findById(req.body.id);

    if (!team) {
        return res.status(404).json({
            message: Constants.Error.TEAM_404_MESSAGE,
            data: {}
        });
    }

    req.body.team = team;
    next();
}

/**
 * @function parseTeam
 * @param {{body: {name: string, members: Object[], devpostURL: string, projectName: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves name, members, devpostURL, projectName from req.body to req.body.teamDetails. 
 * Adds _id to teamDetails.
 */
function parseTeam(req, res, next) {
    const teamDetails = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        members: req.body.members,
        devpostURL: req.body.devpostURL,
        projectName: req.body.projectName
    };

    delete req.body.name;
    delete req.body.members;
    delete req.body.devpostURL;
    delete req.body.projectName;

    req.body.teamDetails = teamDetails;

    return next();
}

module.exports = {
    parseTeam: parseTeam,
    findById: Util.asyncMiddleware(findById),
    createTeam: Util.asyncMiddleware(createTeam),
    ensureUniqueHackerId: Util.asyncMiddleware(ensureUniqueHackerId),
};