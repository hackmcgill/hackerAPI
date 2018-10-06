"use strict";
const Services = {
    Volunteer: require("../services/volunteer.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function createVolunteer
 * @param {{body: {volunteerDetails: {_id: ObjectId, accountId: ObjectId}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description create a volunteer from information in req.body.volunteerDetails
 */
async function createVolunteer(req, res) {
    const volunteerDetails = req.body.volunteerDetails;

    const success = await Services.Volunteer.createVolunteer(volunteerDetails);

    if (success) {
        return res.status(200).json({
            message: "Volunteer creation successful",
            data: volunteerDetails
        });
    } else {
        return res.status(400).json({
            message: "Issue with volunteer creation",
            data: {}
        });
    }
}

module.exports = {
    createVolunteer: Util.asyncMiddleware(createVolunteer),
};