"use strict";
const Util = {
    Account: require("./account.test.util")
};
const Admin = require("../../models/admin.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");

const Admin0 = {
    _id: mongoose.Types.ObjectId(),
    accountId: Util.Account.adminAccounts.stored[0]
};
const Admins = [Admin0];

function store(attributes) {
    const adminDocs = [];
    const adminIds = [];
    attributes.forEach((attribute) => {
        adminDocs.push(new Admin(attribute));
        adminIds.push(attribute._id);
    });

    return Admin.collection.insertMany(adminDocs);
}

async function storeAll() {
    await store(Admins);
}

async function dropAll() {
    try {
        await Admin.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Admin.collection.name);
        } else {
            throw e;
        }
    }
}

module.exports = {
    Admin0: Admin0,
    Admins: Admins,
    storeAll: storeAll,
    dropAll: dropAll
};
