"use strict";
const Team = require("../models/team.model");
const logger = require("./logger.service");
const Services = {
    Hacker: require("../services/hacker.service")
};
const Middleware = {
    Util: require("../middlewares/util.middleware")
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
        members: hackerId
    };

    return Team.findOne(query, logger.queryCallbackFactory(TAG, "team", query));
}

/**
 * @function createTeam
 * @param {{_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}} teamDetails
 * @return {Promise<Team>} The promise will resolve to a team object if save was successful.
 * @description Adds a new team to database.
 */
async function createTeam(teamDetails) {
    const TAG = `[Team Service # createTeam]:`;

    const team = new Team(teamDetails);

    return team.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{name?: string, devpostURL?: string, projectName?: string}} teamDetails
 * @return {DocumentQuery} The document query will resolve to team or null.
 * @description Update a team specified by its mongoId with information specified by teamDetails.
 */

function updateOne(id, teamDetails) {
    const TAG = `[Team Service # updateOne]:`;

    const query = {
        _id: id
    };

    return Team.findOneAndUpdate(
        query,
        teamDetails,
        logger.updateCallbackFactory(TAG, "team")
    );
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
    return Team.findById(
        query,
        logger.queryCallbackFactory(TAG, "team", query)
    );
}

/**
 * @function findByName
 * @param {String} name
 * @return {DocumentQuery} The document query will either resolve to a team or null.
 * @description Finds a team by its team name.
 */
function findByName(name) {
    const TAG = `[Team Services # findByName]:`;

    const query = {
        name: name
    };

    return Team.findOne(query, logger.queryCallbackFactory(TAG, "team", query));
}

/**
 * @async
 * @function removeMember
 * @param {ObjectId} teamId
 * @param {ObjectId} hackerId
 * @return {DocumentQuery} The document query will resolve to the number of objects removed, or null.
 * @description Removes the hacker specified by hackerId from a team specified by teamId.
 */
async function removeMember(teamId, hackerId) {
    const TAG = `[Team Services # removeMember]:`;

    const hacker = await Services.Hacker.updateOne(hackerId, {
        teamId: null
    });

    if (!hacker) {
        return null;
    }

    return Team.findOneAndUpdate(
        {
            _id: teamId
        },
        {
            $pull: {
                members: hackerId
            }
        }
    );
}

/**
 * @async
 * @function addMember
 * @param {ObjectId} teamId
 * @param {ObjectId} hackerId
 * @return {DocumentQuery} Query evaluates to object that details the number of modified documents, or null.
 * @description Add the hacker specified by hackerId to the team specified by teamId
 */
async function addMember(teamId, hackerId) {
    const TAG = `[Team Services # addMember]:`;

    const hacker = await Services.Hacker.updateOne(hackerId, {
        $set: {
            teamId: teamId
        }
    });

    if (!hacker) {
        return null;
    }

    return Team.update(
        {
            _id: teamId
        },
        {
            $push: {
                members: [hackerId]
            }
        }
    );
}

/**
 * @async
 * @function removeTeamIfEmpty
 * @param {ObjectId} teamId
 * @return {DocumentQuery} Query evaluates to object that details the number of modified documents, or null.
 * @description Removes the team if the team contains no members. Returns null if the team has one or more members, or if the team doesn't exist.
 */
async function removeTeamIfEmpty(teamId) {
    const TAG = `[Team Services # removeTeam]`;

    const team = await findById(teamId);

    if (team.members.length === 0) {
        return Team.deleteOne({
            _id: teamId
        });
    }

    return null;
}

/**
 * @async
 * @function removeTeam
 * @param {ObjectId} teamId
 * @return {DocumentQuery} The document query will resolve to the number of objects removed, or null.
 * @description Delete the team specified by teamId.
 */
async function removeTeam(teamId) {
    const TAG = `[Team Services # removeTeam]`;

    const team = await findById(teamId);

    for (const hackerId of team.members) {
        await removeMember(teamId, hackerId);
    }

    return Team.deleteOne({
        _id: teamId
    });
}

/**
 * @async
 * @function getSize
 * @param {*} name
 * @return {number} If the team exists, return the number of members in the team. Otherwise, returns -1.
 * @description Gets the number of current members of a team defined by name
 */
async function getSize(name) {
    const team = await findByName(name);

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
    addMember: addMember,
    updateOne: updateOne,
    removeTeamIfEmpty: removeTeamIfEmpty
};
