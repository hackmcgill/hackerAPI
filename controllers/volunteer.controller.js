"use strict";
const Services = {
    Volunteer: require("../services/volunteer.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
}

/**
 * @async
 * @function createdVolunteer
 * @param {{body: {volunteer: {_id: ObjectId, accountId: ObjectId}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Show the success message and the created volunteer
 */
async function createdVolunteer(req, res) {

    return res.status(200).json({
        message: Constants.Success.VOLUNTEER_CREATE,
        data: req.body.volunteer
    });
}

module.exports = {
    createdVolunteer: createdVolunteer,
};