"use strict";
const Hacker = require("../models/hacker.model");
const logger = require("./logger.service");

const cache = require("memory-cache");

const Constants = require("../constants/general.constant");

const QRCode = require("qrcode");

/**
 * @function createHacker
 * @param {{_id: ObjectId, accountId: ObjectId, application: {Object}}} hackerDetails
 * @return {Promise<Hacker>} The promise will resolve to a hacker object if save is successful.
 * @description Adds a new hacker to database.
 */
function createHacker(hackerDetails) {
    const TAG = `[Hacker Service # createHacker]:`;

    let hacker;

    //if (Date.now() < Constants.APPLICATION_CLOSE_TIME) {
    hacker = new Hacker(hackerDetails);
    return hacker.save();
    //}
    //throw new Error("Sorry, the application deadline has passed!");
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{_id?: ObjectId, accountId?: ObjectId, application?: {Object}, teamId?: ObjectId}} hackerDetails
 * @return {DocumentQuery} The document query will resolve to hacker or null.
 * @description Update an account specified by its mongoId with information specified by hackerDetails.
 */
function updateOne(id, hackerDetails) {
    const TAG = `[Hacker Service # update ]:`;

    const query = {
        _id: id,
    };

    return logger.logUpdate(
        TAG,
        "hacker",
        Hacker.findOneAndUpdate(query, hackerDetails, { new: true }),
    );
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to hacker or null.
 * @description Finds an hacker by the id, which is the mongoId.
 */
function findById(id) {
    const TAG = `[Hacker Service # findById ]:`;

    return logger.logQuery(TAG, "hacker", id, Hacker.findById(id));
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

    for (const query of queries) {
        let currId = await logger.logQuery(
            TAG,
            "hacker",
            query,
            Hacker.findOne(query, "_id"),
        );
        ids.push(currId);
    }
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
        accountId: accountId,
    };

    return logger.logUpdate(TAG, "hacker", Hacker.findOne(query));
}

/**
 * Find all hackers with a specific status
 * @param {string} status - The status to search for (e.g., "Accepted", "Declined")
 * @return {Promise<Array<Hacker>>} Array of hacker documents with the specified status
 */
function findByStatus(status) {
    const TAG = `[ Hacker Service # findByStatus ]:`;
    const query = { status: status };

    return logger.logQuery(
        TAG,
        "hacker",
        query,
        Hacker.find(query).populate("accountId"),
    );
}

async function getStatsAllHackersCached() {
    const TAG = `[ hacker Service # getStatsAll ]`;
    if (cache.get(Constants.CACHE_KEY_STATS) !== null) {
        logger.info(`${TAG} Getting cached stats`);
        return cache.get(Constants.CACHE_KEY_STATS);
    }
    const allHackers = await logger
        .logUpdate(TAG, "hacker", Hacker.find({}))
        .populate({
            path: "accountId",
        });
    cache.put(Constants.CACHE_KEY_STATS, stats, Constants.CACHE_TIMEOUT_STATS); //set a time-out of 5 minutes
    return getStats(allHackers);
}

/**
 * Generate a QR code for the hacker.
 * @param {string} str The string to be encoded in the QR code.
 */
async function generateQRCode(str) {
    const response = await QRCode.toDataURL(str, {
        scale: 4,
    });
    return response;
}

/**
 * Generate the link for the single hacker view page on frontend.
 * @param {string} httpOrHttps either HTTP or HTTPs
 * @param {string} domain The domain of the frontend site
 * @param {string} id The ID of the hacker to view
 */
function generateHackerViewLink(httpOrHttps, domain, id) {
    const link = `${httpOrHttps}://${domain}/application/view/${id}`;
    return link;
}

function getStats(hackers) {
    const TAG = `[ hacker Service # getStats ]`;
    const stats = {
        total: 0,
        status: {},
        school: {},
        degree: {},
        gender: {},
        travel: {},
        ethnicity: {},
        country: {},
        jobInterest: {},
        fieldOfStudy: {},
        graduationYear: {},
        dietaryRestrictions: {},
        shirtSize: {},
        age: {},
        applicationDate: {},
    };

    hackers.forEach((hacker) => {
        if (!hacker.accountId) {
            // user is no longer with us for some reason :(
            return;
        }
        stats.total += 1;
        stats.status[hacker.status] = stats.status[hacker.status]
            ? stats.status[hacker.status] + 1
            : 1;
        stats.school[hacker.application.general.school] = stats.school[
            hacker.application.general.school
        ]
            ? stats.school[hacker.application.general.school] + 1
            : 1;
        stats.degree[hacker.application.general.degree] = stats.degree[
            hacker.application.general.degree
        ]
            ? stats.degree[hacker.application.general.degree] + 1
            : 1;
        stats.gender[hacker.accountId.gender] = stats.gender[
            hacker.accountId.gender
        ]
            ? stats.gender[hacker.accountId.gender] + 1
            : 1;
        stats.travel[hacker.application.accommodation.travel] = stats.travel[
            hacker.application.accommodation.travel
        ]
            ? stats.travel[hacker.application.accommodation.travel] + 1
            : 1;

        for (const ethnicity of hacker.application.other.ethnicity) {
            stats.ethnicity[ethnicity] = stats.ethnicity[ethnicity]
                ? stats.ethnicity[ethnicity] + 1
                : 1;
        }

        stats.country[hacker.application.other.country] = stats.country[
            hacker.application.other.country
        ]
            ? stats.country[hacker.application.other.country] + 1
            : 1;

        stats.jobInterest[hacker.application.general.jobInterest] = stats
            .jobInterest[hacker.application.general.jobInterest]
            ? stats.jobInterest[hacker.application.general.jobInterest] + 1
            : 1;
        stats.fieldOfStudy[hacker.application.general.fieldOfStudy] = stats
            .fieldOfStudy[hacker.application.general.fieldOfStudy]
            ? stats.fieldOfStudy[hacker.application.general.fieldOfStudy] + 1
            : 1;
        stats.graduationYear[hacker.application.general.graduationYear] = stats
            .graduationYear[hacker.application.general.graduationYear]
            ? stats.graduationYear[hacker.application.general.graduationYear] +
              1
            : 1;
        for (const dietaryRestrictions of hacker.accountId
            .dietaryRestrictions) {
            stats.dietaryRestrictions[dietaryRestrictions] = stats
                .dietaryRestrictions[dietaryRestrictions]
                ? stats.dietaryRestrictions[dietaryRestrictions] + 1
                : 1;
        }
        stats.shirtSize[hacker.application.accommodation.shirtSize] = stats
            .shirtSize[hacker.application.accommodation.shirtSize]
            ? stats.shirtSize[hacker.application.accommodation.shirtSize] + 1
            : 1;

        // CHANGED BIRTHDATE TO AGE
        // const age = hacker.accountId.getAge();
        // stats.age[age] = stats.age[age] ? stats.age[age] + 1 : 1;

        stats.age[hacker.accountId.age] = stats.age[hacker.accountId.age]
            ? stats.age[age] + 1
            : 1;

        const applicationDate = hacker._id
            .getTimestamp() //
            .toISOString() // converts Date to "YYYY-MM-DDTHH:mm:ss.sssZ" format
            .slice(0, 10); // slice(beginIndex, endIndex) extracts string from beginIndex to endIndex, used to convert to "YYYY-MM-DD" format

        stats.applicationDate[applicationDate] = stats.applicationDate[
            applicationDate
        ]
            ? stats.applicationDate[applicationDate] + 1
            : 1;
    });
    return stats;
}

module.exports = {
    createHacker: createHacker,
    findById: findById,
    updateOne: updateOne,
    findIds: findIds,
    findByAccountId: findByAccountId,
    findByStatus: findByStatus,
    getStats: getStats,
    getStatsAllHackersCached: getStatsAllHackersCached,
    generateQRCode: generateQRCode,
    generateHackerViewLink: generateHackerViewLink,
};
