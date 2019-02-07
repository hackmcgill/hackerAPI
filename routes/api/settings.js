"use strict";

const express = require("express");
const Controllers = {
    Settings: require("../../controllers/settings.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Settings: require("../../middlewares/validators/settings.validator"),
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Settings: require("../../middlewares/settings.middleware"),
    Auth: require("../../middlewares/auth.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const settingsRouter = express.Router();

        /**
         * 
         */
        settingsRouter.get('/',
            Middleware.Settings.getSettings,
            Controllers.Settings.createdSettings
        );

        settingsRouter.patch('/',
            Middleware.Auth.ensureAuthenticated,
            Middleware.Auth.ensureAuthorized([]),
            Middleware.Validator.Settings.createSettingsValidator,
            Middleware.parseBody,
            Middleware.Settings.parsePatch,
            Middleware.Settings.updateSettings,
            Controllers.Settings.createdSettings
        );

        apiRouter.use("/settings", settingsRouter);
    }
};