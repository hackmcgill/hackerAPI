"use strict";
const Sponsor = require("../models/sponsor.model");
const logger = require("./logger.service");

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to a sponsor or null.
 * @description Find a sponsor by id
 */
function findById(id) {
    const TAG = `[Sponsor Service # findById]:`;
    const query = {
        _id: id
    };

    return logger.logQuery(TAG, "sponsor", query, Sponsor.findById(query));
}

/**
 * @function createSponsor
 * @param {{_id: ObjectId, accountId: ObjectId, tier: number, company: string, contractURL: string, nominees: ObjectId[]}} sponsorDetails
 * @return {Promise<Sponsor>} The promise will resolve to a sponsor object if save was successful.
 * @description Adds a new sponsor to database.
 */
function createSponsor(sponsorDetails) {
    const TAG = `[Sponsor Service # createSponsor]:`;

    const sponsor = new Sponsor(sponsorDetails);

    return sponsor.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{company?: string, contractURL?: string, nominees?: ObjectId[]}} sponsorDetails
 * @return {Promise<Sponsor>} The promise will resolve to a sponsor object if update was successful.
 * @description Updates a sponsor by id with information in sponsorDetails. Return the updated sponsor
 */
function updateOne(id, sponsorDetails) {
    const TAG = `[Sponsor Service # updateOne]:`;

    const query = {
        _id: id
    };

    return Sponsor.findOneAndUpdate(query, sponsorDetails, {
        new: true
    });
}

/**
 * @function findByAccountId
 * @param {ObjectId} accountId
 * @return {DocumentQuery} A sponsor document queried by accountId
 */
function findByAccountId(accountId) {
    const TAG = `[ Sponsor Service # findByAccountId ]:`;

    const query = {
        accountId: accountId
    };

    return logger.logUpdate(TAG, "sponsor", Sponsor.findOne(query));
}

module.exports = {
    findByAccountId: findByAccountId,
    findById: findById,
    createSponsor: createSponsor,
    updateOne: updateOne
};
