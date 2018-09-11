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
};

module.exports = {
    activate: function (apiRouter) {
        const volunteerRouter = express.Router();

        volunteerRouter.route("/").post(
            Middleware.Validator.Volunteer.newVolunteerValidator,

            Middleware.parseBody.middleware,

            Middleware.Volunteer.parseVolunteer,

            Controllers.Volunteer.createVolunteer
        );

        apiRouter.use("/volunteer", volunteerRouter);
    }
};