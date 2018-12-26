"use strict";
const Team = require("../models/team.model");
const logger = require("./logger.service");
const Services = {
    Hacker: require("../services/hacker.service"),
};

/**
 * @function findTeamByHackerId
 * @param {ObjectId} hackerId objectID of the hacker
 * @return {DocumentQuery} The document query will resolve to a team or null.
 * @description Finds the team that the hacker belongs to, or undefined.
 */
function findTeamByHackerId(hackerId) {
    const TAG = `[Team Service # findTeamByHackerId]:`;

    const query = {
        members: hackerId,
    };

    return Team.findOne(query, logger.queryCallbackFactory(TAG, "team", query));
}

/**
 * @function createTeam
 * @param {{_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}} teamDetails
 * @return {Promise<Team>} The promise will resolve to a team object if save was successful.
 * @description Adds a new team to database.
 */
function createTeam(teamDetails) {
    const TAG = `[Team Service # createTeam]:`;

    const team = new Team(teamDetails);

    return team.save();
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will either resolve to a team or null.
 * @description Finds a team by its mongoID.
 */
function findById(id) {
    const TAG = `[Team Service # findById]:`;
    const query = {
        _id: id
    };
    return Team.findById(query, logger.queryCallbackFactory(TAG, "team", query));
}

function findByName(name) {
    const TAG = `[Team Services # findByName]:`;

    const query = {
        name: name
    };

    return Team.findOne(query, logger.queryCallbackFactory(TAG, "team", query));
}

function removeMember(teamId, hackerId) {
    const TAG = `[Team Services # removeMember]:`;

    return Team.update({
        _id: teamId
    }, {
        $pull: {
            members: [hackerId]
        }
    });
}

function addMember(teamId, hackerId) {
    const TAG = `[Team Services # addMember]:`;

    return Team.update({
        _id: teamId
    }, {
        $push: {
            members: [hackerId]
        }
    });
}

function removeTeam(teamId) {
    const TAG = `[Team Services # removeTeam]`;

    return Team.deleteOne({
        _id: teamId
    });
}

/**
 * Gets the number of current members of a team defined by name
 * @param {*} name 
 */
async function getSize(name) {
    const team = await Services.Team.findByName(name);

    if (!team) {
        return -1;
    } else {
        return team.members.length;
    }
}

/**
 * @async
 * @function isTeamIdValid
 * @param {ObjectId} id
 * @return {boolean}
 * @description Checks whether a Team with the specified mongoID exists.
 */
async function isTeamIdValid(id) {
    const team = await findById(id);
    return !!team;
}

module.exports = {
    isTeamIdValid: isTeamIdValid,
    createTeam: createTeam,
    findTeamByHackerId: findTeamByHackerId,
    findById: findById,
    findByName: findByName,
    getSize: getSize,
    removeMember: removeMember,
    removeTeam: removeTeam,
    addMember: addMember
};