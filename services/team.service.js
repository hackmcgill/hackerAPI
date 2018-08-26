"use strict";
const Team = require("../models/team.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

/**
 * @async
 * @function findById
 * @param {string} id
 * @return {Team | null} either Team or null
 * @description Finds a team by its mongoID.
 */
async function findById(id) {
    const TAG = `[Team Service # findById]:`;
    const query = {
        _id: id
    };
    return await Team.findById(query, function (error, team) {
        if (error) {
            logger.error(`${TAG} Failed to verify if team exist or not using ${JSON.stringify(query)}`, error);
        } else if (team) {
            logger.debug(`${TAG} team using ${JSON.stringify(query)} exist in the database`);
        } else {
            logger.debug(`${TAG} team using ${JSON.stringify(query)} do not exist in the database`);
        }
    });
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
};