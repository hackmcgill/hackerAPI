"use strict";
const express = require("express");

const Middleware = {
    Auth: require("../../middlewares/auth.middleware"),
    Email: require("../../middlewares/email.middleware"),
};

const Controllers = {
    Email: require("../../controllers/email.controller"),
};

module.exports = {
    activate: function (apiRouter) {
        const automatedEmailRouter = express.Router();

        /**
         * @api {get} /email/automated/status/:status/count Get count of hackers with specified status
         * @apiName getStatusEmailCount
         * @apiGroup Email
         * @apiVersion 0.0.8
         *
         * @apiParam {string} status Status of hackers to count (Accepted/Declined)
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Contains count of hackers
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Successfully retrieved count",
         *          "data": {
         *              "count": 50
         *          }
         *      }
         */
        automatedEmailRouter.route("/automated/status/:status/count").get(
            Middleware.Auth.ensureAuthenticated(),
            // Middleware.Auth.ensureAuthorized(),
            Middleware.Email.validateStatus,
            Middleware.Email.getStatusCount,
            Controllers.Email.getStatusCount,
        );

        /**
         * @api {post} /email/automated/status/:status Send emails to all hackers with specified status
         * @apiName sendAutomatedStatusEmails
         * @apiGroup Email
         * @apiVersion 0.0.8
         *
         * @apiParam {string} status Status of hackers to email (Accepted/Declined)
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Contains counts of successful and failed emails
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Successfully sent emails",
         *          "data": {
         *              "success": 50,
         *              "failed": 2
         *          }
         *      }
         */
        automatedEmailRouter.route("/automated/status/:status").post(
            Middleware.Auth.ensureAuthenticated(),
            // Middleware.Auth.ensureAuthorized(),
            Middleware.Email.validateStatus,
            Middleware.Email.sendAutomatedStatusEmails,
            Controllers.Email.sendAutomatedStatusEmails,
        );

        apiRouter.use("/email", automatedEmailRouter);
    },
};
