"use strict";
const Util = {
    Account: require("./account.test.util"),
    Skill: require("./skill.test.util")
};

const Services = {
    AccountConfirmation: require("../../services/accountConfirmation.service")
};

const mongoose = require("mongoose");

const AccountConfirmationToken = mongoose.model("AccountConfirmationToken");

const Constants = require('../../constants');
const logger = require("../../services/logger.service");

const HackerConfirmation = {
    "_id": mongoose.Types.ObjectId(),
    "accountId": Util.Account.Account1._id,
    "accountType": Constants.HACKER,
    "email": Util.Account.Account1.email
}

const ConfirmationToken = Services.AccountConfirmation.generateToken(HackerConfirmation._id, Util.Account.Account1._id);

const AccountConfirmationTokens = [
    HackerConfirmation
]

function storeAll(attributes, callback) {
    const accountConfirmationDocs = [];
    const accountConfirmationIds = [];
    for (var i = 0; i < attributes.length; i++) {
        accountConfirmationDocs.push(new AccountConfirmationToken(attributes[i]));
        accountConfirmationIds.push(attributes[i]._id);
    }
    AccountConfirmationToken.collection.insertMany(accountConfirmationDocs).then(
        () => {
            //Flip these two when there are more than one doc
            callback();
            logger.info(`${TAG} saved Account Confirmation Tokens: ${accountConfirmationIds.join(",")}`);
        },
        (reason) => {
            logger.error(`${TAG} could not store Account Confirmation Tokens ${accountConfirmationIds.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    AccountConfirmationToken.collection.drop().then(
        () => {
            logger.info(`Dropped table AccountConfirmationToken`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop AccountConfirmationToken. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}


module.exports = {
    HackerConfirmation: HackerConfirmation,
    ConfirmationToken: ConfirmationToken,
    AccountConfirmationTokens: AccountConfirmationTokens,
    storeAll: storeAll,
    dropAll: dropAll
};
