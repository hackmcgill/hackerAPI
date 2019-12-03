'use strict';
const Services = {
  Volunteer: require('../services/volunteer.service'),
  Logger: require('../services/logger.service'),
};
const Util = require('../middlewares/util.middleware');
const Constants = {
  Success: require('../constants/success.constant'),
  Error: require('../constants/error.constant'),
};

/**
 * @function createdVolunteer
 * @param {{body: {volunteer: {_id: ObjectId, accountId: ObjectId}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description Show the success message and the created volunteer
 */
function createdVolunteer(req, res) {
  return res.status(200).json({
    message: Constants.Success.VOLUNTEER_CREATE,
    data: req.body.volunteer,
  });
}

/**
 * @function showVolunteer
 * @param {{body: {volunteer: {_id: ObjectId, accountId: ObjectId}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description Show the success message and retrieved volunteer
 */
function showVolunteer(req, res) {
  return res.status(200).json({
    message: Constants.Success.VOLUNTEER_GET_BY_ID,
    data: req.body.volunteer.toJSON(),
  });
}

module.exports = {
  createdVolunteer: createdVolunteer,
  showVolunteer: showVolunteer,
};
