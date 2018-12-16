"use strict";

const express = require("express");
const Controllers = {

};
const Middleware = {
    Auth: require("../../middlewares/auth.middleware"),
    Validator: {
        Role: require("../../middlewares/validators/role.validator"),
    },
    parseBody: require("../../middlewares/parse-body.middleware"),
    Role: require("../../middlewares/role.middleware"),
};
const Services = {

};

module.exports = {
    activate: function (apiRouter) {
        const roleRouter = express.Router();

        roleRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Validator.Role.newRoleValidator,
            Middleware.parseBody.middleware,
            Middleware.Role.parseBody

        );

        apiRouter.use("/role", roleRouter);
    }
};