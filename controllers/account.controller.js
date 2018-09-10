"use strict";
const Services = {
    Account: require("../services/account.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

/**
 * @async
 * @function getUserByEmail
 * @param req
 * @param res
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
        return res.status(400).json({
            message: "User email not found",
            data: {}
        });
    }
}

/**
 * @async
 * @function getUserById
 * @param req
 * @param res
 * @return {JSON} Success or error status
 * @description Retrieves an account's information via the account's mongoId, specified in req.params.id from route parameters.
 */
async function getUserById(req, res) {
    const acc = await Services.Account.findById(req.params.id);
    
    if (acc) {
        return res.status(200).json({
            message: "Account found by user id",
            data: acc.toStrippedJSON()
        });
    } else {
        // tentative error code
        return res.status(400).json({
            message: "User id not found",
            data: {}
        });
    }
}

/**
 * @async
 * @function addUser
 * @param req
 * @param res
 * @return {JSON} Success or error status
 * @description Adds a user from information in req.body.accountDetails
 */
async function addUser(req, res) {
    const accountDetails = req.body.accountDetails;

    const success = await Services.Account.addOneAccount(accountDetails);

    if (success) {
        delete accountDetails.password;
        return res.status(200).json({
            message: "Account creation successful",
            data: accountDetails
        });
    } else {
        return res.status(400).json({
            message: "Issue with account creation",
            data: {}
        });
    }
}


/**
 * @async
 * @function updateAccount
 * @param req
 * @param res
 * @return {JSON} Success or error status
 * @description 
 *      Change a user's account information based on the account's mongoID. 
 *      The new account information is located in req.body
 */
async function updateAccount(req, res) {
    const id = req.body._id;

    const success = await Services.Account.changeOneAccount(id, req.body);

    if (success) {
        return res.status(200).json({
            message: "Changed account information",
            data: req.body
        });
    } else {
        return res.status(400).json({
            message: "Issue with changing account information",
            data: {}
        });
    }
}

module.exports = {
    defaultReturn: function (req, res) {
        return res.status(200).json({
            message: "Default message",
            data: "Default data"
        });
    },

    getUserByEmail: Util.asyncMiddleware(getUserByEmail),
    getUserById: Util.asyncMiddleware(getUserById),

    // assumes all information in req.body
    addUser: Util.asyncMiddleware(addUser),

    updateAccount: Util.asyncMiddleware(updateAccount),
};