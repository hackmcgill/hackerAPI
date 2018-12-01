"use strict";
const Util = {
    Account: require("./account.test.util"),
};

const Services = {
    AccountConfirmation: require("../../services/accountConfirmation.service")
};

const mongoose = require("mongoose");

const AccountConfirmationToken = mongoose.model("AccountConfirmationToken");

const Constants = require('../../constants/general.constant');
const logger = require("../../services/logger.service");

const HackerConfirmation = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account2._id,
    "accountType": Constants.HACKER,
    "email": Util.Account.Account2.email
};

const HackerConfirmation2 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.NonConfirmedAccount2._id,
    "accountType": Constants.HACKER,
    "email": Util.Account.NonConfirmedAccount2.email
}

const HackerConfirmation3 = {
    "_id": mongoose.Types.ObjectId(),
    "email": Util.Account.newAccount1
};

// Using a real ID which is stored but corresponds to another account
const FakeHackerToken = {
    "_id": HackerConfirmation._id,
    "accountId": Util.Account.Account3._id,
    "accountType": Constants.HACKER
};

const ConfirmationToken = Services.AccountConfirmation.generateToken(HackerConfirmation._id, HackerConfirmation.accountId);
const FakeToken = Services.AccountConfirmation.generateToken(FakeHackerToken._id, FakeHackerToken.accountId);

const AccountConfirmationTokens = [
    HackerConfirmation,
    HackerConfirmation2,
    HackerConfirmation3
];

function storeAll(attributes) {
    const accountConfirmationDocs = [];
    const accountConfirmationIds = [];
    for (var i = 0; i < attributes.length; i++) {
        accountConfirmationDocs.push(new AccountConfirmationToken(attributes[i]));
        accountConfirmationIds.push(attributes[i]._id);
    }
    return AccountConfirmationToken.collection.insertMany(accountConfirmationDocs);
}

async function dropAll() {
    try {
        await AccountConfirmationToken.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", AccountConfirmationToken.collection.name);
        } else {
            throw e;
        }
    }
}


module.exports = {
    HackerConfirmation: HackerConfirmation,
    ConfirmationToken: ConfirmationToken,
    FakeToken: FakeToken,
    AccountConfirmationTokens: AccountConfirmationTokens,
    storeAll: storeAll,
    dropAll: dropAll
};