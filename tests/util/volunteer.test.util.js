"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const mongoose = require("mongoose");
const Volunteer = require("../../models/volunteer.model");
const logger = require("../../services/logger.service");

const newVolunteer0 = {
    "accountId": Util.Account.volunteerAccounts.new[0]._id
};

const duplicateVolunteer1 = {
    "accountId": Util.Account.volunteerAccounts.stored[0]._id
};

const Volunteer0 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.volunteerAccounts.stored[0]._id
};

const invalidVolunteer0 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.staffAccounts.stored[0]._id
};

const Volunteers = [
    Volunteer0,
];

function storeAll(attributes) {
    const volunteerDocs = [];
    const volunteerIds = [];
    attributes.forEach((attribute) => {
        volunteerDocs.push(new Volunteer(attribute));
        volunteerIds.push(attribute._id);
    });

    return Volunteer.collection.insertMany(volunteerDocs);
}

async function dropAll() {
    try {
        await Volunteer.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Volunteer.collection.name);
        } else {
            throw e;
        }
    }
}

module.exports = {
    duplicateVolunteer1: duplicateVolunteer1,
    newVolunteer0: newVolunteer0,
    Volunteer0: Volunteer0,
    invalidVolunteer0: invalidVolunteer0,

    Volunteers: Volunteers,
    storeAll: storeAll,
    dropAll: dropAll,
};