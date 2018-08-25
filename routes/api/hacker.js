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
    Account: require("../../middlewares/account.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const hackerRouter = new express.Router();

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

        apiRouter.use("/hacker", hackerRouter);
    }
}