"use strict";

const Services = {
    AutomatedEmail: require("../services/automatedEmails.service"),
};
const Constants = {
    Error: require("../constants/error.constant"),
    General: require("../constants/general.constant"),
};

/**
 * Middleware to validate status parameter
 * @param {{params: {status: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
function validateStatus(req, res, next) {
    const { status } = req.params;
    const validStatuses = [
        Constants.General.HACKER_STATUS_ACCEPTED,
        Constants.General.HACKER_STATUS_DECLINED,
    ];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid status",
            data: {},
        });
    }

    next();
}

/**
 * Middleware to get count of hackers with specified status
 * @param {{params: {status: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function getStatusCount(req, res, next) {
    const { status } = req.params;

    try {
        const count = await Services.AutomatedEmail.getStatusCount(status);
        req.body.count = count;
        next();
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            data: {},
        });
    }
}

/**
 * Middleware to send automated status emails
 * @param {{params: {status: string}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 */
async function sendAutomatedStatusEmails(req, res, next) {
    const { status } = req.params;

    try {
        const results =
            await Services.AutomatedEmail.sendAutomatedStatusEmails(status);
        req.body.results = results;
        next();
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            data: {},
        });
    }
}

module.exports = {
    validateStatus,
    getStatusCount,
    sendAutomatedStatusEmails,
};
