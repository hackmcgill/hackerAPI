"use strict";
const Services = {
    Account: require("../services/account.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Constants = {
    Error: require("../constants/error.constant"),
};


/**
 * @async
 * @function getUserByEmail
 * @param {{user: {email: string}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Retrieves an account's information via email query.
 */
async function getUserByEmail(req, res) {
    const acc = await Services.Account.findByEmail(req.user.email);

    if (acc) {
        return res.status(200).json({
            message: "Account found by user email",
            data: acc.toStrippedJSON()
        });
    } else {
        // tentative error code
        return res.status(404).json({
            message: Constants.Error.ACCOUNT_ERROR404_MESSAGE,
            data: {}
        });
    }
}

/**
 * @async
 * @function getUserById
 * @param {{body: {id: string}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Retrieves an account's information via the account's mongoId, specified in req.params.id from route parameters. It is moved to req.body.id from req.params.id by validation.
 */
async function getUserById(req, res) {
    const acc = await Services.Account.findById(req.body.id);

    if (acc) {
        return res.status(200).json({
            message: "Account found by user id",
            data: acc.toStrippedJSON()
        });
    } else {
        return res.status(404).json({
            message: Constants.Error.ACCOUNT_ERROR404_MESSAGE,
            data: {}
        });
    }
}

/**
 * @async
 * @function addUser
 * @param {{body: {accountDetails: {_id: ObjectId, firstName: string, lastName: string, email: string, password: string, dietaryRestrictions: string, shirtSize: string}}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description Adds a user from information in req.body.accountDetails
 */
async function addUser(req, res) {
    const accountDetails = req.body.accountDetails;
    delete accountDetails.password;
    return res.status(200).json({
        message: "Account creation successful",
        data: accountDetails
    });
}


/**
 * @async
 * @function updateAccount
 * @param {{params: {id: string}, body: {Object}}} req
 * @param {*} res
 * @return {JSON} Success or error status
 * @description 
 *      Change a user's account information based on the account's mongoID. 
 *      The new account information is located in req.body.
 *      The id is moved to req.body.id from req.params.id by validation.
 */
async function updateAccount(req, res) {
    const id = req.params.id;

    const success = await Services.Account.changeOneAccount(id, req.body);

    if (success) {
        return res.status(200).json({
            message: "Changed account information",
            data: req.body
        });
    } else {
        return res.status(500).json({
            message: Constants.Error.ACCOUNT_UPDATE_ERROR500_MESSAGE,
            data: {}
        });
    }
}

module.exports = {
    getUserByEmail: Util.asyncMiddleware(getUserByEmail),
    getUserById: Util.asyncMiddleware(getUserById),

    // assumes all information in req.body
    addUser: Util.asyncMiddleware(addUser),

    updateAccount: Util.asyncMiddleware(updateAccount),
};