"use strict";
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const Services = {
    log: require("./services/logger.service"),
    db: require("./services/database.service"),
    emailAndPassStrategy: require("./services/auth.service.js")
};

const passport = require("passport");
passport.use("emailAndPass", Services.emailAndPassStrategy);

/* Routes here */
const indexRouter = require("./routes/index");
const accountRouter = require("./routes/api/account");
const authRouter = require("./routes/api/auth");
const hackerRouter = require("./routes/api/hacker");
// const teamRouter = require("./routes/api/team");

const result = require("dotenv").config({
    path: path.join(__dirname, "./.env")
});
if (result.error) {
    Services.log.error(result.error);
}

const app = express();
Services.db.connect(app);

app.use(Services.log.requestLogger);
app.use(Services.log.errorLogger);
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session()); //persistent login session

app.use(express.static(path.join(__dirname, "public")));

var apiRouter = express.Router();

accountRouter.activate(apiRouter);
Services.log.info("Account router activated");
authRouter.activate(apiRouter);
Services.log.info("Auth router activated");
hackerRouter.activate(apiRouter);
Services.log.info("Hacker router activated");
// teamRouter.activate(apiRouter);
// Services.log.info("Team router activated");

app.use("/", indexRouter);

app.use("/api", apiRouter);

module.exports = {
    app: app,
};