"use strict";
const Services = {
    Sponsor: require("../services/sponsor.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function findById
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Retrieves a sponsor's information via it's mongoId specified in req.params.id
 */
async function findById(req, res) {
    // finds sponsor by route parameter
    const sponsor = await Services.Sponsor.findById(req.params.id);

    if (sponsor) {
        return res.status(200).json({
            message: "Successfully retrieved sponsor information",
            data: sponsor.toJSON()
        });
    } else {
        return res.status(400).json({
            message: "Issue with retrieving sponsor information",
            data: {}
        });
    }
}

/**
 * @async
 * @function createSponsor
 * @param {*} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description create a sponsor from information in req.body.sponsorDetails
 */
async function createSponsor(req, res) {
    const sponsorDetails = req.body.sponsorDetails;

    const success = await Services.Sponsor.createSponsor(sponsorDetails);

    if (success) {
        return res.status(200).json({
            message: "Sponsor creation successful",
            data: sponsorDetails
        });
    } else {
        return res.status(400).json({
            message: "Issue with sponsor creation",
            data: {}
        });
    }
}

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    },

    findById: Util.asyncMiddleware(findById),
    createSponsor: Util.asyncMiddleware(createSponsor),
};