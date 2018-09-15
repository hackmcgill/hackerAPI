"use strict";
const Team = require("../models/team.model");
const logger = require("./logger.service");

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
};