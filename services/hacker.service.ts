import { UpdateResult } from "typeorm";
import Hacker from "../models/hacker.model";
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
async function createHacker(hackerDetails: Object): Promise<Hacker> {
    const TAG = `[Hacker Service # createHacker]:`;

    //if (Date.now() < Constants.APPLICATION_CLOSE_TIME) {
    let hacker = Hacker.create(hackerDetails);
    return await hacker.save();
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
async function updateOne(
    identifier: number,
    hackerDetails: Object
): Promise<Hacker | UpdateResult> {
    const TAG = `[Hacker Service # update ]:`;

    return await Hacker.update(identifier, hackerDetails).then((hacker) => {
        logger.updateCallbackFactory(TAG, "hacker");
        return hacker;
    });
}

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to hacker or null.
 * @description Finds an hacker by the id, which is the mongoId.
 */
async function findById(identifier: number): Promise<Hacker | undefined> {
    const TAG = `[Hacker Service # findById ]:`;

    return await Hacker.findOne(identifier).then((hacker) => {
        logger.queryCallbackFactory(TAG, "hacker", identifier);
        return hacker;
    });
}

/**
 * @async
 * @function findOne
 * @param {ObjectID} query
 * @return {Hacker | null} either hacker or null
 * @description Finds an hacker by some query.
 */
async function findIds(queries: Object[]): Promise<(Hacker | undefined)[]> {
    const TAG = `[Hacker Service # findIds ]:`;
    let ids = [];

    for (const query of queries) {
        let current = await Hacker.findOne({ where: query }).then(
            (hacker: Hacker) => {
                logger.queryCallbackFactory(TAG, "hacker", query);
                return hacker;
            }
        );
        ids.push(current);
    }
    return ids;
}

//TODO - Remove this function, it is redundant.
/**
 * @function findByAccountId
 * @param {number} accountId
 * @return {Promise<Hacker | undefined>} A hacker document queried by accountId
 */
function findByAccountId(accountId: number): Promise<Hacker | undefined> {
    const TAG = `[ Hacker Service # findByAccountId ]:`;
    const query = {
        identifier: accountId
    };

    return Hacker.findOne({ where: query }).then((hacker: Hacker) => {
        logger.updateCallbackFactory(TAG, "hacker");
        return hacker;
    });
}

async function getStatsAllHackersCached() {
    const TAG = `[ hacker Service # getStatsAll ]`;
    if (cache.get(Constants.CACHE_KEY_STATS) !== null) {
        logger.info(`${TAG} Getting cached stats`);
        return cache.get(Constants.CACHE_KEY_STATS);
    }

    const allHackers = await Hacker.find().then((hackers) => {
        logger.updateCallbackFactory(TAG, "hacker");
        return hackers;
    });
    const stats = getStats(allHackers);
    cache.put(Constants.CACHE_KEY_STATS, stats, Constants.CACHE_TIMEOUT_STATS); //set a time-out of 5 minutes
    return stats;
}

/**
 * Generate a QR code for the hacker.
 * @param {string} str The string to be encoded in the QR code.
 */
async function generateQRCode(str: string) {
    const response = await QRCode.toDataURL(str, {
        scale: 4
    });
    return response;
}

/**
 * Generate the link for the single hacker view page on frontend.
 * @param {string} httpOrHttps either HTTP or HTTPs
 * @param {string} domain The domain of the frontend site
 * @param {string} id The ID of the hacker to view
 */
function generateHackerViewLink(
    httpOrHttps: string,
    domain: string,
    id: number
) {
    const link = `${httpOrHttps}://${domain}/application/view/${id}`;
    return link;
}

function getStats(hackers: Hacker[]): Object {
    const TAG = `[ hacker Service # getStats ]`;
    const stats = {
        total: 0,
        status: {},
        school: {},
        degree: {},
        gender: {},
        travel: {},
        ethnicity: {},
        jobInterest: {},
        fieldOfStudy: {},
        graduationYear: {},
        dietaryRestrictions: {},
        shirtSize: {},
        age: {},
        applicationDate: {}
    };

    hackers.forEach((hacker) => {
        if (!hacker.identifier) {
            // user is no longer with us for some reason :(
            return;
        }
        stats.total += 1;
        //TODO - Fix this functionality.
        /*
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
        const age = hacker.accountId.getAge();
        stats.age[age] = stats.age[age] ? stats.age[age] + 1 : 1;

        const applicationDate = hacker._id
            .getTimestamp() //
            .toISOString() // converts Date to "YYYY-MM-DDTHH:mm:ss.sssZ" format
            .slice(0, 10); // slice(beginIndex, endIndex) extracts string from beginIndex to endIndex, used to convert to "YYYY-MM-DD" format

        stats.applicationDate[applicationDate] = stats.applicationDate[
            applicationDate
        ]
            ? stats.applicationDate[applicationDate] + 1
            : 1;
            */
    });
    return stats;
}

export {
    createHacker,
    findById,
    updateOne,
    findIds,
    findByAccountId,
    getStats,
    getStatsAllHackersCached,
    generateQRCode,
    generateHackerViewLink
};
