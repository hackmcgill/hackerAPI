"use strict";
const Hacker = require("../models/hacker.model");
const EmailService = require("./email.service")
const AccountService = require("./account.service")
const logger = require("./logger.service");

/**
 * @function createQuery
 * @param {string} model the model which is being searched
 * @param {Array} queryArray array of clauses for the query
 * @param {number} page the page number you want
 * @param {number} limit the limit to the number of responses you want
 * @param {"asc"|"desc"} sort which direction you want to sort by
 * @param {string} sortBy the attribute you want to sort by
 * @returns {Query} Builds a query object and returns it based on the parameters provided
 */
function createQuery(model, queryArray, page, limit, sort, sortBy, shouldExpand = false) {
    var query;
    switch (model.toLowerCase()) {
        case "hacker":
            query = (shouldExpand) ? Hacker.find().populate([{
                path: "accountId",
                select: " -password"
            }, {
                path: "teamId"
            }]) : Hacker.find();
            break;
        default:
            return [];
    }
    for (var i in queryArray) {
        var clause = queryArray[i];
        var param = clause.param;
        var val = clause.value;
        switch (clause.operation) {
            case "equals":
                query.where(param).equals(val);
                break;
            case "ne":
                query.where(param).ne(val);
                break;
            case "lt":
                query.where(param).lt(val);
                break;
            case "gt":
                query.where(param).gt(val);
                break;
            case "lte":
                query.where(param).lte(val);
                break;
            case "gte":
                query.where(param).gte(val);
                break;
            case "in":
                query.where(param).in(val);
                break;
            case "regex":
                query.where(param).regex(val);
                break;
            case "elemMatch":
                query.where(param).elemMatch(val);
                break;
        }
    }

    if (sort == "desc") {
        query.sort("-" + sortBy);
    } else if (sort == "asc") {
        query.sort(sortBy);
    }
    return query.limit(limit).skip(limit * page)
}


/**
 * @function executeQuery
 * @param {string} model the model which is being searched
 * @param {Array} queryArray array of clauses for the query
 * @param {number} page the page number you want
 * @param {number} limit the limit to the number of responses you want
 * @param {"asc"|"desc"} sort which direction you want to sort by
 * @param {string} sortBy the attribute you want to sort by
 * @returns {Promise<[Array]>}
 * @description Builds and executes a search query based on a subset of mongodb
 */
function executeQuery(model, queryArray, page, limit, sort, sortBy, shouldExpand = false) {
    var query = createQuery(model, queryArray, page, limit, sort, sortBy, shouldExpand);
    return query.exec('find');
}


/**
 * @function executeStatusAction
 * @param {string} model the model which is being searched
 * @param {Array} queryArray array of clauses for the query
 * @param {number} page the page number you want
 * @param {number} limit the limit to the number of responses you want
 * @param {"asc"|"desc"} sort which direction you want to sort by
 * @param {string} sortBy the attribute you want to sort by
 * @param {string} update the JSON string containing the keys and values to update to
 * @returns {Promise<[Array]>}
 * @description Builds and executes a status update based on a subset of mongodb
 */
function executeStatusAction(model, queryArray, page, limit, sort, sortBy, update, shouldExpand = false) {
    var query = createQuery(model, queryArray, page, limit, sort, sortBy, shouldExpand);
    var update_obj = JSON.parse(update);
    return query.updateMany({ $set: update_obj }).exec();
}


/**
 * @function executeEmailAction
 * @param {string} model the model which is being searched
 * @param {Array} queryArray array of clauses for the query
 * @param {number} page the page number you want
 * @param {number} limit the limit to the number of responses you want
 * @param {"asc"|"desc"} sort which direction you want to sort by
 * @param {string} sortBy the attribute you want to sort by
 * @param {"Accepted"|"Waitlisted"|"Reminder"} status the status type of the email to send to hackers
 * @returns {Promise<[Array]>}
 * @description Sends a status update email based on a subset of mongodb
 */
async function executeEmailAction(model, queryArray, page, limit, sort, sortBy, status, shouldExpand = false) {
    var query = createQuery(model, queryArray, page, limit, sort, sortBy, shouldExpand);
    const hackers = await query.exec()

    if (hackers) {
        for (const hacker of hackers) {
            const account = await AccountService.findById(hacker.accountId);
            if (!account) {
                break;
            }
            let emailError = await EmailService.sendStatusUpdateAsync(account.firstName, account.email, status)
            if (emailError) {
                return "Email service failed."
            }
        }
    } else {
        return "Email service failed."
    }
}

module.exports = {
    executeQuery: executeQuery,
    executeStatusAction: executeStatusAction,
    executeEmailAction: executeEmailAction
};