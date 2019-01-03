"use strict";

const TAG = `[ TEAM.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Logger: require("../services/logger.service"),
    Team: require("../services/team.service"),
    Hacker: require("../services/hacker.service")
};
const Util = require("./util.middleware");
const Constants = {
    Error: require("../constants/error.constant"),
    General: require("../constants/general.constant"),
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
 * @function ensureSpance
 * @param {{body: {teamName: string}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description Checks to see that team is not full.
 */
async function ensureSpace(req, res, next) {
    const teamSize = await Services.Team.getSize(req.body.teamName);

    if (teamSize === -1) {
        return next({
            status: 404,
            message: Constants.Error.TEAM_404_MESSAGE,
            data: req.body.teamName
        });
    } else if (teamSize >= Constants.General.MAX_TEAM_SIZE) {
        return next({
            status: 409,
            message: Constants.Error.TEAM_SIZE_409_MESSAGE,
            data: teamSize,
        });
    }

    return next();
}

/**
 * @async
 * @function updateHackerTeam
 * @param {{body: {teamName: string}}} req
 * @param {JSON} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description Adds the logged in user to the team specified by teamName.
 */
async function updateHackerTeam(req, res, next) {
    const hacker = await Services.Hacker.findByAccountId(req.user.id);

    if (!hacker) {
        return next({
            status: 404,
            message: Constants.Error.HACKER_404_MESSAGE,
            data: {
                id: req.user.id
            }
        });
    }

    const receivingTeam = await Services.Team.findByName(req.body.teamName);
    const previousTeam = await Services.Team.findTeamByHackerId(hacker._id);


    if (!receivingTeam) {
        return next({
            status: 404,
            message: Constants.Error.TEAM_404_MESSAGE,
            data: req.body.teamName
        });
    }

    // means hacker is already in a team
    if (previousTeam) {
        // delete old team if old team only had that one hacker
        if (previousTeam.members.length === 1) {
            await Services.Team.removeTeam(previousTeam._id);
        }
        // remove hacker from old team
        else {
            await Services.Team.removeMember(previousTeam._id, hacker._id);
        }
    }

    // add hacker to the new team and change teamId of hacker
    const update = await Services.Team.addMember(receivingTeam._id, hacker._id);

    // Services.Hacker.updateOne should return a hacker object, as the hacker exists
    if (!update) {
        return next({
            status: 500,
            message: Constants.Error.TEAM_UPDATE_500_MESSAGE,
            data: hacker._id,
        });
    }

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
    ensureUniqueHackerId: Util.asyncMiddleware(ensureUniqueHackerId),
    ensureSpace: Util.asyncMiddleware(ensureSpace),
    updateHackerTeam: Util.asyncMiddleware(updateHackerTeam),
};