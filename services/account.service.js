"use strict";
const Account = require("../models/account.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

/**
 * @async
 * @function findById
 * @param {String} id
 * @return {Account | null} either account or null
 * @description Finds an account by mongoID.
 */
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

/**
 * @async
 * @function findByEmail
 * @param {String} email 
 * @return {Account | null} either account or null
 * @description Find an account by email.
 */
async function findByEmail(email) {
    const query = {
        email: email
    };

    return await findOne(query);
}

/**
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

/**
 * @function hashPassword
 * @param {String} password
 * @return {string} hashed password
 * @description Hashes password with bcrypt.
 */
function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

/**
 * @async
 * @function findOne
 * @param {JSON} query
 * @return {Account | null} either account or null
 * @description Finds an account by some query.
 */
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

/**
 * @async
 * @function addOneAccount
 * @param {JSON} accountDetails
 * @return {boolean} success or failure of attempt to add account
 * @description Adds a new account to database.
 */
async function addOneAccount(accountDetails) {
    const TAG = `[Account Service # addOneAccount ]:`;

    const account = new Account(accountDetails);

    const success = await account.save()
        .catch(
            (err) => {
                logger.error(`${TAG} failed create account due to ${err}`);
            }
        );

    return !!(success);
}

/**
 * @async
 * @function changeOneAccount
 * @param {JSON} id
 * @param {JSON} accountDetails 
 * @return {boolean} success or failure of changing account information
 * @description Changes account information to the specified information in accountDetails.
 */
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

/**
 * Updates the password for an account. This function also hashes the password.
 * @param {string} id String representing the ObjectId of the account
 * @param {string} newPassword the new password for the account (in plain-text).
 */
function updatePassword(id, newPassword) {
    const hashed = hashPassword(newPassword);
    return changeOneAccount(id, {password: hashed});
}

module.exports = {
    findOne: findOne,
    findById: findById,
    findByEmail: findByEmail,
    addOneAccount: addOneAccount,
    getAccountIfValid: getAccountIfValid,
    hashPassword: hashPassword,
    changeOneAccount: changeOneAccount,
    updatePassword: updatePassword
};