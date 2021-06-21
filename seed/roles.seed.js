"use strict";
const Role = require("../models/role.model");

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
