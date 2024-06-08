"use strict";
const winston = require("winston");
const expressWinston = require("express-winston");

const colorize = process.env.NODE_ENV !== "deployment";

winston.add(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.printf((l) => `${l.level}: ${l.message}`),
        ),
    }),
);

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                ...(colorize ? [winston.format.colorize()] : []),
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
});

const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                ...(colorize ? [winston.format.colorize()] : []),
                winston.format.printf(
                    (l) => `${l.timestamp} - ${l.level}: ${l.message}`,
                ),
            ),
        }),
    ],
    expressFormat: true,
    meta: false,
});

function logQuery(TAG, model, queryInfo, query) {
    query.then = function (onfulfilled, onrejected) {
        return Object.getPrototypeOf(this).then.call(
            this,
            (res) => {
                if (res) {
                    winston.debug(
                        `${TAG} ${model} using ${JSON.stringify(
                            queryInfo,
                        )} exist in the database`,
                    );
                } else {
                    winston.debug(
                        `${TAG} ${model} using ${JSON.stringify(
                            queryInfo,
                        )} do not exist in the database`,
                    );
                }
                if (onfulfilled) onfulfilled(res);
            },
            (err) => {
                winston.error(
                    `${TAG} Failed to verify if ${model} exist or not using ${JSON.stringify(
                        queryInfo,
                    )}`,
                    err,
                );
                if (onrejected) onrejected(err);
            },
        );
    };

    return query;
}

function logUpdate(TAG, model, query) {
    query.then = function(onfulfilled, onrejected) {
        return Object.getPrototypeOf(this).then.call(this,
            res => {
                if (res) {
                    winston.debug(`${TAG} changed ${model} information`);
                } else {
                    winston.error(`${TAG} failed to find ${model} in database`);
                }
                if (onfulfilled) onfulfilled(res);
            },
            err => {
                winston.error(`${TAG} failed to change ${model}`);
                if (onrejected) onrejected(err);
            },
        )
    };

    return query;
}

module.exports = {
    logUpdate: logUpdate,
    logQuery: logQuery,
    requestLogger: requestLogger,
    errorLogger: errorLogger,
    error: winston.error,
    warn: winston.warn,
    info: winston.info,
    log: winston.log,
    verbose: winston.verbose,
    debug: winston.debug,
    silly: winston.silly,
};
