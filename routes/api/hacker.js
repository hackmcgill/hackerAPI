"use strict";

const express = require("express");

const Services = {
    Logger: require("../../services/logger.service.js")
};
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
    Hacker: require("../../middlewares/hacker.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const hackerRouter = new express.Router();

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
         * @apiParam (body) {Object} application The hacker's application
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Hacker object
         * @apiSuccessExample {object} Success-Response: 
         *      {
                    "message": "Hacker creation successful", 
                    "data": {...}
                }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Issue with hacker creation", "data": {}}
         */
        hackerRouter.route("/").post(
            Middleware.Validator.Hacker.newHackerValidator,

            Middleware.parseBody.middleware,

            Middleware.Hacker.parseHacker,
            Middleware.Hacker.addDefaultStatus,

            Controllers.Hacker.createHacker
        );

        /**
         * @api {patch} /hacker/adminChangeHacker/:id update a hacker's information
         * @apiName adminChangeHacker
         * @apiGroup Account
         * @apiVersion 0.0.8
         * 
         * @apiParam (body) {MongoID} [accountId] ObjectID of the respective account
         * @apiParam (body) {String} [status] Status of the hacker's application
         * @apiParam (body) {String} [school] Name of the school the hacker goes to
         * @apiParam (body) {String} [gender] Gender of the hacker
         * @apiParam (body) {Boolean} [needsBus] Whether the hacker requires a bus for transportation
         * @apiParam (body) {Object} [application] The hacker's application
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
        hackerRouter.route("/:id").patch(
            Middleware.Validator.Hacker.updateHackerValidator,

            Middleware.parseBody.middleware,

            // no parse hacker because will use req.body as information
            // because the number of fields will be variable
            Controllers.Hacker.updateHacker
        );

        apiRouter.use("/hacker", hackerRouter);
    }
}