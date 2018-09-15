"use strict";
const Services = {
    Search: require("../services/search.service")
};
const Middleware = {
    Util: require("../middlewares/util.middleware")
}


/**
 * @function parseQuery
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @description parses the json in the parameter
 */
function parseQuery(req, res, next){
    let query = req.body.q;

    req.body.q = JSON.parse(query);

    next();
}

/**
 * Middleware that executes the query passed
 * @param {{body: {model: string, q: Array}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @returns {Promise.<void>}
 */
async function executeQuery(req, res, next) {
    req.body.results = await Services.Search.executeQuery(req.body.model,req.body.q);
    next();
}


module.exports = {
    parseQuery: parseQuery,
    executeQuery: Middleware.Util.asyncMiddleware(executeQuery)
};
