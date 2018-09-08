"use strict";
const Team = require("../models/team.model");
const logger = require("./logger.service");

/**
 * @function findTeamByHackerId
 * @param {string} hackerId objectID of the hacker
 * @return {Team}
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
 * @param {JSON} teamDetails
 * @return {boolean} success or failure of attempt to add team
 * @description Adds a new team to database.
 */
function createTeam(teamDetails) {
    const TAG = `[Team Service # createTeam]:`;

    const team = new Team(teamDetails);

    return team.save();
}

/**
 * @async
 * @function findById
 * @param {string} id
 * @return {Team | null} either Team or null
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
 * @param {string} id
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
};