"use strict";
const Role = require("../models/role.model");
const Services = {
    env: require("../services/env.service")
};
const path = require("path");
const mongoose = require("mongoose");

const envLoadResult = Services.env.load(path.join(__dirname, "../.env"));
if (envLoadResult.error) {
    Services.log.error(envLoadResult.error);
}

function dropAll() {
    return Role.remove({});
}

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
    dropAll: dropAll,
};