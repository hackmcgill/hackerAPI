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

module.exports = {
    createVolunteer: createVolunteer,
    findById: findById,
};