const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const log = require('./services/logger.service');

const indexRouter = require('./routes/index');

const app = express();

app.use(log.requestLogger);
app.use(log.errorLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
