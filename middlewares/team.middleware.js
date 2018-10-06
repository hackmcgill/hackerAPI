"use strict";

const TAG = `[ TEAM.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Permission: require("../services/permission.service"),
    Logger: require("../services/logger.service"),
    Team: require("../services/team.service")
};
const Util = require("./util.middleware");

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
                message: "Duplicate member in input",
                error: member
            });
        } else {
            idSet[member] = true;
        }
        
        // check to see if member is part of a another team
        const team = await Services.Team.findTeamByHackerId(member);

        if (!!team) {
            return next({
                status: 422,
                message: "A member is already part of another team",
                error: member
            });
        }
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

    next();
}

module.exports = {
    parseTeam: parseTeam,
    ensureUniqueHackerId: Util.asyncMiddleware(ensureUniqueHackerId),
};