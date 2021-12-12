import { attachControllerInstances } from "@decorators/express";
import express from "express";
import passport from "passport";
import { join } from "path";
import { container } from "tsyringe";
import { AccountController } from "./controllers/account.controller";
import { AuthenticationController } from "./controllers/authentication.controller";
import { DatabaseService } from "./services/database.service";
import { EnvService } from "./services/env.service";
import { LoggerService } from "./services/logger.service";
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");

(async () => {
    const application = express();

    const envService: EnvService = container.resolve(EnvService);
    const loggerService: LoggerService = container.resolve(LoggerService);
    const databaseService: DatabaseService = container.resolve(DatabaseService);
    await databaseService.connect();

    let corsOptions = {};

    if (!envService.isProduction()) {
        corsOptions = {
            origin: [`http://${process.env.FRONTEND_ADDRESS_DEV}`],
            credentials: true
        };
    } else {
        // TODO: change this when necessary
        corsOptions = {
            origin: [
                `https://${process.env.FRONTEND_ADDRESS_DEPLOY}`,
                `https://${process.env.FRONTEND_ADDRESS_BETA}`,
                `https://docs.mchacks.ca`
            ],
            credentials: true
        };
    }

    application.use(cors(corsOptions));

    application.use(
        loggerService.getRequestLogger(),
        loggerService.getErrorLogger()
    );

    application.use(
        express.json(),
        express.urlencoded({
            extended: false
        })
    );

    //Cookie-based session tracking
    application.use(
        cookieParser(),
        cookieSession({
            name: "session",
            keys: [process.env.COOKIE_SECRET],
            // Cookie Options
            maxAge: 48 * 60 * 60 * 1000 //Logged in for 48 hours
        })
    );

    application.use(passport.initialize(), passport.session()); //persistent login session

    application.use(express.static(join(__dirname, "public")));

    const router = express.Router();
    attachControllerInstances(router, [
        container.resolve(AccountController),
        container.resolve(AuthenticationController)
    ]);
    application.use("/api", router);

    const port = process.env.PORT ?? 3000;
    application.listen(port, () => {
        loggerService.getLogger().info(`Listening on port ${port}...`);
    });
})();
