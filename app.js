const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const log = require("./services/logger.service");
const db = require("./services/database.service");

const indexRouter = require("./routes/index");

const app = express();
db.connect(app);

const result = require("dotenv").config({
    path: path.join(__dirname, "./.env")
});

if (result.error) {
    log.error(result.error);
}


app.use(log.requestLogger);
app.use(log.errorLogger);
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;