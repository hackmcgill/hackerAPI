"use strict";
const mongoose = require("mongoose");

/**
 * @function parseVolunteer
 * @param {body: {accountId: ObjectId}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves accountId from req.body to req.body.volunteerDetails.
 * Adds _id to volunteerDetails.
 */
function parseVolunteer (req, res, next) {
    const volunteerDetails = {
        _id: mongoose.Types.ObjectId(),
        accountId: req.body.accountId,
    };

    delete req.body.accountId;

    req.body.volunteerDetails = volunteerDetails;

    next();
}

module.exports = {
    parseVolunteer: parseVolunteer,
};