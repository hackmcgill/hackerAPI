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
    "accountId": Util.Account.NonConfirmedAccount1._id,
    "accountType": Constants.HACKER,
    "email": Util.Account.NonConfirmedAccount1.email
};

const HackerConfirmation2 = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.NonConfirmedAccount2._id,
    "accountType": Constants.HACKER,
    "email": Util.Account.NonConfirmedAccount2.email
};

const HackerConfirmation3 = {
    "_id": mongoose.Types.ObjectId(),
    "email": Util.Account.unlinkedAccounts.new[0].email
};

const HackerConfirmation4 = {
    "_id": mongoose.Types.ObjectId(),
    "accountType": Constants.HACKER,
    "email": "abcd@efgh.com"
};

// Using a real ID which is stored but corresponds to another account
const FakeHackerToken = {
    "_id": HackerConfirmation._id,
    "accountId": Util.Account.sponsorT1Accounts.stored[0]._id,
    "accountType": Constants.HACKER
};

const ConfirmationToken = Services.AccountConfirmation.generateToken(HackerConfirmation._id, HackerConfirmation.accountId);
const FakeToken = Services.AccountConfirmation.generateToken(FakeHackerToken._id, FakeHackerToken.accountId);

const AccountConfirmationTokens = [
    HackerConfirmation,
    HackerConfirmation2,
    HackerConfirmation3,
    HackerConfirmation4
];

function store(attributes) {
    const accountConfirmationDocs = [];
    const accountConfirmationIds = [];
    for (var i = 0; i < attributes.length; i++) {
        accountConfirmationDocs.push(new AccountConfirmationToken(attributes[i]));
        accountConfirmationIds.push(attributes[i]._id);
    }
    return AccountConfirmationToken.collection.insertMany(accountConfirmationDocs);
}

async function storeAll() {
    await store(AccountConfirmationTokens);
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