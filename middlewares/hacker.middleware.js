"use strict";

const TAG = `[ HACKER.MIDDLEWARE.js ]`;
const mongoose = require("mongoose");

/**
 * @async
 * @function parseHacker
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @return {void}
 * @description 
 * Moves accountId, school, gender, needsBus, application from req.body to req.body.teamDetails. 
 * Adds _id to teamDetails.
 */
function parseHacker(req, res, next) {
    const hackerDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
        school: req.body.school,
        gender: req.body.gender,
        needsBus: req.body.needsBus,
        application: req.body.application,
    };

    delete req.body.accountId;
    delete req.body.school;
    delete req.body.gender;
    delete req.body.needsBus;
    delete req.body.application;

    req.body.hackerDetails = hackerDetails;

    next();
}

/**
 * @async
 * @function addDefaultStatus
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @return {void}
 * @description Adds status to teamDetails.
 */
function addDefaultStatus(req, res, next) {
    req.body.hackerDetails.status = "Applied";
}

module.exports = {
    parseHacker: parseHacker,
    addDefaultStatus: addDefaultStatus,
};