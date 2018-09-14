"use strict";
const Services = {
    Search: require("../services/search.service")
};

/**
 * @function parseQuery
 * @param {JSON} req
 * @param {JSON} res
 * @param {JSON} next
 * @description parses the json in the parameter
 */
function parseQuery(req, res, next){
    let query = req.query.q;

    req.q = JSON.parse(query);
    req.model = req.query.model;

    delete req.query.model;
    delete req.query.q;

    next();
}

module.exports = {
    parseQuery: parseQuery
};
