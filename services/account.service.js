"use strict";
const Account = require("../models/account.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");


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



/**
 *
 * @param {String} email
 * @param {String} password
 * @return {Account | null} either account or null
 */
async function getAccountIfValid(email, password) {
    const account = await findByEmail(email);
    if (!!account && account.comparePassword(password)) {
        return account;
    }
    return null;
}

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
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

    const account = new Account(accountDetails);

    const success = await account.save(
        // works without this callback
        // function (error) {
        //     if (error) {
        //         logger.error(`${TAG} Failed to add account`);
        //     } else {
        //         logger.info(`${TAG} added account to database`, account.toJSON());
        //     }
        // }
    );

    return !!(success);
}

// untested
async function changeOneAccount(id, accountDetails) {
    const TAG = `[Account Service # changeOneAccount ]:`;

    const query = {
        _id: id
    };

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
    getAccountIfValid: getAccountIfValid,
    hashPassword: hashPassword,
    changeOneAccount: changeOneAccount
};