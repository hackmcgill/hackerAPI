"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const mongoose = require("mongoose");
const Volunteer = require("../../models/volunteer.model");
const logger = require("../../services/logger.service");
const TAG = "[ TAG.TEST.UTIL.JS ]";

const volunteers = [
    {
        "_id": mongoose.Types.ObjectId(),
        "accountId": Util.Account.Account4._id
    },
];

function storeAll (attributes, callback) {
    const volunteerDocs = [];
    const volunteerNames = [];
    attributes.forEach((attribute) => {
        volunteerDocs.push(new Volunteer(attribute));
        volunteerNames.push(attribute.name);
    });

    Volunteer.collection.insertMany(volunteerDocs).then(
        () => {
            logger.info(`${TAG} saved Team: ${volunteerNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Team ${volunteerNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll (callback) {
    Volunteer.collection.drop().then(
        () => {
            logger.info(`dropped table Team`);
            callback();
        },
        (err) => {
            logger.infor(`Could not drop Team. Error: ${JSON.stringify(err)}`);
            callback();
        }
    );
}

module.exports = {
    volunteers: volunteers,
    storeAll: storeAll,
    dropAll: dropAll,
};
