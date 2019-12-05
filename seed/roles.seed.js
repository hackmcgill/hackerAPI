"use strict";
const Role = require("../models/role.model");
const Services = {
    env: require("../services/env.service")
};
const path = require("path");

const envLoadResult = Services.env.load(path.join(__dirname, "../.env"));
if (envLoadResult.error) {
    Services.log.error(envLoadResult.error);
}

/**
 * Drops all elements in Role
 */
function dropAll() {
    return Role.deleteMany({});
}

/**
 * Stores all of the roles in the db
 * @param {role[]} attributes all attributes
 */
function storeAll(attributes) {
    const roleDocs = [];
    const roleNames = [];
    attributes.forEach((attribute) => {
        roleDocs.push(new Role(attribute));
        roleNames.push(attribute.name);
    });
    return Role.collection.insertMany(roleDocs);
}

module.exports = {
    storeAll: storeAll,
    dropAll: dropAll
};
