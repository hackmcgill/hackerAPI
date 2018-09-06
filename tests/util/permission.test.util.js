"use strict";
const Permission = require("../../models/permission.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");
const TAG = "[ PERMISSION.TEST.UTIL.JS ]";

const Permission1 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission1"
};
const Permission2 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission2"
};
const Permission3 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission3"
};
const Permission4 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission4"
};
const Permission5 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission5"
};
const Permission6 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission6"
};
const Permission7 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission7"
};
const Permission8 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission8"
};
const Permission9 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission9"
};
const Permission10 = {
    "_id": mongoose.Types.ObjectId(),
    "name": "Permission10"
};
const Permissions = [
    Permission1,
    Permission2,
    Permission3,
    Permission4,
    Permission5,
    Permission6,
    Permission7,
    Permission8,
    Permission9,
    Permission10,
];

module.exports = {
    Permission1: Permission1,
    Permission2: Permission2,
    Permission3: Permission3,
    Permission4: Permission4,
    Permission5: Permission5,
    Permission6: Permission6,
    Permission7: Permission7,
    Permission8: Permission8,
    Permission9: Permission9,
    Permission10: Permission10,
    Permissions: Permissions,
    storeAll: storeAll,
    dropAll: dropAll
}

function storeAll(attributes, callback) {
    const permDocs = [];
    const permNames = [];
    for (var i = 0; i < attributes.length; i++) {
        permDocs.push(new Permission(attributes[i]));
        permNames.push(attributes[i].name);
    }

    Permission.collection.insertMany(permDocs).then(
        () => {
            logger.info(`${TAG} saved permissions:${permNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store permissions ${permNames.join(",")}. Error: ${JSON.stringify(reason)}`)
            callback(reason);
        }
    );
}

function dropAll(callback) {
    Permission.collection.drop().then(
        () => {
            logger.info(`dropped table Permission`);
            callback();
        },
        (err) => {
            logger.error(`could not drop Permission. Error: ${JSON.stringify(err)}`);
            callback(err);
        }
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}