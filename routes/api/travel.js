"use strict";
const express = require("express");
const Controllers = {
    Travel: require("../../controllers/travel.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Travel: require("../../middlewares/validators/travel.validator"),
        RouteParam: require("../../middlewares/validators/routeParam.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Util: require("../../middlewares/util.middleware"),
    Travel: require("../../middlewares/travel.middleware"),
    Auth: require("../../middlewares/auth.middleware"),
    Search: require("../../middlewares/search.middleware")
};
const Services = {
    Travel: require('../../services/travel.service'),
    //Hacker: require("../../services/hacker.service")
};
const CONSTANTS = require("../../constants/general.constant");

module.exports = {
    activate: function (apiRouter) {
        const travelRouter = express.Router();

        /**
         * @api {get} /travel/self get information about own hacker's travel
         * @apiName self
         * @apiGroup Travel
         * @apiVersion 2.0.1
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Travel object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Travel found by logged in account id", 
                    "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Claimed"
                        "request": 90,
                        "offer": 80
                    }  
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Travel not found", "data": {}}
         */
        hackerRouter.route("/self").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Travel.findSelf,
            Controllers.Travel.showTfravel
        );

        /**
         * @api {post} /travel/ create a new travel
         * @apiName createTravel
         * @apiGroup Travel
         * @apiVersion 2.0.1
         * 
         * @apiParam (body) {MongoID} accountId ObjectID of the respective account
         * @apiParam (body) {MongoID} hackerId ObjectID of the respective hacker
         * @apiParam (body) {Number} request The amount of money the traveller wants for travel
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Travel object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Travel creation successful", 
         *          "data": {
         *               "id":"5bff4d736f86be0a41badb91",
         *              "status": "None",
         *              "request": 50,
         *              "offer": 0
         *          }
         *      }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating travel", "data": {}}
         */
        hackerRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),
            Middleware.Validator.Travel.newTravelValidator,

            Middleware.parseBody.middleware,
            // validate type
            Middleware.Hacker.validateConfirmedStatusFromAccountId,

            Middleware.Travel.parseHacker,

            Middleware.Travel.addDefaultStatusAndOffer,
            Middleware.Travel.createTravel,

            Controllers.Travel.createdTravel
        );

        /**
         * @api {patch} /hacker/status/:id update a hacker's status
         * @apiName patchHackerStatus
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         *
         * @apiParam (body) {string} [status] Status of the hacker's application ("None"|"Applied"|"Accepted"|"Declined"|"Waitlisted"|"Confirmed"|"Withdrawn"|"Checked-in")
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Changed hacker information",
         *          "data": {
         *              "status": "Accepted"
         *          }
         *      }
         * @apiPermission Administrator
         */
        hackerRouter.route("/status/:id").patch(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),
            Middleware.Validator.Hacker.updateStatusValidator,
            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,
            Middleware.Hacker.validateConfirmedStatusFromHackerId,

            Middleware.Hacker.updateHacker,
            Middleware.Hacker.sendStatusUpdateEmail,
            Controllers.Hacker.updatedHacker
        );

        /**
         * @api {patch} /hacker/accept/:id accept a Hacker
         * @apiName acceptHacker
         * @apiGroup Hacker
         * @apiVersion 2.0.0
         *
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Changed hacker information",
         *          "data": {
         *              "status": "Accepted"
         *          }
         *      }
         * @apiPermission Administrator
         */
        hackerRouter
            .route("/accept/:id")
            .patch(
                Middleware.Validator.RouteParam.idValidator,
                Middleware.Auth.ensureAuthenticated(),
                Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),
                Middleware.Hacker.validateConfirmedStatusFromHackerId,
                Middleware.Hacker.parseAccept,
                Middleware.Hacker.updateHacker,
                Middleware.Hacker.sendStatusUpdateEmail,
                Controllers.Hacker.updatedHacker
            );

        /**
         * @api {patch} /hacker/checkin/:id update a hacker's status to be 'Checked-in'. Note that the Hacker must eitehr be Accepted or Confirmed.
         * @apiName checkinHacker
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         * @apiParam (body) {string} [status] Check-in status. "Checked-in"
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
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,
            Middleware.Hacker.validateConfirmedStatusFromHackerId,
            Middleware.Hacker.checkStatus([
                CONSTANTS.HACKER_STATUS_ACCEPTED,
                CONSTANTS.HACKER_STATUS_CONFIRMED
            ]),
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
         * @apiParam (body) {Number} [travel] How much the hacker requires a bus for transportation
         * @apiParam (body) {String[]} [ethnicity] the ethnicities of the hacker
         * @apiParam (body) {String[]} [major] the major of the hacker
         * @apiParam (body) {Number} [graduationYear] the graduation year of the hacker
         * @apiParam (body) {Json} [application] The hacker's application
         * @apiParamExample {Json} application: 
         *      {
                  "application":{
                    "general":{
                      "school": "McGill University",
                      "degree": "Undergraduate",
                      "fieldOfStudy": "Computer Science",
                      "graduationYear": "2021",
                      "jobInterest":"Internship",
                      "URL":{
                        "resume":"resumes/1543458163426-5bff4d736f86be0a41badb91",
                        "github":"https://github.com/abcd",
                        "dropler":"https://dribbble.com/abcd",
                        "personal":"https://www.hi.com/",
                        "linkedIn":"https://linkedin.com/in/abcd",
                        "other":"https://github.com/hackmcgill/hackerAPI/issues/168"
                      },
                    },
                    "shortAnswer": {
                      "skills":["Javascript","Typescript"],
                      "question1": "I love McHacks",
                      "question2":"Pls accept me",
                      "comments":"hi!",
                    },
                    "other:" {
                      "gender": "male",
                      "ethnicity": "Asian or Pacific Islander",
                      "privacyPolicy": true,
                      "codeOfConduct": true,
                    }
                    "accomodation": {
                      "travel": 0
                    },
                  }
                }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Changed hacker information", 
         *          "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Applied",
                         "application":{
                          "general":{
                            "school": "McGill University",
                            "degree": "Undergraduate",
                            "fieldOfStudy": "Computer Science",
                            "graduationYear": "2021",
                            "jobInterest":"Internship",
                            "URL":{
                              "resume":"resumes/1543458163426-5bff4d736f86be0a41badb91",
                              "github":"https://github.com/abcd",
                              "dropler":"https://dribbble.com/abcd",
                              "personal":"https://www.hi.com/",
                              "linkedIn":"https://linkedin.com/in/abcd",
                              "other":"https://github.com/hackmcgill/hackerAPI/issues/168"
                            },
                          },
                          "shortAnswer": {
                            "skills":["Javascript","Typescript"],
                            "question1": "I love McHacks",
                            "question2":"Pls accept me",
                            "comments":"hi!",
                          },
                          "other:" {
                            "gender": "male",
                            "ethnicity": "Asian or Pacific Islander",
                            "privacyPolicy": true,
                            "codeOfConduct": true,
                          }
                          "accomodation": {
                            "travel": 0
                          },
                        }
                      }
         *      }
         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while updating hacker", "data": {}}
         */
        hackerRouter.route("/:id").patch(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.Hacker.updateHackerValidator,

            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,
            Middleware.Hacker.validateConfirmedStatusFromHackerId,

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
         * @apiSuccess {Object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved hacker information", 
                    "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Applied",
                        "application":{
                          "general":{
                            "school": "McGill University",
                            "degree": "Undergraduate",
                            "fieldOfStudy": "Computer Science",
                            "graduationYear": "2021",
                            "jobInterest":"Internship",
                            "URL":{
                              "resume":"resumes/1543458163426-5bff4d736f86be0a41badb91",
                              "github":"https://github.com/abcd",
                              "dropler":"https://dribbble.com/abcd",
                              "personal":"https://www.hi.com/",
                              "linkedIn":"https://linkedin.com/in/abcd",
                              "other":"https://github.com/hackmcgill/hackerAPI/issues/168"
                            },
                          },
                          "shortAnswer": {
                            "skills":["Javascript","Typescript"],
                            "question1": "I love McHacks",
                            "question2":"Pls accept me",
                            "comments":"hi!",
                          },
                          "other:" {
                            "gender": "male",
                            "ethnicity": "Asian or Pacific Islander",
                            "privacyPolicy": true,
                            "codeOfConduct": true,
                          }
                          "accomodation": {
                            "travel": 0
                          },
                        }
                    }
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Hacker not found", "data": {}}
         */
        hackerRouter.route("/:id").get(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.parseBody.middleware,

            Middleware.Hacker.findById,
            Controllers.Hacker.showHacker
        );

        /**
         * @api {get} /hacker/email/:email get a hacker's information
         * @apiName getHacker
         * @apiGroup Hacker
         * @apiVersion 0.0.8
         * 
         * @apiParam (param) {String} email a hacker's unique email
         * 
         * @apiSuccess {String} message Success message
         * @apiSuccess {Object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Successfully retrieved hacker information", 
                    "data": {
                        "id":"5bff4d736f86be0a41badb91",
                        "status": "Applied",
                        "application":{
                          "general":{
                            "school": "McGill University",
                            "degree": "Undergraduate",
                            "fieldOfStudy": "Computer Science",
                            "graduationYear": "2021",
                            "jobInterest":"Internship",
                            "URL":{
                              "resume":"resumes/1543458163426-5bff4d736f86be0a41badb91",
                              "github":"https://github.com/abcd",
                              "dropler":"https://dribbble.com/abcd",
                              "personal":"https://www.hi.com/",
                              "linkedIn":"https://linkedin.com/in/abcd",
                              "other":"https://github.com/hackmcgill/hackerAPI/issues/168"
                            },
                          },
                          "shortAnswer": {
                            "skills":["Javascript","Typescript"],
                            "question1": "I love McHacks",
                            "question2":"Pls accept me",
                            "comments":"hi!",
                          },
                          "other:" {
                            "gender": "male",
                            "ethnicity": "Asian or Pacific Islander",
                            "privacyPolicy": true,
                            "codeOfConduct": true,
                          }
                          "accomodation": {
                            "travel": 0
                          },
                        }
                    }
                }

         * @apiError {String} message Error message
         * @apiError {Object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Hacker not found", "data": {}}
         */
        hackerRouter.route("/email/:email").get(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Account.findByEmail]),

            Middleware.Validator.RouteParam.emailValidator,
            Middleware.parseBody.middleware,

            Middleware.Hacker.findByEmail,
            Controllers.Hacker.showHacker
        );

        hackerRouter
            .route("/resume/:id")
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
         * @api {patch} /hacker/confirmation/:id
         * Allows confirmation of hacker attendence if they are accepted. Also allows change from 'confirmed' to 'withdrawn'.
         * @apiName patchHackerConfirmed
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         *
         * @apiParam (body) {string} [status] The new status of the hacker. "Accepted", "Confirmed", or "Withdrawn"
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
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.Hacker.updateConfirmationValidator,
            Middleware.parseBody.middleware,
            Middleware.Hacker.parsePatch,
            Middleware.Hacker.validateConfirmedStatusFromHackerId,
            Middleware.Hacker.checkStatus([
                CONSTANTS.HACKER_STATUS_ACCEPTED,
                CONSTANTS.HACKER_STATUS_CONFIRMED,
                CONSTANTS.HACKER_STATUS_WITHDRAWN
            ]),

            Middleware.Hacker.parseConfirmation,
            Middleware.Hacker.updateHacker,

            Middleware.Hacker.sendStatusUpdateEmail,
            Controllers.Hacker.updatedHacker
        );

        /**
         * @api {post} /hacker/email/weekOf/:id
         * @apiDescription Sends a hacker the week-of email, along with the HackPass QR code to view their hacker profile (for checkin purposes). Hackers must be either confirmed, or checked in.
         * @apiName postHackerSendWeekOfEmail
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         *
         * @apiParam (param) {string} [status] The hacker ID
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Hacker week-of email sent.",
         *          "data": {}
         *      }
         * @apiPermission Administrator
         */
        hackerRouter.route("/email/weekOf/:id").post(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.parseBody.middleware,
            Middleware.Hacker.findById,

            Middleware.Hacker.validateConfirmedStatusFromHackerId,
            Middleware.Hacker.checkStatus([
                CONSTANTS.HACKER_STATUS_CONFIRMED,
                CONSTANTS.HACKER_STATUS_CHECKED_IN
            ]),

            Middleware.Hacker.sendWeekOfEmail,
            Controllers.Hacker.sentWeekOfEmail
        );

        /**
         * @api {post} /hacker/email/dayOf/:id
         * @apiDescription Sends a hacker the day-of email, along with the HackPass QR code to view their hacker profile (for checkin purposes). Hackers must be either confirmed, or checked in.
         * @apiName postHackerSendDayOfEmail
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         *
         * @apiParam (param) {string} [status] The hacker ID
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Hacker day-of email sent.",
         *          "data": {}
         *      }
         * @apiPermission Administrator
         */
        hackerRouter.route("/email/dayOf/:id").post(
            Middleware.Validator.RouteParam.idValidator,
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.parseBody.middleware,
            Middleware.Hacker.findById,
            Middleware.Hacker.validateConfirmedStatusFromHackerId,
            Middleware.Hacker.checkStatus([CONSTANTS.HACKER_STATUS_CHECKED_IN]),
            Middleware.Hacker.sendDayOfEmail,
            Controllers.Hacker.sentDayOfEmail
        );

        /**
         * @api {post} /hacker/email/weekOf/:id
         * @apiDescription Sends a hacker the week-of email, along with the HackPass QR code to view their hacker profile (for checkin purposes). Hackers must be eitherconfirmed, or checked in.
         * @apiName postHackerSendWeekOfEmail
         * @apiGroup Hacker
         * @apiVersion 0.0.9
         *
         * @apiParam (param) {string} [status] The hacker ID
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data empty
         * @apiSuccessExample {object} Success-Response:
         *      {
         *          "message": "Hacker week-of email sent.",
         *          "data": {}
         *      }
         * @apiPermission Administrator
         */
        hackerRouter.route("/email/dayOf/:id").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized([Services.Hacker.findById]),

            Middleware.Validator.RouteParam.idValidator,
            Middleware.parseBody.middleware,
            Middleware.Hacker.findById,
            Middleware.Hacker.checkStatus([CONSTANTS.HACKER_STATUS_CHECKED_IN]),
            Middleware.Hacker.sendDayOfEmail,
            Controllers.Hacker.sentDayOfEmail
        );

        apiRouter.use("/hacker", hackerRouter);
    }
};
