"use strict";
const Util = {
    Permission: require("./permission.test.util")
};
const Bus = require("../../models/bus.model");
const logger = require("../../services/logger.service");
const TAG = "[ BUS.TEST.UTIL.JS ]";

module.exports = {
    DefaultPermission1: {
        "userType": "Hacker",
        "permissions": [Util.Permission.Permission1._id, Util.Permission.Permission2._id]
    },
    DefaultPermission2: {
        "userType": "Volunteer",
        "permissions": [Util.Permission.Permission3._id, Util.Permission.Permission2._id]
    },
    DefaultPermission3: {
        "userType": "Staff",
        "permissions": [Util.Permission.Permission5._id, Util.Permission.Permission6._id]
    },
    DefaultPermission4: {
        "userType": "GodStaff",
        "permissions": [Util.Permission.Permission7._id, Util.Permission.Permission8._id]
    },
    DefaultPermission5: {
        "userType": "Sponsor",
        "permissions": [Util.Permission.Permission9._id, Util.Permission10._id]
    },
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes, callback) {
    const acctDocs = [];
    for (var i = 0; i < attributes.length; i++) {
        acctDocs.push(new Bus(attributes[i]));
    }
    const permissionNames = attributes.map((val) => {
        return val.name + ",";
    });
    Bus.collection.insertMany(acctDocs).then(
        () => {
            logger.info(`${TAG} saved Buses: ${permissionNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Buses ${permissionNames.join(",")}. Error: ${JSON.stringify(reason)}`);
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Bus.collection.drop().then(
        () => {
            logger.info(`dropped table Bus`);
            callback();
        },
        (err) => {
            logger.error(`could not drop Buses. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    );
}