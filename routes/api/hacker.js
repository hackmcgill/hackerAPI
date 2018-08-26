"use strict";
const express = require("express");
const Controllers = {
    Hacker: require("../../controllers/hacker.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Hacker: require("../../middlewares/validators/hacker.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Account: require("../../middlewares/account.middleware"),
    Util: require("../../middlewares/util.middleware"),
    Hacker: require("../../middlewares/hacker.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const hackerRouter = express.Router();

        /**
         * @api {post} /hacker/adminChangeHacker/:id update a hacker's information
         * @apiName adminChangeHacker
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Changed hacker information", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Issue with changing hacker information", "data": {}}
         */
        hackerRouter.route("/adminChangeHacker/:id").post(
            Middleware.Validator.Hacker.changeOneStatusValidator,

            Middleware.parseBody.middleware,

            // no parse account because will use req.body as information
            // because the number of fields will be variable
            Controllers.Hacker.updateOne
        );

        hackerRouter.route("/:id/resume")
        /**
         * @api {post} /hacker/:id/resume upload or update resume for a hacker.
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
         * @api {get} /hacker/:id/resume get the resume for a hacker.
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

        apiRouter.use("/hacker", hackerRouter);
    }
}