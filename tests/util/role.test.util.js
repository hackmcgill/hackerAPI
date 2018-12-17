"use strict";
const Role = require("../../models/role.model");
const Constants = require("../../constants/general.constant");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");

const newRole1 = {
    name: "newRole",
    routes: [{
        uri: "/api/fake/uri",
        requestType: Constants.REQUEST_TYPES.GET,
    }]
};

function storeAll(attributes) {
    const roleDocs = [];
    const roleNames = [];
    attributes.forEach((attribute) => {
        roleDocs.push(new Role(attribute));
        roleNames.push(attribute.name);
    });

    return Role.collection.insertMany(roleDocs);
}

async function dropAll() {
    try {
        await Role.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Role.collection.name);
        } else {
            throw e;
        }
    }
}

module.exports = {
    newRole1: newRole1,
    storeAll: storeAll,
    dropAll: dropAll,
};