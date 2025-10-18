"use strict";

const express = require("express");
const router = express.Router();
const Controllers = {
    Checkin: require("../../controllers/checkin.controller")
};
const Middleware = {
    Auth: require("../../middlewares/auth.middleware"),
    Validators: {
        checkinValidator: require("../../middlewares/validators/checkin.validator")
    }
};

/**
 * @api {post} /api/hacker/checkin Submit check-in form data
 * @apiName SubmitCheckin
 * @apiGroup Checkin
 * @apiVersion 2.0.0
 *
 * @apiDescription Submits check-in form for the logged-in hacker's team.
 * Team member emails are automatically fetched from the team.
 * Hacker must be part of a team to submit.
 *
 * @apiParam {Object} formData The check-in form data
 * @apiParam {String[]} formData.prizeCategories Array of prize categories
 * @apiParam {String[]} formData.sponsorChallenges Array of sponsor challenges
 * @apiParam {String[]} formData.workshopsAttended Array of workshops attended
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {String} message Error message
 * @apiError (400) {String} message "You must be part of a team to submit check-in"
 * @apiError (404) {String} message "Hacker not found" or "Team not found"
 */
router.post(
    "/checkin",
    Middleware.Auth.ensureAuthenticated(),
    Middleware.Validators.checkinValidator,
    Controllers.Checkin.submitCheckin
);

function activate(apiRouter) {
    apiRouter.use("/hacker", router);
}

module.exports = {
    activate: activate
}; 
