"use strict";
const Util = {
    Hacker: require("./hacker.test.util")
};
const Bus = require("../../models/bus.model");
const logger = require("../../services/logger.service");

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

function storeAll(attributes) {
    const busDocs = [];
    const busZips = [];
    for (var i = 0; i < attributes.length; i++) {
        busDocs.push(new Bus(attributes[i]));
        busZips.push(attributes[i].zip);
    }

    return Bus.collection.insertMany(busDocs);
}

async function dropAll() {
    try {
        await Bus.collection.drop();
    } catch (e) {
        if (e.code === 26) {
            logger.info("namespace %s not found", Bus.collection.name);
        } else {
            throw e;
        }
    }
}