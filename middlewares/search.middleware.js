"use strict";
const Services = {
    Search: require("../services/search.service")
};
const Middleware = {
    Util: require("../middlewares/util.middleware")
};

/**
 * @function parseQuery
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @description parses the json in the parameter
 */
function parseQuery(req, res, next) {
    let query = req.body.q;

    req.body.q = JSON.parse(query);

    //Default page
    if (!req.body.hasOwnProperty("page")) {
        req.body.page = 0;
    } else {
        req.body.page = parseInt(req.body.page);
    }
    //Default limit
    if (!req.body.hasOwnProperty("limit")) {
        req.body.limit = 10000;
    } else {
        req.body.limit = parseInt(req.body.limit);
    }
    //Default sorting
    if (!req.body.hasOwnProperty("sort")) {
        req.body.sort = "";
        req.body.sort_by = "";
    }

    if (!req.body.hasOwnProperty("expand")) {
        req.body.expand = false;
    }

    return next();
}

/**
 * Middleware that executes the query passed
 * @param {{body: {model: string, q: Array, page: Integer, limit: Integer}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @returns {Promise.<void>}
 */
async function executeQuery(req, res, next) {
    req.body.results = await Services.Search.executeQuery(
        req.body.model,
        req.body.q,
        req.body.page,
        req.body.limit,
        req.body.sort,
        req.body.sort_by,
        req.body.expand
    );
    return next();
}

function setExpandTrue(req, res, next) {
    req.body.expand = true;
    next();
}

module.exports = {
    parseQuery: parseQuery,
    executeQuery: Middleware.Util.asyncMiddleware(executeQuery),
    setExpandTrue: setExpandTrue
};
