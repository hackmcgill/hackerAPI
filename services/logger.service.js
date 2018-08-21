"use strict";
const winston = require("winston");
const expressWinston = require("express-winston");
const StackDriverTransport = require("@google-cloud/logging-winston").LoggingWinston;

const colorize = process.env.NODE_ENV !== "production";

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

module.exports = {
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