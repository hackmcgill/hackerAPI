"use strict";
const winston = require("winston");
const expressWinston = require("express-winston");
const StackDriverTransport = require("@google-cloud/logging-winston").LoggingWinston;

const colorize = process.env.NODE_ENV !== "deployment";

const errorLogger = expressWinston.errorLogger({
    transports: [
        new StackDriverTransport(),
        new winston.transports.Console({
            json: true,
            colorize: colorize,
            timestamp: true
        })
    ]
});

const requestLogger = expressWinston.logger({
    transports: [
        new StackDriverTransport(),
        new winston.transports.Console({
            json: false,
            colorize: colorize,
            timestamp: true
        })
    ],
    expressFormat: true,
    meta: false
});

function queryCallbackFactory(TAG, model, query) {
    // err is error, res is result
    return (err, res) => {
        if (err) {
            winston.error(`${TAG} Failed to verify if ${model} exist or not using ${JSON.stringify(query)}`, err);
        } else if (res) {
            winston.debug(`${TAG} ${model} using ${JSON.stringify(query)} exist in the database`);
        } else {
            winston.debug(`${TAG} ${model} using ${JSON.stringify(query)} do not exist in the database`);
        }
    };
}

function updateCallbackFactory(TAG, model) {
    return (err, res) => {
        if (err) {
            winston.error(`${TAG} failed to change ${model}`);
        } else if (!res) {
            winston.error(`${TAG} failed to find ${model} in database`);
        } else {
            winston.debug(`${TAG} changed ${model} information`);
        }
    };
}

module.exports = {
    updateCallbackFactory: updateCallbackFactory,
    queryCallbackFactory: queryCallbackFactory,
    requestLogger: requestLogger,
    errorLogger: errorLogger,
    error: winston.error,
    warn: winston.warn,
    info: winston.info,
    log: winston.log,
    verbose: winston.verbose,
    debug: winston.debug,
    silly: winston.silly
};