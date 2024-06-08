"use strict";
const Role = require("../models/role.model");
const logger = require("./logger.service");
const mongoose = require("mongoose");

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
    return logger.logQuery(TAG, "role", query, Role.findOne(query));
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
    return logger.logQuery(TAG, "role", query, Role.findById(query));
}

/**
 * @function getAll
 * @description
 * Returns all the roles in the database
 */
function getAll() {
    const TAG = "[Role Service # getAll]:";
    return logger.logQuery(TAG, "role", {}, Role.find({}));
}

module.exports = {
    getRole: getRole,
    getById: getById,
    getAll: getAll,
    createRole: createRole
};
