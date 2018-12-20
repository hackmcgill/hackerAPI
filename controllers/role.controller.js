"use strict";

const Success = require("../constants/success.constants");

function createdRole(req, res) {
    return res.status(200).json({
        message: Success.ROLE_CREATE,
        data: req.body.role.toJSON(),
    });
}

module.exports = {
    createdRole: createdRole,
};