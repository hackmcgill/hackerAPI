"use strict";
const Permission = require("../../models/permission.model");
const mongoose = require("mongoose");
const logger = require("../../services/logger.service");
const TAG = "[ PERMISSION.TEST.UTIL.JS ]";
module.exports = {
    Permission1: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission1"
    },
    Permission2: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission2"
    },
    Permission3: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission3"
    },
    Permission4: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission4"
    },
    Permission5: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission5"
    },
    Permission6: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission6"
    },
    Permission7: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission7"
    },
    Permission8: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission8"
    },
    Permission9: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission9"
    },
    Permission10: {
        "_id": mongoose.Types.ObjectId(),
        "name": "Permission10"
    },
    storeAll: storeAll,
    dropAll: dropAll
}

function storeAll(attributes, callback) {
    const permDocs = [];
    for (var i = 0; i < attributes.length; i++) {
        permDocs.push(new Permission(attributes[i]));
    }
    const permissionNames = attributes.map((val) => {
        return val.name + ",";
    });
    Permission.collection.insertMany(permDocs).then(
        () => {
            logger.info(`${TAG} saved permissions:${permissionNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store permissions ${permissionNames.join(",")}. Error: ${JSON.stringify(reason)}`)
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
    );
}