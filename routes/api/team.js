"use strict";

const express = require("express");

const Controllers = {
    Team: require("../../controllers/team.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Team: require("../../middlewares/validators/team.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Team: require("../../middlewares/team.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const teamRouter = new express.Router();

        teamRouter.route("/").post(
            // Validators
            Middleware.Validator.Team.newTeamValidator,

            Middleware.parseBody.middleware,

            Middleware.Team.parseTeam,

            Controllers.Team.createTeam

        );

        apiRouter.use("/team", teamRouter);
    }
};