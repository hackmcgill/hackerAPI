'use strict';
const Services = {
  Sponsor: require('../services/sponsor.service'),
  Logger: require('../services/logger.service'),
};
const Util = require('../middlewares/util.middleware');
const Constants = {
  Success: require('../constants/success.constant'),
  Error: require('../constants/error.constant'),
};

/**
 * @function showSponsor
 * @param {{body: {sponsor: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and sponsor object
 * @description Returns the JSON of sponsor object located in req.body.sponsor
 */
function showSponsor(req, res) {
  return res.status(200).json({
    message: Constants.Success.SPONSOR_READ,
    data: req.body.sponsor.toJSON(),
  });
}

/**
 * @function createdSponsor
 * @param {{body: {sponsor: {_id: ObjectId, accountId: ObjectId, tier: number, company: string, contractURL: string, nominees: ObjectId[]}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description returns success message
 */
function createdSponsor(req, res) {
  return res.status(200).json({
    message: Constants.Success.SPONSOR_CREATE,
    data: req.body.sponsor.toJSON(),
  });
}

/**
 * @function updatedSponsor
 * @param {{body: {sponsor: {_id: ObjectId, accountId: ObjectId, tier: number, company: string, contractURL: string, nominees: ObjectId[]}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description returns success message
 */
function updatedSponsor(req, res) {
  return res.status(200).json({
    message: Constants.Success.SPONSOR_UPDATE,
    data: req.body.sponsor.toJSON(),
  });
}

module.exports = {
  createdSponsor: createdSponsor,
  showSponsor: showSponsor,
  updatedSponsor: updatedSponsor,
};
