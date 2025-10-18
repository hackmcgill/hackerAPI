"use strict";
const express = require("express");
const Services = {
    AutomatedEmail: require("../../services/automatedEmails.service"),
};
const Middleware = {
    Auth: require("../../middlewares/auth.middleware"),
};
const PROJECT_CONSTANTS = require("../../constants/general.constant");
const Constants = {
    STATUSES: [
        PROJECT_CONSTANTS.HACKER_STATUS_ACCEPTED,
        PROJECT_CONSTANTS.HACKER_STATUS_DECLINED,
    ],
};

module.exports = {
    activate: function (apiRouter) {
        const automatedEmailRouter = express.Router();

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
        automatedEmailRouter
            .route("/automated/status/:status")
            .post(
                Middleware.Auth.ensureAuthenticated(),
                Middleware.Auth.ensureAuthorized(),
                async (req, res) => {
                    const { status } = req.params;

                    if (!Constants.STATUSES.includes(status)) {
                        return res.status(400).json({
                            message: "Invalid status",
                            data: {},
                        });
                    }

                    try {
                        const results =
                            await Services.AutomatedEmail.sendAutomatedStatusEmails(
                                status,
                            );
                        return res.status(200).json({
                            message: "Successfully sent emails",
                            data: results,
                        });
                    } catch (err) {
                        return res.status(500).json({
                            message: err.message,
                            data: {},
                        });
                    }
                },
            );

        apiRouter.use("/email", automatedEmailRouter);
    },
};
