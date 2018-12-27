"use strict";
const mongoose = require("mongoose");
const Services = {
    Role: require("../services/role.service"),
};
const Constants = {
    Error: require("../constants/error.constant"),
};

/**
 * @function parseRole
 * @param {{body: name: String, routes: route[]}}} req
 * @param {*} res
 * @param {(err?)=>void} next
 * @return {void}
 * @description 
 * Moves name and routes from req.body to req.body.roleDetails.
 * Adds _id to roleDetails.
 */
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

/**
 * @function createRole
 * @param {{body: {roleDetails: object}}} req 
 * @param {*} res 
 * @param {(err?)=>void} next 
 * @return {void}
 * @description
 * Creates role document
 */
async function createRole(req, res, next) {
    const roleDetails = req.body.roleDetails;

    const role = await Services.Role.createRole(roleDetails);

    if (!!role) {
        delete req.body.roleDetails;
        req.body.role = role;
        return next();
    } else {
        return next({
            status: 500,
            message: Constants.Error.ROLE_CREATE_500_MESSAGE,
            data: {}
        });
    }
}

module.exports = {
    parseRole: parseRole,
    createRole: createRole,
};