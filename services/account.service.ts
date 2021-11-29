const Hacker = require("../models/hacker.model");
import Account from "../models/account.model";
import * as logger from "./logger.service";
import { hashSync } from "bcrypt";

/**
 * @function findById
 * @param {Number} id
 * @return {Account} Will resolve to either account or null.
 * @description Finds an account by identifier.
 */
async function findById(id: number): Promise<Account | undefined> {
    const TAG = `[Account Service # findById]:`;
    return await Account.findOne(id).then((account) => {
        logger.queryCallbackFactory(TAG, "account", id);
        return account;
    });
}

/**
 * @function findByHackerId
 * @param {number} identifier the Hacker's ID
 * @returns {Promise<Account>} The account of the hacker, minus the password. Returns null if the hacker does not exist, or if the hacker is not associated with an account.
 * Get the account by using the hacker's ID.
 */
//TODO: Complete this message.
async function findByHackerId(identifier: number) {
    const TAG = `[Account Service # findByHackerId]:`;
    const query = {
        _id: identifier
    };
    const hacker = await Hacker.findById(
        query,
        logger.queryCallbackFactory(TAG, "account", query)
    ).populate({
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
 * @return {Account} Will resolve to either account or null.
 * @description Find an account by email.
 */
function findByEmail(email: string) {
    const query = { email: email };

    return findOne(query);
}

/**
 * @param {String} email
 * @param {String} password
 * @return {Account | null} either account or null
 */
async function getAccountIfValid(email: string, password: string) {
    const account = await findByEmail(email);

    return !!account && account.comparePassword(password) ? account : null;
}

/**
 * @function hashPassword
 * @param {String} password
 * @return {string} hashed password
 * @description Hashes password with bcrypt.
 */
function hashPassword(password: string) {
    return hashSync(password, 10);
}

/**
 * @function findOne
 * @param {*} query
 * @return {Account} Will resolve to either account or null.
 * @description Finds an account by some query.
 */
function findOne(query: Object): Promise<Account | undefined> {
    const TAG = `[Account Service # findOne ]:`;

    return Account.findOne(query).then((account) => {
        logger.queryCallbackFactory(TAG, "account", query);
        return account;
    });
}

/**
 * @function addOneAccount
 * @param {{identifier: number, firstName: string, lastName: string, email: string, password: string}} accountDetails
 * @return {Promise<Account>} The promise will resolve to the account object if save is successful.
 * @description Adds a new account to database.
 */
//TODO: Make all functions that call this async.
async function addOneAccount(accountDetails: Object): Promise<Account> {
    const TAG = `[Account Service # addOneAccount ]:`;

    const account = Account.create(accountDetails);

    return await account.save();
}

/**
 * @function updateOne
 * @param {number} identifier
 * @param {{identifier?: number, firstName?: string, lastName?: string, email?: string, password?: string}} accountDetails
 * @return {DocumentQuery} The document query will resolve to either account or null.
 * @description Changes account information to the specified information in accountDetails.
 */
function updateOne(identifier: number, accountDetails: Object) {
    const TAG = `[Account Service # updateOne ]:`;

    return Account.update(identifier, accountDetails).then((account) => {
        logger.updateCallbackFactory(TAG, "account");
        return account;
    });
}

/**
 * Updates the password for an account. This function also hashes the password.
 * @param {number} identifier String representing the ObjectId of the account
 * @param {string} newPassword the new password for the account (in plain-text).
 */
async function updatePassword(identifier: number, newPassword: string) {
    const hashed = hashPassword(newPassword);
    return await updateOne(identifier, {
        password: hashed
    });
}

export {
    findOne,
    findById,
    findByHackerId,
    findByEmail,
    addOneAccount,
    getAccountIfValid,
    hashPassword,
    updateOne,
    updatePassword
};
