"use strict";
const Travel = require("../models/travel.model");
const logger = require("./logger.service");

// const Constants = require("../constants/general.constant");


/**
 * @function createTravel
 * @param {{_id: ObjectId, accountId: ObjectId, status: enum of Constants.TRAVEL_STATUSES, request: Number, offer?: number}} travelDetails
 * @return {Promise<Hacker>} The promise will resolve to a travel object if save is successful.
 * @description Adds a new travel to database.
 */
function createTravel(travelDetails) {
    const TAG = `[Travel Service # createTravel]:`;

    const travel = new Travel(travelDetails);

    return travel.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{_id?: ObjectId, accountId?: ObjectId, status?: enum of Constants.TRAVEL_STATUSES, request?: Number, offer?: number}} travelDetails
 * @return {DocumentQuery} The document query will resolve to travel or null.
 * @description Update an travel specified by its mongoId with information specified by travelDetails.
 */
function updateOne(id, travelDetails) {
    const TAG = `[Travel Service # update ]:`;

    const query = {
        _id: id
    };

    return Travel.findOneAndUpdate(
        query,
        travelDetails,
        logger.updateCallbackFactory(TAG, "travel")
    );
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to travel or null.
 * @description Finds an travel by the id, which is the mongoId.
 */
function findById(id) {
    const TAG = `[Travel Service # findById ]:`;

    return Travel.findById(id, logger.queryCallbackFactory(TAG, "travel", id));
}

/**
 * @async
 * @function findOne
 * @param {JSON} query
 * @return {Travel | null} either travel or null
 * @description Finds an travel by some query.
 */
async function findIds(queries) {
    const TAG = `[Travel Service # findIds ]:`;
    let ids = [];

    for (const query of queries) {
        let currId = await Travel.findOne(
            query,
            "_id",
            logger.queryCallbackFactory(TAG, "travel", query)
        );
        ids.push(currId);
    }
    return ids;
}

/**
 * @function findByAccountId
 * @param {ObjectId} accountId
 * @return {DocumentQuery} A travel document queried by accountId
 */
function findByAccountId(accountId) {
    const TAG = `[ Travel Service # findByAccountId ]:`;
    const query = {
        accountId: accountId
    };

    return Travel.findOne(query, logger.updateCallbackFactory(TAG, "travel"));
}

/**
 * @function findByHackerId
 * @param {ObjectId} travelId
 * @return {DocumentQuery} A travel document queried by hackerId
 */
function findByHackerId(accountId) {
    const TAG = `[ Travel Service # findByAccountId ]:`;
    const query = {
        hackerId: hackerId
    };

    return Travel.findOne(query, logger.updateCallbackFactory(TAG, "travel"));
}

module.exports = {
    createTravel: createTravel,
    findById: findById,
    updateOne: updateOne,
    findIds: findIds,
    findByAccountId: findByAccountId,
    findByHackerId: findByHackerId
};
