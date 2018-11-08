"use strict";
const Hacker = require("../models/hacker.model");
const logger = require("./logger.service");

/**
 * @function createHacker
 * @param {{_id: ObjectId, accountId: ObjectId, school: string, gender: string, needsBus: boolean, application: {Object}}} hackerDetails
 * @return {Promise<Hacker>} The promise will resolve to a hacker object if save is successful.
 * @description Adds a new hacker to database.
 */
function createHacker(hackerDetails) {
    const TAG = `[Hacker Service # createHacker]:`;

    const hacker = new Hacker(hackerDetails);

    return hacker.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{_id?: ObjectId, accountId?: ObjectId, school?: string, gender?: string, needsBus?: boolean, application?: {Object}}} hackerDetails
 * @return {DocumentQuery} The document query will resolve to hacker or null.
 * @description Update an account specified by its mongoId with information specified by hackerDetails.
 */
function updateOne(id, hackerDetails) {
    const TAG = `[Hacker Service # update ]:`;

    const query = {
        _id: id
    };

    return Hacker.findOneAndUpdate(query, hackerDetails, logger.updateCallbackFactory(TAG, "hacker"));
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to hacker or null.
 * @description Finds an hacker by the id, which is the mongoId.
 */
function findById(id) {
    const TAG = `[Hacker Service # findById ]:`;

    return Hacker.findById(id, logger.queryCallbackFactory(TAG, "hacker", id));
}

/**
 * @async
 * @function findOne
 * @param {JSON} query
 * @return {Hacker | null} either hacker or null
 * @description Finds an hacker by some query.
 */
async function findIds(queries) {
    const TAG = `[Hacker Service # findIds ]:`;
    let ids = [];

    queries.forEach(async (query) => {
        let currId = await Hacker.findOne(query, "_id", logger.queryCallbackFactory(TAG, "hacker", query));
        ids.push(currId);
    });

    return ids;
}

/**
 * @function findByAccountId
 * @param {ObjectId} accountId
 * @return {DocumentQuery} A hacker document queried by accountId
 */
function findByAccountId(accountId) {
    const TAG = `[ Hacker Service # findByAccountId ]:`;

    const query = {
        accountId: accountId
    };

    return Hacker.findOne(query, logger.updateCallbackFactory(TAG, "hacker"));
}

module.exports = {
    createHacker: createHacker,
    findById: findById,
    updateOne: updateOne,
    findIds: findIds,
    findByAccountId: findByAccountId,
};