"use strict";
const Role = require("../../models/role.model");
const Constants = require("../../constants/general.constant");
const mongoose = require("mongoose");

function storeAll(attributes) {
    const roleDocs = [];
    const roleNames = [];
    attributes.forEach((attribute) => {
        roleDocs.push(new Role(attribute));
        roleNames.push(attribute.name);
    });

    return Role.collection.insertMany(roleDocs);
}

function dropAll() {
    return Role.collection.drop();
}

module.exports = {
    storeAll: storeAll,
    dropAll: dropAll,
};