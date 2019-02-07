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
         * @api {get} /settings/ Get the settings for the current hackathon
         * @apiName getSettings
         * @apiGroup Settings
         * @apiVersion 1.1.1
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Settings Object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Settings creation successful.", 
         *          "data": {
         *              "settings": {
         *                  openTime: "Wed Feb 06 2019 00:00:00 GMT-0500 (GMT-05:00)",
         *                  closeTime: "Sat Feb 01 2020 00:00:00 GMT-0500 (GMT-05:00)",
         *                  confirmTime: "Sat Feb 20 2020 00:00:00 GMT-0500 (GMT-05:00)"
         *              }
         *          }
         *      }
         * @apiPermission public
         */
        settingsRouter.get('/',
            Middleware.Settings.getSettings,
            Controllers.Settings.gotSettings
        );

        /**
         * @api {patch} /settings/ Patch the settings for the current hackathon
         * @apiName patchSettings
         * @apiGroup Settings
         * @apiVersion 1.1.1
         * 
         * @apiParam (body) {Date} [openTime] The opening time for the hackathon.
         * @apiParam (body) {Date} [closeTime] The closing time for the hackathon.
         * @apiParam (body) {Date} [confirmTime] The deadline for confirmation for the hackathon.
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Settings Object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Settings patch successful.", 
         *          "data": {
         *              "settings": {
         *                  openTime: "Wed Feb 06 2019 00:00:00 GMT-0500 (GMT-05:00)",
         *                  closeTime: "Sat Feb 01 2020 00:00:00 GMT-0500 (GMT-05:00)",
         *                  confirmTime: "Sat Feb 20 2020 00:00:00 GMT-0500 (GMT-05:00)"
         *              }
         *          }
         *      }
         * @apiPermission Administrators
         */
        settingsRouter.patch('/',
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([]),
            Middleware.Validator.Settings.createSettingsValidator,
            Middleware.parseBody.middleware,
            Middleware.Settings.parsePatch,
            Middleware.Settings.updateSettings,
            Controllers.Settings.patchedSettings
        );

        apiRouter.use("/settings", settingsRouter);
    }
};