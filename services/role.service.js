"use strict";
const Role = require("../models/role.model");
const logger = require("./logger.service");

/**
 * @function createRole
 * @param {{_id: ObjectId, name: String, routes: route[]}} roleDetails 
 * @return {Promise<Role>} The promise will resolve to a role object if save was successful.
 * @description Adds a new role to database.
 */
function createRole(roleDetails) {
    const role = new Role(roleDetails);

    return role.save();
}

/**
 * @function isDuplicate
 * @param {{_id: ObjectId, name: String, routes: route[]}} roleDetails 
 * @return {boolean} True or false depending on whether the routes are duplicated
 * @description Check that the routes contained in routeDetails aren't already specified 
 */
async function isDuplicate(roleDetails) {
    const existRole = await getByRoutes(roleDetails.routes);

    const all = await getAll();

    if (!!existRole) {
        return true;
    }

    return false;
}

/**
 * @function routeEquals
 * @param {{uri: String, requestType: Enum}} route1 
 * @param {{uri: String, requestType: Enum}} route2 
 * @return {boolean} Returns whether route1 is the same as route2
 * @description Checks that route1 and route2 are the same
 */
function routeEquals(route1, route2) {
    return route1.uri === route2.uri && route1.requestType === route2.requestType;
}

/**
 * @function getByRoutes
 * @param {route[]} routes 
 * @returns {Promise<Role>} The promise will resolve to a role object if successful.
 * @description finds a role object by the routes
 */
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