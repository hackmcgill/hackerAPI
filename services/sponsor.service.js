"use strict";
const Sponsor = require("../models/sponsor.model");
const logger = require("./logger.service");

/**
 * @async
 * @function findById
 * @param {String} id
 * @return {Sponsor | null} either sponsor or null
 * @description Find a sponsor by id
 */
async function findById(id) {
    const TAG = `[Sponsor Service # findById]:`;
    const query = {
        _id: id
    };

    return await Sponsor.findById(query, function (error, sponsor) {
        if (error) {
            logger.error(`${TAG} Failed to verify if sponsor exist or not using ${JSON.stringify(query)}`, error);
        } else if (sponsor) {
            logger.debug(`${TAG} Sponsor with id ${JSON.stringify(query)} exist in the database`);
        } else {
            logger.debug(`${TAG} Sponsor with id ${JSON.stringify(query)} do not exist in the database`);
        }
    });
}

/**
 * @async
 * @function createSponsor
 * @param {JSON} sponsorDetails
 * @return {boolean} success or failure of attempt to add sponsor
 * @description Adds a new sponsor to database.
 */
async function createSponsor(sponsorDetails) {
    const sponsor = new Sponsor(sponsorDetails);

    const success = await sponsor.save();

    return !!(success);
}

module.exports = {
    findById: findById,
    createSponsor: createSponsor,
};