"use strict";

const express = require("express");

const Controllers = {
    Sponsor: require("../../controllers/sponsor.controller")
};
const Middleware = {
    Validator: {
        /* Insert the require statement to the validator file here */
        Sponsor: require("../../middlewares/validators/sponsor.validator")
    },
    /* Insert all of ther middleware require statements here */
    parseBody: require("../../middlewares/parse-body.middleware"),
    Sponsor: require("../../middlewares/sponsor.middleware")
};

module.exports = {
    activate: function (apiRouter) {
        const sponsorRouter = new express.Router();

        /**
         * @api {get} /sponsor/:id get a sponsor's information
         */
        sponsorRouter.route("/:id").get(
            Controllers.Sponsor.findById
        );

        /**
         * @api {post} /sponsor/ create a new sponsor
         */
        sponsorRouter.route("/").post(
            // validation
            Middleware.Validator.Sponsor.postNewSponsorValidator,

            // parsing
            Middleware.parseBody.middleware,
            Middleware.Sponsor.parseSponsor,

            Controllers.Sponsor.createSponsor
        );

        apiRouter.use("/sponsor", sponsorRouter);
    }
};