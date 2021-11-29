import winston, {
    error,
    warn,
    info,
    log,
    verbose,
    debug,
    silly
} from "winston";
import expressWinston from "express-winston";

const colorize = process.env.NODE_ENV !== "deployment";

const errorLogger = expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize(),
        winston.format.timestamp()
    )
});

const requestLogger = expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize(),
        winston.format.timestamp()
    ),
    colorize: colorize,
    expressFormat: true,
    meta: false
});

function queryCallbackFactory(TAG: string, model: string, query: Object) {
    // err is error, res is result
    return (err: Error, res: Object) => {
        if (err) {
            winston.error(
                `${TAG} Failed to verify if ${model} exist or not using ${JSON.stringify(
                    query
                )}`,
                err
            );
        } else if (res) {
            winston.debug(
                `${TAG} ${model} using ${JSON.stringify(
                    query
                )} exist in the database`
            );
        } else {
            winston.debug(
                `${TAG} ${model} using ${JSON.stringify(
                    query
                )} do not exist in the database`
            );
        }
    };
}

function updateCallbackFactory(TAG: string, model: string) {
    return (err: Error, res: Object) => {
        if (err) {
            winston.error(`${TAG} failed to change ${model}`);
        } else if (!res) {
            winston.error(`${TAG} failed to find ${model} in database`);
        } else {
            winston.debug(`${TAG} changed ${model} information`);
        }
    };
}

export {
    updateCallbackFactory,
    queryCallbackFactory,
    requestLogger,
    errorLogger,
    error,
    warn,
    info,
    verbose,
    debug,
    silly
};
