"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const mongoose = require("mongoose");
const Volunteer = require("../../models/volunteer.model");
const logger = require("../../services/logger.service");
const TAG = "[ TAG.TEST.UTIL.JS ]";

const newVolunteer1 = {
    "accountId": Util.Account.generatedAccounts[15]._id
};

const duplicateVolunteer1 = {
    "accountId": Util.Account.Account4._id
};

const adminVolunteer1 = {
    "accountId": Util.Account.Admin1._id
};

const Volunteer1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account4._id
};
const Volunteers = [
    Volunteer1,
];

function storeAll(attributes, callback) {
    const volunteerDocs = [];
    const volunteerIds = [];
    attributes.forEach((attribute) => {
        volunteerDocs.push(new Volunteer(attribute));
        volunteerIds.push(attribute._id);
    });

    Volunteer.collection.insertMany(volunteerDocs).then(
        () => {
            logger.info(`${TAG} saved Team: ${volunteerIds.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Team ${volunteerIds.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Volunteer.collection.drop().then(
        () => {
            logger.info(`dropped table Volunteer`);
            callback();
        },
        (err) => {
            logger.info(`Could not drop Volunteer. Error: ${JSON.stringify(err)}`);
            callback();
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}

module.exports = {
    duplicateVolunteer1: duplicateVolunteer1,
    adminVolunteer1: adminVolunteer1,
    newVolunteer1: newVolunteer1,
    Volunteer1: Volunteer1,
    Volunteers: Volunteers,
    storeAll: storeAll,
    dropAll: dropAll,
};