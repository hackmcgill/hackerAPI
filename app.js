"use strict";
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");
const Services = {
    log: require("./services/logger.service"),
    db: require("./services/database.service"),
    auth: require("./services/auth.service"),
    env: require("./services/env.service")
};

const envLoadResult = Services.env.load(path.join(__dirname, "./.env"));
if (envLoadResult.error) {
    Services.log.error(envLoadResult.error);
}

const passport = require("passport");
passport.use("emailAndPass", Services.auth.emailAndPassStrategy);

/* Routes here */
const indexRouter = require("./routes/index");
const accountRouter = require("./routes/api/account");
const authRouter = require("./routes/api/auth");
const hackerRouter = require("./routes/api/hacker");
const teamRouter = require("./routes/api/team");
const sponsorRouter = require("./routes/api/sponsor");
const searchRouter = require("./routes/api/search");
const volunteerRouter = require("./routes/api/volunteer");

const app = express();
Services.db.connect(app);
app.use(cors());
app.use(Services.log.requestLogger);
app.use(Services.log.errorLogger);
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
//Cookie-based session tracking
app.use(cookieSession({
  name: "session",
  keys: [process.env.COOKIE_SECRET],
  // Cookie Options
  maxAge: 60 * 60 * 1000 //Logged in for 1 hour
}));
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
teamRouter.activate(apiRouter);
Services.log.info("Team router activated");
sponsorRouter.activate(apiRouter);
Services.log.info("Sponsor router activated");
volunteerRouter.activate(apiRouter);
Services.log.info("Volunteer router activated");
searchRouter.activate(apiRouter);
Services.log.info("Search router activated");

app.use("/", indexRouter);

app.use("/api", apiRouter);

//Custom error handler
app.use((err, req, res, next) => {
    // log the error...
    const status = (err.status) ? err.status : 500;
    const message = (err.message) ? err.message : "Internal Server Error";
    //Only show bad error when we're not in deployment
    const errorContents = (err.error) ? err.error : (process.env.NODE_ENV !== "deployment") ? err : {};
    res.status(status).json({
        message: message,
        data: errorContents
    });
});

module.exports = {
    app: app,
};