"use strict";

const Success = require("../constants/success.constant");

/**
 * @function createdRole
 * @param {{body: {role: Object}}} req
 * @param {*} res
 * @return {JSON} Success status and role object
 * @description Returns the JSON of role object located in req.body.role
 */
function createdRole(req, res) {
    return res.status(200).json({
        message: Success.ROLE_CREATE,
        data: req.body.role.toJSON()
    });
}

module.exports = {
    createdRole: createdRole
};
