"use strict";
const Services = {
    Sponsor: require("../services/sponsor.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
};

/**
 * @async
 * @function findById
 * @param {{body: {id: ObjectId}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Retrieves a sponsor's information via it's mongoId specified in req.params.id. The id is moved to req.body.id from req.params.id by validation.
 */
async function findById(req, res) {
    // finds sponsor by route parameter
    const sponsor = await Services.Sponsor.findById(req.body.id);

    if (sponsor) {
        return res.status(200).json({
            message: Constants.Success.SPONSOR_GET_BY_ID,
            data: sponsor.toJSON()
        });
    } else {
        return res.status(404).json({
            message: Constants.Error.SPONSOR_404_MESSAGE,
            data: {}
        });
    }
}

/**
 * @async
 * @function createSponsor
 * @param {{body: {sponsorDetails: {_id: ObjectId, accountId: ObjectId, tier: number, company: string, contractURL: string, nominees: ObjectId[]}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description create a sponsor from information in req.body.sponsorDetails
 */
async function createSponsor(req, res) {
    const sponsorDetails = req.body.sponsorDetails;

    const success = await Services.Sponsor.createSponsor(sponsorDetails);

    if (success) {
        return res.status(200).json({
            message: Constants.Success.SPONSOR_CREATE,
            data: sponsorDetails
        });
    } else {
        return res.status(500).json({
            message: Constants.Error.SPONSOR_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

module.exports = {
    findById: Util.asyncMiddleware(findById),
    createSponsor: Util.asyncMiddleware(createSponsor),
};