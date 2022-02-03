import { config } from "dotenv";
import express, {
    Application as ExpressApplication,
    json,
    Router,
    urlencoded
} from "express";
import { join } from "path";
import { container } from "tsyringe";
import cors from "cors";
import { Connection, createConnection } from "typeorm";
import { attachControllerInstances } from "@decorators/express";
import { AccountController } from "@controllers/account.controller";
import { AuthenticationController } from "@controllers/authentication.controller";
import { HackerController } from "@controllers/hacker.controller";
import { SearchController } from "@controllers/search.controller";
import { SettingsController } from "@controllers/settings.controller";
import { SponsorController } from "@controllers/sponsor.controller";
import { TeamController } from "@controllers/team.controller";
import { TravelController } from "@controllers/travel.controller";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import passport from "passport";
import { LoggerService } from "./services/logger.service";

async function createApplication(): Promise<ExpressApplication> {
    const application: ExpressApplication = express();
    const loggerService: LoggerService = container.resolve(LoggerService);

    useLogging(application, loggerService);
    useEnvironmentFile();
    useCors(application);
    useMiddleware(application);
    await useDatabase(loggerService);
    useControllers(application);

    return application;
}

function useLogging(express: ExpressApplication, loggerService: LoggerService) {
    express.use(
        loggerService.getRequestLogger(),
        loggerService.getErrorLogger()
    );
}

function useEnvironmentFile(): void {
    const { error } = config({
        path: join(__dirname, "../", `.env.${process.env.NODE_ENV}`)
    });

    if (error) throw error;
}

function useCors(express: ExpressApplication): void {
    const options =
        process.env.NODE_ENV === "production"
            ? {
                  origin: [
                      `${process.env.FRONTEND_ADDRESS}`,
                      `https://docs.mchacks.ca`
                  ],
                  credentials: true
              }
            : {
                  origin: [`${process.env.FRONTEND_ADDRESS}`],
                  credentials: true
              };
    express.use(cors(options));
}

function useMiddleware(express: ExpressApplication): void {
    express.use(json(), urlencoded({ extended: false }));
    express.use(
        cookieParser(),
        cookieSession({
            name: "session",
            keys: [`${process.env.COOKIE_SECRET}`],
            // Cookie Options
            maxAge: 48 * 60 * 60 * 1000 //Logged in for 48 hours
        })
    );
    express.use(passport.initialize(), passport.session());
}

async function useDatabase(loggerService: LoggerService): Promise<void> {
    await createConnection()
        .then((connection: Connection) => {
            loggerService.getLogger().info("Connected to the database.");
            container.registerInstance(Connection, connection);
        })
        .catch((error) =>
            loggerService
                .getLogger()
                .error(`Failed to connect to the database. ${error}`)
        );
}

function useControllers(express: ExpressApplication): void {
    const router: Router = Router();
    attachControllerInstances(router, [
        container.resolve(AccountController),
        container.resolve(AuthenticationController),
        container.resolve(HackerController),
        container.resolve(TeamController),
        container.resolve(SponsorController),
        container.resolve(TravelController),
        container.resolve(SearchController),
        container.resolve(SettingsController)
    ]);
    express.use("/api", router);
}

export default createApplication;
