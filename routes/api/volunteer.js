"use strict";

const express = require("express");
const Controllers = {
    Volunteer: require("../../controllers/volunteer.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Volunteer: require("../../middlewares/validators/volunteer.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Volunteer: require("../../middlewares/volunteer.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
};
const Services = {
    Volunteer: require("../../services/volunteer.service")
};

module.exports = {
    activate: function (apiRouter) {
        const volunteerRouter = express.Router();

        /**
         * @api {post} /volunteer/ create a new volunteer
         * @apiName createVolunteer
         * @apiGroup Volunteer
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {MongoID} accountId MongoID of the account of the volunteer
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Volunteer object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Volunteer creation successful", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating volunteer", "data": {}}
         */
        volunteerRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Validator.Volunteer.newVolunteerValidator,

            Middleware.parseBody.middleware,

            // validate type
            Middleware.Volunteer.validateConfirmedStatus,
            // validate that the accountId is not being used for any other thing
            Middleware.Volunteer.checkDuplicateAccountLinks,

            Middleware.Volunteer.parseVolunteer,

            Controllers.Volunteer.createVolunteer
        );

        apiRouter.use("/volunteer", volunteerRouter);
    }
};