"use strict";
const mongoose = require("mongoose");
const Services = {
    Role: require("../services/role.service"),
};
const Constants = {
    Error: require("../constants/error.constant"),
};

function parseRole(req, res, next) {
    const roleDetails = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        routes: req.body.routes,
    };

    delete req.body.name;
    delete req.body.routes;

    req.body.roleDetails = roleDetails;

    return next();
}

async function createRole(req, res, next) {
    const roleDetails = req.body.roleDetails;

    // check for duplicate roles
    if (await Services.Role.isDuplicate(roleDetails)) {
        // get by the route
        const existingRole = await Services.Role.getByRoutes(roleDetails.routes);

        return res.status(422).json({
            message: Constants.Error.ROLE_DUPLICATE_422_MESSAGE,
            data: {
                role: existingRole,
            }
        });
    }

    const role = await Services.Role.createRole(roleDetails);

    if (!!role) {
        delete req.body.roleDetails;
        req.body.role = role;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.HACKER_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

module.exports = {
    parseRole: parseRole,
    createRole: createRole,
};