"use strict";
const Util = {
    Hacker: require("./hacker.test.util")
};
const Bus = require("../../models/bus.model");
const logger = require("../../services/logger.service");
const TAG = "[ BUS.TEST.UTIL.JS ]";

const Bus1 = {
    "origin": {
        "country": "Country1",
        "provinceOrState": "Province2",
        "zip": "123456",
        "city": "City1",
        "addr1": "addr1-1",
        "addr2": "addr2-1"
    },
    "capacity": 10,
    "hackers": [Util.Hacker.HackerA._id]
};
const Busses = [
    Bus1,
];

module.exports = {
    Bus1: Bus1,
    Busses: Busses,
    storeAll: storeAll,
    dropAll: dropAll
};

function storeAll(attributes, callback) {
    const busDocs = [];
    const busNames = [];
    for (var i = 0; i < attributes.length; i++) {
        busDocs.push(new Bus(attributes[i]));
        busNames.push(attributes[i].name);
    }
    
    Bus.collection.insertMany(busDocs).then(
        () => {
            logger.info(`${TAG} saved Buses: ${busNames.join(",")}`);
            callback();
        },
        (reason) => {
            logger.error(`${TAG} could not store Buses ${busNames.join(",")}. Error: ${JSON.stringify(reason)}`);
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
    ).catch((error) => {
        logger.error(error);
        callback();
    });
}