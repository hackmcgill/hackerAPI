"use strict";
const Volunteer = require("../models/volunteer.model");
const logger = require("./logger.service");

/**
 * @function createVolunteer
 * @param {{_id: ObjectId, accountId: ObjectId}} volunteerDetails
 * @return {Promise<Volunteer>} The promise will resolve to a volunteer object if save was successful.
 * @description Adds a new volunteer to database.
 */
function createVolunteer(volunteerDetails) {
    const TAG = `[Volunteer Service # createTeam]:`;

    const volunteer = new Volunteer(volunteerDetails);

    return volunteer.save();
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to volunteer or null.
 * @description Finds an volunteer by the id, which is the mongoId.
 */
function findById(id) {
    const TAG = `[Volunteer Service # findById ]:`;

    return Volunteer.findById(id, logger.queryCallbackFactory(TAG, "volunteer", id));
}

/**
 * @function findByAccountId
 * @param {ObjectId} accountId
 * @return {DocumentQuery} A volunteer document queried by accountId
 */
function findByAccountId(accountId) {
    const TAG = `[ Volunteer Service # findByAccountId ]:`;

    const query = {
        accountId: accountId
    };

    return Volunteer.findOne(query, logger.updateCallbackFactory(TAG, "hacker"));
}

module.exports = {
    createVolunteer: createVolunteer,
    findById: findById,
    findByAccountId: findByAccountId,
};