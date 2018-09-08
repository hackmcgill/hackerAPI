"use strict";
const Account = require("../models/account.model");
const logger = require("./logger.service");
const bcrypt = require("bcrypt");

/**
 * @async
 * @function findById
 * @param {String} id
 * @return {DocumentQuery} either account or null
 * @description Finds an account by mongoID.
 */
function findById(id) {
    const TAG = `[Account Service # findById]:`;
    const query = {
        _id: id
    };

    return Account.findById(query, logger.queryCallbackFactory(TAG, "account", query));
}

/**
 * @async
 * @function findByEmail
 * @param {String} email 
 * @return {Account | null} either account or null
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
 * @async
 * @function findOne
 * @param {JSON} query
 * @return {Account | null} either account or null
 * @description Finds an account by some query.
 */
function findOne(query) {
    const TAG = `[Account Service # findOne ]:`;

    return Account.findOne(query, logger.queryCallbackFactory(TAG, "account", query));
}

/**
 * @function addOneAccount
 * @param {JSON} accountDetails
 * @return {boolean} success or failure of attempt to add account
 * @description Adds a new account to database.
 */
function addOneAccount(accountDetails) {
    const TAG = `[Account Service # addOneAccount ]:`;

    const account = new Account(accountDetails);

    return account.save();
}

/**
 * @async
 * @function changeOneAccount
 * @param {JSON} id
 * @param {JSON} accountDetails 
 * @return {boolean} success or failure of changing account information
 * @description Changes account information to the specified information in accountDetails.
 */
function changeOneAccount(id, accountDetails) {
    const TAG = `[Account Service # changeOneAccount ]:`;

    const query = {
        _id: id
    };

    return Account.findOneAndUpdate(query, accountDetails, logger.updateCallbackFactory(TAG, "account"));
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