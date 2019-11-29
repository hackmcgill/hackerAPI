"use strict";
const Hacker = require("../models/hacker.model");
const logger = require("./logger.service");

const cache = require("memory-cache");

const Constants = require("../constants/general.constant");

const QRCode = require("qrcode");

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
 * @param {{_id?: ObjectId, accountId?: ObjectId, school?: string, gender?: string, needsBus?: boolean, application?: {Object}, teamId?: ObjectId}} hackerDetails
 * @return {DocumentQuery} The document query will resolve to hacker or null.
 * @description Update an account specified by its mongoId with information specified by hackerDetails.
 */
function updateOne(id, hackerDetails) {
  const TAG = `[Hacker Service # update ]:`;

  const query = {
    _id: id
  };

  return Hacker.findOneAndUpdate(
    query,
    hackerDetails,
    logger.updateCallbackFactory(TAG, "hacker")
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

  for (const query of queries) {
    let currId = await Hacker.findOne(
      query,
      "_id",
      logger.queryCallbackFactory(TAG, "hacker", query)
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
    accountId: accountId
  };
  console.log(query);

  return Hacker.findOne(query, logger.updateCallbackFactory(TAG, "hacker"));
}

async function getStatsAllHackersCached() {
  const TAG = `[ hacker Service # getStatsAll ]`;
  if (cache.get(Constants.CACHE_KEY_STATS) !== null) {
    logger.info(`${TAG} Getting cached stats`);
    return cache.get(Constants.CACHE_KEY_STATS);
  }
  const allHackers = await Hacker.find(
    {},
    logger.updateCallbackFactory(TAG, "hacker")
  ).populate({
    path: "accountId"
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
    needsBus: {},
    ethnicity: {},
    jobInterest: {},
    major: {},
    graduationYear: {},
    dietaryRestrictions: {},
    shirtSize: {},
    age: {}
  };

  hackers.forEach(hacker => {
    if (!hacker.accountId) {
      // user is no longer with us for some reason :(
      return;
    }
    stats.total += 1;
    stats.status[hacker.status] = stats.status[hacker.status]
      ? stats.status[hacker.status] + 1
      : 1;
    stats.school[hacker.school] = stats.school[hacker.school]
      ? stats.school[hacker.school] + 1
      : 1;
    stats.degree[hacker.degree] = stats.degree[hacker.degree]
      ? stats.degree[hacker.degree] + 1
      : 1;
    stats.gender[hacker.gender] = stats.gender[hacker.gender]
      ? stats.gender[hacker.gender] + 1
      : 1;
    stats.needsBus[hacker.needsBus] = stats.needsBus[hacker.needsBus]
      ? stats.needsBus[hacker.needsBus] + 1
      : 1;

    for (const ethnicity of hacker.ethnicity) {
      stats.ethnicity[ethnicity] = stats.ethnicity[ethnicity]
        ? stats.ethnicity[ethnicity] + 1
        : 1;
    }

    stats.jobInterest[hacker.application.jobInterest] = stats.jobInterest[
      hacker.application.jobInterest
    ]
      ? stats.jobInterest[hacker.application.jobInterest] + 1
      : 1;
    stats.major[hacker.major] = stats.major[hacker.major]
      ? stats.major[hacker.major] + 1
      : 1;
    stats.graduationYear[hacker.graduationYear] = stats.graduationYear[
      hacker.graduationYear
    ]
      ? stats.graduationYear[hacker.graduationYear] + 1
      : 1;

    for (const dietaryRestrictions of hacker.accountId.dietaryRestrictions) {
      stats.dietaryRestrictions[dietaryRestrictions] = stats
        .dietaryRestrictions[dietaryRestrictions]
        ? stats.dietaryRestrictions[dietaryRestrictions] + 1
        : 1;
    }
    stats.shirtSize[hacker.accountId.shirtSize] = stats.shirtSize[
      hacker.accountId.shirtSize
    ]
      ? stats.shirtSize[hacker.accountId.shirtSize] + 1
      : 1;
    const age = hacker.accountId.getAge();
    stats.age[age] = stats.age[age] ? stats.age[age] + 1 : 1;
  });
  return stats;
}

module.exports = {
  createHacker: createHacker,
  findById: findById,
  updateOne: updateOne,
  findIds: findIds,
  findByAccountId: findByAccountId,
  getStats: getStats,
  getStatsAllHackersCached: getStatsAllHackersCached,
  generateQRCode: generateQRCode,
  generateHackerViewLink: generateHackerViewLink
};
