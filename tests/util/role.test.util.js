"use strict";
const Role = require("../../models/role.model");
const Constants = require("../../constants/general.constant");
const mongoose = require("mongoose");
const TAG = "[ ROLE.TEST.UTIL.JS ]";
const logger = require("../../services/logger.service");

function storeAll(attributes, callback) {
    const roleDocs = [];
    const roleNames = [];
    attributes.forEach((attribute) => {
        roleDocs.push(new Role(attribute));
        roleNames.push(attribute.name);
    });

    Role.collection.insertMany(roleDocs).then(
        () => {
            logger.info(`${TAG} saved Roles: ${roleNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Roles ${roleNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Role.collection.drop().then(
        () => {
            logger.info(`Dropped table Role`);
            callback();
        },
        (err) => {
            logger.error(`Could not drop Role. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}

module.exports = {
    storeAll: storeAll,
    dropAll: dropAll,
};