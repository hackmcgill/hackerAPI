"use strict";
const Services = {
    Search: require("../services/search.service"),
    Logger: require("../services/logger.service")
};
const Util = require("../middlewares/util.middleware");

async function searchResults(req, res) {
    let results = req.body.results;
    let message;
    if(results.length < 1){
        message = "No results found."
        results = {}
    }
    else{
        message = "Successfully executed query, returning all results"
    }
    return res.status(200).json({
        message: message,
        data: results
    });
}

module.exports = {
    searchResults: Util.asyncMiddleware(searchResults)
}