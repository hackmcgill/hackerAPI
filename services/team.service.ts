import Team from "../models/team.model";
import hacker from "../routes/api/hacker";
import { BaseEntity, UpdateResult } from "typeorm";

const logger = require("./logger.service");
const Services = {
    Hacker: require("../services/hacker.service")
};
const Middleware = {
    Util: require("../middlewares/util.middleware")
};

/**
 * @function findTeamByHackerId
 * @param {number} hackerId objectID of the hacker
 * @return {DocumentQuery} The document query will resolve to a team or null.
 * @description Finds the team that the hacker belongs to, or undefined.
 */
async function findTeamByHackerId(hackerId: number): Promise<Team | undefined> {
    const TAG = `[Team Service # findTeamByHackerId]:`;

    const query = { hackers: hackerId };

    return await Team.findOne({ where: query }).then((team) => {
        logger.queryCallbackFactory(TAG, "team", query);
        return team;
    });
}

/**
 * @function createTeam
 * @param {{_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}} teamDetails
 * @return {Promise<Team>} The promise will resolve to a team object if save was successful.
 * @description Adds a new team to database.
 */
async function createTeam(teamDetails: Object): Promise<Team> {
    const TAG = `[Team Service # createTeam]:`;

    const team = Team.create(teamDetails);
    return await team.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{name?: string, devpostURL?: string, projectName?: string}} teamDetails
 * @return {DocumentQuery} The document query will resolve to team or null.
 * @description Update a team specified by its mongoId with information specified by teamDetails.
 */

async function updateOne(
    identifier: number,
    teamDetails: Object
): Promise<Team | UpdateResult> {
    const TAG = `[Team Service # updateOne]:`;

    return await Team.update(identifier, teamDetails).then((team) => {
        logger.updateCallbackFactory(TAG, "team");
        return team;
    });
}

/**
 * @function findById
 * @param {number} identifier
 * @return {DocumentQuery} The document query will either resolve to a team or null.
 * @description Finds a team by its mongoID.
 */
async function findById(identifier: number): Promise<Team | undefined> {
    const TAG = `[Team Service # findById]:`;

    return await Team.findOne(identifier).then((team) => {
        logger.queryCallbackFactory(TAG, "team", identifier);
        return team;
    });
}

/**
 * @function findByName
 * @param {String} name
 * @return {DocumentQuery} The document query will either resolve to a team or null.
 * @description Finds a team by its team name.
 */
function findByName(name: string): Promise<Team | undefined> {
    const TAG = `[Team Services # findByName]:`;

    const query = {
        name: name
    };

    return Team.findOne({ where: query }).then((team: Team) => {
        logger.queryCallbackFactory(TAG, "team", query);
        return team;
    });
}

/**
 * @async
 * @function removeMember
 * @param {number} teamId
 * @param {number} hackerId
 * @return {DocumentQuery} The document query will resolve to the number of objects removed, or null.
 * @description Removes the hacker specified by hackerId from a team specified by teamId.
 */
async function removeMember(teamId: number, identifier: number) {
    const TAG = `[Team Services # removeMember]:`;

    const hacker = await Services.Hacker.updateOne(identifier, {
        team: null
    });

    if (!hacker) {
        return null;
    }

    // TODO - Implement this functionality.
    /*    return Team.findOneAndUpdate(
        {
            ident: teamId
        },
        {
            $pull: {
                members: hackerId
            }
        }
    );*/
    return null;
}

/**
 * @async
 * @function addMember
 * @param {ObjectId} teamId
 * @param {ObjectId} hackerId
 * @return {DocumentQuery} Query evaluates to object that details the number of modified documents, or null.
 * @description Add the hacker specified by hackerId to the team specified by teamId
 */
async function addMember(teamId: number, hackerId: number) {
    const TAG = `[Team Services # addMember]:`;

    const hacker = await Services.Hacker.updateOne(hackerId, {
        $set: {
            teamId: teamId
        }
    });

    if (!hacker) {
        return null;
    }

    // TODO - Implement this functionality.
    /*
    return Team.update(
        {
            _id: teamId
        },
        {
            $push: {
                members: [hackerId]
            }
        }
    );*/
    return null;
}

/**
 * @async
 * @function removeTeamIfEmpty
 * @param {ObjectId} teamId
 * @return {Promise<Team>} Query evaluates to object that details the number of modified documents, or null.
 * @description Removes the team if the team contains no members. Returns null if the team has one or more members, or if the team doesn't exist.
 */
async function removeTeamIfEmpty(teamId: number) {
    const TAG = `[Team Services # removeTeam]`;

    const team = await findById(teamId);

    if (team?.hackers.length === 0) {
        return Team.delete(teamId);
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
async function removeTeam(teamId: number) {
    const TAG = `[Team Services # removeTeam]`;

    const team = await findById(teamId);

    if (team == null) return null;

    for (const hackerId of team.hackers) {
        await removeMember(teamId, hackerId.identifier);
    }

    return Team.delete(teamId);
}

/**
 * @async
 * @function getSize
 * @param {*} name
 * @return {number} If the team exists, return the number of members in the team. Otherwise, returns -1.
 * @description Gets the number of current members of a team defined by name
 */
async function getSize(name: string): Promise<number> {
    const team = await findByName(name);

    if (!team) {
        return -1;
    } else {
        return team.hackers.length;
    }
}

/**
 * @async
 * @function isTeamIdValid
 * @param {number} id
 * @return {boolean}
 * @description Checks whether a Team with the specified mongoID exists.
 */
async function isTeamIdValid(identifier: number): Promise<boolean> {
    const team = await findById(identifier);
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
