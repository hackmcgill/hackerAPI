"use strict";
const Services = {
    Account: require("../services/account.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Constants = {
    Error: require("../constants/error.constant"),
    Success: require("../constants/success.constant"),
};

/**
 * @function showAccount
 * @param {{body: {account: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and account object
 * @description Returns the JSON of account object located in req.body.account
 */
function showAccount(req, res) {
    return res.status(200).json({
        message: Constants.Success.ACCOUNT_READ,
        data: req.body.account.toStrippedJSON()
    });
}

/**
 * @async
 * @function addUser
 * @param {{body: {accountDetails: {_id: ObjectId, firstName: string, lastName: string, email: string, password: string, dietaryRestrictions: string, shirtSize: string}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Adds a user from information in req.body.accountDetails
 */
function addUser(req, res) {
    const acc = req.body.account;
    return res.status(200).json({
        message: Constants.Success.ACCOUNT_CREATE,
        data: acc.toStrippedJSON()
    });
}


/**
 * @function updatedAccount
 * @param {{body: {Object}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description 
 *      Returns a 200 status for an updated account.
 *      The new account information is located in req.body.
 *      The id is moved to req.body.id from req.params.id by validation.
 */
function updatedAccount(req, res) {
    return res.status(200).json({
        message: Constants.Success.ACCOUNT_UPDATE,
        data: req.body
    });
}

function invitedAccount(req, res) {
    return res.status(200).json({
        message: Constants.Success.ACCOUNT_INVITE,
        data: {}
    });
}


module.exports = {
    addUser: addUser,
    updatedAccount: updatedAccount,
    invitedAccount: invitedAccount,
    showAccount: showAccount,
};