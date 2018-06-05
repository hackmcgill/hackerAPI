"use strict";
const Util = {
    Hacker: require("./hacker.test.util")
};
const Bus = require("../../models/bus.model");
const logger = require("../../services/logger.service");
const TAG = "[ BUS.TEST.UTIL.JS ]";

module.exports = {
    bus1: {
        "origin": {
            "country": "Country1",
            "provinceOrState": "Province2",
            "zip": "123456",
            "city": "City1",
            "addr1": "addr1-1",
            "addr2": "addr2-1"
        },
        "capacity": 10,
        "hackers": [Util.Hacker.Hacker1._id]
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