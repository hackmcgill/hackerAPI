"use strict";
const Util = {
    Permission: require("./permission.test.util")
};
const DefaultPermission = require("../../models/defaultPermission.model");
const logger = require("../../services/logger.service");
const TAG = "[ DEFAULTPERMISSION.TEST.UTIL.JS ]";

const DefaultPermission1 = {
    "userType": "Hacker",
    "permissions": [Util.Permission.Permission1._id, Util.Permission.Permission2._id]
};
const DefaultPermission2 = {
    "userType": "Volunteer",
    "permissions": [Util.Permission.Permission3._id, Util.Permission.Permission2._id]
};
const DefaultPermission3 = {
    "userType": "Staff",
    "permissions": [Util.Permission.Permission5._id, Util.Permission.Permission6._id]
};
const DefaultPermission4 = {
    "userType": "GodStaff",
    "permissions": [Util.Permission.Permission7._id, Util.Permission.Permission8._id]
};
const DefaultPermission5 = {
    "userType": "Sponsor",
    "permissions": [Util.Permission.Permission9._id, Util.Permission.Permission10._id]
};
const DefaultPermissions = [
    DefaultPermission1,
    DefaultPermission2,
    DefaultPermission3,
    DefaultPermission4,
    DefaultPermission5,
];

module.exports = {
    DefaultPermission1: DefaultPermission1,
    DefaultPermission2: DefaultPermission2,
    DefaultPermission3: DefaultPermission3,
    DefaultPermission4: DefaultPermission4,
    DefaultPermission5: DefaultPermission5,
    DefaultPermissions: DefaultPermissions,
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes, callback) {
    const permissionDocs = [];
    const permissionTypes = [];

    attributes.forEach((attribute) => {
        permissionDocs.push(new DefaultPermission(attribute));
        permissionTypes.push(attribute.userType);
    });

    DefaultPermission.collection.insertMany(permissionDocs).then(
        () => {
            logger.info(`${TAG} saved DefaultPermission: ${permissionTypes.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store DefaultPermission ${permissionTypes.join(",")}. Error: ${JSON.stringify(reason)}`);
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