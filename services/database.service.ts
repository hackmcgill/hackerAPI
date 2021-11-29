import { Connection, createConnection } from "typeorm";
const logger = require("./logger.service");

const TAG = "[ DATABASE SERVICE ]";
import * as env from "./env.service";
import Account from "../models/account.model";
import AccountConfirmation from "../models/accountConfirmationToken.model";
import Application from "../models/application.model";
import Bus from "../models/bus.model";
import EmailTemplate from "../models/emailTemplate.model";
import Hacker from "../models/hacker.model";
import PasswordReset from "../models/passwordResetToken.model";
import Role from "../models/role.model";
import RoleBinding from "../models/roleBinding.model";
import Settings from "../models/settings.model";
import Sponsor from "../models/sponsor.model";
import Staff from "../models/staff.model";
import Team from "../models/team.model";
import Travel from "../models/travel.model";
import Volunteer from "../models/volunteer.model";

// if DB is defined as an env var, it will go there, elsewise, try local
// you ideally set DB to your database uri that the provider gives you
// it should be easily findable

// DATABASE SERVICE
function getHostFromEnvironment() {
    return process.env.NODE_ENV == "development"
        ? process.env.DB_HOST_DEV
        : process.env.NODE_ENV == "deployment"
        ? process.env.DB_HOST_DEPLOY
        : process.env.DB_HOST_TEST;
}

function getPortFromEnvironment() {
    return process.env.NODE_ENV == "development"
        ? process.env.DB_PORT_DEV
        : process.env.NODE_ENV == "deployment"
        ? process.env.DB_PORT_DEPLOY
        : process.env.DB_PORT_TEST;
}

function getNameFromEnvironment() {
    return process.env.NODE_ENV == "development"
        ? process.env.DB_NAME_DEV
        : process.env.NODE_ENV == "deployment"
        ? process.env.DB_NAME_DEPLOY
        : process.env.DB_NAME_TEST;
}

function getUserFromEnvironment() {
    return process.env.NODE_ENV == "development"
        ? process.env.DB_USER_DEV
        : process.env.NODE_ENV == "deployment"
        ? process.env.DB_USER_DEPLOY
        : process.env.DB_USER_TEST;
}

function getPassFromEnvironment() {
    return process.env.NODE_ENV == "development"
        ? process.env.DB_PASS_DEV
        : process.env.NODE_ENV == "deployment"
        ? process.env.DB_PASS_DEPLOY
        : process.env.DB_PASS_TEST;
}

async function connect(app: any, callback: any) {
    const host = getHostFromEnvironment();
    // TODO - Fix this hack.
    const port = parseInt(getPortFromEnvironment()!);
    const user = getUserFromEnvironment();
    const password = getPassFromEnvironment();
    const database = getNameFromEnvironment();
    logger.info(`${TAG} Connecting to db on ${host}`);
    await createConnection({
        type: "postgres",
        host: host,
        port: port,
        username: user,
        password: password,
        database: database,
        entities: [
            Account,
            AccountConfirmation,
            Application,
            Bus,
            EmailTemplate,
            Hacker,
            PasswordReset,
            Role,
            RoleBinding,
            Settings,
            Sponsor,
            Staff,
            Team,
            Travel,
            Volunteer
        ]
    })
        .then((connection: Connection) => {
            connection.synchronize();
            logger.info(`${TAG} Connected to database on ${host}`);
            if (app) {
                app.emit("event:connected to db");
            }
            if (callback) {
                callback();
            }
        })
        .catch((error) => {
            logger.error(
                `${TAG} Failed to connect to database at ${host}. Error: ${error}`
            );
            throw `Failed to connect to database at ${host}`;
        });
}

export { connect };
