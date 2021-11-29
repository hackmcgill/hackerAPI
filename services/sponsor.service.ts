"use strict";
import { UpdateResult } from "typeorm";
import Sponsor from "../models/sponsor.model";
import * as logger from "./logger.service";

/**
 * @function findById
 * @param {number} identifier
 * @return {Promise<Sponsor | undefined>} The document query will resolve to a sponsor or null.
 * @description Find a sponsor by id
 */
function findById(identifier: number): Promise<Sponsor | undefined> {
    const TAG = `[Sponsor Service # findById]:`;

    return Sponsor.findOne(identifier).then((sponsor) => {
        logger.queryCallbackFactory(TAG, "sponsor", identifier);
        return sponsor;
    });
}

/**
 * @function createSponsor
 * @param {{_id: ObjectId, accountId: ObjectId, tier: number, company: string, contractURL: string, nominees: ObjectId[]}} sponsorDetails
 * @return {Promise<Sponsor>} The promise will resolve to a sponsor object if save was successful.
 * @description Adds a new sponsor to database.
 */
async function createSponsor(sponsorDetails: Object): Promise<Sponsor> {
    const TAG = `[Sponsor Service # createSponsor]:`;

    const sponsor = Sponsor.create(sponsorDetails);

    return await sponsor.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{company?: string, contractURL?: string, nominees?: ObjectId[]}} sponsorDetails
 * @return {Promise<Sponsor | UpdateResult | undefined>} The promise will resolve to a sponsor object if update was successful.
 * @description Updates a sponsor by id with information in sponsorDetails. Return the updated sponsor
 */
async function updateOne(
    identifier: number,
    sponsorDetails: Object
): Promise<Sponsor | UpdateResult | undefined> {
    const TAG = `[Sponsor Service # updateOne]:`;

    return await Sponsor.update(identifier, sponsorDetails);
}

// TODO - Remove this function, it's redundant.
/**
 * @function findByAccountId
 * @param {number} identifier
 * @return {Promise<Sponsor | undefined>} A sponsor document queried by accountId
 */
function findByAccountId(identifier: number): Promise<Sponsor | undefined> {
    const TAG = `[ Sponsor Service # findByAccountId ]:`;

    return Sponsor.findOne(identifier).then((sponsor) => {
        logger.updateCallbackFactory(TAG, "sponsor");
        return sponsor;
    });
}

module.exports = {
    findByAccountId: findByAccountId,
    findById: findById,
    createSponsor: createSponsor,
    updateOne: updateOne
};

export { findByAccountId, findById, createSponsor, updateOne };
