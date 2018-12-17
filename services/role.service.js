"use strict";
const Role = require("../models/role.model");
const logger = require("./logger.service");

function createRole(roleDetails) {
    const role = new Role(roleDetails);

    return role.save();
}

function isDuplicate(roleDetails) {
    const roles = getAll();
    for (let roleName in roles) {
        // skip loop if roleName is from prototype
        if (!roles.hasOwnProperty(roleName)) {
            continue;
        }

        let existRole = roles[roleName];

        let existRoutes = existRole.routes;

        if (routesEquals(existRoutes, roleDetails.routes)) {
            return true;
        }
    }
    return false;
}

function routeEquals(route1, route2) {
    return route1.uri === route2.uri && route1.requestType === route2.requestType;
}

function routesEquals(routes1, routes2) {
    if (routes1.length !== routes2.length) {
        return false;
    }

    for (let i = 0; i < routes1.length; i++) {
        if (!routeEquals(routes1[i], routes2[i])) {
            return false;
        }
    }

    return true;
}

function getByRoutes(routes) {
    const TAG = "[Role Service # getByRoutes]:";
    const query = {
        routes: routes
    };

    return Role.findOne(query, logger.queryCallbackFactory(TAG, "role", query));
}

/**
 * @function getRole
 * @param {string} roleName The name of the role that you're looking for.
 * @description 
 * Returns the role defined by the role name
 */
function getRole(roleName) {
    const TAG = "[Role Service # getRole]:";
    const query = {
        name: roleName
    };
    //get the roleBinding for account
    //Populate roles for roleBinding
    return Role.findOne(query, logger.queryCallbackFactory(TAG, "role", query));
}

/**
 * @function getById
 * @param {ObjectId} id The role id
 * @description 
 * Returns the role specified by the id.
 */
function getById(id) {
    const TAG = "[Role Service # getById]:";
    const query = {
        _id: id
    };
    //get the roleBinding for account
    //Populate roles for roleBinding
    return Role.findById(query, logger.queryCallbackFactory(TAG, "role", query));
}

/**
 * @function getAll
 * @description 
 * Returns all the roles in the database
 */
function getAll() {
    const TAG = "[Role Service # getAll]:";
    return Role.find({}, logger.queryCallbackFactory(TAG, "role", {}));
}

module.exports = {
    getByRoutes: getByRoutes,
    getRole: getRole,
    getById: getById,
    getAll: getAll,
    createRole: createRole,
    isDuplicate: isDuplicate,
};