"use strict";
const Util = {
    Account: require("./account.test.util"),
};
const Staff = require("../../models/staff.model");
const mongoose = require("mongoose");

const Staff1 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account4._id
};
const Staffs = [
    Staff1,
];

function storeAll(attributes) {
    const staffDocs = [];
    const staffIds = [];
    attributes.forEach((attribute) => {
        staffDocs.push(new Staff(attribute));
        staffIds.push(attribute._id);
    });

    return Staff.collection.insertMany(staffDocs);
}

function dropAll() {
    return Staff.collection.drop();
}

module.exports = {
    Staff1: Staff1,
    Staffs: Staffs,
    storeAll: storeAll,
    dropAll: dropAll,
};