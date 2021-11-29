import Travel from "../models/travel.model";
const logger = require("./logger.service");
import { UpdateResult } from "typeorm";

// const Constants = require("../constants/general.constant");

/**
 * @function createTravel
 * @param {{_id: ObjectId, accountId: ObjectId, status: enum of Constants.TRAVEL_STATUSES, request: Number, offer?: number}} travelDetails
 * @return {Promise<Hacker>} The promise will resolve to a travel object if save is successful.
 * @description Adds a new travel to database.
 */
async function createTravel(travelDetails: Object): Promise<Travel> {
    const TAG = `[Travel Service # createTravel]:`;

    const travel = Travel.create(travelDetails);
    return await travel.save();
}

/**
 * @function updateOne
 * @param {number} identifier
 * @param {{_id?: ObjectId, accountId?: ObjectId, status?: enum of Constants.TRAVEL_STATUSES, request?: Number, offer?: number}} travelDetails
 * @return {Promise<Travel | UpdateResult>} The document query will resolve to travel or null.
 * @description Update an travel specified by its mongoId with information specified by travelDetails.
 */
async function updateOne(
    identifier: number,
    travelDetails: Object
): Promise<Travel | UpdateResult | undefined> {
    const TAG = `[Travel Service # update ]:`;

    return await Travel.findOne(identifier, travelDetails).then((travel) => {
        logger.updateCallbackFactory(TAG, "travel");
        return travel;
    });
}

/**
 * @function findById
 * @param {number} identifier
 * @return {Promise<Travel | undefined>} The document query will resolve to travel or null.
 * @description Finds an travel by the id, which is the mongoId.
 */
async function findById(identifier: number): Promise<Travel | undefined> {
    const TAG = `[Travel Service # findById ]:`;

    return await Travel.findOne(identifier).then((travel) => {
        logger.queryCallbackFactory(TAG, "travel", identifier);
        return travel;
    });
}

/**
 * @async
 * @function findOne
 * @param {Object} query
 * @return {Promise<(Travel | undefined)[]>} either travel or null
 * @description Finds an travel by some query.
 */
async function findIds(queries: Object[]): Promise<(Travel | undefined)[]> {
    const TAG = `[Travel Service # findIds ]:`;
    let ids = [];

    for (const query of queries) {
        let current = await Travel.findOne({ where: query }).then(
            (travel: Travel) => {
                logger.queryCallbackFactory(TAG, "travel", query);
                return travel;
            }
        );
        ids.push(current);
    }
    return ids;
}

/**
 * @function findByHackerId
 * @param {number} identifier
 * @return {Promise<Travel | undefined>} A travel document queried by accountId
 */
async function findByHackerId(identifier: number): Promise<Travel | undefined> {
    const TAG = `[ Travel Service # findByHackerId ]:`;
    const query = {
        hacker: identifier
    };

    return await Travel.findOne({ where: query }).then((travel) => {
        logger.updateCallbackFactory(TAG, "travel");
        return travel;
    });
}

export { createTravel, findById, updateOne, findIds, findByHackerId };
