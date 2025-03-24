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
 * @apiVersion 1.0.0
 *
 * @apiParam {Object} formData The check-in form data
 * @apiParam {String} formData.teamMember1 First team member's name
 * @apiParam {String} [formData.teamMember2] Second team member's name
 * @apiParam {String} [formData.teamMember3] Third team member's name
 * @apiParam {String} [formData.teamMember4] Fourth team member's name
 * @apiParam {String[]} formData.prizeCategories Array of prize categories
 * @apiParam {String[]} formData.sponsorChallenges Array of sponsor challenges
 * @apiParam {String[]} formData.workshopsAttended Array of workshops attended
 *
 * @apiSuccess {String} message Success message
 *
 * @apiError {String} message Error message
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
