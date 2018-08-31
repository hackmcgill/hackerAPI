"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const Staff = require("../../models/staff.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");
const TAG = "[ STAFF.TEST.UTIL.JS ]";

const Staff1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account2._id,
    "godMode": true
};
const Staffs = [
    Staff1,
];

function storeAll(attributes, callback) {
    const staffDocs = [];
    const staffIds = [];
    attributes.forEach((attribute) => {
        staffDocs.push(new Staff(attribute));
        staffIds.push(attribute._id);
    });

    Staff.collection.insertMany(staffDocs).then(
        () => {
            logger.info(`${TAG} saved Staffs: ${staffIds.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Staffs ${staffIds.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Staff.collection.drop().then(
        () => {
            logger.info(`Dropped table Staff`);
            callback();
        },
        (err) => {
            logger.infor(`Could not drop Staff. Error: ${JSON.stringify(err)}`);
            callback();
        }
    );
}

module.exports = {
    Staff1: Staff1,
    Staffs: Staffs,
    storeAll: storeAll,
    dropAll: dropAll,
};