"use strict";
const Role = require("../models/role.model");
const logger = require("./logger.service");

/**
 * @async
 * @function getRole
 * @param {string} roleName The name of the role that you're looking for.
 * @description 
 * Returns the role defined by the role name
 */
async function getRole(roleName) {
    const TAG = "[Role Service # getRole]:";
    const query = {name: roleName};
    //get the roleBinding for account
    //Populate roles for roleBinding
    return await Role.findOne(query, logger.queryCallbackFactory(TAG, "role", query));
}

/**
 * @async
 * @function getById
 * @param {ObjectId} id The role id
 * @description 
 * Returns the role specified by the id.
 */
async function getById(id) {
    const TAG = "[Role Service # getById]:";
    const query = {_id: id};
    //get the roleBinding for account
    //Populate roles for roleBinding
    return await Role.findById(query, logger.queryCallbackFactory(TAG, "role", query));
}

module.exports = {
    getRole: getRole,
    getById: getById
}