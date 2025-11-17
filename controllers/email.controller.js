"use strict";

const Constants = {
    Success: require("../constants/success.constant"),
    Error: require("../constants/error.constant"),
};

/**
 * @function getStatusCount
 * @param {{body: {count: number}}} req
 * @param {*} res
 * @return {JSON} Success status and count
 * @description Returns the count of hackers with specified status
 */
function getStatusCount(req, res) {
    return res.status(200).json({
        message: "Successfully retrieved count",
        data: { count: req.body.count },
    });
}

/**
 * @function sendAutomatedStatusEmails
 * @param {{body: {results: {success: number, failed: number}}}} req
 * @param {*} res
 * @return {JSON} Success status and email results
 * @description Returns the results of sending automated status emails
 */
function sendAutomatedStatusEmails(req, res) {
    return res.status(200).json({
        message: "Successfully sent emails",
        data: req.body.results,
    });
}

module.exports = {
    getStatusCount,
    sendAutomatedStatusEmails,
};
