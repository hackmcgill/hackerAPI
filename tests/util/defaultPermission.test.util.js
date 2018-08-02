"use strict";
const Util = {
    Permission: require("./permission.test.util")
};
const DefaultPermission = require("../../models/defaultPermission.model");
const logger = require("../../services/logger.service");
const TAG = "[ DEFAULTPERMISSION.TEST.UTIL.JS ]";

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
    const permissionDocs = [];
    const permissionNames = [];
    for (var i = 0; i < attributes.length; i++) {
        permissionDocs.push(new DefaultPermission(attributes[i]));
        permissionNames.push(attributes[i].name);
    }

    DefaultPermission.collection.insertMany(permissionDocs).then(
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
    DefaultPermission.collection.drop().then(
        () => {
            logger.info(`dropped table DefaultPermission`);
            callback();
        },
        (err) => {
            logger.error(`could not drop DefaultPermissions. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    );
}