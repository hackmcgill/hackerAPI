"use strict";
const Services = {
    Search: require("../services/search.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");
const Success = require("../constants/success.constant");

async function searchResults(req, res) {
    let results = req.body.results;
    let message;
    if (results.length < 1) {
        message = Success.SEARCH_NO_RESULTS;
        results = {};
    } else {
        message = Success.SEARCH_QUERY;
    }
    return res.status(200).json({
        message: message,
        data: results
    });
}

module.exports = {
    searchResults: Util.asyncMiddleware(searchResults)
};