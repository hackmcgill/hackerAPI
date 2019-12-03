'use strict';
const mongoose = require('mongoose');

const Services = {
  Team: require('../services/team.service'),
  Logger: require('../services/logger.service'),
};
const Util = require('../middlewares/util.middleware');
const Constants = {
  Success: require('../constants/success.constant'),
  Error: require('../constants/error.constant'),
};

/**
 * @function showTeam
 * @param {{body: {team: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and team object
 * @description Returns the JSON of team object located in req.body.team
 */
function showTeam(req, res) {
  const teamData = req.body.team.toJSON();

  const memberNames = [];
  for (const member of req.body.teamMembers) {
    const strippedMemberJSON = member.toStrippedJSON();

    const memberName = {
      firstName: strippedMemberJSON.firstName,
      lastName: strippedMemberJSON.lastName,
    };

    memberNames.push(memberName);
  }

  return res.status(200).json({
    message: Constants.Success.TEAM_READ,
    data: {
      team: teamData,
      members: memberNames,
    },
  });
}

/**
 * @function joinedTeam
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success status of joining team
 * @description return success message of joining team
 */
function joinedTeam(req, res) {
  return res.status(200).json({
    message: Constants.Success.TEAM_JOIN,
    data: {},
  });
}

/**
 * @function updatedTeam
 * @param {{body: {team: {_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}}}} req
 * @param {*} res
 * @return {JSON} Success status
 * @description Display team information and update success status
 */
function updatedTeam(req, res) {
  return res.status(200).json({
    message: Constants.Success.TEAM_UPDATE,
    data: req.body.team.toJSON(),
  });
}

/**
 * @function createdTeam
 * @param {{body: {team: {_id: ObjectId, name: string, members: ObjectId[], devpostURL: string, projectName: string}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Display team information and creation success status.
 */
function createdTeam(req, res) {
  return res.status(200).json({
    message: Constants.Success.TEAM_CREATE,
    data: req.body.team,
  });
}

/**
 * @function leftTeam
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success status
 * @description return success message of removing self from team.
 */

function leftTeam(req, res) {
  return res.status(200).json({
    message: Constants.Success.TEAM_HACKER_LEAVE,
    data: {},
  });
}

module.exports = {
  joinedTeam: joinedTeam,
  updatedTeam: updatedTeam,
  createdTeam: createdTeam,
  showTeam: showTeam,
  leftTeam: leftTeam,
};
