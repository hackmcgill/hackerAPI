"use strict";

const express = require("express");
const Controllers = {
    Role: require("../../controllers/role.controller")
};
const Middleware = {
    Auth: require("../../middlewares/auth.middleware"),
    Validator: {
        Role: require("../../middlewares/validators/role.validator"),
    },
    parseBody: require("../../middlewares/parse-body.middleware"),
    Role: require("../../middlewares/role.middleware"),
};

module.exports = {
    activate: function (apiRouter) {
        const roleRouter = express.Router();

        /**
         * @api {post} /api/role/ create a new role
         * @apiName createRole
         * @apiGroup Role
         * @apiVersion 1.1.1
         * 
         * @apiParam (body) {String} name Name of the route
         * @apiParam (body) {Route[]} routes The routes that this role gives access to
         * @apiParamExample {Json} application: 
         *      {
                    "name": "routename",
                    "routes": [
                        {
                            uri: "/api/hacker/"
                            requestType: "POST"
                        }
                    ]
         *      }
         * 
         * @apiSuccess {string} message Success message
         * @apiSuccess {object} data Role object
         * @apiSuccessExample {object} Success-Response: 
         *      {
         *          "message": "Role creation successful", 
         *          "data": {
                        "name": "routename",
                        "routes": [
                            {
                                uri: "/api/hacker/"
                                requestType: "POST"
                            }
                        ]
         *          }
         *      }

         * @apiError {string} message Error message
         * @apiError {object} data empty
         * @apiErrorExample {object} Error-Response: 
         *      {"message": "Error while creating role", "data": {}}
         */
        roleRouter.route("/").post(
            Middleware.Auth.ensureAuthenticated(),
            Middleware.Auth.ensureAuthorized(),

            Middleware.Validator.Role.newRoleValidator,
            Middleware.parseBody.middleware,
            Middleware.Role.parseRole,
            Middleware.Role.setId,

            Middleware.Role.createRole,
            Controllers.Role.createdRole
        );

        apiRouter.use("/role", roleRouter);
    }
};