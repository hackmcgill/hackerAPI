"use strict";

const TAG = `[ TEAM.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");
const Services = {
    Permission: require("../services/permission.service"),
    Logger: require("../services/logger.service"),
    Team: require("../services/team.service")
};
const Util = require("./util.middleware");

async function ensureUniqueHackerId(req, res, next) {
    let idSet = [];    

    for (const member of req.body.teamDetails.members) {
        // check to see if a member is entered twice in the application
        if (!!idSet[member]) {
            return next({
                message: "Duplicate member in input",
                data: member
            });
        } else {
            idSet[member] = true;
        }
        
        // check to see if member is part of a another team
        const team = await Services.Team.findTeamByHackerId(member);

        if (!!team) {
            return next({
                message: "A member is already part of another team",
                data: member
            });
        }
    }

    next();
}

function parseTeam(req, res, next) {
    const teamDetails = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        members: req.body.members,
        hackSubmitted: req.body.hackSubmitted,
        devpostURL: req.body.devpostURL,
        projectName: req.body.projectName
    };

    delete req.body.name;
    delete req.body.members;
    delete req.body.hackSubmitted;
    delete req.body.devpostURL;
    delete req.body.projectName;

    req.body.teamDetails = teamDetails;

    next();
}

module.exports = {
    parseTeam: parseTeam,
    ensureUniqueHackerId: Util.asyncMiddleware(ensureUniqueHackerId),
};