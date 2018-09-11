"use strict";
const Volunteer = require("../models/volunteer.model");

/**
 * @function createVolunteer
 * @param {JSON} volunteerDetails
 * @return {Promise<Volunteer>} The promise will resolve to a volunteer object if save was successful.
 * @description Adds a new volunteer to database.
 */
function createVolunteer(volunteerDetails) {
    const TAG = `[Volunteer Service # createTeam]:`;

    const volunteer = new Volunteer(volunteerDetails);

    return volunteer.save();
}

module.exports = {
    createVolunteer: createVolunteer,
};