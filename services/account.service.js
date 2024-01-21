"use strict";
const Hacker = require("../models/hacker.model");
const Account = require("../models/account.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

/**
 * @function findById
 * @param {ObjectId} id
 * @return {DocumentQuery} The document query will resolve to either account or null.
 * @description Finds an account by mongoID.
 */
function findById(id) {
    const TAG = `[Account Service # findById]:`;
    const query = {
        _id: id
    };
    return logger.logQuery(TAG, "account", query, Account.findById(query));
}

/**
 * @function findByHackerId
 * @param {ObjectId} id the Hacker's ID
 * @returns {Promise<Account>} The account of the hacker, minus the password. Returns null if the hacker does not exist, or if the hacker is not associated with an account.
 * Get the account by using the hacker's ID.
 */
async function findByHackerId(id) {
    const TAG = `[Account Service # findByHackerId]:`;
    const query = {
        _id: id
    };
    const hacker = await logger.logQuery(TAG, "account", query, Hacker.findById(query)).populate({
        path: "accountId",
        select: " -password"
    });
    if (!hacker || !hacker.accountId) {
        return null;
    }
    return hacker.accountId;
}

/**
 * @function findByEmail
 * @param {String} email
 * @return {DocumentQuery} The document query will resolve to either account or null.
 * @description Find an account by email.
 */
function findByEmail(email) {
    const query = {
        email: email
    };

    return findOne(query);
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
 * @function findOne
 * @param {*} query
 * @return {DocumentQuery} The document query will resolve to either account or null.
 * @description Finds an account by some query.
 */
function findOne(query) {
    const TAG = `[Account Service # findOne ]:`;
    return logger.logQuery(TAG, "account", query, Account.findOne(query));
}

/**
 * @function addOneAccount
 * @param {{_id: ObjectId, firstName: string, lastName: string, email: string, password: string}} accountDetails
 * @return {Promise<Account>} The promise will resolve to the account object if save is successful.
 * @description Adds a new account to database.
 */
function addOneAccount(accountDetails) {
    const TAG = `[Account Service # addOneAccount ]:`;

    const account = new Account(accountDetails);

    return account.save();
}

/**
 * @function updateOne
 * @param {ObjectId} id
 * @param {{_id?: ObjectId, firstName?: string, lastName?: string, email?: string, password?: string}} accountDetails
 * @return {DocumentQuery} The document query will resolve to either account or null.
 * @description Changes account information to the specified information in accountDetails.
 */
function updateOne(id, accountDetails) {
    const TAG = `[Account Service # updateOne ]:`;

    const query = {
        _id: id
    };

    return logger.logUpdate(TAG, "account", Account.findOneAndUpdate(query, accountDetails, { new: true }));
}

/**
 * Updates the password for an account. This function also hashes the password.
 * @param {ObjectId} id String representing the ObjectId of the account
 * @param {string} newPassword the new password for the account (in plain-text).
 */
function updatePassword(id, newPassword) {
    const hashed = hashPassword(newPassword);
    return updateOne(id, {
        password: hashed
    });
}

module.exports = {
    findOne: findOne,
    findById: findById,
    findByHackerId: findByHackerId,
    findByEmail: findByEmail,
    addOneAccount: addOneAccount,
    getAccountIfValid: getAccountIfValid,
    hashPassword: hashPassword,
    updateOne: updateOne,
    updatePassword: updatePassword
};
