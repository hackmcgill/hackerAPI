"use strict";
const Account = require("../models/account.model");
const logger = require("./logger.service");

async function findById(id) {
    const TAG = `[Account Service # findById]:`;
    const query = {
        _id: id
    };
    return await Account.findById(query, function (error, user) {
        if (error) {
            logger.error(`${TAG} Failed to verify if accounts exist or not using ${JSON.stringify(query)}`, error);
        } else if (user) {
            logger.debug(`${TAG} accounts using ${JSON.stringify(query)} exist in the database`);
        } else {
            logger.debug(`${TAG} accounts using ${JSON.stringify(query)} do not exist in the database`);
        }
    });
}

async function findByEmail(email) {
    const query = {
        email: email
    };
    return await findOne(query);
}

async function findOne(query) {
    const TAG = `[Account Service # findOne ]:`;
    return await Account.findOne(query, function (error, user) {
        if (error) {
            logger.error(`${TAG} Failed to verify if accounts exist or not using ${JSON.stringify(query)}`, error);
        } else if (user) {
            logger.debug(`${TAG} accounts using ${JSON.stringify(query)} exist in the database`);
        } else {
            logger.debug(`${TAG} accounts using ${JSON.stringify(query)} do not exist in the database`);
        }
    });
}

// untested
async function addOneAccount(accountDetails) {
    const TAG = `[Account Service # addOneAccount ]:`;

    const account = new Account(accountDetail);

    const success = await account.save(function (error) {
        if (error) {
            logger.error(`${TAG} Failed to add account`);
        } else {
            logger.debug(`${TAG} added account to database`);
        }
    });

    return !!(success);
}

// untested
async function changeOneAccount(id, accountDetails) {
    const TAG = `[Account Service # changeOneAccount ]:`;

    const query = { _id: id };

    const success = await Account.findOneAndUpdate(query, accountDetails, function (error, user) {
        if (error) {
            logger.error(`${TAG} failed to change account`);
        } else if (!user) {
            logger.error(`${TAG} failed to find account in database`);
        } else {
            logger.debug(`${TAG} changed account information`);
        }
    });

    return !!(success);
}

module.exports = {
    findOne: findOne,
    findById: findById,
    findByEmail: findByEmail,
    addOneAccount: addOneAccount,
    changeOneAccount: changeOneAccount
};