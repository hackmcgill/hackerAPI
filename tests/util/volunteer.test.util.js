"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const mongoose = require("mongoose");
const Volunteer = require("../../models/volunteer.model");
const logger = require("../../services/logger.service");

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
    adminVolunteer1: adminVolunteer1,
    newVolunteer1: newVolunteer1,
    Volunteer1: Volunteer1,
    Volunteers: Volunteers,
    storeAll: storeAll,
    dropAll: dropAll,
};