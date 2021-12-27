import winston, {
    error,
    warn,
    info,
    log,
    verbose,
    debug,
    silly,
    Logger
} from "winston";
import expressWinston from "express-winston";
import { inject, injectable, singleton } from "tsyringe";
import { ErrorRequestHandler, Handler, Response } from "express";
import { EnvService } from "./env.service";
import { Format } from "logform";

@injectable()
@singleton()
export class LoggerService {
    private readonly logger: Logger;
    private readonly requestLogger: Handler;
    private readonly errorLogger: ErrorRequestHandler;

    constructor(@inject(EnvService) envService: EnvService) {
        const format: Format = winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({
                format: "MM/D/YYYY HH:MM:SS"
            }),
            winston.format.printf((info) => {
                return `${info.timestamp} [${info.level}] : ${info.message}`;
            })
        );

        this.logger = winston.createLogger({
            transports: [new winston.transports.Console()],
            format: format
        });

        this.requestLogger = expressWinston.logger({
            transports: [new winston.transports.Console()],
            format: format,
            colorize: !envService.isProduction()
        });

        this.errorLogger = expressWinston.errorLogger({
            transports: [new winston.transports.Console()],
            format: format
        });
    }

    public getLogger() {
        return this.logger;
    }

    public getRequestLogger(): Handler {
        return this.requestLogger;
    }

    public getErrorLogger(): ErrorRequestHandler {
        return this.errorLogger;
    }
}
