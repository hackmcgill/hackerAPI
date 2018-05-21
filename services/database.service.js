"use strict";
const mongoose = require("mongoose");
const logger = require("./logger.service");
const Q = require("q");

const TAG = "[ DATABASE SERVICE ]";
// if DB is defined as an env var, it will go there, elsewise, try local
// you ideally set DB to your database uri that the provider gives you
// it should be easily findable

// DATABASE SERVICE
const address = (process.env.NODE_ENV === "development")
    ? process.env.DB_ADDRESS_DEV
    : (process.env.NODE_ENV === "deployment")
        ? process.env.DB_ADDRESS_DEPLOY
        : process.env.DB_ADDRESS_TEST;

function getUserFromEnvironment() {
    return (process.env.NODE_ENV === "development")
        ? process.env.DB_USER_DEV
        : (process.env.NODE_ENV === "deployment")
            ? process.env.DB_USER_DEPLOY
            : process.env.DB_USER_TEST;
}

function getPassFromEnvironment() {
    return (process.env.NODE_ENV === "development")
        ? process.env.DB_PASS_DEV
        : (process.env.NODE_ENV === "deployment")
            ? process.env.DB_PASS_DEPLOY
            : process.env.DB_PASS_TEST;
}


module.exports = {
    connect: function (app) {
        logger.info(`${TAG} Connecting to db`);
        mongoose.Promise = Q.promise;
        const user = getUserFromEnvironment();
        const pass = getPassFromEnvironment();
        mongoose.connect(`mongodb://${user}:${pass}@${address}`, {
            useMongoClient: true
        }).then(function () {
            logger.info(`${TAG} Connected to database on ${address}`);
            app.emit("event:connected to db");
        }, function () {
            logger.error(`${TAG} Failed to connect to database on ${address}`);
            throw `Failed to connect to database on ${address}`;
        });
    },
    address: address,
    readyState: function () {
        return mongoose.connection.readyState;
    }
};