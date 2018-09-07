"use strict";
const Services = {
    Sponsor: require("../services/sponsor.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const mongoose = require("mongoose");

/**
 * @async
 * @function findById
 * @param req
 * @param res
 * @return {JSON} Success or error status
 * @description Retrieves a sponsor's information via it's mongoId specified in req.params.id
 */
async function findById(req, res) {
    // finds sponsor by route parameter
    const testId = mongoose.Types.ObjectId();
    console.log(testId);
    const sponsor = await Services.Sponsor.findById("testId")
                        .exec((error, result) => {
                            if (error) {
                                console.log("In exec " + error);
                            }
                            if (result) {
                                console.log(result);
                            }
                        });
    const sponsor1 = Services.Sponsor.findById("testId").exec()
                        .then(
                            (resolve) => {
                                console.log("In then " + resolve);
                            },
                            (error) => {
                                console.log("In then " + error);
                            }
                        );
    
    console.log("sponsor " + sponsor);
    console.log("sponsor1 " + sponsor1);

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
 * @param req
 * @param res
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