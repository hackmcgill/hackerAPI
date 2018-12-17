"use strict";

function createdRole(req, res) {
    return res.status(200).json({
        message: "Create sponsor successful",
        data: req.body.sponsor.toJSON(),
    });
}

module.exports = {
    createdRole: createdRole,
};