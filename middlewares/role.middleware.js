"use strict";
const mongoose = require("mongoose");
const Services = {

    Role: require("../services/role.service"),
    ParsePatch: require("../services/parsePatch.service")
};
const Constants = {
    Error: require("../constants/error.constant")
};

const Model = {
    Role: require("../models/role.model")
}

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
    let parseRoleDetails = Services.ParsePatch.parsePatch(Model.Role, "roleDetails");
    return parseRoleDetails(req, res, next);


}


function setId(req, res, next) {
    req.body.roleDetails._id = mongoose.Types.ObjectId();
    return next()
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
        console.log(req.body.role);
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
    setId: setId,
    createRole: createRole,

};

