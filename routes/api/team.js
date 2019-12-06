"use strict";

const express = require("express");

const Controllers = {
    Team: require("../../controllers/team.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Team: require("../../middlewares/validators/team.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator"),
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Team: require("../../middlewares/team.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
};
const Services = {
    Hacker: require("../../services/hacker.service"),
};

module.exports = {
    activate: function (apiRouter) {
        const teamRouter = new express.Router();

        /**
         * @api {post} /team/ create a new team consisting of only the logged in user
         * @apiName createTeam
         * @apiGroup Team
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {String} name Name of the team.
         * @apiParam (body) {String} [devpostURL] Devpost link to hack. Once the link is sent, the hack will be considered to be submitted.
         * @apiParam (body) {String} [projectName] Name of the team.
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Team object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Team creation successful", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating team", "data": {}}
         */
        teamRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            // Validators
            Middleware.Validator.Team.newTeamValidator,
            Middleware.parseBody.middleware,
            Middleware.Team.parsePatch,
            Middleware.Team.addId,
            Middleware.Team.parseNewTeam,

            Middleware.Team.ensureFreeTeamName,

            Middleware.Team.createTeam,
            Controllers.Team.createdTeam
        );

        /**
         * @api {patch} /team/join/ Allows a logged in hacker to join a team by name
         * @apiName patchJoinTeam
         * @apiGroup Team
         * @apiVersion 1.1.1
         * 
         * @apiParam (body) {string} [name] Name of the team to join
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data {}
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Team join successful.", 
         *          "data": {}
         *      }
         */
        teamRouter.route("/join/").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Validator.Team.joinTeamValidator,
            // need to check that the team is not full
            Middleware.Team.ensureSpace,

            Middleware.Team.updateHackerTeam,

            Controllers.Team.joinedTeam
        );

        /**
         * @api {patch} /team/leave/ Allows a logged in hacker to leave current team
         * @apiName deleteSelfFromTeam
         * @apiGroup Team
         * @apiVersion 1.1.1
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data {}
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Removal from team successful.", 
         *          "data": {}
         *      }
         */
        teamRouter.route("/leave").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            Middleware.Team.deleteUserFromTeam,
            Controllers.Team.leftTeam
        );

        /**
         * @api {get} /team/:id get a team's information
         * @apiName getTeam
         * @apiGroup Team
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {ObjectId} id MongoId of the team
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Team object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Team retrieval successful", 
                    "data": {        
                        "team": {
                            "name":"foo",
                            "members": [
                                ObjectId('...')
                            ],
                            "devpostURL": "www.devpost.com/foo",
                            "projectName": "fooey"
                        },
                        "members": [
                            {
                                "firstName": "John",
                                "lastName": "Doe"
                            }
                        ],
                    }
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Team not found", "data": {}}
         */
        teamRouter.route("/:id").get(
            Middleware.Auth.ensureAuthenticated(),
            // get is available for all teams, or no teams. No authorization is done on the :id parameter.
            // However, a function is needed, so the identity function is put here. In reality, the route
            // is /api/team/:all, so the id is not checked. The returned object places the id inside accountId
            // to be consistent with other findById functions
            Middleware.Auth.ensureAuthorized([(id) => {
                return {
                    accountId: id
                };
            }]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,

            Middleware.Team.populateMemberAccountsById,
            Controllers.Team.showTeam
        );

        /**
         * @api {patch} /team/:hackerId Update a team's information. The team is specified by the hacker belonging to it.
         * @apiName patchTeam
         * @apiGroup Team
         * @apiVersion 0.0.8
         * @apiDescription 
         *      We use hackerId instead of teamId because authorization requires 
         *      a one-to-one mapping from param id to accountId, but we are not able
         *      to have that from teamId to accountId due to multiple members in a team.
         *      Instead, we use hackerId, as there is a 1 to 1 link between hackerId to teamId,
         *      and a 1 to 1 link between hackerId and accountId
         * 
         * 
         * @apiParam (param) {ObjectId} hackerId a hacker's unique Id
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Team object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Team update successful.", 
                    "data": {...}
                }

         * @apiError {String} message Error message
         * @apiError {Object} data Query input that caused the error.
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Team not found", "data": {teamId}}
         */
        teamRouter.route("/:hackerId").patch(
            Middleware.Auth.ensureAuthenticated(),

            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.Team.patchTeamValidator,
            Middleware.Validator.RouteParam.hackeridValidator,
            Middleware.parseBody.middleware,
            Middleware.Team.parsePatch,
            Middleware.Team.getTeamIdByHackerId,
            Middleware.Team.updateTeam,

            Controllers.Team.updatedTeam
        );

        apiRouter.use("/team", teamRouter);
    }
};