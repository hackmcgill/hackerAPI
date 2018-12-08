"use strict";
const express = require("express");
const Controllers = {
    Hacker: require("../../controllers/hacker.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Hacker: require("../../middlewares/validators/hacker.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator"),
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Util: require("../../middlewares/util.middleware"),
    Hacker: require("../../middlewares/hacker.middleware"),
    Auth: require("../../middlewares/auth.middleware")
};
const Services = {
    Hacker: require("../../services/hacker.service"),
}
const CONSTANTS = require("../../constants/general.constant");

module.exports = {
    activate: function (apiRouter) {
        const hackerRouter = express.Router();

        /**
         * @api {get} /hacker/self get information about own hacker
         * @apiName self
         * @apiGroup Hacker
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Hacker found by logged in account id", 
                    "data": {HackerObject}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Hacker not found", "data": {}}
         */
        hackerRouter.route("/self").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Hacker.findSelf,
            Controllers.Hacker.showHacker
        );

        /**
         * @api {post} /hacker/ create a new hacker
         * @apiName createHacker
         * @apiGroup Hacker
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {MongoID} accountId ObjectID of the respective account
         * @apiParam (body) {String} school Name of the school the hacker goes to
         * @apiParam (body) {String} gender Gender of the hacker
         * @apiParam (body) {Boolean} needsBus Whether the hacker requires a bus for transportation
         * @apiParam (body) {String[]} ethnicity the ethnicities of the hacker
         * @apiParam (body) {String} major the major of the hacker
         * @apiParam (body) {Number} graduationYear the graduation year of the hacker
         * @apiParam (body) {Boolean} codeOfConduct acceptance of the code of conduct 
         * @apiParam (body) {Json} application The hacker's application. Resume and jobInterest fields are required.
         * @apiParamExample {Json} application: 
         *      {
         *          "portfolioURL": {
         *              "resume": "..."
         *              "github": "...",
         *              "dropler": "...",
         *              "personal": "...",
         *              "linkedIn": "...",
         *              "other": "..."
         *          },
         *          "jobInterest": "...",
         *          "skills": ["CSS", "HTML"],    
         *          "comments": "...",
         *          "essay": "...",
         *          "team": [id1, id2],
         *      }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Hacker creation successful", 
         *          "data": {...}
         *      }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating hacker", "data": {}}
         */
        hackerRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Validator.Hacker.newHackerValidator,

            Middleware.parseBody.middleware,
            // validate type
            Middleware.Hacker.validateConfirmedStatus,
            // validate that the accountId is not being used for any other thing
            Middleware.Hacker.checkDuplicateAccountLinks,

            Middleware.Hacker.parseHacker,

            Middleware.Hacker.addDefaultStatus,
            Middleware.Auth.createRoleBindings(CONSTANTS.HACKER),
            Middleware.Hacker.createHacker,
            Middleware.Hacker.sendAppliedStatusEmail,
            Controllers.Hacker.createdHacker
        );
        /**
         * @api {patch} /hacker/status/:id update a hacker's status
         * @apiName patchHackerStatus
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         * 
         * @apiParam (body) {String} [status] Status of the hacker's application
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Changed hacker information", 
         *          "data": {
         *              "status": "accepted"
         *          }
         *      }
         * @apiPermission Administrator
         */
        hackerRouter.route("/status/:id").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Validator.Hacker.updateStatusValidator,
            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,
            Middleware.Hacker.updateHacker,
            Middleware.Hacker.sendStatusUpdateEmail,
            Controllers.Hacker.updatedHacker
        );

        /**
         * @api {patch} /hacker/checkin/:id update a hacker's status to be 'Checked-in'.
         * @apiName checkinHacker
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         * 
         * @apiParam (body) {String} [status] Check-in status
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Changed hacker information", 
         *          "data": {
         *              "status": "Checked-in"
         *          }
         *      }
         * @apiPermission Administrator
         * @apiPermission Volunteer
         */
        hackerRouter.route("/checkin/:id").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,

            Middleware.Hacker.checkStatus([CONSTANTS.HACKER_STATUS_ACCEPTED, CONSTANTS.HACKER_STATUS_CONFIRMED]),
            Middleware.Hacker.parseCheckIn,
            Middleware.Hacker.updateHacker,

            Middleware.Hacker.sendStatusUpdateEmail,
            Controllers.Hacker.updatedHacker
        );

        /**
         * @api {patch} /hacker/:id update a hacker's information.  
         * @apiDescription This route only contains the ability to update a subset of a hacker's information. If you want to update a status, you must have Admin priviledges and use PATCH /hacker/status/:id.
         * @apiName patchHacker
         * @apiGroup Hacker
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {String} [school] Name of the school the hacker goes to
         * @apiParam (body) {String} [gender] Gender of the hacker
         * @apiParam (body) {Boolean} [needsBus] Whether the hacker requires a bus for transportation
         * @apiParam (body) {Json} [application] The hacker's application
         * @apiParamExample {Json} application: 
         *      {
         *          "portfolioURL": {
         *              "resume": "..."
         *              "github": "...",
         *              "dropler": "...",
         *              "personal": "...",
         *              "linkedIn": "...",
         *              "other": "..."
         *          },
         *          "jobInterest": "...",
         *          "skills": ["CSS", "HTML"],    
         *          "comments": "...",
         *          "essay": "...",
         *          "team": [id1, id2],
         *      }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Changed hacker information", 
         *          "data": {...}
         *      }
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while updating hacker", "data": {}}
         */
        hackerRouter.route("/:id").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.Validator.Hacker.updateHackerValidator,

            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,

            Middleware.Hacker.updateHacker,
            Middleware.Hacker.updateStatusIfApplicationCompleted,
            Controllers.Hacker.updatedHacker
        );

        /**
         * @api {get} /hacker/:id get a hacker's information
         * @apiName getHacker
         * @apiGroup Hacker
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {String} id a hacker's unique mongoID
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Sponsor object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved hacker information", 
                    "data": {...}
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Hacker not found", "data": {}}
         */
        hackerRouter.route("/:id").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,

            Controllers.Hacker.findById
        );

        hackerRouter.route("/resume/:id")
            /**
             * @api {post} /hacker/resume/:id upload or update resume for a hacker.
             * @apiName postHackerResume
             * @apiGroup Hacker
             * @apiVersion 0.0.8
             * @apiDescription <b>NOTE: This must be sent via multipart/form-data POST request</b>
             * 
             * @apiParam (param) {ObjectId} id Hacker id
             * @apiParam (body) {File} resume The uploaded file.
             * 
             * @apiSuccess {String} message Success message
             * @apiSuccess {Object} data Location in the bucket that the file was stored.
             * @apiSuccessExample {json} Success-Response: 
             *      HTTP/1.1 200 OK
             *      {
             *          message: "Uploaded resume", 
             *          data: {
             *              filename: "resumes/1535032624768-507f191e810c19729de860ea"
             *          }
             *      }
             * 
             * @apiPermission Must be logged in, and the account id must be linked to the hacker.
             */
            .post(
                //TODO: authenticate middleware
                Middleware.Validator.Hacker.uploadResumeValidator,
                Middleware.parseBody.middleware,
                //verify that the hacker entity contains the account id
                Middleware.Hacker.ensureAccountLinkedToHacker,
                //load resume into memory
                Middleware.Util.Multer.single("resume"),
                //upload resume to storage and update hacker profile
                Middleware.Hacker.uploadResume,
                //controller response           
                Controllers.Hacker.uploadedResume
            )
            /**
             * @api {get} /hacker/resume:id get the resume for a hacker.
             * @apiName getHackerResume
             * @apiGroup Hacker
             * @apiVersion 0.0.8
             * 
             * @apiParam (param) {ObjectId} id Hacker id
             * 
             * @apiSuccess {String} message Success message
             * @apiSuccessExample {json} Success-Response:
             *      HTTP/1.1 200 OK 
             *      { 
             *          message: "Downloaded resume", 
             *          data: { 
             *              id: "507f191e810c19729de860ea", 
             *              resume: [Buffer] 
             *          } 
             *      }
             * @apiError {String} message "Resume does not exist"
             * @apiErrorExample {json} Error-Response:
             *      HTTP/1.1 404 
             *      { 
             *          message: "Resume not found", 
             *          data: {} 
             *      }
             * @apiSampleRequest off
             * @apiPermission Must be logged in, and the account id must be linked to the hacker.
             */
            .get(
                //TODO: authenticate middleware
                Middleware.Validator.Hacker.downloadResumeValidator,
                Middleware.parseBody.middleware,
                Middleware.Hacker.downloadResume,
                Controllers.Hacker.downloadedResume
            );

        /**
         * @api {patch} /hacker/confirmation/:id Allows confirmation of hacker attendence if they are accepted. 
         * Also allows change from 'confirmed' back to 'accepted'
         * @apiName patchHackerConfirmed
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         * 
         * @apiParam (body) {String} [status] The new status of the hacker. 'Accepted' or 'Confirmed'
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Changed hacker information", 
         *          "data": {
         *              "status": "Confirmed"
         *          }
         *      }
         * @apiPermission Administrator
         * @apiPermission Hacker
         */
        hackerRouter.route("/confirmation/:id").patch(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.Validator.Hacker.updateConfirmationValidator,
            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,

            Middleware.Hacker.checkStatus([CONSTANTS.HACKER_STATUS_ACCEPTED, CONSTANTS.HACKER_STATUS_CONFIRMED]),

            Middleware.Hacker.parseConfirmation,
            Middleware.Hacker.updateHacker,

            Middleware.Hacker.sendStatusUpdateEmail,
            Controllers.Hacker.updatedHacker
        );
        apiRouter.use("/hacker", hackerRouter);
    }
};